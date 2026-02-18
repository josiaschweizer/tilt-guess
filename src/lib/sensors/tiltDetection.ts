import { TiltConfig } from '@/interface/tilt/TiltConfig'
import { TiltDirection } from '@/types/tilt/TiltDirection'

export const DEFAULT_TILT_CONFIG: TiltConfig = {
  gyroThreshold: 3.5,
  debounceMs: 800,
  confirmationMs: 60,
}

let lastTiltTime = 0
let lastTiltDirection: TiltDirection = null

let candidateDirection: TiltDirection = null
let candidateStartTime = 0

export interface SensorData {
  accelX?: number
  accelY?: number
  accelZ?: number
  gyroX?: number
  gyroY?: number
  gyroZ?: number
}

export function detectTilt(
  _accelData: SensorData,
  gyroData: SensorData,
  config: TiltConfig = DEFAULT_TILT_CONFIG,
): TiltDirection {
  const now = Date.now()

  if (now - lastTiltTime < config.debounceMs) {
    candidateDirection = null
    candidateStartTime = 0
    return null
  }

  const gyroY = gyroData.gyroY ?? 0

  let currentDirection: TiltDirection = null
  if (gyroY > config.gyroThreshold) {
    currentDirection = 'backward'
  } else if (gyroY < -config.gyroThreshold) {
    currentDirection = 'forward'
  }

  if (currentDirection === null) {
    candidateDirection = null
    candidateStartTime = 0
    return null
  }

  if (currentDirection !== candidateDirection) {
    candidateDirection = currentDirection
    candidateStartTime = now
    return null
  }

  const heldFor = now - candidateStartTime
  if (heldFor < config.confirmationMs) {
    return null
  }

  if (candidateDirection !== lastTiltDirection) {
    lastTiltDirection = candidateDirection
    lastTiltTime = now
    candidateDirection = null
    candidateStartTime = 0
    return lastTiltDirection
  }

  return null
}

export function resetTiltState(): void {
  lastTiltTime = 0
  lastTiltDirection = null
  candidateDirection = null
  candidateStartTime = 0
}
