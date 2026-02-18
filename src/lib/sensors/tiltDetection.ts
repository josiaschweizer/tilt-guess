export type TiltDirection = 'forward' | 'backward'

export type TiltAxis = 'x' | 'y' | 'z'

export interface TiltConfig {
  axis: TiltAxis
  threshold: number
  neutralThreshold: number
  cooldownMs: number
  baselineAlpha: number
  invert: boolean
  log: boolean
}

export const DEFAULT_TILT_CONFIG: TiltConfig = {
  axis: 'y',
  threshold: 0.35,
  neutralThreshold: 0.12,
  cooldownMs: 800,
  baselineAlpha: 0.03,
  invert: false,
  log: false,
}

type SensorInput = {
  accelX?: number
  accelY?: number
  accelZ?: number
}

type TiltState = {
  baseline: number | null
  armed: boolean
  lastTriggerAt: number
}

const state: TiltState = {
  baseline: null,
  armed: true,
  lastTriggerAt: 0,
}

function getAxisValue(input: SensorInput, axis: TiltAxis): number {
  if (axis === 'x') return input.accelX ?? 0
  if (axis === 'y') return input.accelY ?? 0
  return input.accelZ ?? 0
}

export function resetTiltState() {
  state.baseline = null
  state.armed = true
  state.lastTriggerAt = 0
}

export function detectTilt(
  _prev: unknown,
  input: SensorInput,
  config: TiltConfig = DEFAULT_TILT_CONFIG,
): TiltDirection | null {
  const t = Date.now()
  const axisValueRaw = getAxisValue(input, config.axis)

  // Baseline initialisieren
  if (state.baseline === null) {
    state.baseline = axisValueRaw
  }

  const baseline = state.baseline ?? axisValueRaw
  const axisDeltaRaw = axisValueRaw - baseline
  const axisDelta = config.invert ? -axisDeltaRaw : axisDeltaRaw

  if (config.log) {
    console.log('[TILT] raw', {
      t,
      axis: config.axis,
      axisValue: axisValueRaw,
      baseline,
      axisDelta,
      armed: state.armed,
      lastTriggerAt: state.lastTriggerAt,
    })
  }

  // Cooldown
  if (t - state.lastTriggerAt < config.cooldownMs) {
    return null
  }

  // Re-Arm + Baseline nur in Neutralzone nachziehen
  const isNeutral = Math.abs(axisDelta) <= config.neutralThreshold
  if (isNeutral) {
    state.armed = true
    // Baseline sanft nachziehen, aber nur wenn neutral (wichtig!)
    state.baseline = baseline + (axisValueRaw - baseline) * config.baselineAlpha
    return null
  }

  // Nur triggern, wenn armed
  if (!state.armed) {
    return null
  }

  if (axisDelta >= config.threshold) {
    state.armed = false
    state.lastTriggerAt = t
    return 'forward'
  }

  if (axisDelta <= -config.threshold) {
    state.armed = false
    state.lastTriggerAt = t
    return 'backward'
  }

  return null
}
