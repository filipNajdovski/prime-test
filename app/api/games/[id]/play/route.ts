import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractTokenFromHeader, getUserFromToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;

    if (!gameId) {
      return NextResponse.json({ message: "Missing game id" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    const session = await prisma.gameSession.create({
      data: {
        userId: user.userId,
        gameId,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Play game error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
