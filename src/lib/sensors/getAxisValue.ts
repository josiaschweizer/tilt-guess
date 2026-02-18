import { SensorInput } from '@/types/tilt/SensorInput'
import { TiltAxis } from '@/types/tilt/TiltAxis'

export default function getAxisValue(
  input: SensorInput,
  axis: TiltAxis,
): number {
  if (axis === 'x') {
    return input.accelX ?? 0
  } else if (axis === 'y') {
    return input.accelY ?? 0
  }

  return input.accelZ ?? 0
}
