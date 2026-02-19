import { Text, View } from 'react-native'
import SurfaceCard from '@/components/ui/leaderboard/SurfaceCard'

export default function SplitStatCard({
  leftValue,
  leftLabel,
  rightValue,
  rightLabel,
}: {
  leftValue: string | number
  leftLabel: string
  rightValue: string | number
  rightLabel: string
}) {
  return (
    <SurfaceCard className="p-6 mb-5">
      <View className="flex-row">
        <View className="flex-1 items-center">
          <Text className="text-3xl font-black text-text">{leftValue}</Text>
          <Text className="text-black/70">{leftLabel}</Text>
        </View>

        <View className="w-px bg-black/10" />

        <View className="flex-1 items-center">
          <Text className="text-3xl font-black text-text">{rightValue}</Text>
          <Text className="text-black/70">{rightLabel}</Text>
        </View>
      </View>
    </SurfaceCard>
  )
}
