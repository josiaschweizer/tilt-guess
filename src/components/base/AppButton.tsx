import React from 'react'
import {
  Text,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native'

interface ButtonProps {
  text?: string
  onPress?: () => void
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  style?: StyleProp<ViewStyle>
}

export default function AppButton({
  text,
  onPress,
  disabled = false,
  fullWidth = true,
  icon,
  variant = 'primary',
  size = 'lg',
  style,
}: ButtonProps) {
  const primary = variant === 'primary'
  const iconOnly = icon && !text

  const sizeClasses = {
    sm: iconOnly ? 'h-9 w-9' : 'h-9 px-4',
    md: iconOnly ? 'h-12 w-12' : 'h-12 px-5',
    lg: iconOnly ? 'h-14 w-14' : 'h-14 px-6',
  }

  const base = `${sizeClasses[size]} rounded-xl flex-row items-center justify-center mb-3`
  const width = fullWidth && !iconOnly ? 'w-full' : ''
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
      {icon && !iconOnly ? <View className="mr-3">{icon}</View> : null}
      {iconOnly ? icon : null}
      {text ? (
        <Text className={`font-bold text-lg ${textClass}`}>{text}</Text>
      ) : null}
    </TouchableOpacity>
  )
}
