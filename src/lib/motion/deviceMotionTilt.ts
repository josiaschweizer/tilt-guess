import type { TiltConfig } from '@/types/tilt/TiltConfig'
import type { TiltDirection } from '@/types/tilt/TiltDirection'
import type { TiltState } from '@/types/tilt/TiltState'
import type { TiltDebugInfo } from '@/types/tilt/TiltDebugInfo'

export const DEFAULT_TILT_CONFIG: TiltConfig = {
  axis: 'pitch',

  // Startwerte (Radiant): ~14°
  thresholdRad: 0.25,
  // ~6°
  neutralThresholdRad: 0.1,

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

export function resetTiltState() {
  state.baseline = null
  state.armed = true
  state.lastTriggerAt = 0
}

type Rotation = { alpha: number; beta: number; gamma: number } // values from DeviceMotion.rotation

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

function looksLikeDegrees(v: number) {
  // Euler-Winkel in rad bewegen sich i.d.R. in [-pi, pi] oder ähnlichen Bereichen.
  // Wenn wir deutlich > ~3.5 sehen, ist es sehr wahrscheinlich Grad.
  return Math.abs(v) > 3.5
}

function normalizeRotationUnitsToRad(r: Rotation): Rotation {
  if (
    looksLikeDegrees(r.alpha) ||
    looksLikeDegrees(r.beta) ||
    looksLikeDegrees(r.gamma)
  ) {
    return {
      alpha: degToRad(r.alpha),
      beta: degToRad(r.beta),
      gamma: degToRad(r.gamma),
    }
  }
  return r
}

/**
 * Mapping:
 * - DeviceMotion beschreibt Achsen relativ zur Portrait-Ausrichtung (X links→rechts, Y unten→oben, Z durch Screen).  [oai_citation:2‡Expo Documentation](https://docs.expo.dev/versions/latest/sdk/devicemotion/)
 * - rotation: alpha(Z), beta(X), gamma(Y).  [oai_citation:3‡Expo Documentation](https://docs.expo.dev/versions/latest/sdk/devicemotion/)
 * - Für “forward/backward kippen” ist in Portrait typischerweise pitch ~ beta (X).
 * - In Landscape verschiebt sich das, darum mappen wir abhängig von orientation:
 *   - RightLandscape (90): pitch ~ -gamma
 *   - LeftLandscape (-90): pitch ~ gamma
 */
function getAxisValueRad(
  rotationRad: Rotation,
  axis: 'pitch' | 'roll',
  orientation: 0 | 90 | 180 | -90 | null,
) {
  const { beta, gamma } = rotationRad

  if (axis === 'roll') {
    // Roll ist “seitlich kippen”.
    // In Portrait entspricht das typischerweise gamma.
    // In Landscape entspricht das eher beta (mit Vorzeichen je nach Seite).
    if (orientation === 90) return beta
    if (orientation === -90) return -beta
    return gamma
  }

  // axis === 'pitch' (vor/zurück)
  if (orientation === 90) return -gamma
  if (orientation === -90) return gamma
  return beta
}

export function detectTiltFromDeviceMotionRotation(params: {
  rotation: Rotation | null
  orientation: 0 | 90 | 180 | -90 | null
  config?: Partial<TiltConfig>
  onDebug?: (info: TiltDebugInfo) => void
}): TiltDirection | null {
  const t = Date.now()
  const config: TiltConfig = {
    ...DEFAULT_TILT_CONFIG,
    ...(params.config ?? {}),
  }

  if (!params.rotation) {
    params.onDebug?.({
      t,
      axis: config.axis,
      orientation: params.orientation,
      raw: null,
      axisValue: 0,
      baseline: state.baseline ?? 0,
      axisDelta: 0,
      armed: state.armed,
      lastTriggerAt: state.lastTriggerAt,
      direction: null,
    })
    return null
  }

  const rotationRad = normalizeRotationUnitsToRad(params.rotation)
  const axisValueRaw = getAxisValueRad(
    rotationRad,
    config.axis,
    params.orientation,
  )
  const axisValue = config.invert ? -axisValueRaw : axisValueRaw

  if (state.baseline === null) {
    state.baseline = axisValue
  }

  const baseline = state.baseline ?? axisValue
  const axisDelta = axisValue - baseline

  const emitDebug = (
    direction: TiltDirection | null,
    baselineForDebug = baseline,
  ) => {
    params.onDebug?.({
      t,
      axis: config.axis,
      orientation: params.orientation,
      raw: rotationRad,
      axisValue,
      baseline: baselineForDebug,
      axisDelta,
      armed: state.armed,
      lastTriggerAt: state.lastTriggerAt,
      direction,
    })
  }

  if (config.log) {
    console.log('[TILT][DeviceMotion]', {
      t,
      axis: config.axis,
      orientation: params.orientation,
      axisValue,
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

  const isNeutral = Math.abs(axisDelta) <= config.neutralThresholdRad
  if (isNeutral) {
    state.armed = true

    const nextBaseline =
      baseline + (axisValue - baseline) * config.baselineAlpha
    state.baseline = nextBaseline

    emitDebug(null, nextBaseline)
    return null
  }

  if (!state.armed) {
    emitDebug(null)
    return null
  }

  if (axisDelta >= config.thresholdRad) {
    state.armed = false
    state.lastTriggerAt = t
    emitDebug('forward')
    return 'forward'
  }

  if (axisDelta <= -config.thresholdRad) {
    state.armed = false
    state.lastTriggerAt = t
    emitDebug('backward')
    return 'backward'
  }

  emitDebug(null)
  return null
}
