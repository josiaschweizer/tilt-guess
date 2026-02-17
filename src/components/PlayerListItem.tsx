import { Text, TouchableOpacity, View } from 'react-native'

interface PlayerListItemProps {
  onDelete: (playerName: string) => void
  playerName: string
}

export default function PlayerListItem({
  onDelete,
  playerName,
}: PlayerListItemProps) {
  return (
    <View>
      <Text>{playerName}</Text>
      <TouchableOpacity onPress={() => onDelete(playerName)}></TouchableOpacity>
    </View>
  )
}
