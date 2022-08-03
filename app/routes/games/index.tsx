import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/Layout";

import { getGames } from "~/models/game.server";

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
    <Layout title="All games">
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/games/${game.id}`} className="text-blue-600 underline">
              {game.name}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
