import { Pressable, Text, View } from 'react-native'
import { Calendar, ChevronRight, Trash2 } from 'lucide-react-native'
import { GameResult } from '@/interface/GameResult'

function formatDate(iso: string) {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${min}`
}

interface Props {
  game: GameResult
  title: string
  onPress: () => void
  onDelete: () => void
}

export default function HistoryRow({ game, title, onPress, onDelete }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl bg-surface/70 border border-black/10 px-5 py-4"
      style={({ pressed }) =>
        pressed ? { opacity: 0.92, transform: [{ scale: 0.995 }] } : null
      }
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="h-12 w-24 rounded-2xl bg-accent/80 border border-black/10 items-center justify-center">
            <Text className="font-black text-on-accent">
              {formatTime(game.createdAtIso)}
            </Text>
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-xl font-black text-text">{title}</Text>

            <View className="flex-row items-center mt-1">
              <Calendar size={14} color="#000000" />
              <Text className="ml-2 text-black/70 text-sm">
                {formatDate(game.createdAtIso)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center">
          <ChevronRight size={18} color="#000000" />
        </View>
      </View>
    </Pressable>
  )
}
