import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Award, Home, Medal, RotateCcw, Trophy } from 'lucide-react-native'

import Button from '@/components/base/Button'
import { computeLeaderboard } from '@/lib/game/leaderboard'
import type { Game } from '@/interface/entities/Game'
import type { Turn } from '@/interface/entities/Turn'
import loadGameById from '@/method/game'
import saveGameToHistory from '@/method/history'

export default function ResultScreen() {
  const params = useLocalSearchParams()
  const idParam = params.id

  const gameId = Array.isArray(idParam) ? idParam[0] : idParam

  const [game, setGame] = useState<Game | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const didSaveRef = useRef(false)

  useEffect(() => {
    const load = async () => {
      if (!gameId) {
        router.replace('/game/setup')
        return
      }

      const data = await loadGameById(gameId)
      if (!data) {
        router.replace('/game/setup')
        return
      }

      setGame(data.game)
      setTurns(data.turns)
    }

    load()
  }, [gameId])

  const leaderboard = useMemo(() => {
    if (!game) {
      return []
    }

    return computeLeaderboard(game.players, turns)
  }, [game, turns])

  const winner = leaderboard[0]

  useEffect(() => {
    const save = async () => {
      if (!game) {
        return
      }
      if (!winner) {
        return
      }
      if (didSaveRef.current) {
        return
      }

      didSaveRef.current = true

      await saveGameToHistory({
        id: game.id,
        createdAtIso: game.createdAtIso,
        rounds: game.rounds,
        playerNames: game.players.map((p) => p.name),
        winner: {
          playerName: winner.player.name,
          correct: winner.correct,
          skipped: winner.skipped,
        },
      })
    }

    save()
  }, [game, winner])

  const startNewGame = () => {
    // todo: clear current game from storage (the one with gameId)
    router.replace('/game/setup')
  }

  const goHome = () => {
    router.replace('/')
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <View className="h-10 w-10 rounded-2xl bg-surface border border-black/10 items-center justify-center">
            <Trophy size={22} color="#000000" />
          </View>
        )
      case 2:
        return (
          <View className="h-10 w-10 rounded-2xl bg-surface border border-black/10 items-center justify-center">
            <Medal size={22} color="#000000" />
          </View>
        )
      case 3:
        return (
          <View className="h-10 w-10 rounded-2xl bg-surface border border-black/10 items-center justify-center">
            <Award size={22} color="#000000" />
          </View>
        )
      default:
        return (
          <View className="h-10 w-10 rounded-2xl bg-surface border border-black/10 items-center justify-center">
            <Text className="text-text font-black">#{rank}</Text>
          </View>
        )
    }
  }

  if (!game) return null

  return (
    <View className="flex-1 bg-bg">
      <Stack.Screen options={{ title: 'Resultat' }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 24,
          paddingBottom: 40,
        }}
      >
        <View className="w-full max-w-md self-center">
          {/* winner card */}
          <View className="rounded-3xl bg-surface border border-black/10 p-7 mb-5">
            <View className="items-center">
              <View className="h-20 w-20 rounded-3xl bg-bg border border-black/10 items-center justify-center mb-4">
                <Trophy size={36} color="#000000" />
              </View>

              <Text className="text-3xl font-black text-text text-center mb-1">
                Gewinner
              </Text>

              <Text className="text-2xl font-black text-text text-center mb-5">
                {winner?.player.name ?? '—'}
              </Text>

              <View className="rounded-3xl bg-bg border border-black/10 px-8 py-5 items-center">
                <Text className="text-5xl font-black text-text">
                  {winner?.correct ?? 0}
                </Text>
                <Text className="text-black/70">punkte</Text>
              </View>

              {winner ? (
                <Text className="text-black/70 mt-4">
                  {winner.skipped} übersprungen
                </Text>
              ) : null}
            </View>
          </View>

          <View className="rounded-3xl bg-surface border border-black/10 p-6 mb-5">
            <Text className="text-2xl font-black text-text mb-5">
              Rangliste
            </Text>

            <View className="gap-3">
              {leaderboard.map((row) => (
                <View
                  key={row.player.id}
                  className="rounded-2xl bg-bg border border-black/10 p-5 flex-row items-center"
                >
                  {getRankBadge(row.rank)}

                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-black text-text">
                      {row.player.name}
                    </Text>
                    <Text className="text-black/70">
                      {row.skipped} übersprungen
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-3xl font-black text-text">
                      {row.correct}
                    </Text>
                    <Text className="text-black/70">punkte</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-3xl bg-surface border border-black/10 p-6 mb-5">
            <View className="flex-row">
              <View className="flex-1 items-center">
                <Text className="text-3xl font-black text-text">
                  {game.rounds}
                </Text>
                <Text className="text-black/70">runden</Text>
              </View>

              <View className="w-px bg-black/10" />

              <View className="flex-1 items-center">
                <Text className="text-3xl font-black text-text">
                  {game.players.length}
                </Text>
                <Text className="text-black/70">spieler</Text>
              </View>
            </View>
          </View>

          <View className="gap-3">
            <Button
              text="Neues spiel"
              onPress={startNewGame}
              icon={<RotateCcw size={18} color="#000000" />}
              fullWidth
            />
            <Button
              text="Zur startseite"
              onPress={goHome}
              variant="secondary"
              icon={<Home size={18} color="#000000" />}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
