import { LeaderboardRow } from '@/lib/game/leaderboard'
import { Text, View } from 'react-native'
import { Trophy } from 'lucide-react-native'
import StatPill from '@/components/ui/leaderboard/StatPill'
import SurfaceCard from '@/components/ui/leaderboard/SurfaceCard'

export default function WinnerCard({ winner }: { winner?: LeaderboardRow }) {
  return (
    <SurfaceCard className="p-7 mb-5">
      <View className="items-center">
        <View className="h-20 w-20 rounded-3xl bg-bg border border-black/10 items-center justify-center mb-4">
          <Trophy size={36} color="#000000" />
        </View>

        <Text className="text-3xl font-black text-text text-center mb-1">
          Gewinner
        </Text>

        <Text className="text-2xl font-black text-text text-center mb-5">
          {winner?.player.name ?? '—'}
        </Text>

        <StatPill value={winner?.correct ?? 0} label="punkte" />

        {winner ? (
          <Text className="text-black/70 mt-4">
            {winner.skipped} übersprungen
          </Text>
        ) : null}
      </View>
    </SurfaceCard>
  )
}
