import { Text, View, Animated, Pressable } from 'react-native'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Stack, useLocalSearchParams, router } from 'expo-router'
import { useTiltGesture } from '@/lib/hooks/useTiltGesture'
import type { TiltDirection } from '@/lib/sensors/tiltDetection'

export default function GamePlay() {
  const params = useLocalSearchParams()
  const idParam = params.id
  const gameId = Array.isArray(idParam) ? idParam[0] : idParam

  const [isLoading, setIsLoading] = useState(true)
  const [lastGesture, setLastGesture] = useState<TiltDirection>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [gestureTime, setGestureTime] = useState<Date | null>(null)

  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [gameId])

  const handleTiltDetected = useCallback(
    (direction: TiltDirection) => {
      if (!direction) return

      console.log(`✅ Tilt detected: ${direction}`)

      // Update Statistiken
      if (direction === 'backward') {
        setCorrectCount((prev) => prev + 1)
      } else if (direction === 'forward') {
        setWrongCount((prev) => prev + 1)
      }

      setLastGesture(direction)
      setGestureTime(new Date())

      scaleAnim.setValue(0.8)
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start()

      setTimeout(() => {
        setLastGesture(null)
      }, 1000)
    },
    [scaleAnim],
  )

  // Aktiviere Tilt-Gesture-Erkennung
  useTiltGesture({
    onTiltDetected: handleTiltDetected,
    enabled: !isLoading,
  })

  const gestureColor =
    lastGesture === 'backward'
      ? '#10b981'
      : lastGesture === 'forward'
        ? '#ef4444'
        : '#6b7280'
  const gestureText =
    lastGesture === 'backward'
      ? '✓ CORRECT'
      : lastGesture === 'forward'
        ? '✗ WRONG'
        : 'Waiting...'

  return (
    <View className="flex-1 bg-gradient-to-b from-slate-900 to-slate-800">
      <Stack.Screen
        options={{ title: 'Tilt Test', orientation: 'landscape' }}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-2xl font-bold">Loading...</Text>
        </View>
      ) : (
        <View className="flex-1 p-6 justify-between">
          {/* Top Section - Instructions */}
          <View className="items-center">
            <Text className="text-white text-2xl font-bold mb-4">
              Tilt Detection Test
            </Text>
            <View className="bg-blue-900/50 rounded-lg p-4 w-full">
              <Text className="text-blue-200 text-sm font-semibold mb-2">
                📱 Instructions:
              </Text>
              <Text className="text-blue-100 text-xs mb-1">
                • Tilt device BACKWARD for CORRECT ✓
              </Text>
              <Text className="text-blue-100 text-xs">
                • Tilt device FORWARD for WRONG ✗
              </Text>
            </View>
          </View>

          {/* Middle Section - Live Feedback */}
          <View className="items-center justify-center">
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
              className="w-48 h-48 rounded-full bg-slate-700 items-center justify-center mb-8"
            >
              <Text
                style={{ color: gestureColor }}
                className="text-5xl font-bold text-center"
              >
                {gestureText}
              </Text>
            </Animated.View>

            {gestureTime && (
              <Text className="text-gray-400 text-xs">
                {gestureTime.toLocaleTimeString()}
              </Text>
            )}
          </View>

          {/* Bottom Section - Statistics */}
          <View>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/game/instruction/[id]',
                  params: { id: gameId, disableBack: 'true' },
                })
              }}
              className="mb-4 bg-blue-600 rounded-lg p-3 items-center"
            >
              <Text className="text-white font-bold">
                Nächste Runde (mit disableBack: true)
              </Text>
            </Pressable>

            <View className="flex-row justify-around mb-4">
              {/* Correct Counter */}
              <View className="bg-green-900/50 rounded-lg p-4 flex-1 mr-2 items-center">
                <Text className="text-green-400 text-xs mb-1">CORRECT</Text>
                <Text className="text-green-300 text-4xl font-bold">
                  {correctCount}
                </Text>
                <Text className="text-green-500 text-xs mt-1">← Backward</Text>
              </View>

              {/* Wrong Counter */}
              <View className="bg-red-900/50 rounded-lg p-4 flex-1 ml-2 items-center">
                <Text className="text-red-400 text-xs mb-1">WRONG</Text>
                <Text className="text-red-300 text-4xl font-bold">
                  {wrongCount}
                </Text>
                <Text className="text-red-500 text-xs mt-1">Forward →</Text>
              </View>
            </View>

            {/* Total and Status */}
            <View className="bg-slate-700 rounded-lg p-3 items-center">
              <Text className="text-gray-400 text-xs mb-1">Total Tilts</Text>
              <Text className="text-white text-2xl font-bold">
                {correctCount + wrongCount}
              </Text>
              <Text className="text-gray-500 text-xs mt-2">
                Sensor Status:{' '}
                <Text className="text-green-400 font-semibold">ACTIVE</Text>
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
