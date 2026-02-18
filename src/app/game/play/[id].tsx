import { Alert, Text, View, Animated } from 'react-native'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Stack, useLocalSearchParams, router } from 'expo-router'
import { randomUUID } from 'expo-crypto'
import { Game } from '@/interface/entities/Game'
import { Turn } from '@/interface/entities/Turn'
import { loadGameById, updateGame } from '@/lib/game/games'
import { fetchRandomGermanWord } from '@/lib/game/randomWord'
import { useTiltGesture } from '@/lib/hooks/useTiltGesture'
import { TiltDirection } from '@/types/tilt/TiltDirection'

const TURN_DURATION_IN_SECONDS = 60

export default function GamePlay() {
  const { id } = useLocalSearchParams()
  const gameId = Array.isArray(id) ? id[0] : id

  const [game, setGame] = useState<Game | null>(null)
  const [currentWord, setCurrentWord] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(TURN_DURATION_IN_SECONDS)
  const [isLoading, setIsLoading] = useState(true)
  const [turn, setTurn] = useState<Turn | null>(null)
  const [timerEnded, setTimerEnded] = useState(false)

  const feedbackAnim = useRef(new Animated.Value(0)).current
  const [feedbackType, setFeedbackType] = useState<'correct' | 'skip' | null>(
    null,
  )

  const loadNewWord = useCallback(async () => {
    const word = await fetchRandomGermanWord()
    setCurrentWord(word)
  }, [])

  const showFeedback = useCallback(
    (type: 'correct' | 'skip') => {
      setFeedbackType(type)
      feedbackAnim.setValue(1)
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setFeedbackType(null))
    },
    [feedbackAnim],
  )

  const onTimerEnd = useCallback(
    async (currentTurn: Turn, currentGame: Game) => {
      const finalTurn: Turn = {
        ...currentTurn,
        endedAtIso: new Date().toISOString(),
      }

      const isLastPlayer =
        currentGame.currentPlayerIndex === currentGame.players.length - 1
      const nextRoundIndex = isLastPlayer
        ? currentGame.currentRoundIndex + 1
        : currentGame.currentRoundIndex

      const isGameFinished = nextRoundIndex >= currentGame.rounds

      const updatedGame: Game = {
        ...currentGame,
        currentPlayerIndex: isLastPlayer
          ? 0
          : currentGame.currentPlayerIndex + 1,
        currentRoundIndex: nextRoundIndex,
      }

      await updateGame({ game: updatedGame, turn: finalTurn })

      Alert.alert(
        'Zeit abgelaufen!',
        `Richtig: ${currentTurn.correct}, Übersprungen: ${currentTurn.skipped}`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (isGameFinished) {
                router.replace(`/leaderboard/${currentGame.id}`)
              } else {
                router.replace(`/game/instruction/${currentGame.id}`)
              }
            },
          },
        ],
      )
    },
    [],
  )

  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) {
        Alert.alert('Game not found')
        return
      }

      try {
        const data = await loadGameById({ gameId })

        if (data?.game) {
          setGame(data.game)

          const newTurn: Turn = {
            id: randomUUID(),
            gameId: data.game.id,
            roundId: `round-${data.game.currentRoundIndex}`,
            playerId: data.game.players[data.game.currentPlayerIndex]?.id || '',
            startedAtIso: new Date().toISOString(),
            correct: 0,
            skipped: 0,
          }
          setTurn(newTurn)
        } else {
          Alert.alert('Game not found')
        }
      } catch (error) {
        console.error(error)
        Alert.alert('An error occurred loading the game')
      } finally {
        setIsLoading(false)
      }
    }

    void loadGame()
  }, [gameId])

  useEffect(() => {
    if (!isLoading && game) {
      void loadNewWord()
    }
  }, [isLoading, game, loadNewWord])

  useEffect(() => {
    if (!isLoading && game && !timerEnded) {
      const timerId = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerEnded(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timerId)
    }
  }, [isLoading, game, timerEnded])

  useEffect(() => {
    if (timerEnded && turn && game) {
      void onTimerEnd(turn, game)
    }
  }, [timerEnded, turn, game, onTimerEnd])

  const onCorrectPress = useCallback(() => {
    if (!turn || timerEnded) return
    setTurn((prev) => (prev ? { ...prev, correct: prev.correct + 1 } : prev))
    showFeedback('correct')
    void loadNewWord()
  }, [turn, timerEnded, loadNewWord, showFeedback])

  const onSkipPress = useCallback(() => {
    if (!turn || timerEnded) return
    setTurn((prev) => (prev ? { ...prev, skipped: prev.skipped + 1 } : prev))
    showFeedback('skip')
    void loadNewWord()
  }, [turn, timerEnded, loadNewWord, showFeedback])

  const handleTiltDetected = useCallback(
    (direction: TiltDirection) => {
      if (direction === 'forward') {
        onCorrectPress()
      } else if (direction === 'backward') {
        onSkipPress()
      }
    },
    [onCorrectPress, onSkipPress],
  )

  useTiltGesture({
    onTiltDetected: handleTiltDetected,
    enabled: !isLoading && !timerEnded,
  })

  const progressPercentage = (timeRemaining / TURN_DURATION_IN_SECONDS) * 100

  const feedbackColor =
    feedbackType === 'correct'
      ? 'rgba(16,185,129,0.25)'
      : 'rgba(239,68,68,0.25)'

  return (
    <View className="flex-1 p-5 bg-background">
      <Stack.Screen options={{ title: 'Game', orientation: 'landscape' }} />

      {feedbackType && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: feedbackColor,
            opacity: feedbackAnim,
            zIndex: 10,
          }}
        />
      )}

      <View className="mb-5">
        <View className="h-2 bg-gray-300 rounded overflow-hidden">
          <View
            className="h-full bg-primary"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
        <Text className="text-2xl font-bold text-center mt-2.5">
          {timeRemaining}s
        </Text>
      </View>

      <View className="flex-1 justify-center items-center">
        {currentWord ? (
          <Text className="text-5xl font-bold text-center">{currentWord}</Text>
        ) : (
          <Text className="text-2xl text-gray-400">Lädt...</Text>
        )}
      </View>

      {turn && (
        <View className="flex-row justify-between px-10 mb-5">
          <Text className="text-xl font-semibold text-green-600">
            ✓ Richtig: {turn.correct}
          </Text>
          <Text className="text-xl font-semibold text-gray-500">
            → Übersprungen: {turn.skipped}
          </Text>
        </View>
      )}
    </View>
  )
}
