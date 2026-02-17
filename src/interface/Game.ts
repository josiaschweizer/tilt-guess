import { Player } from '@/interface/Player'
import { GameStatus } from '@/types/GameStatus'

export interface Game {
  id: string
  createdAtIso: string

  status: GameStatus

  rounds: number
  players: Player[]

  currentRoundIndex: number // 0-based
  currentPlayerIndex: number // 0-based (wer ist gerade dran)
}
