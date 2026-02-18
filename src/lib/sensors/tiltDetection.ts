/**
 * Tilt Detection Utility
 * Kombiniert Accelerometer und Gyroscope Daten zur Erkennung von Handy-Kippbewegungen
 */

export type TiltDirection = 'forward' | 'backward' | null

export interface TiltConfig {
  accelerometerThreshold: number // z.B. 0.3 (0.3g)
  gyroThreshold: number // z.B. 1.5 rad/s
  debounceMs: number // z.B. 500ms
  hysteresis: number // z.B. 0.1 zur Vermeidung von Bounce-Effekten
}

export const DEFAULT_TILT_CONFIG: TiltConfig = {
  accelerometerThreshold: 0.3,
  gyroThreshold: 1.5,
  debounceMs: 500,
  hysteresis: 0.1,
}

export interface SensorData {
  accelX: number // Beschleunigung auf X-Achse (vor/zurück)
  accelY?: number
  accelZ?: number
  gyroX?: number // Rotationsgeschwindigkeit um X-Achse
  gyroY?: number
  gyroZ?: number
}

let lastTiltTime = 0
let lastTiltDirection: TiltDirection = null

/**
 * Erkennt Tilt-Gesten basierend auf Accelerometer und Gyroscope Daten
 *
 * @param accelData - Accelerometer Daten
 * @param gyroData - Gyroscope Daten
 * @param config - Konfiguration für Erkennungsschwellwerte
 * @returns 'forward' (nach vorne kippen) | 'backward' (nach hinten kippen) | null
 */
export function detectTilt(
  accelData: SensorData,
  gyroData: SensorData,
  config: TiltConfig = DEFAULT_TILT_CONFIG,
): TiltDirection {
  const now = Date.now()

  // Debounce: Ignoriere Gesten die zu schnell hintereinander kommen
  if (now - lastTiltTime < config.debounceMs) {
    return null
  }

  // Kombiniere Accelerometer-Signal (primary) und Gyroscope (validation)
  const accelSignal = accelData.accelX ?? 0

  // Erkenne Richtung basierend auf beschleunigung
  // Nach HINTEN kippen (back tilt) = positive X-Beschleunigung (device tilts away)
  // Nach VORNE kippen (forward tilt) = negative X-Beschleunigung (device tilts towards)

  let detectedDirection: TiltDirection = null

  // Check für Backward Tilt (nach hinten)
  if (accelSignal > config.accelerometerThreshold) {
    // Validierung mit Gyroscope: positive Rotation um Y-Achse
    if (!gyroData.gyroY || gyroData.gyroY > -config.gyroThreshold) {
      detectedDirection = 'backward'
    }
  }
  // Check für Forward Tilt (nach vorne)
  else if (accelSignal < -config.accelerometerThreshold) {
    // Validierung mit Gyroscope: negative Rotation um Y-Achse
    if (!gyroData.gyroY || gyroData.gyroY < config.gyroThreshold) {
      detectedDirection = 'forward'
    }
  }

  // Hysterese: Ignoriere sehr kleine Richtungswechsel
  if (
    detectedDirection &&
    detectedDirection !== lastTiltDirection &&
    Math.abs(accelSignal) > config.accelerometerThreshold + config.hysteresis
  ) {
    lastTiltDirection = detectedDirection
    lastTiltTime = now
    return detectedDirection
  }

  return null
}

/**
 * Setzt den Tilt-Erkennungs-Zustand zurück (z.B. bei neuer Runde)
 */
export function resetTiltState(): void {
  lastTiltTime = 0
  lastTiltDirection = null
}
