import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PaginatedResponse, Game } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Extract query parameters
    const search = searchParams.get("search")?.toLowerCase() || "";
    const category = searchParams.get("category")?.toUpperCase() || "";
    const provider = searchParams.get("provider")?.toLowerCase() || "";
    const sort = searchParams.get("sort") || "popularity";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Validation
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { message: "Page and limit must be positive numbers" },
        { status: 400 }
      );
    }

    // Build filter
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { provider: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && ["SLOT", "LIVE", "TABLE", "JACKPOT"].includes(category)) {
      where.category = category;
    }

    if (provider) {
      where.provider = { contains: provider, mode: "insensitive" };
    }

    // Build order
    let orderBy: any = { popularity: "desc" };
    if (sort === "name") {
      orderBy = { title: "asc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    }

    // Get total count
    const total = await prisma.game.count({ where });

    // Get games
    const games = await prisma.game.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<Game> = {
      data: games,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Games list error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
