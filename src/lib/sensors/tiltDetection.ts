import { TiltConfig } from '@/interface/tilt/TiltConfig'
import { TiltAxis } from '@/types/tilt/TiltAxis'
import { TiltDirection } from '@/types/tilt/TiltDirection'
import { SensorInput } from '@/types/tilt/SensorInput'
import { TiltState } from '@/types/tilt/TiltState'
import { TiltDebugInfo } from '@/types/tilt/TiltDebugInfo'

export const DEFAULT_TILT_CONFIG: TiltConfig = {
  axis: 'y',
  threshold: 0.35,
  neutralThreshold: 0.12,
  cooldownMs: 800,
  baselineAlpha: 0.03,
  invert: false,
  log: false,
}

const state: TiltState = {
  baseline: null,
  armed: true,
  lastTriggerAt: 0,
}

function getAxisValue(input: SensorInput, axis: TiltAxis): number {
  if (axis === 'x') {
    return input.accelX ?? 0
  } else if (axis === 'y') {
    return input.accelY ?? 0
  }

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
  onDebug?: (info: TiltDebugInfo) => void,
): TiltDirection | null {
  const t = Date.now()
  const axisValueRaw = getAxisValue(input, config.axis)

  if (state.baseline === null) {
    state.baseline = axisValueRaw
  }

  const baseline = state.baseline ?? axisValueRaw
  const axisDeltaRaw = axisValueRaw - baseline
  const axisDelta = config.invert ? -axisDeltaRaw : axisDeltaRaw

  const emitDebug = (
    direction: TiltDirection | null,
    baselineForDebug = baseline,
  ) => {
    onDebug?.({
      t,
      axis: config.axis,
      axisValue: axisValueRaw,
      baseline: baselineForDebug,
      axisDelta,
      armed: state.armed,
      lastTriggerAt: state.lastTriggerAt,
      direction,
    })
  }

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

  if (t - state.lastTriggerAt < config.cooldownMs) {
    emitDebug(null)
    return null
  }

  const isNeutral = Math.abs(axisDelta) <= config.neutralThreshold
  if (isNeutral) {
    state.armed = true
    const nextBaseline =
      baseline + (axisValueRaw - baseline) * config.baselineAlpha
    state.baseline = nextBaseline
    emitDebug(null, nextBaseline)
    return null
  }

  if (!state.armed) {
    emitDebug(null)
    return null
  }

  if (axisDelta >= config.threshold) {
    state.armed = false
    state.lastTriggerAt = t
    emitDebug('forward')
    return 'forward'
  }

  if (axisDelta <= -config.threshold) {
    state.armed = false
    state.lastTriggerAt = t
    emitDebug('backward')
    return 'backward'
  }

  emitDebug(null)
  return null
}
