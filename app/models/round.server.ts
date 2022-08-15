import { db } from "~/utils/db.server";

export async function getRound(gameId: string, order: number) {
  return db.round.findFirst({
    where: { gameId, order },
    include: {
      Score: {},
      Game: { include: { teams: { include: { Score: {} } } } },
    },
  });
}

export async function updateScore(
  teamId: string,
  roundId: string,
  points: number,
  scoreId?: string,
) {
  return db.round.update({
    where: {
      id: roundId,
    },
    data: {
      Score: {
        upsert: {
          where: {
            id: scoreId,
          },
          create: {
            points,
            teamId,
          },
          update: {
            points,
            teamId,
          },
        },
      },
    },
  });
}
