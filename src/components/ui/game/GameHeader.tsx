import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface GameHeaderProps {
  title: string
}

export default function GameHeader({ title }: GameHeaderProps) {
  const insets = useSafeAreaInsets()

  return (
    <View style={{ paddingTop: insets.top }} className="bg-bg">
      <View className="h-14 flex-row items-center justify-center px-2">
        <Text className="text-lg font-black text-text">{title}</Text>
      </View>
    </View>
  )
}
