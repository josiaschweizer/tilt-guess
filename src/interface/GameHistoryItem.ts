export interface GameHistoryItem {
  id: string
  createdAtIso: string
  rounds: number
  playerNames: string[]

  winner: {
    playerName: string
    correct: number
    skipped: number
  }
}
