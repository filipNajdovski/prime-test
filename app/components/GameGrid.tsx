"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Game } from "@/lib/types";
import { GameCard } from "./GameCard";
import { SearchBar } from "./SearchBar";
import { GamePlayModal } from "./GamePlayModal";
import { useGames } from "../hooks/useGames";

interface GameGridProps {
  defaultSort?: string;
  defaultCategory?: string;
}

export function GameGrid({
  defaultSort = "popularity",
  defaultCategory = "",
}: GameGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read from URL or use defaults
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [sort, setSort] = useState(searchParams.get("sort") || defaultSort);
  const [category, setCategory] = useState(
    searchParams.get("category") || defaultCategory
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [provider, setProvider] = useState(searchParams.get("provider") || "");
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const limit = 12;

  // Fetch games with current filters
  const { data: games, pagination, loading, error } = useGames({
    page,
    limit,
    sort,
    category,
    search,
    provider,
  });

  // Fetch all games to extract providers (without pagination)
  // Memoize to prevent SearchBar from re-rendering unnecessarily
  const { data: allGamesList } = useGames({
    page: 1,
    limit: 1000,
    sort: "name",
  });

  const allGames = useMemo(() => allGamesList, [allGamesList]);

  // Sync to URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.append("page", page.toString());
    if (sort !== defaultSort) params.append("sort", sort);
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (provider) params.append("provider", provider);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "", { shallow: true } as any);
  }, [page, sort, category, search, provider, router, defaultSort]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage(page + 1);
  };

  const handleClearFilters = () => {
    setPage(1);
    setSort(defaultSort);
    setCategory("");
    setSearch("");
    setProvider("");
  };

  const handlePlay = async (gameId: string) => {
    const token = localStorage.getItem("auth_token");
    console.debug("handlePlay called", { gameId, token });
    if (!gameId) {
      console.error("handlePlay called with empty gameId", { gameId });
      alert("Invalid game selected");
      return;
    }
    if (!token) {
      alert("Please log in to play a game");
      return;
    }

      try {
      // Sanitize gameId and log request URL for debugging
      const safeId = String(gameId ?? "");
      if (!safeId || safeId === "undefined" || safeId === "null") {
        console.error("Invalid gameId before fetch", { gameId, safeId });
        alert("Invalid game selected");
        return;
      }

      const url = `/api/games/${encodeURIComponent(safeId)}`;
      console.debug("About to POST to", url);

      // Use same-origin API route to avoid env base-url mismatch
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const sessionData = await response.json();
        // Find the game object in the games array to pass to modal
        const game = games.find((g) => g.id === gameId);
        if (game) {
          setPlayingGame(game);
          setSessionId(sessionData.id || sessionData.session?.id || gameId);
        } else {
          alert("Game not found");
        }
        return;
      }

      // Try to parse error message from server for debugging
      let errBody: any = null;
      try {
        errBody = await response.json();
      } catch (e) {
        // ignore JSON parse errors
      }

      console.error("Play game failed", response.status, errBody);
      alert(errBody?.message || `Failed to start game session (status ${response.status})`);
    } catch (err) {
      console.error("Play game error:", err);
      alert("Error starting game session");
    }
  };

  // Memoize callback handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  const handleProviderChange = useCallback((newProvider: string) => {
    setProvider(newProvider);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <SearchBar
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onProviderChange={handleProviderChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        currentSearch={search}
        currentCategory={category}
        currentProvider={provider}
        currentSort={sort}
        allGames={allGames}
        loading={loading}
      />

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-800">Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

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

      {/* Game Play Modal */}
      {playingGame && (
        <GamePlayModal
          game={playingGame}
          token={localStorage.getItem("auth_token") || ""}
          sessionId={sessionId || ""}
          onClose={() => {
            setPlayingGame(null);
            setSessionId(null);
          }}
        />
      )}
    </div>
  );
}
