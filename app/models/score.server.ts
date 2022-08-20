import { db } from "~/utils/db.server";

export type ScoreAfterRound = {
  teamId: string;
  teamName: string;
  totalPoints: number;
  scoreFromLatestRound: number;
  scoreFromPreviousRounds: number;
  place: "gold" | "silver" | "bronze" | null;
};

const getPlace = (
  pts: number,
  topThree: [number, number, number]
): ScoreAfterRound["place"] => {
  const [gold, silver, bronze] = topThree;

  switch (pts) {
    case gold:
      return "gold";
    case silver:
      return "silver";
    case bronze:
      return "bronze";
    default:
      return null;
  }
};

export async function getScoreAfterNthRound(
  gameId: string,
  roundOrder: number
) {
  const scores = await db.score.findMany({
    where: {
      round: {
        order: { lte: roundOrder },
        Game: {
          OR: [{ urlIdentifier: gameId }, { id: gameId }],
        },
      },
    },
    include: {
      round: {
        select: { order: true },
      },
    },
  });

  const scoresFromLatestRound = new Map<string, number>();

  const scoreMap = scores.reduce((acc, curr) => {
    acc.set(curr.teamId, (acc.get(curr.teamId) ?? 0) + curr.points);
    if(curr.round.order === roundOrder){
      scoresFromLatestRound.set(curr.teamId, curr.points);
    }
    return acc;
  }, new Map<string, number>());

  const teams = await db.team.findMany({
    where: { id: { in: [...scoreMap.keys()] } },
    select: { id: true, name: true },
  });

  const scoreWithoutPlace: ScoreAfterRound[] = teams
    .map((team): ScoreAfterRound => ({
      teamId: team.id,
      teamName: team.name,
      totalPoints: scoreMap.get(team.id) ?? 0,
      place: null,
      scoreFromLatestRound: scoresFromLatestRound.get(team.id) ?? 0,
      scoreFromPreviousRounds: (scoreMap.get(team.id) ?? 0) - (scoresFromLatestRound.get(team.id) ?? 0)
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const uniqueScores = [
    ...new Set(scoreWithoutPlace.map(({ totalPoints }) => totalPoints)),
  ];

  const [goldPoints, silverPoints, bronzePoints] = uniqueScores;

  const score = scoreWithoutPlace.map((s) => ({
    ...s,
    place: getPlace(s.totalPoints, [goldPoints, silverPoints, bronzePoints]),
  }));

  const game = await db.game.findFirst({
    where: {
      OR: [{ urlIdentifier: gameId }, { id: gameId }],
    },
  });

  const prevRound = await db.round.findFirst({
    where: {Game: {OR: [{urlIdentifier: gameId}, {id: gameId}]}, order: roundOrder - 1}
  })

  const nextRound = await db.round.findFirst({
    where: {Game: {OR: [{urlIdentifier: gameId}, {id: gameId}]}, order: roundOrder + 1}
  })

  return { score, game, roundOrder, prevRound, nextRound };
}
