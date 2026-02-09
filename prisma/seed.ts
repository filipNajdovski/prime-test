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

  // Providers: NetEnt, Microgaming, Playtech, Evolution Gaming, Pragmatic Play
  // SLOT Games (8 games)
  const slotGames = await Promise.all([
    prisma.game.create({
      data: {
        title: "Golden Fortune",
        provider: "NetEnt",
        thumbnail: `/images/games/slots/Golden Fortune.jpeg`,
        description: "Spin to win with our classic 3-reel slot machine featuring golden symbols and lucky sevens.",
        category: GameCategory.SLOT,
        popularity: 95,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Diamond Dreams",
        provider: "Microgaming",
        thumbnail: `/images/games/slots/Diamond Dreams.jpeg`,
        description: "Match diamonds and jewels to unlock big jackpots in this high-volatility slot game.",
        category: GameCategory.SLOT,
        popularity: 87,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Lucky Leprechaun",
        provider: "Playtech",
        thumbnail: `/images/games/slots/Lucky Leprechaun.jpeg`,
        description: "Find the leprechaun's pot of gold and claim your winnings in this Irish-themed slot game.",
        category: GameCategory.SLOT,
        popularity: 76,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Aztec Gold",
        provider: "Pragmatic Play",
        thumbnail: `/images/games/slots/Aztec Gold.jpeg`,
        description: "Explore ancient Aztec treasures and uncover hidden riches in this adventure slot.",
        category: GameCategory.SLOT,
        popularity: 82,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Book of Mysteries",
        provider: "Evolution Gaming",
        thumbnail: `/images/games/slots/Book of Mysteries.jpeg`,
        description: "Uncover the secrets of an ancient book and trigger free spins and multipliers.",
        category: GameCategory.SLOT,
        popularity: 79,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Cosmic Cash",
        provider: "NetEnt",
        thumbnail: `/images/games/slots/Cosmic Cash.jpeg`,
        description: "Launch into space and collect cosmic rewards in this futuristic slot adventure.",
        category: GameCategory.SLOT,
        popularity: 85,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Fire Blaze",
        provider: "Microgaming",
        thumbnail: `/images/games/slots/Fire Blaze.jpeg`,
        description: "Hot symbols and blazing multipliers await in this fiery slot experience.",
        category: GameCategory.SLOT,
        popularity: 81,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Treasure Island",
        provider: "Pragmatic Play",
        thumbnail: `/images/games/slots/Treasure Island.jpeg`,
        description: "Sail the seas and discover treasure on this island-themed slot game.",
        category: GameCategory.SLOT,
        popularity: 77,
        isActive: true,
      },
    }),
  ]);

  // LIVE Games (4 games)
  const liveGames = await Promise.all([
    prisma.game.create({
      data: {
        title: "Live Blackjack",
        provider: "Evolution Gaming",
        thumbnail: `/images/games/live/Live Blackjack.jpeg`,
        description: "Play blackjack with a live dealer streamed directly from our gaming studio.",
        category: GameCategory.LIVE,
        popularity: 92,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Live Roulette",
        provider: "Playtech",
        thumbnail: `/images/games/live/Live Roulette.jpeg`,
        description: "Classic roulette with a real dealer. Watch the wheel spin in real-time.",
        category: GameCategory.LIVE,
        popularity: 88,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Live Baccarat",
        provider: "NetEnt",
        thumbnail: `/images/games/live/Live Baccarat.jpeg`,
        description: "Experience elegant baccarat with professional live dealers.",
        category: GameCategory.LIVE,
        popularity: 85,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Live Casino Hold'em",
        provider: "Pragmatic Play",
        thumbnail: `/images/games/live/Live Casino Hold'em.jpeg`,
        description: "Play against the dealer in this exciting live poker variant.",
        category: GameCategory.LIVE,
        popularity: 80,
        isActive: true,
      },
    }),
  ]);

  // TABLE Games (4 games)
  const tableGames = await Promise.all([
    prisma.game.create({
      data: {
        title: "Poker Pro",
        provider: "Microgaming",
        thumbnail: `/images/games/table/Poker Pro.jpeg`,
        description: "Texas Hold'em Poker with multiple difficulty levels and strategic gameplay.",
        category: GameCategory.TABLE,
        popularity: 84,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Baccarat Elite",
        provider: "NetEnt",
        thumbnail: `/images/games/table/Baccarat Elite.jpeg`,
        description: "Elegant baccarat game with multiple betting options and side bets.",
        category: GameCategory.TABLE,
        popularity: 78,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "European Roulette",
        provider: "Playtech",
        thumbnail: `/images/games/table/European Roulette.jpeg`,
        description: "Classic European roulette with single zero. Test your luck and strategy.",
        category: GameCategory.TABLE,
        popularity: 82,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Three Card Poker",
        provider: "Evolution Gaming",
        thumbnail: `/images/games/table/Three Card Poker.jpeg`,
        description: "Fast-paced poker variant with straightforward rules and big payouts.",
        category: GameCategory.TABLE,
        popularity: 75,
        isActive: true,
      },
    }),
  ]);

  // JACKPOT Games (4 games)
  const jackpotGames = await Promise.all([
    prisma.game.create({
      data: {
        title: "Mega Jackpot Slots",
        provider: "Pragmatic Play",
        thumbnail: `/images/games/jackpot/Mega Jackpot Slots.jpeg`,
        description: "Progressive jackpot game with prize pool growing with every play. Current jackpot: $500,000+",
        category: GameCategory.JACKPOT,
        popularity: 99,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Golden Jackpot",
        provider: "Playtech",
        thumbnail: `/images/games/jackpot/Golden Jackpot.jpeg`,
        description: "Hit the golden combination to trigger the multi-million jackpot.",
        category: GameCategory.JACKPOT,
        popularity: 97,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Cosmic Jackpot",
        provider: "NetEnt",
        thumbnail: `/images/games/jackpot/Cosmic Jackpot.jpeg`,
        description: "Reach for the stars and claim the cosmic jackpot prize.",
        category: GameCategory.JACKPOT,
        popularity: 94,
        isActive: true,
      },
    }),
    prisma.game.create({
      data: {
        title: "Royal Jackpot",
        provider: "Microgaming",
        thumbnail: `/images/games/jackpot/Royal Jackpot.jpeg`,
        description: "Feel like royalty when you trigger this premium jackpot experience.",
        category: GameCategory.JACKPOT,
        popularity: 91,
        isActive: true,
      },
    }),
  ]);

  // const allGames = [...slotGames, ...liveGames, ...tableGames, ...jackpotGames];

  console.log("Creating favorites...");

  // Add some favorites for each user
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      gameId: slotGames[0].id, // Golden Fortune
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user1.id,
      gameId: slotGames[3].id, // Aztec Gold
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user1.id,
      gameId: liveGames[0].id, // Live Blackjack
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      gameId: jackpotGames[0].id, // Mega Jackpot Slots
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      gameId: tableGames[0].id, // Poker Pro
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user3.id,
      gameId: tableGames[1].id, // Baccarat Elite
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user3.id,
      gameId: liveGames[1].id, // Live Roulette
    },
  });

  console.log("Creating game sessions...");

  // Create game sessions
  const now = new Date();

  // User 1 sessions
  await prisma.gameSession.create({
    data: {
      userId: user1.id,
      gameId: slotGames[0].id, // Golden Fortune
      startedAt: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      endedAt: new Date(now.getTime() - 50 * 60 * 1000),
    },
  });

  await prisma.gameSession.create({
    data: {
      userId: user1.id,
      gameId: liveGames[0].id, // Live Blackjack
      startedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      endedAt: null, // Still playing
    },
  });

  // User 2 sessions
  await prisma.gameSession.create({
    data: {
      userId: user2.id,
      gameId: jackpotGames[0].id, // Mega Jackpot Slots
      startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      endedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
    },
  });

  // User 3 sessions
  await prisma.gameSession.create({
    data: {
      userId: user3.id,
      gameId: tableGames[1].id, // Baccarat Elite
      startedAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
      endedAt: null, // Still playing
    },
  });

  await prisma.gameSession.create({
    data: {
      userId: user3.id,
      gameId: slotGames[1].id, // Diamond Dreams
      startedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      endedAt: new Date(now.getTime() - 3.5 * 60 * 60 * 1000),
    },
  });

  await prisma.gameSession.create({
    data: {
      userId: user1.id,
      gameId: tableGames[2].id, // European Roulette
      startedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      endedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`
  📊 Seeded Data Summary:
  - Users: 3
  - Games: 20 (8 Slots, 4 Live, 4 Table, 4 Jackpot)
  - Providers: 5 (NetEnt, Microgaming, Playtech, Evolution Gaming, Pragmatic Play)
  - Favorites: 7
  - Game Sessions: 6

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
