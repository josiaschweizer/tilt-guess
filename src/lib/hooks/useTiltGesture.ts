import { useCallback, useEffect, useRef, useState } from 'react'
import { DeviceMotion } from 'expo-sensors'
import type { TiltConfig } from '@/types/tilt/TiltConfig'
import type { TiltDirection } from '@/types/tilt/TiltDirection'
import type { TiltDebugInfo } from '@/types/tilt/TiltDebugInfo'
import {
  detectTiltFromDeviceMotionRotation,
  resetTiltState,
} from '@/lib/motion/deviceMotionTilt'

interface UseTiltGestureProps {
  onTiltDetected: (direction: TiltDirection) => void
  onTiltLog?: (info: TiltDebugInfo) => void
  enabled?: boolean
  config?: Partial<TiltConfig>
  requestPermissionOnMount?: boolean
}

export function useTiltGesture(props: UseTiltGestureProps) {
  const {
    onTiltDetected,
    onTiltLog,
    enabled = true,
    config,
    requestPermissionOnMount = false,
  } = props

  const subsRef = useRef<Array<{ remove: () => void }>>([])
  const [isSupported, setIsSupported] = useState<boolean>(true)

  const handleTilt = useCallback(
    (direction: TiltDirection | null) => {
      if (direction) onTiltDetected(direction)
    },
    [onTiltDetected],
  )

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      try {
        const available = await DeviceMotion.isAvailableAsync()
        if (cancelled) return

        setIsSupported(available)
        if (!available) return

        if (requestPermissionOnMount) {
          const perm = await DeviceMotion.requestPermissionsAsync()
          if (cancelled) return
          if (!perm.granted) {
            setIsSupported(false)
            return
          }
        }

        DeviceMotion.setUpdateInterval(50)

        const sub = DeviceMotion.addListener((m) => {
          const tilt = detectTiltFromDeviceMotionRotation({
            rotation: m.rotation
              ? {
                  alpha: m.rotation.alpha,
                  beta: m.rotation.beta,
                  gamma: m.rotation.gamma,
                }
              : null,
            orientation: (m.orientation ?? null) as 0 | 90 | 180 | -90 | null,
            config,
            onDebug: onTiltLog,
          })
          handleTilt(tilt)
        })

        subsRef.current = [sub]
      } catch (e) {
        console.error('Error setting up DeviceMotion tilt gesture:', e)
        setIsSupported(false)
      }
    }

    if (!enabled) {
      subsRef.current.forEach((s) => s.remove?.())
      subsRef.current = []
      resetTiltState()
      return
    }

    void start()

    return () => {
      cancelled = true
      subsRef.current.forEach((s) => s.remove?.())
      subsRef.current = []
      resetTiltState()
    }
  }, [enabled, config, handleTilt, onTiltLog, requestPermissionOnMount])

  return { isSupported }
}
