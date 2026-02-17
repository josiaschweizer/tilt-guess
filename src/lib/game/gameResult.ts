// src/lib/game/gameResult.ts
import type { Game } from '@/interface/Game'
import type { Player } from '@/interface/Player'
import type { Turn } from '@/interface/Turn'
import { computeLeaderboard, type LeaderboardRow } from './leaderboard'

export interface GameResult {
  id: string
  createdAtIso: string
  rounds: number
  players: Player[]
  leaderboard: LeaderboardRow[]
  winner: LeaderboardRow
}

export function buildGameResult(game: Game, turns: Turn[]): GameResult {
  const leaderboard = computeLeaderboard(game.players, turns)

  const winner =
    leaderboard[0] ??
    ({
      player: { id: 'n/a', name: 'n/a' },
      correct: 0,
      skipped: 0,
      rank: 1,
    } as LeaderboardRow)

  return {
    id: game.id,
    createdAtIso: game.createdAtIso,
    rounds: game.rounds,
    players: game.players,
    leaderboard,
    winner,
  }
}
