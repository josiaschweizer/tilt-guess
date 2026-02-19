import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowRight } from 'lucide-react-native'

import AppButton from '@/components/base/AppButton'
import GameHeader from '@/components/ui/game/GameHeader'
import OrientationGuard from '@/components/ui/game/OrientationGuard'
import PlayerInfoCard from '@/components/ui/game/PlayerInfoCard'
import type { Game } from '@/interface/entities/Game'
import { loadGameById } from '@/lib/game/games'
import GameInstructionCard from '@/components/ui/game/GameInstructionCard'

export default function GameInstruction() {
  const params = useLocalSearchParams()
  const idParam = params.id
  const gameId = Array.isArray(idParam) ? idParam[0] : idParam
  const disableBackParam = params.disableBack

  const disableBack = useMemo(() => {
    const rawValue = Array.isArray(disableBackParam)
      ? disableBackParam[0]
      : disableBackParam
    return rawValue === 'true'
  }, [disableBackParam])

  const [game, setGame] = useState<Game | null>(null)
  const dimensions = useWindowDimensions()
  const isLandscape = dimensions.width > dimensions.height
  const insets = useSafeAreaInsets()

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

    void load()
  }, [gameId])

  const currentPlayer = useMemo(() => {
    if (!game) {
      return null
    }

    return game.players[game.currentPlayerIndex] ?? null
  }, [game])

  return (
    <View className="flex-1 bg-bg">
      <Stack.Screen
        options={{
          title: 'Anleitung',
          orientation: 'all',
          headerShown: !disableBack,
        }}
      />
      {disableBack ? <GameHeader title="Anleitung" /> : null}
      <View
        className="flex-1 py-6"
        style={{
          paddingLeft: 24 + insets.left,
          paddingRight: 24 + insets.right,
        }}
      >
        {!isLandscape ? (
          <OrientationGuard />
        ) : !game || !currentPlayer ? (
          <View className="flex-1" />
        ) : (
          <View className="w-full max-w-4xl self-center flex-1">
            <View className="flex-1 flex-row gap-6">
              <PlayerInfoCard
                player={currentPlayer}
                currentRound={game.currentRoundIndex + 1}
                totalRounds={game.rounds}
                gameName={game.name}
                totalPlayers={game.players.length}
              />

              <GameInstructionCard
                title="So spielst du"
                instructions={`Wenn du bereit bist, um zu starten, drücke auf den Button unten.\nDu musst dein Handy während der gesamten Runde im Querformat und auf der Stirn halten. Und mit kippen nach unten das Wort als korrekt markieren, oder mit kippen nach oben überspringen.\nViel Spass!`}
              />
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
    </View>
  )
}
