import { TouchableOpacity, Text, View } from 'react-native'
import { Trash2, User } from 'lucide-react-native'
import { Player } from '@/interface/entities/Player'

interface PlayerListItemProps {
  player: Player
  onDelete: (playerId: string) => void
}

export default function PlayerListItem({
  player,
  onDelete,
}: PlayerListItemProps) {
  return (
    <View className="mb-2 flex-row items-center justify-between rounded-xl border border-black/10 bg-surface px-3 py-2">
      <View className="flex-1 flex-row items-center">
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-accent">
          <User size={18} color="#000000" />
        </View>
        <Text
          className="flex-1 text-[18px] font-semibold text-text"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {player.name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(player.id)}
        className="h-9 w-9 items-center justify-center rounded-full bg-primary"
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${player.name}`}
        accessibilityHint="Removes this player from the list"
      >
        <Trash2 size={18} color="#EEE0CB" />
      </TouchableOpacity>
    </View>
  )
}
