export interface Turn {
  id: string
  gameId: string
  roundId: string
  playerId: string

  startedAtIso: string
  endedAtIso?: string

  correct: number
  skipped: number
}
