import { Text, View } from 'react-native'
import getRankBadge from '@/components/ui/rank/RankBadge'
import { LeaderboardRow } from '@/lib/game/leaderboard'

export default function LeaderboardItem({ row }: { row: LeaderboardRow }) {
  return (
    <View className="rounded-2xl bg-bg border border-black/10 p-5 flex-row items-center">
      {getRankBadge({ rank: row.rank })}

      <View className="flex-1 ml-4">
        <Text className="text-lg font-black text-text">{row.player.name}</Text>
        <Text className="text-black/70">{row.skipped} übersprungen</Text>
      </View>

      <View className="items-end">
        <Text className="text-3xl font-black text-text">{row.correct}</Text>
        <Text className="text-black/70">punkte</Text>
      </View>
    </View>
  )
}
