import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { HiChevronRight, HiPlus } from "react-icons/hi";
import { Button } from "~/components/Button";
import { Layout } from "~/components/Layout";
import { Outlet } from "@remix-run/react";

import { getGames } from "~/models/game.server";
import { GameStatusBadge } from "~/components/GameStatusBadge";

type LoaderData = {
  games: Awaited<ReturnType<typeof getGames>>;
};

export const loader = async () => {
  return json<LoaderData>({
    games: await getGames(),
  });
};

export default function GamesIndexRoute() {
  const { games } = useLoaderData<LoaderData>();
  return (
    <Layout
      title="All games"
      cta={
        <div className="flex space-x-2 my-3 w-full md:w-auto">
          <Link to={"/games/new"} className="flex flex-1">
            <Button color="green" className="h-10 space-x-2 flex-1 px-6">
              <HiPlus className="inline-block" /> Add new game
            </Button>
          </Link>
        </div>
      }
    >
      <ul>
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            className="block odd:bg-gray-100/30 odd:border-y py-3 px-4 -mx-4 sm:mx-0 sm:py-1 hover:bg-gray-100 transition-all"
          >
            <li className="grid grid-cols-4 gap-2">
              <div className="font-bold truncate col-span-3 flex items-center">
                {game.name}
              </div>
              <div className="col-span-1 truncate flex justify-between">
                <GameStatusBadge
                  status={game.status}
                  className="hidden md:block"
                />
                <span className="text-2xl flex items-center text-gray-400">
                  <HiChevronRight />
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <Outlet />
    </Layout>
  );
}
