import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Home, RotateCcw, Trophy } from 'lucide-react-native'

import AppButton from '@/components/base/AppButton'
import GameHeader from '@/components/ui/game/GameHeader'
import getRankBadge from '@/components/ui/rank/RankBadge'
import { computeLeaderboard, LeaderboardRow } from '@/lib/game/leaderboard'
import type { Game } from '@/interface/entities/Game'
import { loadGameById } from '@/lib/game/games'

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

  const startNewGame = () => {
    router.push('/game/setup')
  }

  const goHome = () => {
    router.push('/')
  }

  return (
    <View className="flex-1 bg-bg">
      <Stack.Screen
        options={{
          title: 'Resultat',
          headerShown: !disableBack,
          gestureEnabled: !disableBack,
        }}
      />
      {disableBack ? <GameHeader title="Resultat" /> : null}

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
                    {getRankBadge({ rank: row.rank })}

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
                  <Text className="text-black/70">Runde(n)</Text>
                </View>

                <View className="w-px bg-black/10" />

                <View className="flex-1 items-center">
                  <Text className="text-3xl font-black text-text">
                    {game.players.length}
                  </Text>
                  <Text className="text-black/70">Spieler</Text>
                </View>
              </View>
            </View>

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
