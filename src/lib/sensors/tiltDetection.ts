import { TiltConfig } from '@/interface/tilt/TiltConfig'
import { TiltDirection } from '@/types/tilt/TiltDirection'

export const DEFAULT_TILT_CONFIG: TiltConfig = {
  gyroThreshold: 5.5,
  debounceMs: 900,
  confirmationMs: 40,
}

let lastTiltTime = 0
let candidateDirection: TiltDirection = null
let candidateStartTime = 0

let isNeutral = true
let neutralStartTime = 0

const NEUTRAL_DEADZONE = 1.2
const NEUTRAL_REQUIRED_MS = 200

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
  const gyroY = gyroData.gyroY ?? 0

  if (Math.abs(gyroY) < NEUTRAL_DEADZONE) {
    if (!isNeutral) {
      isNeutral = true
      neutralStartTime = now
    }
  } else {
    isNeutral = false
    neutralStartTime = 0
  }

  const hasPreviousTilt = lastTiltTime > 0
  const timeSinceLastTilt = now - lastTiltTime
  const neutralLongEnough =
    isNeutral &&
    neutralStartTime > 0 &&
    now - neutralStartTime >= NEUTRAL_REQUIRED_MS

  if (
    hasPreviousTilt &&
    (timeSinceLastTilt < config.debounceMs || !neutralLongEnough)
  ) {
    candidateDirection = null
    candidateStartTime = 0
    return null
  }

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

  const confirmedDirection = candidateDirection
  lastTiltTime = now
  candidateDirection = null
  candidateStartTime = 0
  return confirmedDirection
}

export function resetTiltState(): void {
  lastTiltTime = 0
  candidateDirection = null
  candidateStartTime = 0
  isNeutral = true
  neutralStartTime = 0
}
