import type { Prisma } from "@prisma/client";
import { GameStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import Chance from "chance";

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
  const chance = new Chance();

  return Array.from({ length: 10 }).map((_, i) => {
    const chanceWord = chance.word({ capitalize: true });
    const name = `Test game #${i + 1} - ${chanceWord}`;
    return {
      name,
      createdAt: new Date(new Date().getTime() - i),
      urlIdentifier: encodeURIComponent(chanceWord.toLowerCase()),
      status: GameStatus.PREPARING,
      teams: {
        createMany: {
          data: Array.from({ length: chance.integer({ min: 2, max: 10 }) }).map(
            () => ({
              name: `${chance.word({ capitalize: true })} ${chance.animal()}`,
            })
          ),
        },
      },
    } as Prisma.GameCreateInput;
  });
}
