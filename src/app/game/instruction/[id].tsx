import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Text, View, useWindowDimensions, Animated } from 'react-native'
import { ArrowRight, User, RotateCw } from 'lucide-react-native'

import AppButton from '@/components/base/AppButton'
import type { Game } from '@/interface/entities/Game'
import { loadGameById } from '@/lib/game/games'
import { useRotationAnimation } from '@/lib/hooks'

export default function GameInstruction() {
  const params = useLocalSearchParams()
  const idParam = params.id
  const gameId = Array.isArray(idParam) ? idParam[0] : idParam

  const [game, setGame] = useState<Game | null>(null)
  const dimensions = useWindowDimensions()
  const isLandscape = dimensions.width > dimensions.height

  const { animatedStyle } = useRotationAnimation()

  useEffect(() => {
    const load = async () => {
      if (!gameId) {
        router.replace('/game/setup')
        return
      }

      const data = await loadGameById({ gameId })
      if (!data) {
        router.replace('/game/setup')
        return
      }

      setGame(data.game)
    }

    load()
  }, [gameId])

  const currentPlayer = useMemo(() => {
    if (!game) {
      return null
    }

    return game.players[game.currentPlayerIndex] ?? null
  }, [game])

  return (
    <View className="flex-1 bg-bg px-6 py-6">
      <Stack.Screen options={{ title: 'Anleitung', orientation: 'all' }} />

      {!isLandscape ? (
        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <Animated.View style={[animatedStyle]}>
              <RotateCw size={64} color="#000000" strokeWidth={1.5} />
            </Animated.View>
            <Text className="text-center text-xl font-black text-text mt-6">
              Bitte drehe dein Handy
            </Text>
            <Text className="text-center text-black/60 mt-3">
              Querformat ist erforderlich
            </Text>
          </View>
        </View>
      ) : !game || !currentPlayer ? (
        <View className="flex-1" />
      ) : (
        <View className="w-full max-w-4xl self-center flex-1">
          <View className="flex-1 flex-row gap-6">
            <View className="flex-1 rounded-3xl bg-surface border border-black/10 p-5">
              <View className="flex-row items-center">
                <View className="h-12 w-12 rounded-2xl bg-bg border border-black/10 items-center justify-center">
                  <User size={22} color="#000000" />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-black/70">Dran ist</Text>
                  <Text className="text-2xl font-black text-text">
                    {currentPlayer.name}
                  </Text>
                </View>

                <View className="rounded-2xl bg-bg border border-black/10 px-3 py-2">
                  <Text className="text-text font-black">
                    Runde {game.currentRoundIndex + 1}/{game.rounds}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row flex-wrap gap-2">
                <View className="rounded-2xl bg-bg border border-black/10 px-3 py-2">
                  <Text className="text-black/70">Spielname</Text>
                  <Text className="text-text font-black">{game.name}</Text>
                </View>
                <View className="rounded-2xl bg-bg border border-black/10 px-3 py-2">
                  <Text className="text-black/70">Spieler</Text>
                  <Text className="text-text font-black">
                    {game.players.length}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-1 rounded-3xl bg-surface border border-black/10 p-6">
              <Text className="text-xl font-black text-text mb-3">
                So spielst du
              </Text>

              <Text className="text-black/80 leading-5">
                Wenn das Wort erraten wurde, drücke unten den Button.
                {'\n'}
                Später kannst du dafür auch das Smartphone nach hinten kippen
                (Sensorik).
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <AppButton
              text="Runde starten"
              onPress={() => {
                router.push({
                  pathname: '/game/play/[id]',
                  params: { id: game.id, disableBack: 'true' },
                })
              }}
              icon={<ArrowRight size={18} color="#000000" />}
              fullWidth
            />
          </View>
        </View>
      )}
    </View>
  )
}
