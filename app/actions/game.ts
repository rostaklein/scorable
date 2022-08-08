import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { deleteGame, startGame } from "~/models/game.server";
import { addTeam, deleteTeam, updateTeam } from "~/models/team.server";

export type ActionData = {
  name: null | string;
};

const isValidString = (value: unknown): value is string => {
  return typeof value === "string" || value !== "";
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const intent = formData.get("intent");

  const teamId = formData.get("teamId");
  const gameId = formData.get("gameId");

  switch (intent) {
    case "delete-game": {
      if (isValidString(gameId)) {
        await deleteGame(gameId);
        return redirect("/");
      }
    }
    case "start-game": {
      if (isValidString(gameId)) {
        const game = await startGame(gameId);
        return redirect(`/games/${gameId}/rounds/${game.rounds[0].order}`)
      }
    }
    case "add-team":
    case "update-team": {
      const name = formData.get("name");
      if (!isValidString(name)) {
        return json<ActionData>({
          name: "Team name is required",
        });
      }
      switch (intent) {
        case "add-team":
          if (isValidString(gameId)) {
            return await addTeam(gameId, { name });
          }
        case "update-team":
          if (isValidString(teamId)) {
            return await updateTeam(teamId, { name });
          }
      }
    }
    case "remove-team": {
      if (isValidString(teamId)) {
        await deleteTeam(teamId);
      }
    }
    default:
      return null;
  }
};
