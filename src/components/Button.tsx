import React from 'react'
import { Pressable, Text, View, StyleProp, ViewStyle } from 'react-native'

interface ButtonProps {
  text: string
  onPress?: () => void
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary'
  style?: StyleProp<ViewStyle>
}

export default function Button({
  text,
  onPress,
  disabled = false,
  fullWidth = true,
  icon,
  variant = 'primary',
  style,
}: ButtonProps) {
  const primary = variant === 'primary'

  const base =
    'h-12 px-4 rounded-full flex-row items-center justify-center mb-2.5'
  const width = fullWidth ? 'w-full' : ''
  const colors = primary ? 'bg-primary' : 'bg-surface border border-black/15'
  const disabledClass = disabled ? 'opacity-40' : ''
  const textClass = primary ? 'text-on-primary' : 'text-text'

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`${base} ${width} ${colors} ${disabledClass}`}
      style={({ pressed }): StyleProp<ViewStyle> => [
        style,
        pressed && !disabled
          ? { transform: [{ scale: 0.98 }], opacity: 0.9 }
          : null,
      ]}
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
    >
      {icon ? <View className="mr-2">{icon}</View> : null}
      <Text className={`font-bold text-base ${textClass}`}>{text}</Text>
    </Pressable>
  )
}
