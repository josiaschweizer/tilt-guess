import { View } from 'react-native'
import { ReactNode } from 'react'

export default function SurfaceCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <View
      className={`rounded-3xl bg-surface border border-black/10 ${className}`}
    >
      {children}
    </View>
  )
}
