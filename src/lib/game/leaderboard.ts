import type { Player } from '@/interface/entities/Player'
import type { Turn } from '@/interface/entities/Turn'

export interface LeaderboardRow {
  player: Player
  correct: number
  skipped: number
  rank: number
}

export function computeLeaderboard(
  players: Player[],
  turns: Turn[],
): LeaderboardRow[] {
  const scoreByPlayerId = new Map<
    string,
    { correct: number; skipped: number }
  >()

  for (const p of players) {
    scoreByPlayerId.set(p.id, { correct: 0, skipped: 0 })
  }

  for (const turn of turns) {
    const entry = scoreByPlayerId.get(turn.playerId)
    if (!entry) {
      continue
    }

    entry.correct += turn.correct
    entry.skipped += turn.skipped
  }

  const rows: Omit<LeaderboardRow, 'rank'>[] = players.map((p) => {
    const s = scoreByPlayerId.get(p.id) ?? { correct: 0, skipped: 0 }
    return {
      player: p,
      correct: s.correct,
      skipped: s.skipped,
    }
  })

  rows.sort((a, b) => {
    if (b.correct !== a.correct) {
      return b.correct - a.correct
    } else if (a.skipped !== b.skipped) {
      return a.skipped - b.skipped
    }

    return a.player.name.localeCompare(b.player.name)
  })

  const ranked: LeaderboardRow[] = []
  let lastKey: string | null = null
  let lastRank = 0

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const key = `${r.correct}|${r.skipped}`

    if (key !== lastKey) {
      lastRank = i + 1
      lastKey = key
    }

    ranked.push({
      ...r,
      rank: lastRank,
    })
  }

  return ranked
}
