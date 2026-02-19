import React from 'react'
import { Text, View } from 'react-native'
import { User } from 'lucide-react-native'
import { Player } from '@/interface/entities/Player'

interface PlayerInfoCardProps {
  player: Player
  currentRound: number
  totalRounds: number
  gameName?: string
  totalPlayers?: number
}

export default function PlayerInfoCard({
  player,
  currentRound,
  totalRounds,
  gameName,
  totalPlayers,
}: PlayerInfoCardProps) {
  return (
    <View className="flex-1 rounded-3xl bg-surface border border-black/10 p-5">
      <View className="flex-row items-center">
        <View className="h-12 w-12 rounded-2xl bg-bg border border-black/10 items-center justify-center">
          <User size={22} color="#000000" />
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-black/70">Dran ist</Text>
          <Text className="text-2xl font-black text-text">{player.name}</Text>
        </View>

        <View className="rounded-2xl bg-bg border border-black/10 px-3 py-2">
          <Text className="text-text font-black">
            Runde {currentRound}/{totalRounds}
          </Text>
        </View>
      </View>

      {(gameName || totalPlayers !== undefined) && (
        <View className="mt-4 flex-row flex-wrap gap-2">
          {gameName && (
            <View className="rounded-2xl bg-bg border border-black/10 px-3 py-2">
              <Text className="text-black/70">Spielname</Text>
              <Text className="text-text font-black">{gameName}</Text>
            </View>
          )}
          {totalPlayers !== undefined && (
            <View className="rounded-2xl bg-bg border border-black/10 px-3 py-2">
              <Text className="text-black/70">Spieler</Text>
              <Text className="text-text font-black">{totalPlayers}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
