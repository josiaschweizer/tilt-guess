import { Pressable, Text, View, StyleProp, ViewStyle } from 'react-native'
import { Trash2, User } from 'lucide-react-native'

interface PlayerListItemProps {
  onDelete: (playerId: string) => void
  playerId: string
  playerName: string
}

export default function PlayerListItem({
  onDelete,
  playerId,
  playerName,
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
          {playerName}
        </Text>
      </View>
      <Pressable
        onPress={() => onDelete(playerId)}
        className="h-9 w-9 items-center justify-center rounded-full bg-primary"
        android_ripple={{ color: 'rgba(0,0,0,0.12)', radius: 18 }}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={({ pressed }): StyleProp<ViewStyle> => [
          pressed ? { transform: [{ scale: 0.96 }], opacity: 0.9 } : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${playerName}`}
        accessibilityHint="Removes this player from the list"
      >
        <Trash2 size={18} color="#EEE0CB" />
      </Pressable>
    </View>
  )
}
