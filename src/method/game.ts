import { Game } from '@/interface/entities/Game'
import { Turn } from '@/interface/entities/Turn'

export default async function loadGameById(
  gameId: string,
): Promise<{ game: Game; turns: Turn[] } | null> {
  // todo: replace with real storage lookup

  if (gameId === 'demo-1') {
    const game: Game = {
      id: 'demo-1',
      createdAtIso: new Date().toISOString(),
      status: 'FINISHED',
      rounds: 3,
      players: [
        { id: 'p1', name: 'josia' },
        { id: 'p2', name: 'marko' },
        { id: 'p3', name: 'simi' },
        { id: 'p4', name: 'noe' },
        { id: 'p5', name: 'younes affe' },
        { id: 'p6', name: 'samuel' },
        { id: 'p7', name: 'alea' },
        { id: 'p8', name: 'laurin' },
        { id: 'p9', name: 'janna' },
      ],
      currentRoundIndex: 2,
      currentPlayerIndex: 0,
    }

    const now = Date.now()
    const min = (n: number) => 1000 * 60 * n

    const turns: Turn[] = [
      {
        id: 't1',
        gameId: 'demo-1',
        roundId: 'r1',
        playerId: 'p1',
        startedAtIso: new Date(now - min(18)).toISOString(),
        endedAtIso: new Date(now - min(17)).toISOString(),
        correct: 4,
        skipped: 1,
      },
      {
        id: 't2',
        gameId: 'demo-1',
        roundId: 'r1',
        playerId: 'p2',
        startedAtIso: new Date(now - min(17)).toISOString(),
        endedAtIso: new Date(now - min(16)).toISOString(),
        correct: 3,
        skipped: 1,
      },
      {
        id: 't3',
        gameId: 'demo-1',
        roundId: 'r1',
        playerId: 'p3',
        startedAtIso: new Date(now - min(16)).toISOString(),
        endedAtIso: new Date(now - min(15)).toISOString(),
        correct: 2,
        skipped: 2,
      },

      {
        id: 't4',
        gameId: 'demo-1',
        roundId: 'r2',
        playerId: 'p4',
        startedAtIso: new Date(now - min(15)).toISOString(),
        endedAtIso: new Date(now - min(14)).toISOString(),
        correct: 5,
        skipped: 0,
      },
      {
        id: 't5',
        gameId: 'demo-1',
        roundId: 'r2',
        playerId: 'p5',
        startedAtIso: new Date(now - min(14)).toISOString(),
        endedAtIso: new Date(now - min(13)).toISOString(),
        correct: 1,
        skipped: 1,
      },
      {
        id: 't6',
        gameId: 'demo-1',
        roundId: 'r2',
        playerId: 'p6',
        startedAtIso: new Date(now - min(13)).toISOString(),
        endedAtIso: new Date(now - min(12)).toISOString(),
        correct: 3,
        skipped: 0,
      },

      {
        id: 't7',
        gameId: 'demo-1',
        roundId: 'r3',
        playerId: 'p7',
        startedAtIso: new Date(now - min(12)).toISOString(),
        endedAtIso: new Date(now - min(11)).toISOString(),
        correct: 4,
        skipped: 0,
      },
      {
        id: 't8',
        gameId: 'demo-1',
        roundId: 'r3',
        playerId: 'p8',
        startedAtIso: new Date(now - min(11)).toISOString(),
        endedAtIso: new Date(now - min(10)).toISOString(),
        correct: 2,
        skipped: 1,
      },
      {
        id: 't9',
        gameId: 'demo-1',
        roundId: 'r3',
        playerId: 'p9',
        startedAtIso: new Date(now - min(10)).toISOString(),
        endedAtIso: new Date(now - min(9)).toISOString(),
        correct: 6,
        skipped: 1,
      },
    ]

    return { game, turns }
  }

  return null
}
