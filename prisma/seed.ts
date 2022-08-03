import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getGames().map((joke) => {
      return db.game.create({ data: joke });
    })
  );
}

seed();

function getGames() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
    },
    {
      name: "Frisbee",
    },
    {
      name: "Trees",
    },
    {
      name: "Skeletons",
    },
    {
      name: "Hippos",
    },
    {
      name: "Dinner",
    },
    {
      name: "Elevator",
    },
  ];
}