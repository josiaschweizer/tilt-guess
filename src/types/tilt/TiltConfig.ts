export interface TiltConfig {
  axis: 'pitch' | 'roll'
  thresholdRad: number
  neutralThresholdRad: number
  cooldownMs: number
  baselineAlpha: number
  invert: boolean
  log: boolean
}
