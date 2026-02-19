import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { Text, View } from 'react-native'

export default function StatPill({
  value,
  label,
}: {
  value: string | number
  label: string
}) {
  return (
    <View className="rounded-3xl bg-bg border border-black/10 px-8 py-5 items-center">
      <Text className="text-5xl font-black text-text">{value}</Text>
      <Text className="text-black/70">{label}</Text>
    </View>
  )
}
