import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function LeaderBoard() {
  const gameId = useLocalSearchParams()

  return (
    <View>
      <Text>{String(gameId)}</Text>
    </View>
  )
}
