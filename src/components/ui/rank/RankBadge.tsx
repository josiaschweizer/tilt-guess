import { Text, View } from 'react-native'
import { Award, Medal, Trophy } from 'lucide-react-native'

interface Props {
  rank: number
}

export default function getRankBadge({ rank }: Props) {
  switch (rank) {
    case 1:
      return (
        <View className="h-10 w-10 rounded-2xl bg-surface border border-black/10 items-center justify-center">
          <Trophy size={22} color="#000000" />
        </View>
      )
    case 2:
      return (
        <View className="h-10 w-10 rounded-2xl bg-surface border border-black/10 items-center justify-center">
          <Medal size={22} color="#000000" />
        </View>
      )
    case 3:
      return (
        <View className="h-10 w-10 rounded-2xl bg-surface border border-black/10 items-center justify-center">
          <Award size={22} color="#000000" />
        </View>
      )
    default:
      return (
        <View className="h-10 w-10 rounded-2xl bg-surface border border-black/10 items-center justify-center">
          <Text className="text-text font-black">#{rank}</Text>
        </View>
      )
  }
}
