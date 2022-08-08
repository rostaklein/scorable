import type { Game } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function getGames() {
  return db.game.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getGame(gameId: string) {
  return db.game.findUnique({
    where: { id: gameId },
    include: { teams: {} },
  });
}

export async function createGame(game: Pick<Game, "name">) {
  return db.game.create({ data: { ...game, status: "PREPARING" } });
}

export async function updateGame(
  gameId: string,
  game: Partial<Pick<Game, "name" | "status">>
) {
  return db.game.update({ data: game, where: { id: gameId } });
}

export async function deleteGame(gameId: string) {
  return db.game.delete({ where: { id: gameId } });
}
