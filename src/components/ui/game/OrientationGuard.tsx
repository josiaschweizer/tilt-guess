import React from 'react'
import { Animated, Text, View } from 'react-native'
import { RotateCw } from 'lucide-react-native'
import { useRotationAnimation } from '@/lib/hooks'

export default function OrientationGuard() {
  const { animatedStyle } = useRotationAnimation()

  return (
    <View className="flex-1 items-center justify-center">
      <View className="items-center">
        <Animated.View style={[animatedStyle]}>
          <RotateCw size={64} color="#000000" strokeWidth={1.5} />
        </Animated.View>
        <Text className="text-center text-xl font-black text-text mt-6">
          Bitte drehe dein Handy
        </Text>
        <Text className="text-center text-black/60 mt-3">
          Querformat ist erforderlich
        </Text>
      </View>
    </View>
  )
}
