import { Form, Link, useLoaderData } from "@remix-run/react";
import { HiOutlineTrash } from "react-icons/hi";
import { Button } from "~/components/Button";
import type { LoaderData } from "../$gameId";

export { loader } from "../$gameId";
export { action } from "../../../actions/game";

export default function GamesIndex() {
  const { game } = useLoaderData<LoaderData>();

  if (!game) {
    return null;
  }

  const shouldDisplayRounds =
    game.status === "IN_PROGRESS" && game.teams.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div>
        {shouldDisplayRounds && (
          <>
            <h2 className="font-bold text-lg mb-2">Rounds</h2>
            {game.rounds.map((round) => (
              <Link
                key={round.id}
                to={`/games/${game.id}/rounds/${round.order}`}
              >
                <Button>{round.order}</Button>
              </Link>
            ))}
          </>
        )}
      </div>
      <div className="flex justify-center sm:justify-start py-3">
        <Form
          method="delete"
          onSubmit={(e) => {
            if (!confirm("Are you sure want to delete this game?")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" value={game?.id} name="gameId" />
          <Button
            size="small"
            name="intent"
            value="delete-game"
            className="space-x-2 h-auto"
          >
            <HiOutlineTrash className="text-[16px] inline-block" />
            <span>Delete game</span>
          </Button>
        </Form>
      </div>
    </div>
  );
}
