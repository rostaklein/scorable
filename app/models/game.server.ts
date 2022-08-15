import type { Game } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function getGames() {
  return db.game.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getGame(gameId: string) {
  return db.game.findFirst({
    where: { OR: [{ urlIdentifier: gameId }, { id: gameId }] },
    include: { teams: {}, rounds: {} },
  });
}

export async function createGame(game: Pick<Game, "name" | "urlIdentifier">) {
  return db.game.create({ data: { ...game, status: "PREPARING" } });
}

export async function startGame(gameId: string) {
  return db.game.update({
    data: {
      status: "IN_PROGRESS",
      rounds: { create: { order: 1, startedAt: new Date() } },
    },
    where: { id: gameId },
    include: {
      rounds: {},
    },
  });
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
