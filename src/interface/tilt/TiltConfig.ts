import { TiltAxis } from '@/types/tilt/TiltAxis'

export interface TiltConfig {
  axis: TiltAxis
  threshold: number
  neutralThreshold: number
  cooldownMs: number
  baselineAlpha: number
  invert: boolean
  log: boolean
}
