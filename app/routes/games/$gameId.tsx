import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { HiArrowRight, HiCalendar, HiOutlineTrash } from "react-icons/hi";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { GameStatusBadge } from "~/components/GameStatusBadge";
import { Layout } from "~/components/Layout";
import { TeamsList } from "~/features/TeamsList";
import { getGame } from "~/models/game.server";
import { relativeTimeFromDates } from "~/utils/relativeTimeFormat";

export { action } from "~/actions/game";

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

export default function GameRoute() {
  const { game } = useLoaderData<LoaderData>();

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
        <div className="flex space-x-2 my-3 w-full md:w-auto">
          {game.status === "PREPARING" && game.teams.length > 0 && (
            <Form method="post" className="flex flex-1">
              <input type="hidden" value={game?.id} name="gameId" />
              <Button
                size="small"
                color="green"
                name="intent"
                value="start-game"
                className="h-10 space-x-2 flex-1 px-6"
              >
                <span>Start game</span>
                <HiArrowRight className="inline-block" />
              </Button>
            </Form>
          )}
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
        </div>
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
        <TeamsList teams={game.teams} gameId={game.id} />
      </div>
    </Layout>
  );
}
