import "dotenv/config";
import { PrismaClient, GameCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Clear existing data
  await prisma.gameSession.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Creating users...");
  
  // Hash passwords
  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("securepass456", 10);
  const hashedPassword3 = await bcrypt.hash("mypassword789", 10);

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      username: "johndoe",
      name: "John Doe",
      password: hashedPassword1,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "sarah@example.com",
      username: "sarahsmith",
      name: "Sarah Smith",
      password: hashedPassword2,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "mike@example.com",
      username: "mikejones",
      name: "Mike Jones",
      password: hashedPassword3,
    },
  });

  console.log("Creating games...");

  // SLOT Games
  const slotGames = await Promise.all([
    prisma.game.create({
      data: {
        title: "Golden Fortune",
        provider: "NetEnt",
        thumbnail:
          "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=300",
        description:
          "Spin to win with our classic 3-reel slot machine featuring golden symbols and lucky sevens.",
        category: GameCategory.SLOT,
        popularity: 95,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Diamond Dreams",
        provider: "Microgaming",
        thumbnail:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300",
        description:
          "Match diamonds and jewels to unlock big jackpots in this high-volatility slot game.",
        category: GameCategory.SLOT,
        popularity: 87,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Lucky Leprechaun",
        provider: "Playtech",
        thumbnail:
          "https://images.unsplash.com/photo-1551614439-32e7d94f3d5a?w=300",
        description:
          "Find the leprechaun's pot of gold and claim your winnings in this Irish-themed slot game.",
        category: GameCategory.SLOT,
        popularity: 76,
        isActive: true,
      },
    }),
  ]);

  // LIVE Games
  const liveGames = await Promise.all([
    prisma.game.create({
      data: {
        title: "Live Blackjack",
        provider: "Evolution Gaming",
        thumbnail:
          "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=300",
        description:
          "Play blackjack with a live dealer streamed directly from our gaming studio.",
        category: GameCategory.LIVE,
        popularity: 92,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Live Roulette",
        provider: "Playtech",
        thumbnail:
          "https://images.unsplash.com/photo-1549560707-5f61ae1ba51a?w=300",
        description:
          "Classic roulette with a real dealer. Watch the wheel spin in real-time.",
        category: GameCategory.LIVE,
        popularity: 88,
        isActive: true,
      },
    }),
  ]);

  // TABLE Games
  const tableGames = await Promise.all([
    prisma.game.create({
      data: {
        title: "Poker Pro",
        provider: "Microgaming",
        thumbnail:
          "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=300",
        description:
          "Texas Hold'em Poker with multiple difficulty levels and strategic gameplay.",
        category: GameCategory.TABLE,
        popularity: 84,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Baccarat Elite",
        provider: "NetEnt",
        thumbnail:
          "https://images.unsplash.com/photo-1549560707-5f61ae1ba51a?w=300",
        description:
          "Elegant baccarat game with multiple betting options and side bets.",
        category: GameCategory.TABLE,
        popularity: 78,
        isActive: true,
      },
    }),
  ]);

  // JACKPOT Games
  const jackpotGames = await Promise.all([
    prisma.game.create({
      data: {
        title: "Mega Jackpot Slots",
        provider: "Progressive",
        thumbnail:
          "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=300",
        description:
          "Progressive jackpot game with prize pool growing with every play. Current jackpot: $500,000+",
        category: GameCategory.JACKPOT,
        popularity: 99,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Golden Jackpot",
        provider: "Playtech",
        thumbnail:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300",
        description:
          "Hit the golden combination to trigger the multi-million jackpot.",
        category: GameCategory.JACKPOT,
        popularity: 97,
        isActive: true,
      },
    }),
  ]);

  const allGames = [...slotGames, ...liveGames, ...tableGames, ...jackpotGames];

  console.log("Creating favorites...");

  // Add some favorites
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      gameId: slotGames[0].id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user1.id,
      gameId: liveGames[0].id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      gameId: jackpotGames[0].id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user3.id,
      gameId: tableGames[1].id,
    },
  });

  console.log("Creating game sessions...");

  // Create game sessions
  const now = new Date();

  // User 1 sessions
  await prisma.gameSession.create({
    data: {
      userId: user1.id,
      gameId: slotGames[0].id,
      startedAt: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      endedAt: new Date(now.getTime() - 50 * 60 * 1000),
    },
  });

  await prisma.gameSession.create({
    data: {
      userId: user1.id,
      gameId: liveGames[0].id,
      startedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      endedAt: null, // Still playing
    },
  });

  // User 2 sessions
  await prisma.gameSession.create({
    data: {
      userId: user2.id,
      gameId: jackpotGames[0].id,
      startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      endedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
    },
  });

  // User 3 sessions
  await prisma.gameSession.create({
    data: {
      userId: user3.id,
      gameId: tableGames[1].id,
      startedAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
      endedAt: null, // Still playing
    },
  });

  await prisma.gameSession.create({
    data: {
      userId: user3.id,
      gameId: slotGames[1].id,
      startedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      endedAt: new Date(now.getTime() - 3.5 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`
  📊 Seeded Data Summary:
  - Users: 3
  - Games: 8
  - Favorites: 4
  - Game Sessions: 5

  🎮 Sample Credentials:
  1. john@example.com / johndoe / password123
  2. sarah@example.com / sarahsmith / securepass456
  3. mike@example.com / mikejones / mypassword789
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
