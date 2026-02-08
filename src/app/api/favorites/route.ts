import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractTokenFromHeader, getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
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

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.userId },
      include: {
        game: true,
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
