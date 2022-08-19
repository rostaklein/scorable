import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { getScoreAfterNthRound } from "~/models/score.server";

type LoaderData = Awaited<ReturnType<typeof getScoreAfterNthRound>>;

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.gameId || !params.roundId) {
    return;
  }
  const data = await getScoreAfterNthRound(
    params.gameId,
    Number(params.roundId)
  );
  return json<LoaderData>(data);
};

function nth(n: number) {
  return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
}

export const RoundResults: React.FC = () => {
  const { game, roundOrder, score } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto my-4 px-4 pb-8">
      <h2 className="text-sm text-gray-400">Results for game {game?.name}</h2>
      <h2 className="font-bold">
        after{" "}
        <span>
          {roundOrder}
          {nth(roundOrder)} round
        </span>
      </h2>
      <ol>
        {score.map((s, i) => (
          <li key={`${s.teamId}${s.totalPoints}`} className="grid grid-cols-2">
            <div>
              {i + 1}. {s.teamName}
            </div>
            <div>{s.totalPoints}</div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RoundResults;
