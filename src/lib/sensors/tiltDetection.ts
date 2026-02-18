export type TiltDirection = 'forward' | 'backward' | null

export interface TiltConfig {
  axis: 'x' | 'y' | 'z'
  threshold: number
  cooldownMs: number
  log?: boolean
}

export const DEFAULT_TILT_CONFIG: TiltConfig = {
  axis: 'x',
  threshold: 0.3,
  cooldownMs: 900,
  log: false,
}

type AccelInput = {
  accelX?: number
  accelY?: number
  accelZ?: number
}

type TiltState = {
  lastDirection: Exclude<TiltDirection, null> | null
  lastEmitAt: number
}

const state: TiltState = {
  lastDirection: null,
  lastEmitAt: 0,
}

function pickAxisValue(accel: AccelInput, axis: TiltConfig['axis']): number {
  if (axis === 'x') return accel.accelX ?? 0
  if (axis === 'y') return accel.accelY ?? 0
  return accel.accelZ ?? 0
}

function logTilt(
  label: string,
  payload: Record<string, unknown>,
  enabled: boolean,
) {
  if (!enabled) return
  // eslint-disable-next-line no-console
  console.log(`[TILT] ${label}`, JSON.stringify(payload))
}

export function resetTiltState(): void {
  state.lastDirection = null
  state.lastEmitAt = 0
}

export function detectTilt(
  _prev: unknown,
  accel: AccelInput,
  config: TiltConfig = DEFAULT_TILT_CONFIG,
): TiltDirection {
  const now = Date.now()
  const axisValue = pickAxisValue(accel, config.axis)

  logTilt('raw', { t: now, axis: config.axis, axisValue }, Boolean(config.log))

  const inCooldown = now - state.lastEmitAt < config.cooldownMs
  if (inCooldown) {
    logTilt(
      'cooldown',
      { t: now, msRemaining: config.cooldownMs - (now - state.lastEmitAt) },
      Boolean(config.log),
    )
    return null
  }

  let direction: TiltDirection = null
  if (axisValue >= config.threshold) direction = 'forward'
  if (axisValue <= -config.threshold) direction = 'backward'

  logTilt(
    'direction-eval',
    {
      t: now,
      axis: config.axis,
      axisValue,
      threshold: config.threshold,
      direction,
      lastDirection: state.lastDirection,
    },
    Boolean(config.log),
  )

  if (!direction) {
    state.lastDirection = null
    return null
  }

  if (state.lastDirection === direction) {
    return null
  }

  state.lastDirection = direction
  state.lastEmitAt = now
  return direction
}
