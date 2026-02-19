import React from 'react'
import { Text, View } from 'react-native'

interface GameInstructionCardProps {
  title: string
  instructions: string
}

export default function GameInstructionCard({
  title,
  instructions,
}: GameInstructionCardProps) {
  return (
    <View className="flex-1 rounded-3xl bg-surface border border-black/10 p-6">
      <Text className="text-xl font-black text-text mb-3">{title}</Text>

      <Text className="text-black/80 leading-5">{instructions}</Text>
    </View>
  )
}
