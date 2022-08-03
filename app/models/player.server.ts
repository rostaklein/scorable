import type { Player } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function addPlayer(gameId: string, player: Pick<Player, "name">) {
  return db.player.create({ data: {
     name: player.name,
     gameId,
  } });
}

export async function deletePlayer(playerId: string) {
  return db.player.delete({ where: { id: playerId } });
}

export async function updatePlayer(playerId: string, player: Pick<Player, "name">) {
  return db.player.update({ where: { id: playerId }, data: player });
}
