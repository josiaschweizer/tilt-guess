import { Stack, router } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Play, UserPlus } from 'lucide-react-native'
import Button from '@/components/base/Button'
import InputField from '@/components/base/InputField'
import PlayerListItem from '@/components/ui/PlayerListItem'
import { Player } from '@/interface/entities/Player'

export default function GameSetup() {
  const [players, setPlayers] = useState<Player[]>([])
  const [nameInput, setNameInput] = useState('')

  const trimmedName = nameInput.trim()
  const canAdd = trimmedName.length > 0

  const handleAdd = () => {
    if (!canAdd) {
      return
    }

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setPlayers((current) => [...current, { id, name: trimmedName }])
    setNameInput('')
  }

  const handleDelete = (playerId: string) => {
    setPlayers((current) => current.filter((player) => player.id !== playerId))
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
        <View className="mb-3">
          <Text className="text-lg font-bold text-text">
            Spieler ({players.length})
          </Text>
        </View>
        <View className="mb-4 flex-row items-center">
          <View className="flex-1 mb-4">
            <InputField
              value={nameInput}
              placeholder="Name eingeben..."
              onChangeText={setNameInput}
            />
          </View>
          <Pressable
            onPress={handleAdd}
            disabled={!canAdd}
            className={`ml-3 h-12 w-12 items-center justify-center rounded-xl bg-primary ${
              !canAdd ? 'opacity-40' : ''
            }`}
            android_ripple={{ color: 'rgba(0,0,0,0.12)', radius: 22 }}
            accessibilityRole="button"
            accessibilityLabel="Spieler hinzufuegen"
            accessibilityHint="Fuegt den eingegebenen Spieler zur Liste hinzu"
          >
            <UserPlus size={20} color="#EEE0CB" />
          </Pressable>
        </View>
        {players.length === 0 ? (
          <View className="mb-10 items-center rounded-xl border border-black/10 bg-surface px-4 py-6">
            <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-accent">
              <UserPlus size={28} color="#000000" />
            </View>
            <Text className="text-center text-base font-semibold text-text">
              Keine Spieler hinzugefuegt
            </Text>
          </View>
        ) : (
          <View className="mb-10">
            {players.map((player) => (
              <PlayerListItem
                key={player.id}
                playerId={player.id}
                playerName={player.name}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
        <Button
          text="Spiel starten"
          onPress={() => router.push('/game')}
          disabled={players.length === 0}
          icon={<Play size={18} color="#EEE0CB" />}
        />
      </ScrollView>
    </View>
  )
}
