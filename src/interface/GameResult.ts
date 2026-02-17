import { Player } from '@/interface/Player'
import { LeaderboardEntry } from '@/interface/LeaderboardEntry'

export interface GameResult {
  id: string
  createdAtIso: string
  rounds: number
  players: Player[]
  leaderboard: LeaderboardEntry[]
  winner: LeaderboardEntry
}
