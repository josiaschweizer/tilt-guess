import { Stack } from 'expo-router'
import { Text, View } from 'react-native'

export default function GameSetup() {
  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Game Setup',
        }}
      />
      <Text>Game Setup Screen</Text>
    </View>
  )
}
