import React from 'react'
import { Text, View } from 'react-native'

interface ScoreDisplayProps {
  correct: number
  skipped: number
  layout?: 'horizontal' | 'vertical'
}

export default function ScoreDisplay({
  correct,
  skipped,
  layout = 'horizontal',
}: ScoreDisplayProps) {
  const containerClass =
    layout === 'horizontal' ? 'flex-row justify-between' : 'gap-4'

  return (
    <View className={containerClass}>
      <Text className="text-xl font-semibold text-green-600">
        ✓ Richtig: {correct}
      </Text>
      <Text className="text-xl font-semibold text-gray-500">
        → Übersprungen: {skipped}
      </Text>
    </View>
  )
}
