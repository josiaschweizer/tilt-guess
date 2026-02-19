import { LeaderboardRow } from '@/lib/game/leaderboard'
import SurfaceCard from '@/components/ui/leaderboard/SurfaceCard'
import { Text, View } from 'react-native'
import LeaderboardItem from '@/components/ui/leaderboard/LeaderboardItem'

export default function LeaderboardCard({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <SurfaceCard className="p-6 mb-5">
      <Text className="text-2xl font-black text-text mb-5">Rangliste</Text>

      <View className="gap-3">
        {rows.map((row) => (
          <LeaderboardItem key={row.player.id} row={row} />
        ))}
      </View>
    </SurfaceCard>
  )
}
