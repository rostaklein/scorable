import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { FaTrophy } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import type { ScoreAfterRound } from "~/models/score.server";

type Props = ScoreAfterRound & {
  maxScore: number;
  showTotals: boolean;
};

export const ScoreBar: React.FC<Props> = ({
  place,
  maxScore,
  showTotals,
  totalPoints,
  scoreFromLatestRound,
  scoreFromPreviousRounds,
}) => {
  const baseClassName = twMerge(
    "bg-slate-200 flex justify-center items-center px-6 flex-col"
  );
  const placeClassName = twMerge(
    place === "bronze" && "bg-amber-200",
    place === "silver" && "bg-slate-300",
    place === "gold" && "bg-amber-400"
  );

  const hasPreviousScore = scoreFromPreviousRounds > 0;

  return (
    <div className="flex-1 flex flex-col justify-end">
      <Transition
        as={Fragment}
        show={true}
        appear={true}
        enter="transition-all duration-1000 origin-bottom delay-500"
        enterFrom="scale-y-0"
        enterTo="scale-y-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={twMerge(
            baseClassName,
            showTotals && placeClassName,
            hasPreviousScore && "bg-opacity-40"
          )}
          style={{
            height: `${(scoreFromLatestRound / maxScore) * 100}%`,
          }}
        >
          <Transition
            as={Fragment}
            show={true}
            appear={true}
            enter="transition-all duration-1000 origin-bottom delay-1000"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
          >
            <div className="font-bold text-xl">
              {hasPreviousScore && "+"} {scoreFromLatestRound}
            </div>
          </Transition>
        </div>
      </Transition>
      {hasPreviousScore && (
        <div
          className={twMerge(baseClassName, showTotals && placeClassName)}
          style={{
            height: `${(scoreFromPreviousRounds / maxScore) * 100}%`,
          }}
        >
          <div className="font-bold text-xl">
            {place !== null && showTotals && (
              <div>
                <FaTrophy />
              </div>
            )}
            {showTotals ? totalPoints : scoreFromPreviousRounds}
          </div>
        </div>
      )}
    </div>
  );
};
