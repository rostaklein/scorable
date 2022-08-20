import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { twMerge } from "tailwind-merge";
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

  const maxScore = Math.max(...score.map(({ totalPoints }) => totalPoints));

  return (
    <div className="container mx-auto py-4 px-4 pb-8 min-h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-sm text-gray-400">Results for game {game?.name}</h2>
        <h2 className="font-bold">
          after{" "}
          <span>
            {roundOrder}
            {nth(roundOrder)} round
          </span>
        </h2>
      </div>
      <ol className="flex flex-1 justify-between space-x-6 mt-6">
        {score.map((s, i) => (
          <li
            key={`${s.teamId}${s.totalPoints}`}
            className="grid grid-rows-2 mb-6 flex-1"
            style={{ gridTemplateRows: "1fr 60px" }}
          >
            <div className="flex justify-end flex-col items-center">
              <div
                className={twMerge(
                  "bg-slate-200 flex justify-center items-center px-6 rounded-lg"
                )}
                style={{
                  height: `${(s.totalPoints / maxScore) * 100}%`,
                }}
              >
                <div className="font-bold text-xl">{s.totalPoints}</div>
              </div>
            </div>
            <h3 className="font-bold text-center text-xl mt-6 flex items-center justify-center flex-col">
              <span className="font-normal text-sm text-gray-500">team</span>
              <span>{s.teamName}</span>
            </h3>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RoundResults;
