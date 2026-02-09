import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractTokenFromHeader, getUserFromToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params;

    if (!gameId) {
      return NextResponse.json({ message: "Missing game id" }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Get game error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: initialId } = await params;
    let gameId: string | undefined = initialId;
    console.debug("POST /api/games/[id] called", { id: gameId, headers: Object.fromEntries(req.headers) });
    // Check authentication
    const authHeader = req.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Fallback: some clients may send the id in the request body instead of the route param.
    if (!gameId) {
      try {
        const body = await req.json();
        gameId = body?.gameId || body?.id || gameId;
      } catch {
        // ignore parse errors
      }
    }
    // Final fallback: parse id from request URL path (e.g., /api/games/<id>)
    if (!gameId) {
      try {
        const url = new URL(req.url);
        const parts = url.pathname.split("/").filter(Boolean);
        // expecting [..., 'api', 'games', '<id>']
        const maybeId = parts.length ? parts[parts.length - 1] : null;
        if (maybeId && maybeId !== "api" && maybeId !== "games") {
          gameId = maybeId;
        }
      } catch {
        // ignore
      }
    }

    if (!gameId) {
      console.error("Missing gameId in params, body, and URL", { params, url: req.url });
      return NextResponse.json({ message: "Missing game id" }, { status: 400 });
    }

    console.debug("Resolved gameId for play", { gameId });

    // Verify game exists
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    // Create game session
    const session = await prisma.gameSession.create({
      data: {
        userId: user.userId,
        gameId: gameId,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Play game error:", error);
    // Return error details in development to aid debugging
    let message = "Internal server error";
    let stack: string | null = null;
    if (error instanceof Error) {
      message = error.message;
      stack = error.stack || null;
    }
    return NextResponse.json(
      { message, stack },
      { status: 500 }
    );
  }
}
