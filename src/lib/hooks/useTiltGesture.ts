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
  config?: Partial<TiltConfig>
}

export function useTiltGesture(props: UseTiltGestureProps) {
  const { onTiltDetected, enabled = true, config } = props

  const mergedConfig: TiltConfig = { ...DEFAULT_TILT_CONFIG, ...(config ?? {}) }
  const subsRef = useRef<Array<{ remove: () => void }>>([])

  const handleTilt = useCallback(
    (direction: TiltDirection | null) => {
      if (direction) {
        onTiltDetected(direction)
      }
    },
    [onTiltDetected],
  )

  useEffect(() => {
    if (!enabled) {
      subsRef.current.forEach((s) => s.remove?.())
      subsRef.current = []
      resetTiltState()
      return
    }

    try {
      Accelerometer.setUpdateInterval(50)

      const sub = Accelerometer.addListener((data) => {
        const tilt = detectTilt(
          {},
          { accelX: data.x, accelY: data.y, accelZ: data.z },
          mergedConfig,
        )
        handleTilt(tilt)
      })

      subsRef.current = [sub]

      return () => {
        subsRef.current.forEach((s) => s.remove?.())
        subsRef.current = []
        resetTiltState()
      }
    } catch (e) {
      console.error('Error setting up tilt gesture recognition:', e)
      return () => {}
    }
  }, [enabled, mergedConfig, handleTilt])

  return { isSupported: true }
}
