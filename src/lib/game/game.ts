import AsyncStorage from '@react-native-async-storage/async-storage'
import { Game } from '@/interface/entities/Game'

const GAME_STORAGE_KEY = '@tilt-guess/game'

export async function loadGame(id: string): Promise<Game | null> {
  try {
    const key = `${GAME_STORAGE_KEY}/${id}`
    const gameData = await AsyncStorage.getItem(key)

    if (!gameData) {
      return null
    }

    return JSON.parse(gameData) as Game
  } catch (error) {
    console.error('Error loading game:', error)
    return null
  }
}
