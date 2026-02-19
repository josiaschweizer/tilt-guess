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

interface PropsUpdateGame {
  game: Game
  turn?: Turn
}

export async function updateGame(props: PropsUpdateGame): Promise<void> {
  const data = await loadGameById({ gameId: props.game.id })
  if (!data) {
    return
  }

  const turns = props.turn ? [...data.turns, props.turn] : data.turns
  const payload = { game: props.game, turns }

  const key = `${GAME_KEY_PREFIX}${props.game.id}`
  await AsyncStorage.setItem(key, JSON.stringify(payload))
}

export async function loadGames(): Promise<{ game: Game; turns: Turn[] }[]> {
  const allKeys = await AsyncStorage.getAllKeys()
  const gameKeys = allKeys.filter((key) => key.startsWith(GAME_KEY_PREFIX))

  if (gameKeys.length === 0) {
    return []
  }

  const pairs = await AsyncStorage.multiGet(gameKeys)
  const results: { game: Game; turns: Turn[] }[] = []

  for (const [, value] of pairs) {
    if (value) {
      results.push(JSON.parse(value) as { game: Game; turns: Turn[] })
    }
  }

  return results
}

interface PropsDeleteGame {
  gameId: string
}

export async function deleteGame(props: PropsDeleteGame): Promise<void> {
  const key = `${GAME_KEY_PREFIX}${props.gameId}`
  await AsyncStorage.removeItem(key)
}

export async function deleteAllGames(): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys()
  const gameKeys = allKeys.filter((key) => key.startsWith(GAME_KEY_PREFIX))

  if (gameKeys.length > 0) {
    await AsyncStorage.multiRemove(gameKeys)
  }
}
