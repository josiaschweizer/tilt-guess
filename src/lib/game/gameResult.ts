// src/lib/game/gameResult.ts
import type { Game } from '@/interface/entities/Game'
import type { Player } from '@/interface/entities/Player'
import type { Turn } from '@/interface/entities/Turn'
import { computeLeaderboard, type LeaderboardRow } from './leaderboard'

export interface GameResult {
  id: string
  name: string
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
    name: game.name,
    createdAtIso: game.createdAtIso,
    rounds: game.rounds,
    players: game.players,
    leaderboard,
    winner,
  }
}
