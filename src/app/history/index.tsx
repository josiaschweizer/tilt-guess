import { router, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, FlatList, Pressable, Text, View } from 'react-native'
import type { GameHistoryItem } from '@/interface/GameHistoryItem'
import HistoryRow from '@/components/ui/history/HistoryRow'
import Button from '@/components/base/Button'
import { Trash2, Trophy } from 'lucide-react-native'

export default function History() {
  const [history, setHistory] = useState<GameHistoryItem[]>([])

  useEffect(() => {
    // todo: load history from storage and setHistory(...)
    setHistory([
      {
        id: 'demo-1',
        createdAtIso: new Date().toISOString(),
        rounds: 3,
        playerNames: ['josia', 'marko'],
        winner: { playerName: 'josia', correct: 12, skipped: 2 },
      },
      {
        id: 'demo-2',
        createdAtIso: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
        rounds: 2,
        playerNames: ['josia', 'marko', 'laurin'],
        winner: { playerName: 'marko', correct: 9, skipped: 1 },
      },
    ])
  }, [])

  const openDetail = (gameId: string) => {
    // todo: implement history detail screen + route
    // router.push({ pathname: '/history/[id]', params: { id: gameId } })
    console.log('todo: open history detail for', gameId)
  }

  const deleteGame = (gameId: string) => {
    // todo: delete single game from storage
    setHistory((prev) => prev.filter((g) => g.id !== gameId))
  }

  const deleteAllGames = () => {
    Alert.alert(
      'Spielverlauf löschen?',
      'Willst du wirklich alle Spiele entfernen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            // todo: delete all games from storage
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
                onPress={deleteAllGames}
                className="h-11 w-11 items-center justify-center"
                hitSlop={10}
              >
                <Trash2 size={24} color="#000000" />
              </Pressable>
            ),
        }}
      />

      <View className="w-full max-w-md self-center flex-1">
        <FlatList
          data={history
            .slice()
            .sort(
              (a, b) => +new Date(b.createdAtIso) - +new Date(a.createdAtIso),
            )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 24,
            flexGrow: 1,
            justifyContent: history.length === 0 ? 'center' : 'flex-start',
          }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item, index }) => (
            <HistoryRow
              game={item}
              title={`Game: ${history.length - index}`}
              onPress={() => openDetail(item.id)}
              onDelete={() => deleteGame(item.id)}
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

              <Button
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
