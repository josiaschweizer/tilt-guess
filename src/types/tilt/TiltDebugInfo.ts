export interface TiltDebugInfo {
  t: number
  axis: 'pitch' | 'roll'
  orientation: 0 | 90 | 180 | -90 | null
  raw: { alpha: number; beta: number; gamma: number } | null
  axisValue: number
  baseline: number
  axisDelta: number
  armed: boolean
  lastTriggerAt: number
  direction: 'forward' | 'backward' | null
}
