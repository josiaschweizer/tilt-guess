import { Game } from '@/interface/entities/Game'
import { Turn } from '@/interface/entities/Turn'
import AsyncStorage from '@react-native-async-storage/async-storage'

const GAME_KEY_PREFIX = 'game:'

interface PropsCreateGame {
  payload: {
    game: Game
    turns: Turn[]
  }
}

export async function createGame(props: PropsCreateGame): Promise<void> {
  const key = `${GAME_KEY_PREFIX}${props.payload.game.id}`
  const value = JSON.stringify(props.payload)

  await AsyncStorage.setItem(key, value)
}

interface PropsLoadGameById {
  gameId: string
}

export async function loadGameById(
  props: PropsLoadGameById,
): Promise<{ game: Game; turns: Turn[] } | null> {
  const key = `${GAME_KEY_PREFIX}${props.gameId}`
  const value = await AsyncStorage.getItem(key)
  if (!value) {
    return null
  }

  return JSON.parse(value) as { game: Game; turns: Turn[] }
}
