import { router, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, Text, View } from 'react-native'
import HistoryListItem from '@/components/ui/history/HistoryListItem'
import AppButton from '@/components/base/AppButton'
import { Trash2, Trophy } from 'lucide-react-native'
import { loadGames, deleteGame, deleteAllGames } from '@/lib/game/games'
import { buildGameResult, GameResult } from '@/lib/game/gameResult'

export default function History() {
  const [history, setHistory] = useState<GameResult[]>([])

  useEffect(() => {
    const load = async () => {
      const allGames = await loadGames()
      const results = allGames.map(({ game, turns }) =>
        buildGameResult(game, turns),
      )
      results.sort(
        (a, b) => +new Date(b.createdAtIso) - +new Date(a.createdAtIso),
      )
      setHistory(results)
    }
    void load()
  }, [])

  const openDetail = (gameId: string) => {
    router.push({ pathname: '/leaderboard/[id]', params: { id: gameId } })
  }

  const handleDeleteGame = async (gameId: string) => {
    await deleteGame({ gameId })
    setHistory((prev) => prev.filter((g) => g.id !== gameId))
  }

  const handleDeleteAllGames = () => {
    Alert.alert(
      'Spielverlauf löschen?',
      'Willst du wirklich alle Spiele entfernen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            await deleteAllGames()
            setHistory([])
          },
        },
      ],
    )
  }

  return (
    <View className="flex-1 bg-bg px-6 py-6">
      <Stack.Screen
        options={{
          title: 'Spielverlauf',
          headerRight: () =>
            history.length === 0 ? null : (
              <Pressable
                onPress={handleDeleteAllGames}
                className="h-10 w-10 items-center justify-center"
              >
                <Trash2 size={22} color="#000000" />
              </Pressable>
            ),
        }}
      />

      <View className="w-full max-w-md self-center flex-1">
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 24,
            flexGrow: 1,
            justifyContent: history.length === 0 ? 'center' : 'flex-start',
          }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <HistoryListItem
              game={item}
              onPress={() => openDetail(item.id)}
              onDelete={() => handleDeleteGame(item.id)}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-6">
              <View className="h-20 w-20 rounded-3xl bg-surface/60 border border-black/10 items-center justify-center mb-6">
                <Trophy size={36} color="#000000" />
              </View>

              <Text className="text-2xl font-black text-text text-center mb-2">
                Noch keine Spiele gespielt
              </Text>
              <Text className="text-black/70 text-center mb-8 leading-5">
                Starte dein erstes TiltGuess Spiel{'\n'}
                und verfolge hier deinen Fortschritt.
              </Text>

              <AppButton
                text="Neues Spiel starten"
                onPress={() => router.push('/game/setup')}
                fullWidth={false}
              />
            </View>
          }
        />
      </View>
    </View>
  )
}
