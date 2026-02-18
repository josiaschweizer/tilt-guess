import { TiltConfig } from '@/interface/tilt/TiltConfig'
import { TiltDirection } from '@/types/tilt/TiltDirection'
import { SensorInput } from '@/types/tilt/SensorInput'
import { TiltState } from '@/types/tilt/TiltState'
import getAxisValue from '@/lib/sensors/getAxisValue'

export const DEFAULT_TILT_CONFIG: TiltConfig = {
  axis: 'y',
  threshold: 0.35,
  resetThreshold: 0.15,
  cooldownMs: 800,
  invert: false,
}

const state: TiltState = {
  baseline: null,
  armed: true,
  lastTriggerAt: 0,
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

  if (state.baseline === null) {
    state.baseline = axisValueRaw
  }

  const baseline = state.baseline ?? axisValueRaw
  const axisDeltaRaw = axisValueRaw - baseline
  const axisDelta = config.invert ? -axisDeltaRaw : axisDeltaRaw
  const absAxisDelta = Math.abs(axisDelta)
  const resetThreshold = config.resetThreshold ?? config.threshold / 2

  if (t - state.lastTriggerAt < config.cooldownMs) {
    return null
  }

  if (!state.armed) {
    if (absAxisDelta <= resetThreshold) {
      state.armed = true
    }

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
