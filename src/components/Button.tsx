import { Animated, StyleSheet, TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native'

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
      style={[styles.button, style, disabled && styles.disabled]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    paddingHorizontal: 16,
    elevation: 4,
    backgroundColor: '#222222',
    borderRadius: 50,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.4,
  },
})