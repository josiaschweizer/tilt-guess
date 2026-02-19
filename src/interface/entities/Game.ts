import { Player } from '@/interface/entities/Player'

export interface Game {
  id: string
  name: string
  createdAtIso: string

  rounds: number
  players: Player[]

  currentRoundIndex: number
  currentPlayerIndex: number
}
