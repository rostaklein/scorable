import { db } from "~/utils/db.server";
export type { Game } from "@prisma/client";

export async function getGames() {
  return db.game.findMany();
}

export async function getGame(gameId: string) {
    return db.game.findUnique({ where: { id: gameId } });
  }