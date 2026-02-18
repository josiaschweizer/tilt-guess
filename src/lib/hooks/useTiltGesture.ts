import { useEffect, useCallback, useRef, useMemo } from 'react'
import { Accelerometer } from 'expo-sensors'
import {
  DEFAULT_TILT_CONFIG,
  detectTilt,
  resetTiltState,
} from '@/lib/sensors/tiltDetection'
import { TiltConfig } from '@/interface/tilt/TiltConfig'
import { TiltDirection } from '@/types/tilt/TiltDirection'

interface UseTiltGestureProps {
  onTiltDetected: (direction: TiltDirection) => void
  enabled?: boolean
  config?: Partial<TiltConfig>
}

export function useTiltGesture(props: UseTiltGestureProps) {
  const { onTiltDetected, enabled = true, config } = props

  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_TILT_CONFIG, ...(config ?? {}) }),
    [config],
  )

  const subsRef = useRef<Array<{ remove: () => void }>>([])
  const configRef = useRef<TiltConfig>(mergedConfig)
  const onTiltDetectedRef =
    useRef<UseTiltGestureProps['onTiltDetected']>(onTiltDetected)

  useEffect(() => {
    configRef.current = mergedConfig
  }, [mergedConfig])

  useEffect(() => {
    onTiltDetectedRef.current = onTiltDetected
  }, [onTiltDetected])

  const handleTilt = useCallback((direction: TiltDirection | null) => {
    if (direction && onTiltDetectedRef.current) {
      onTiltDetectedRef.current(direction)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      subsRef.current.forEach((s) => s.remove?.())
      subsRef.current = []
      return
    }

    try {
      Accelerometer.setUpdateInterval(50)
      resetTiltState()

      const sub = Accelerometer.addListener((data) => {
        const tilt = detectTilt(
          {},
          { accelX: data.x, accelY: data.y, accelZ: data.z },
          configRef.current,
        )
        handleTilt(tilt)
      })

      subsRef.current = [sub]

      return () => {
        subsRef.current.forEach((s) => s.remove?.())
        subsRef.current = []
        // Nicht resetTiltState() hier aufrufen - das erhält die Baseline
      }
    } catch (e) {
      return () => {}
    }
  }, [enabled, handleTilt])

  return { isSupported: true }
}
