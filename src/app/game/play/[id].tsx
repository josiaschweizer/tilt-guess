import { Alert, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Game } from '@/interface/entities/Game'
import { loadGameById } from '@/lib/game/games'

export default function GamePlay() {
  const params = useLocalSearchParams()
  const idParam = params.id
  const gameId = Array.isArray(idParam) ? idParam[0] : idParam

  const [game, setGame] = useState<Game | null>(null)

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
        } else {
          Alert.alert('Game not found')
        }
      } catch (error) {
        console.error(error)
        Alert.alert('An error occurred loading the game')
      }
    }

    void loadGame()
  }, [gameId])

  return (
    <View>
      <Stack.Screen options={{ title: 'Game', orientation: 'landscape' }} />
      <Text>Game Screen</Text>
    </View>
  )
}
