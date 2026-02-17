import { forwardRef } from 'react'
import { TextInput, View, TextInputProps } from 'react-native'

interface Props extends TextInputProps {
  value: string
  placeholder: string
  onChangeText: (text: string) => void
}

const InputField = forwardRef<TextInput, Props>(
  ({ value, placeholder, onChangeText, ...rest }, ref) => {
    return (
      <View className="w-full">
        <TextInput
          ref={ref}
          className="h-12 px-3 text-[18px] rounded-md border-2 bg-surface border-primary text-text"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#00000080"
          {...rest}
        />
      </View>
    )
  },
)

InputField.displayName = 'InputField'

export default InputField
