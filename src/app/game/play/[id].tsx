import { Alert, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useLocalSearchParams } from 'expo-router'
import { Game } from '@/interface/entities/Game'
import { loadGame } from '@/lib/game/game'

export default function GamePlay() {
  const { id } = useLocalSearchParams()
  const [game, setGame] = useState<Game | null>(null)

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    ).catch((error) => {
      console.error('Failed to lock orientation:', error)
    })

    return () => {
      ScreenOrientation.unlockAsync().catch((error) => {
        console.error('Failed to unlock orientation:', error)
      })
    }
  }, [])

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const data = await loadGame(id.toString())
        if (data) {
          setGame(data)
        } else {
          Alert.alert('Game not found')
        }
      } catch (error) {
        console.error(error)
        Alert.alert('An error occurred loading the game')
      }
    }

    void loadGameData()
  }, [id])

  return (
    <View>
      <Text>Game Screen</Text>
    </View>
  )
}
