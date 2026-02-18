import { TiltAxis } from '@/types/tilt/TiltAxis'

export interface TiltConfig {
  axis: TiltAxis
  threshold: number
  resetThreshold?: number
  cooldownMs: number
  invert: boolean
}
