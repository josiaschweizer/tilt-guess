import { useEffect, useCallback, useRef } from 'react'
import { Gyroscope } from 'expo-sensors'
import {
  detectTilt,
  resetTiltState,
  type TiltDirection,
  type TiltConfig,
  DEFAULT_TILT_CONFIG,
} from '@/lib/sensors/tiltDetection'

interface UseTiltGestureProps {
  onTiltDetected: (direction: TiltDirection) => void
  enabled?: boolean
  config?: TiltConfig
}

export function useTiltGesture(props: UseTiltGestureProps) {
  const { onTiltDetected, enabled = true, config = DEFAULT_TILT_CONFIG } = props

  const subscriptionsRef = useRef<Array<{ remove: () => void }>>([])

  const handleTilt = useCallback(
    (direction: TiltDirection) => {
      if (direction) {
        onTiltDetected(direction)
      }
    },
    [onTiltDetected],
  )

  useEffect(() => {
    if (!enabled) {
      subscriptionsRef.current.forEach((sub) => sub.remove?.())
      subscriptionsRef.current = []
      return
    }

    try {
      Gyroscope.setUpdateInterval(50)

      const gyroSubscription = Gyroscope.addListener((data) => {
        const tilt = detectTilt(
          {},
          { gyroX: data.x, gyroY: data.y, gyroZ: data.z },
          config,
        )
        handleTilt(tilt)
      })

      subscriptionsRef.current = [gyroSubscription]

      return () => {
        subscriptionsRef.current.forEach((sub) => sub.remove?.())
        subscriptionsRef.current = []
        resetTiltState()
      }
    } catch (error) {
      console.error('Error setting up tilt gesture recognition:', error)
      return () => {}
    }
  }, [enabled, config, handleTilt])

  return {
    isSupported: true,
  }
}
