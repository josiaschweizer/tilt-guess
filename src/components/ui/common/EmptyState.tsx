import React from 'react'
import { Text, View } from 'react-native'
import AppButton from '@/components/base/AppButton'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionText?: string
  onAction?: () => void
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="h-20 w-20 rounded-3xl bg-surface/60 border border-black/10 items-center justify-center mb-6">
        {icon}
      </View>

      <Text className="text-2xl font-black text-text text-center mb-2">
        {title}
      </Text>
      <Text className="text-black/70 text-center mb-8 leading-5">
        {description}
      </Text>

      {actionText && onAction && (
        <AppButton text={actionText} onPress={onAction} fullWidth={false} />
      )}
    </View>
  )
}
