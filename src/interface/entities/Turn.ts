export interface Turn {
  id: string
  gameId: string
  playerId: string

  startedAtIso: string
  endedAtIso?: string

  correct: number
  skipped: number
}
