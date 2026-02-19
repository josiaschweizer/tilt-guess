import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Home, RotateCcw } from 'lucide-react-native'

import AppButton from '@/components/base/AppButton'
import { computeLeaderboard, LeaderboardRow } from '@/lib/game/leaderboard'
import type { Game } from '@/interface/entities/Game'
import { loadGameById } from '@/lib/game/games'
import SplitStatCard from '@/components/ui/leaderboard/SplitStatCard'
import LeaderboardCard from '@/components/ui/leaderboard/LeaderboardCard'
import WinnerCard from '@/components/ui/leaderboard/WinnerCard'
import ScreenHeader from '@/components/ui/leaderboard/ScreenHeader'

export default function ResultScreen() {
  const params = useLocalSearchParams()
  const idParam = params.id
  const disableBackParam = params.disableBack

  const disableBack = useMemo(() => {
    const rawValue = Array.isArray(disableBackParam)
      ? disableBackParam[0]
      : disableBackParam
    return rawValue === 'true'
  }, [disableBackParam])

  const gameId = Array.isArray(idParam) ? idParam[0] : idParam

  const [game, setGame] = useState<Game | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([])

  useEffect(() => {
    const load = async () => {
      if (!gameId) {
        router.push('/game/setup')
        return
      }

      const data = await loadGameById({ gameId })
      if (!data) {
        router.replace('/game/setup')
        return
      }

      setGame(data.game)
      setLeaderboard(computeLeaderboard(data.game.players, data.turns))
    }

    load()
  }, [gameId])

  const winner = leaderboard[0]

  const startNewGame = () => router.push('/game/setup')
  const goHome = () => router.push('/')

  return (
    <View className="flex-1 bg-bg">
      <Stack.Screen
        options={{
          title: 'Resultat',
          headerShown: !disableBack,
          gestureEnabled: !disableBack,
        }}
      />
      {disableBack ? <ScreenHeader title="Resultat" /> : null}

      {!game ? (
        <View className="flex-1" />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 24,
            paddingBottom: 40,
          }}
        >
          <View className="w-full max-w-md self-center">
            <WinnerCard winner={winner} />

            <LeaderboardCard rows={leaderboard} />

            <SplitStatCard
              leftValue={game.rounds}
              leftLabel="Runde(n)"
              rightValue={game.players.length}
              rightLabel="Spieler"
            />

            <View className="gap-3">
              <AppButton
                text="Neues spiel"
                onPress={startNewGame}
                icon={<RotateCcw size={18} color="#000000" />}
                fullWidth
              />
              <AppButton
                text="Zur startseite"
                onPress={goHome}
                variant="secondary"
                icon={<Home size={18} color="#000000" />}
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  )
}
