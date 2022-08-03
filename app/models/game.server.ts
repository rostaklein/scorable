import type { Game } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function getGames() {
  return db.game.findMany();
}

export async function getGame(gameId: string) {
  return db.game.findUnique({
    where: { id: gameId },
    include: { players: {} },
  });
}

export async function createGame(game: Pick<Game, "name">) {
  return db.game.create({ data: game });
}

export async function deleteGame(gameId: string) {
  return db.game.delete({ where: { id: gameId } });
}
