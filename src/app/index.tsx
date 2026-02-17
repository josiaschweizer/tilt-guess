import { Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { Users } from 'lucide-react-native'

export default function Home() {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />

      <View className="w-full max-w-md">
        <View className="items-center mb-12">
          <View className="h-24 w-24 rounded-full bg-primary items-center justify-center mb-4">
            <Users size={48} color="#EEE0CB" />
          </View>

          <Text className="text-4xl font-black text-text mb-2">TiltGuess</Text>

          <Text className="text-base text-black/70 text-center">
            Das ultimative Rate-Spiel für deine Party!
          </Text>
        </View>
      </View>
    </View>
  )
}
