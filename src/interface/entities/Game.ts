import { Player } from '@/interface/entities/Player'
import { GameStatus } from '@/types/GameStatus'

export interface Game {
  id: string
  name: string
  createdAtIso: string

  status: GameStatus

  rounds: number
  players: Player[]

  currentRoundIndex: number
  currentPlayerIndex: number
}
