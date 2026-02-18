import { Stack, router } from 'expo-router'
import { useRef, useState } from 'react'
import { ScrollView, Text, TextInput, View } from 'react-native'
import { Play, UserPlus } from 'lucide-react-native'
import AppButton from '@/components/base/AppButton'
import InputField from '@/components/base/InputField'
import PlayerListItem from '@/components/ui/PlayerListItem'
import { Player } from '@/interface/entities/Player'
import { Game } from '@/interface/entities/Game'
import { randomUUID } from 'expo-crypto'
import { createGame } from '@/method/games'

export default function GameSetup() {
  const [players, setPlayers] = useState<Player[]>([])
  const [nameInput, setNameInput] = useState('')
  const [gameName, setGameName] = useState('')
  const [rounds, setRounds] = useState(3)
  const inputRef = useRef<TextInput>(null)

  const trimmedName = nameInput.trim()
  const trimmedGameName = gameName.trim()
  const canAdd = trimmedName.length > 0
  const canStartGame = players.length >= 2 && trimmedGameName.length > 0

  const handleAdd = () => {
    if (!canAdd) {
      return
    }

    const newPlayer: Player = {
      id: randomUUID(),
      name: trimmedName,
    }
    setPlayers((current) => [...current, newPlayer])
    setNameInput('')
  }

  const handleDelete = (playerId: string) => {
    setPlayers((current) => current.filter((player) => player.id !== playerId))
  }

  const handleStartGame = async () => {
    if (!canStartGame) {
      return
    }

    const newGame: Game = {
      id: randomUUID(),
      name: trimmedGameName,
      createdAtIso: new Date().toISOString(),
      status: 'LOBBY',
      rounds,
      players,
      currentRoundIndex: 0,
      currentPlayerIndex: 0,
    }

    await createGame({
      payload: {
        game: newGame,
        turns: [],
      },
    })

    router.push('/game/instruction/' + newGame.id)
  }

  return (
    <View className="flex-1 bg-bg px-6 pt-6">
      <Stack.Screen
        options={{
          title: 'Spiel Setup',
        }}
      />
      <ScrollView
        contentContainerClassName="pb-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-3xl font-black text-text mb-1">
            Spiel Setup
          </Text>
          <Text className="text-base text-black/70">
            Fuege Spieler hinzu und waehle die Rundenanzahl
          </Text>
        </View>
        <View className="mb-6">
          <Text className="text-lg font-bold text-text mb-2">Spielname</Text>
          <InputField
            value={gameName}
            placeholder="Spielname eingeben..."
            onChangeText={setGameName}
          />
        </View>
        <View className="mb-3">
          <Text className="text-lg font-bold text-text">
            Spieler ({players.length})
          </Text>
        </View>
        <View className="mb-4 flex-row items-center gap-3">
          <View className="flex-1">
            <InputField
              ref={inputRef}
              value={nameInput}
              placeholder="Name eingeben..."
              onChangeText={setNameInput}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />
          </View>
          <AppButton
            onPress={handleAdd}
            disabled={!canAdd}
            icon={<UserPlus size={20} color="#EEE0CB" />}
            size="md"
            fullWidth={false}
            style={{ marginBottom: 0 }}
          />
        </View>
        {players.length === 0 ? (
          <AppButton
            onPress={() => inputRef.current?.focus()}
            variant="secondary"
            text="Keine Spieler hinzugefügt"
            icon={<UserPlus size={28} color="#000000" />}
            style={{ height: 80, marginBottom: 40 }}
          />
        ) : (
          <View className="mb-10">
            {players.map((player) => (
              <PlayerListItem
                key={player.id}
                player={player}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
        <AppButton
          text="Spiel starten"
          onPress={handleStartGame}
          disabled={!canStartGame}
          icon={<Play size={18} color="#EEE0CB" />}
        />
      </ScrollView>
    </View>
  )
}
