import React from 'react'
import {
  Text,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native'

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

  const base = 'h-14 px-6 rounded-xl flex-row items-center justify-center mb-3'
  const width = fullWidth ? 'w-full' : ''
  const colors = primary ? 'bg-primary' : 'bg-surface border border-black/15'
  const disabledClass = disabled ? 'opacity-40' : ''
  const textClass = primary ? 'text-on-primary' : 'text-text'

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={`${base} ${width} ${colors} ${disabledClass}`}
      style={[
        style,
        primary && {
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 5,
        },
      ]}
      activeOpacity={0.7}
    >
      {icon ? <View className="mr-3">{icon}</View> : null}
      <Text className={`font-bold text-lg ${textClass}`}>{text}</Text>
    </TouchableOpacity>
  )
}
