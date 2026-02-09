import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractTokenFromHeader, getUserFromToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: initialGameId } = await params;
    const authHeader = req.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    let gameId = initialGameId;
    if (!gameId) {
      try {
        const body = await req.json();
        gameId = body?.gameId || body?.id || gameId;
      } catch (e) {
        // ignore
      }
    }
    // Final fallback: parse id from request URL path (e.g., /api/games/<id>/end)
    if (!gameId) {
      try {
        const url = new URL(req.url);
        const parts = url.pathname.split("/").filter(Boolean);
        // expecting [..., 'api', 'games', '<id>', 'end']
        const maybeId = parts.length >= 2 ? parts[parts.length - 2] : null;
        if (maybeId && maybeId !== "api" && maybeId !== "games" && maybeId !== "end") {
          gameId = maybeId;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!gameId) return NextResponse.json({ message: "Missing game id" }, { status: 400 });

    // Find the most recent open session for this user and game
    const session = await prisma.gameSession.findFirst({
      where: { userId: user.userId, gameId, endedAt: null },
      orderBy: { startedAt: "desc" },
    });

    if (!session) {
      return NextResponse.json({ message: "No active session found" }, { status: 404 });
    }

    const updated = await prisma.gameSession.update({
      where: { id: session.id },
      data: { endedAt: new Date() },
    });

    return NextResponse.json({ session: updated }, { status: 200 });
  } catch (error) {
    console.error("End session error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
