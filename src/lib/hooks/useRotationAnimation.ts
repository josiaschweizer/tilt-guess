import { useMemo, useEffect } from 'react'
import { Animated } from 'react-native'

export function useRotationAnimation() {
  const rotationAnim = useMemo(() => new Animated.Value(0), [])

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 360,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start()
  }, [rotationAnim])

  const animatedStyle = {
    transform: [
      {
        rotate: rotationAnim.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  }

  return { animatedStyle, animatedValue: rotationAnim }
}
