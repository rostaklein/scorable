import type { Prisma} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getGames().map((joke) => {
      return db.game.create({ data: { ...joke }});
    })
  );
}

seed();

function getGames() {
  return [
    {
      name: "Road worker",
      status: "IN_PROGRESS"
    },
    {
      name: "Frisbee",
      status: "FINISHED"
    },
    {
      name: "Trees",
      status: "PREPARING",
    },
    {
      name: "Skeletons",
      status: "PREPARING",
    },
    {
      name: "Hippos",
      status: "PREPARING",
    },
    {
      name: "Dinner",
      status: "PREPARING",
    },
    {
      name: "Elevator",
      status: "PREPARING",
    },
  ] as Prisma.GameCreateInput[];
}