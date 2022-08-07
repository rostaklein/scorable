import type { Team } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function addTeam(gameId: string, team: Pick<Team, "name">) {
  return db.team.create({ data: {
     name: team.name,
     gameId,
  } });
}

export async function deleteTeam(teamId: string) {
  return db.team.delete({ where: { id: teamId } });
}

export async function updateTeam(teamId: string, team: Pick<Team, "name">) {
  return db.team.update({ where: { id: teamId }, data: team });
}
