import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React, { Fragment, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getScoreAfterNthRound } from "~/models/score.server";
import { RiTeamFill } from "react-icons/ri";
import { Button } from "~/components/Button";
import { Transition } from "@headlessui/react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiChevronLeft,
  HiMinus,
  HiPlus,
} from "react-icons/hi";

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

  const [shownTeams, setShownTeams] = useState<number[]>([]);

  const lastShownTeam = shownTeams[shownTeams.length - 1] ?? null;
  const nextTeamToShow =
    lastShownTeam === null ? score.length - 1 : lastShownTeam - 1;

  const canShowMore = nextTeamToShow >= 0;
  const canShowLess = shownTeams.length > 0;

  const onShowNext = () => {
    if (!canShowMore) {
      return;
    }

    setShownTeams((prev) => [...prev, nextTeamToShow]);
  };

  const onShowLess = () => {
    if (!canShowLess) {
      return;
    }

    const teamsWithoutLatest = [...shownTeams];
    teamsWithoutLatest.pop();

    setShownTeams(teamsWithoutLatest);
  };

  return (
    <div className="container mx-auto py-4 px-4 pb-8 min-h-screen flex flex-col justify-between">
      <div className="flex space-x-6 justify-between items-center">
        <Link to={`/games/${game?.urlIdentifier}/rounds/${roundOrder}`}>
          <Button>
            <HiChevronLeft className="inline-block" /> Back
          </Button>
        </Link>
        <div className="text-center">
          <h2 className="text-sm text-gray-400">{game?.name}</h2>
          <h2 className="font-bold text-2xl">
            after{" "}
            <span>
              {roundOrder}
              {nth(roundOrder)} round
            </span>
          </h2>
        </div>
        <div className="space-x-2">
          <Button onClick={() => onShowNext()} disabled={!canShowMore}>
            <HiPlus className="inline-block mr-1" />
            <RiTeamFill className="inline-block mr-2 text-lg" />
            <span>Show Next</span>
          </Button>
          <Button onClick={() => onShowLess()} disabled={!canShowLess}>
            <HiMinus className="inline-block" />
          </Button>
        </div>
      </div>
      <ol className="flex flex-1 justify-between space-x-6 mt-6">
        {score.map((s, i) => (
          <li
            key={`${s.teamId}${s.totalPoints}`}
            className="grid grid-rows-2 mb-6 flex-1"
            style={{ gridTemplateRows: "1fr 60px" }}
          >
            <div className="flex justify-end flex-col items-center">
              <Transition
                as={Fragment}
                show={shownTeams.includes(i)}
                enter="transition-all duration-1000 origin-bottom"
                enterFrom="scale-y-0"
                enterTo="scale-y-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className={twMerge(
                    "bg-slate-200 flex justify-center items-center px-6 rounded-sm"
                  )}
                  style={{
                    height: `${(s.totalPoints / maxScore) * 100}%`,
                  }}
                >
                  <div className="font-bold text-xl">{s.totalPoints}</div>
                </div>
              </Transition>
            </div>
            <Transition
              show={shownTeams.includes(i)}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <h3 className="font-bold text-center text-2xl mt-6 flex items-center justify-center flex-col">
                <span className="font-normal text-sm text-gray-500 flex items-center">
                  <RiTeamFill className="mr-1" />
                  team
                </span>
                <span>{s.teamName}</span>
              </h3>
            </Transition>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RoundResults;
