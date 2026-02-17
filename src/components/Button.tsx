import { TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native'

interface ButtonProps {
  text: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}

export default function Button({
  text,
  onPress,
  style,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={` h-12 px-4 rounded-full mb-2.5 items-center justify-center bg-primary${disabled ? 'opacity-40' : ''}`}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <Text className="text-on-primary font-bold">{text}</Text>
    </TouchableOpacity>
  )
}
