import React from 'react'
import { Text, View } from 'react-native'

interface ProgressBarProps {
  current: number
  total: number
  label?: string
  showPercentage?: boolean
}

export default function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <View className="mb-5">
      <View className="h-2 bg-gray-300 rounded overflow-hidden">
        <View
          className="h-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </View>
      {showPercentage && (
        <Text className="text-2xl font-bold text-center mt-2.5">
          {label || `${current}s`}
        </Text>
      )}
    </View>
  )
}
