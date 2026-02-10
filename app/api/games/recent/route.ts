import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractTokenFromHeader, getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "8"));

    const sessions = await prisma.gameSession.findMany({
      where: { userId: user.userId },
      orderBy: { startedAt: "desc" },
      include: { game: true },
      take: limit * 3,
    });

    const seen = new Set<string>();
    const games = [];

    for (const session of sessions) {
      if (!seen.has(session.gameId)) {
        seen.add(session.gameId);
        games.push(session.game);
      }
      if (games.length >= limit) break;
    }

    return NextResponse.json({ data: games }, { status: 200 });
  } catch (error) {
    console.error("Recent games error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
