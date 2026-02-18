import { TiltAxis } from '@/types/tilt/TiltAxis'
import { TiltDirection } from '@/types/tilt/TiltDirection'

export interface TiltDebugInfo {
  t: number
  axis: TiltAxis
  axisValue: number
  baseline: number
  axisDelta: number
  armed: boolean
  lastTriggerAt: number
  direction: TiltDirection | null
}
