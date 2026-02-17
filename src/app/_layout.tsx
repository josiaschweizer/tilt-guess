import { Stack } from 'expo-router'
import { View } from 'react-native'
import '@/styles/global.css'

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: '#EEE0CB',
        },
        headerStyle: {
          backgroundColor: '#839788',
        },
      }}
    />
  )
}
