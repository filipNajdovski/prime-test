"use client";

import { useState } from "react";
import { Game } from "@/lib/types";
import { GameCard } from "./GameCard";
import { useGames } from "../hooks/useGames";

interface GameGridProps {
  defaultSort?: string;
  defaultCategory?: string;
}

export function GameGrid({
  defaultSort = "popularity",
  defaultCategory = "",
}: GameGridProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(defaultSort);
  const [category, setCategory] = useState(defaultCategory);

  const limit = 12;
  const { data: games, pagination, loading, error } = useGames({
    page,
    limit,
    sort,
    category,
  });

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage(page + 1);
  };

  const handlePlay = async (gameId: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please log in to play a game");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/games/${gameId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Game session started!");
      } else {
        alert("Failed to start game session");
      }
    } catch (err) {
      console.error("Play game error:", err);
      alert("Error starting game session");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-800">Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          <option value="popularity">Popularity</option>
          <option value="name">Name (A-Z)</option>
          <option value="newest">Newest</option>
        </select>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          <option value="">All Categories</option>
          <option value="SLOT">Slots</option>
          <option value="LIVE">Live</option>
          <option value="TABLE">Table</option>
          <option value="JACKPOT">Jackpot</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="h-40 w-full animate-pulse bg-gray-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Games Grid */}
      {!loading && games.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={handlePlay}
                onFavoriteToggle={(gameId, isFav) => {
                  console.log(`Toggle favorite for ${gameId}: ${isFav}`);
                  // Will implement in next step
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} (
              {pagination.total} total games)
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= pagination.totalPages}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && games.length === 0 && (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">No games found</p>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  );
}
