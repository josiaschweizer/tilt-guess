import { useEffect, useCallback, useRef } from 'react'
import { Accelerometer } from 'expo-sensors'
import {
  DEFAULT_TILT_CONFIG,
  detectTilt,
  resetTiltState,
} from '@/lib/sensors/tiltDetection'
import { TiltConfig } from '@/interface/tilt/TiltConfig'
import { TiltDirection } from '@/types/tilt/TiltDirection'
import { TiltDebugInfo } from '@/types/tilt/TiltDebugInfo'

interface UseTiltGestureProps {
  onTiltDetected: (direction: TiltDirection) => void
  onTiltLog?: (info: TiltDebugInfo) => void
  enabled?: boolean
  config?: Partial<TiltConfig>
}

export function useTiltGesture(props: UseTiltGestureProps) {
  const { onTiltDetected, onTiltLog, enabled = true, config } = props

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
          onTiltLog,
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
  }, [enabled, mergedConfig, handleTilt, onTiltLog])

  return { isSupported: true }
}
