import { db } from "~/utils/db.server";

export async function getRound(gameId: string, order: number) {
  return db.round.findFirst({
    where: { gameId, order },
    include: { Score: {} },
  });
}
