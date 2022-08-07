import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { HiOutlineTrash, HiPlus, HiTrash } from "react-icons/hi";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Layout } from "~/components/Layout";
import { getGame, deleteGame } from "~/models/game.server";
import { addPlayer, deletePlayer, updatePlayer } from "~/models/player.server";

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

  const playerId = formData.get("playerId");
  const gameId = formData.get("gameId");

  switch (intent) {
    case "delete-game": {
      if (isValidString(gameId)) {
        await deleteGame(gameId);
        return redirect("/");
      }
    }
    case "add-player":
    case "update-player": {
      const name = formData.get("name");
      if (!isValidString(name)) {
        return json<ActionData>({
          name: "Player name is required",
        });
      }
      switch (intent) {
        case "add-player":
          if (isValidString(gameId)) {
            return await addPlayer(gameId, { name });
          }
        case "update-player":
          if (isValidString(playerId)) {
            return await updatePlayer(playerId, { name });
          }
      }
    }
    case "remove-player": {
      if (isValidString(playerId)) {
        await deletePlayer(playerId);
      }
    }
    default:
      return null;
  }
};

export default function GameRoute() {
  const { game } = useLoaderData<LoaderData>();
  const [newPlayerName, setNewPlayerName] = useState("");

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div>
          {game?.players.length === 0 && (
            <div className="text-center text-gray-400 text-sm p-3">
              No teams yet
            </div>
          )}
          {game?.players.map((player) => (
            <Form
              className="flex items-end mb-2 w-full"
              method="post"
              key={player.id}
            >
              <Input
                name="name"
                placeholder="Cool guys"
                initialValue={player.name}
                className="h-10"
                wrapperClassname="flex-1"
              />
              <input type="hidden" value={player?.id} name="playerId" />
              <div className="ml-3 flex">
                <Button
                  className="mr-3 h-10"
                  name="intent"
                  value="update-player"
                  size="small"
                >
                  Update
                </Button>
                <Button
                  size="small"
                  name="intent"
                  value="remove-player"
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
            onSubmit={() => setNewPlayerName("")}
          >
            <Input
              name="name"
              placeholder="Cool guys"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="h-10"
              wrapperClassname="flex-1"
            />
            <input type="hidden" value={game?.id} name="gameId" />
            <div className="ml-3">
              <Button
                color="green"
                className="h-10 w-32 flex-nowrap"
                name="intent"
                value="add-player"
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
