import { router, Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { History, Play, Users } from 'lucide-react-native'
import Button from '@/components/Button'

export default function Home() {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <Stack.Screen options={{ title: 'Home' }} />

      <View className="w-full max-w-md">
        <View className="items-center mb-12">
          <View className="h-24 w-24 rounded-full bg-primary items-center justify-center mb-4">
            <Users size={48} color="#EEE0CB" />
          </View>

          <Text className="text-4xl font-black text-text mb-2">TiltGuess</Text>

          <Text className="text-base text-black/70 text-center">
            Das ultimative Rate-Spiel für deine Party und gegen Langeweile.
          </Text>
        </View>

        <View className="gap-4">
          <Button
            text="Neues Spiel starten"
            onPress={() => router.push('/game/setup')}
            icon={<Play size={20} color="#EEE0CB" />}
          />

          <Button
            text="Spielverlauf"
            variant="secondary"
            onPress={() => router.push('/history')}
            icon={<History size={20} color="#000000" />}
          />
        </View>
      </View>
    </View>
  )
}
