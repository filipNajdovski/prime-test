"use client";

import { Game } from "@/lib/types";
import Image from "next/image";

interface GameCardProps {
  game: Game;
  onPlay?: (gameId: string) => void;
  onFavoriteToggle?: (gameId: string, isFavorited: boolean) => void;
  isFavorited?: boolean;
}

export function GameCard({
  game,
  onPlay,
  onFavoriteToggle,
  isFavorited = false,
}: GameCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      SLOT: "bg-purple-100 text-purple-800",
      LIVE: "bg-red-100 text-red-800",
      TABLE: "bg-blue-100 text-blue-800",
      JACKPOT: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      {/* Game Thumbnail */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-200 dark:bg-slate-800">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
          {game.title}
        </h3>

        {/* Provider */}
        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{game.provider}</p>

        {/* Category Badge */}
        <div className="mt-2 mb-3 inline-block">
          <span
            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(game.category)}`}
          >
            {game.category}
          </span>
        </div>

        {/* Description (2 lines max) */}
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {game.description}
        </p>

        {/* Popularity */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Popularity:
            </span>
            <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${game.popularity}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              console.debug("GameCard Play clicked", { id: game.id });
              onPlay?.(game.id);
            }}
            className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Play
          </button>
          <button
            onClick={() => onFavoriteToggle?.(game.id, !isFavorited)}
            aria-pressed={isFavorited}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              isFavorited
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            <span className="text-sm">
              {isFavorited ? "❤️" : "🤍"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
