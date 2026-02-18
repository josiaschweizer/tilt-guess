import { useEffect, useCallback, useRef } from 'react'
import { Accelerometer } from 'expo-sensors'
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
      resetTiltState()
      return
    }

    try {
      Accelerometer.setUpdateInterval(50)

      const accelSubscription = Accelerometer.addListener((data) => {
        const tilt = detectTilt(
          {},
          { accelX: data.x, accelY: data.y, accelZ: data.z },
          config,
        )
        handleTilt(tilt)
      })

      subscriptionsRef.current = [accelSubscription]

      return () => {
        subscriptionsRef.current.forEach((sub) => sub.remove?.())
        subscriptionsRef.current = []
        resetTiltState()
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error setting up tilt gesture recognition:', error)
      return () => {}
    }
  }, [enabled, config, handleTilt])

  return {
    isSupported: true,
  }
}
