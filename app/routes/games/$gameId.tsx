import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { HiCalendar, HiOutlineTrash, HiPlus } from "react-icons/hi";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { GameStatusBadge } from "~/components/GameStatusBadge";
import { Input } from "~/components/Input";
import { Layout } from "~/components/Layout";
import { getGame, deleteGame } from "~/models/game.server";
import { addTeam, deleteTeam, updateTeam } from "~/models/team.server";
import { relativeTimeFromDates } from "~/utils/relativeTimeFormat";

type LoaderData = {
  game: Awaited<ReturnType<typeof getGame>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.gameId) {
    return;
  }
  const game = await getGame(params.gameId);
  return json<LoaderData>({ game });
};

type ActionData = {
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

export default function GameRoute() {
  const { game } = useLoaderData<LoaderData>();
  const [newTeamName, setNewTeamName] = useState("");

  if (!game) {
    return null;
  }

  return (
    <Layout
      title={`Game: ${game?.name}`}
      breadcrumbs={[
        {
          label: `Game: ${game?.name}`,
          to: `/games/${game?.id}`,
        },
      ]}
      cta={
        <Form
          method="delete"
          onSubmit={(e) => {
            if (!confirm("Are you sure?")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" value={game?.id} name="gameId" />
          <Button
            size="small"
            name="intent"
            value="delete-game"
            className="h-10"
          >
            <HiOutlineTrash className="text-[16px]" />
          </Button>
        </Form>
      }
    >
      <div className="mb-4 flex space-x-1">
        <Badge
          title={`Created on: ${new Date(
            game?.createdAt ?? 0
          ).toLocaleString()}`}
        >
          <HiCalendar />
          <span>{relativeTimeFromDates(new Date(game?.createdAt ?? 0))}</span>
        </Badge>
        <GameStatusBadge status={game?.status} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div>
          {game?.teams.length === 0 && (
            <div className="text-center text-gray-400 text-sm p-3">
              No teams yet
            </div>
          )}
          {game?.teams.map((team) => (
            <Form
              className="flex items-end mb-2 w-full"
              method="post"
              key={team.id}
            >
              <Input
                name="name"
                placeholder="Cool guys"
                initialValue={team.name}
                className="h-10"
                wrapperClassname="flex-1"
              />
              <input type="hidden" value={team?.id} name="teamId" />
              <div className="ml-3 flex">
                <Button
                  className="mr-3 h-10"
                  name="intent"
                  value="update-team"
                  size="small"
                >
                  Update
                </Button>
                <Button
                  size="small"
                  name="intent"
                  value="remove-team"
                  className="h-10"
                  onClick={(e) => {
                    if (!confirm("Are you sure?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <HiOutlineTrash className="text-[16px]" />
                </Button>
              </div>
            </Form>
          ))}
          <h3 className="font-bold mb-3 mt-6">Add new team</h3>
          <Form
            className="flex items-end mb-2 w-full"
            method="post"
            onSubmit={() => setNewTeamName("")}
          >
            <Input
              name="name"
              placeholder="Cool guys"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="h-10"
              wrapperClassname="flex-1"
            />
            <input type="hidden" value={game?.id} name="gameId" />
            <div className="ml-3">
              <Button
                color="green"
                className="h-10 w-32 flex-nowrap"
                name="intent"
                value="add-team"
              >
                <HiPlus className="inline-block" /> Add
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
