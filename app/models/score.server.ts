import { db } from "~/utils/db.server";
import { getGame } from "./game.server";
import { getRound } from "./round.server";

type ScoreAfterRound = {
  teamId: string;
  teamName: string;
  totalPoints: number;
};

export async function getScoreAfterNthRound(
  gameId: string,
  roundOrder: number
) {
  const scores = await db.score.findMany({
    where: {
      round: {
        order: { lte: roundOrder },
        Game: {
          OR: [{ urlIdentifier: gameId }, { id: gameId }],
        },
      },
    },
  });

  const scoreMap = scores.reduce((acc, curr) => {
    acc.set(curr.teamId, acc.get(curr.teamId) ?? 0 + curr.points);
    return acc;
  }, new Map<string, number>());

  const teams = await db.team.findMany({
    where: { id: { in: [...scoreMap.keys()] } },
    select: { id: true, name: true },
  });

  const score: ScoreAfterRound[] = teams
    .map((team) => ({
      teamId: team.id,
      teamName: team.name,
      totalPoints: scoreMap.get(team.id) ?? 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const game = await db.game.findFirst({
    where: {
      OR: [{ urlIdentifier: gameId }, { id: gameId }],
    },
  });

  return { score, game, roundOrder };
}
