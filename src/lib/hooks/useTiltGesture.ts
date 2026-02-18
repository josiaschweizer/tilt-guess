/**
 * useTiltGesture Hook
 *
 * Erkennt Handy-Kippbewegungen durch Accelerometer und Gyroscope Sensoren.
 * Ruft einen Callback auf, wenn eine Geste erkannt wird.
 */

import { useEffect, useCallback, useRef } from 'react'
import { Accelerometer, Gyroscope } from 'expo-sensors'
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

  const accelDataRef = useRef({ accelX: 0, accelY: 0, accelZ: 0 })
  const gyroDataRef = useRef({ gyroX: 0, gyroY: 0, gyroZ: 0 })
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
      // Cleanup wenn deaktiviert
      subscriptionsRef.current.forEach((sub) => sub.remove?.())
      subscriptionsRef.current = []
      return
    }

    try {
      // Setze Sensor-Update-Frequenz (in Millisekunden zwischen Updates)
      // Expo Sensors default ist 16ms (60Hz), das ist für unseren Use-Case gut
      Accelerometer.setUpdateInterval(50) // 20Hz für Balance zwischen Responsivität und Performance
      Gyroscope.setUpdateInterval(50)

      // Subscribe zu Accelerometer Updates
      const accelSubscription = Accelerometer.addListener((data) => {
        accelDataRef.current = {
          accelX: data.x,
          accelY: data.y,
          accelZ: data.z,
        }

        // Erkenne Tilt basierend auf kombiniertem Sensor-Daten
        const combinedSensorData = {
          accelX: accelDataRef.current.accelX,
          accelY: accelDataRef.current.accelY,
          accelZ: accelDataRef.current.accelZ,
          gyroX: gyroDataRef.current.gyroX,
          gyroY: gyroDataRef.current.gyroY,
          gyroZ: gyroDataRef.current.gyroZ,
        }
        const tilt = detectTilt(combinedSensorData, combinedSensorData, config)
        handleTilt(tilt)
      })

      // Subscribe zu Gyroscope Updates
      const gyroSubscription = Gyroscope.addListener((data) => {
        gyroDataRef.current = {
          gyroX: data.x,
          gyroY: data.y,
          gyroZ: data.z,
        }
      })

      subscriptionsRef.current = [accelSubscription, gyroSubscription]

      return () => {
        // Cleanup: Unsubscribe von Sensoren
        subscriptionsRef.current.forEach((sub) => {
          sub.remove?.()
        })
        subscriptionsRef.current = []
        resetTiltState()
      }
    } catch (error) {
      console.error('Error setting up tilt gesture recognition:', error)
      return () => {
        // Cleanup
      }
    }
  }, [enabled, config, handleTilt])

  return {
    isSupported: true, // TODO: Add platform check if needed
  }
}
