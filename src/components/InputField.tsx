import { TextInput, View } from 'react-native'

interface Props {
  value: string
  placeholder: string
  onChangeText: (text: string) => void
}

export default function InputField({
  value,
  placeholder,
  onChangeText,
}: Props) {
  return (
    <View className="mb-4">
      <TextInput
        className="h-12 px-3 text-[18px] rounded-md border-2 bg-surface border-primary text-text"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#00000080"
      />
    </View>
  )
}
