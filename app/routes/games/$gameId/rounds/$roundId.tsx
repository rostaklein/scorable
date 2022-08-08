import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRound } from "~/models/round.server";

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

export default function RoundRoute() {
  const { round } = useLoaderData<LoaderData>();

  if (!round) {
    return null;
  }

  return <div className="col-span-2">{JSON.stringify(round)}</div>;
}
