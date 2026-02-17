import { Player } from '@/interface/Player'

export interface LeaderboardEntry {
  player: Player
  correct: number
  skipped: number
  rank: number
}
