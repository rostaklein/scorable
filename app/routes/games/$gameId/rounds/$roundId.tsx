import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import {
  HiArrowCircleRight,
  HiArrowRight,
  HiCheck,
  HiChevronLeft,
} from "react-icons/hi";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { getRound, updateScore } from "~/models/round.server";
import type { ActionFunction } from "@remix-run/node";
import { isValidString } from "~/utils/isValidString";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "~/components/Spinner";

type LoaderData = {
  round: Awaited<ReturnType<typeof getRound>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.gameId || !params.roundId) {
    return;
  }
  const round = await getRound(params.gameId, Number(params.roundId));
  return json<LoaderData>({ round });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const intent = formData.get("intent");

  const teamId = formData.get("teamId");
  const roundId = formData.get("roundId");
  const scoreId = formData.get("scoreId");
  const points = formData.get("points");

  switch (intent) {
    case "update-score": {
      if (
        isValidString(roundId) &&
        isValidString(teamId) &&
        isValidString(scoreId)
      ) {
        await updateScore(teamId, roundId, Number(points), scoreId);
        return null;
      }
    }
    default:
      return null;
  }
};

export default function RoundRoute() {
  const { round } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const [teamIdScoreLoading, setTeamIdScoreLoading] = useState<string | null>(
    null
  );
  const submit = useSubmit();

  useEffect(() => {
    const teamId = transition.submission?.formData.get("teamId");
    if (teamId && typeof teamId === "string") {
      setTeamIdScoreLoading(teamId);
    } else {
      setTeamIdScoreLoading(null);
    }
  }, [transition]);

  if (!round) {
    return null;
  }

  return (
    <div className="col-span-2 max-w-md">
      <div className=" mb-4 flex items-center justify-between">
        <Link
          to={`/games/${round.gameId}`}
          className="h-8 w-8 inline-flex items-center justify-center hover:bg-gray-200 rounded-md mr-2 -mt-0.5 transition-all"
        >
          <HiChevronLeft />
        </Link>
        <h2 className="font-bold text-lg inline-block">Round #{round.order}</h2>
        <Button>
          Next round <HiArrowRight className="inline-block ml-2" />
        </Button>
      </div>
      <div>
        {round.Game?.teams.map((team, i) => (
          <div
            className="flex justify-between align-center h-10 mb-2"
            key={team.id}
          >
            <div className="flex items-center pr-3 flex-1 overflow-x-auto whitespace-nowrap">
              {team.name}
            </div>
            <Form
              className="flex items-center flex-shrink-0 pl-2"
              method="post"
            >
              <Input
                name="points"
                placeholder="Score"
                className="w-16 appearance-none"
                type="number"
                initialValue={team.Score[0]?.points.toString()}
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                onDebouncedValueChange={(value) => {
                  const formData = new FormData();

                  formData.append("scoreId", team.Score[0]?.id);
                  formData.append("teamId", team.id);
                  formData.append("roundId", round.id);
                  formData.append("points", value);
                  formData.append("intent", "update-score");

                  submit(formData, { method: "post", replace: true });
                }}
              />
              <input type="hidden" value={team.Score[0]?.id} name="scoreId" />
              <input type="hidden" value={team.id} name="teamId" />
              <input type="hidden" value={round.id} name="roundId" />
              <Button
                className="ml-3"
                name="intent"
                value="update-score"
                size="small"
              >
                <div className="h-5 w-5">
                  {teamIdScoreLoading === team.id ? (
                    <Spinner />
                  ) : (
                    <HiCheck className="text-[18px]" />
                  )}
                </div>
              </Button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}
