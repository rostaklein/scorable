import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useMatches } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { getScoreAfterNthRound } from "~/models/score.server";
import { RiTeamFill } from "react-icons/ri";
import { Button } from "~/components/Button";
import { Transition } from "@headlessui/react";
import { HiChevronLeft, HiChevronRight, HiMinus, HiPlus } from "react-icons/hi";
import { GrDocumentMissing } from "react-icons/gr";
import { getBgColorByPlace, ScoreBar } from "~/components/Bar";
import { twMerge } from "tailwind-merge";

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
  const { game, roundOrder, score, prevRound, nextRound } =
    useLoaderData<LoaderData>();

  const matches = useMatches();

  const maxScore = Math.max(...score.map(({ totalPoints }) => totalPoints));

  const [shownTeams, setShownTeams] = useState<number[]>([]);
  // const [shownTeams, setShownTeams] = useState<number[]>(
  //   score.map((_, i) => i)
  // );

  const lastShownTeam = shownTeams[shownTeams.length - 1] ?? null;
  const nextTeamToShow =
    lastShownTeam === null ? score.length - 1 : lastShownTeam - 1;

  const canShowMore = nextTeamToShow >= 0;
  const canShowLess = shownTeams.length > 0;

  useEffect(() => {
    // clear on reroute
    setShownTeams([]);
  }, [matches]);

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

  const hasScoreToShow = score.some((s) => s.scoreFromLatestRound);
  const isLastRound = !nextRound;

  return (
    <div className="container mx-auto py-4 px-4 pb-8 min-h-screen flex flex-col">
      <div
        className="grid items-center"
        style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <Link to={`/games/${game?.urlIdentifier}/rounds/${roundOrder}`}>
          <Button size="small" className="h-9">
            <HiChevronLeft className="inline-block" /> Back
          </Button>
        </Link>
        <div className="flex justify-center items-center group space-x-4">
          <Link
            to={`/games/${game?.urlIdentifier}/rounds/${prevRound?.order}/results`}
            className={twMerge(!prevRound && "pointer-events-none")}
          >
            <Button
              size="small"
              className={twMerge(
                "h-9 opacity-0",
                prevRound && "group-hover:opacity-100 transition-opacity"
              )}
            >
              <HiChevronLeft />
            </Button>
          </Link>
          <div>
            <h2 className="text-sm text-gray-400">{game?.name}</h2>
            <h2 className="font-bold text-2xl">
              after{" "}
              <span>
                {roundOrder}
                {nth(roundOrder)} round
              </span>
            </h2>
          </div>
          <Link
            to={`/games/${game?.urlIdentifier}/rounds/${nextRound?.order}/results`}
            className={twMerge(!nextRound && "pointer-events-none")}
          >
            <Button
              size="small"
              className={twMerge(
                "h-9 opacity-0",
                nextRound && "group-hover:opacity-100 transition-opacity"
              )}
            >
              <HiChevronRight />
            </Button>
          </Link>
        </div>
        <div className="space-x-2 flex justify-end">
          <Button
            onClick={() => onShowNext()}
            disabled={!canShowMore}
            size="small"
            className="h-9"
          >
            <HiPlus className="inline-block mr-1" />
            <RiTeamFill className="inline-block mr-2 text-lg" />
            <span>Show Next</span>
          </Button>
          <Button
            onClick={() => onShowLess()}
            disabled={!canShowLess}
            size="small"
            className="h-9"
          >
            <HiMinus className="inline-block" />
          </Button>
        </div>
      </div>
      {hasScoreToShow ? (
        <ol className="flex flex-1 justify-between space-x-6 mt-6">
          {score.map((s, i) => (
            <li
              key={`${s.teamId}${s.totalPoints}`}
              className="grid grid-rows-2 mb-6 flex-1"
              style={{ gridTemplateRows: "1fr 90px" }}
            >
              <Transition
                className={"flex justify-end flex-col items-center"}
                show={shownTeams.includes(i)}
                enter="transition-all duration-1000 origin-bottom"
                enterFrom="scale-y-0"
                enterTo="scale-y-100"
                leave="transition-opacity duration-250"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ScoreBar {...s} maxScore={maxScore} showTotals={isLastRound} />
              </Transition>
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
                  <span className="mt-1">
                    <span
                      className={twMerge(
                        isLastRound && getBgColorByPlace(s.place),
                        isLastRound && s.place ? "text-black" : "text-gray-500",
                        isLastRound &&
                          s.place &&
                          "w-10 h-10 rounded-full inline-flex justify-center items-center mr-2 pl-1"
                      )}
                    >
                      {i + 1}.{" "}
                    </span>
                    {s.teamName}
                  </span>
                </h3>
              </Transition>
            </li>
          ))}
        </ol>
      ) : (
        <div className="my-12 text-center text-gray-400 text-sm">
          <GrDocumentMissing className="inline-block text-2xl opacity-50 mb-4" />
          <div>There are no scores recorded for round #{roundOrder}.</div>
          <Link to={`/games/${game?.urlIdentifier}`}>
            <Button size="small" className="h-9 mt-6">
              <HiChevronLeft className="inline-block" /> Back to all rounds
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RoundResults;
