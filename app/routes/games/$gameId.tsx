import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Layout } from "~/components/Layout";
import { Timeline } from "~/components/Timeline";
import { getGame, deleteGame } from "~/models/game.server";

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = formData.get("id");

  if (typeof id !== "string" || id === "") {
    return null;
  }

  await deleteGame(id);

  return redirect("/games");
};

export default function GameRoute() {
  const { game } = useLoaderData<LoaderData>();

  return (
    <Layout title={`Game: ${game?.name}`}>
      <div className="grid grid-flow-col auto-cols-max gap-6">
        <div>
          <Timeline
            items={[
              game?.updatedAt &&
                game?.updatedAt !== game?.createdAt && {
                  label: "Updated at",
                  value: new Date(game.updatedAt).toLocaleString(),
                },
              game?.createdAt && {
                label: "Created at",
                value: new Date(game.createdAt).toLocaleString(),
              },
            ].filter((item): item is { label: string; value: string } =>
              Boolean(item)
            )}
          />
        </div>
        <Form method="delete">
          <input type="hidden" value={game?.id} name="id" />
          <Button size="small">Delete</Button>
        </Form>
      </div>
    </Layout>
  );
}
