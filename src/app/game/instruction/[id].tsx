import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { ArrowRight, User } from 'lucide-react-native'

import Button from '@/components/base/Button'
import type { Game } from '@/interface/entities/Game'
import { loadGameById } from '@/method/games'

export default function GameInstruction() {
  const params = useLocalSearchParams()
  const idParam = params.id
  const gameId = Array.isArray(idParam) ? idParam[0] : idParam

  const [game, setGame] = useState<Game | null>(null)

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
    }

    load()
  }, [gameId])

  const currentPlayer = useMemo(() => {
    if (!game) return null
    return game.players[game.currentPlayerIndex] ?? null
  }, [game])

  if (!game || !currentPlayer) return null

  return (
    <View className="flex-1 bg-bg px-6 py-6">
      <Stack.Screen options={{ title: 'Anleitung' }} />

      <View className="w-full max-w-md self-center flex-1 justify-between">
        <View>
          <View className="rounded-3xl bg-surface border border-black/10 p-6 mb-5">
            <View className="flex-row items-center">
              <View className="h-12 w-12 rounded-2xl bg-bg border border-black/10 items-center justify-center">
                <User size={22} color="#000000" />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-black/70">dran ist</Text>
                <Text className="text-2xl font-black text-text">
                  {currentPlayer.name}
                </Text>
              </View>

              <View className="rounded-2xl bg-bg border border-black/10 px-3 py-2">
                <Text className="text-text font-black">
                  runde {game.currentRoundIndex + 1}/{game.rounds}
                </Text>
              </View>
            </View>
          </View>

          <View className="rounded-3xl bg-surface border border-black/10 p-6">
            <Text className="text-xl font-black text-text mb-3">
              so spielst du
            </Text>

            <Text className="text-black/80 leading-5">
              wenn das wort erraten wurde, drücke unten den button.
              {'\n'}
              später kannst du dafür auch das smartphone nach hinten kippen
              (sensorik).
            </Text>
          </View>
        </View>

        <Button
          text="runde starten"
          onPress={() =>
            router.push({
              pathname: '/game/play/[id]',
              params: { id: game.id },
            })
          }
          icon={<ArrowRight size={18} color="#000000" />}
          fullWidth
        />
      </View>
    </View>
  )
}
