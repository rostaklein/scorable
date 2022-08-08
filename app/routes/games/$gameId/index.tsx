import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/Button";
import type { LoaderData } from "../$gameId";

export { loader } from "../$gameId";

export default function GamesIndex() {
  const { game } = useLoaderData<LoaderData>();

  if (!game || game.status !== "IN_PROGRESS" || game.teams.length < 0) {
    return null;
  }

  return (
    <div className="col-start-1 md:col-start-2 col-span-2">
      <h2 className="font-bold text-lg mb-2">Rounds</h2>
      {game.rounds.map((round) => (
        <Link key={round.id} to={`/games/${game.id}/rounds/${round.order}`}>
          <Button>{round.order}</Button>
        </Link>
      ))}
    </div>
  );
}
