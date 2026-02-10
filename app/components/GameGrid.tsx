"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Game } from "@/lib/types";
import { GameCard } from "./GameCard";
import { SearchBar } from "./SearchBar";
import { GamePlayModal } from "./GamePlayModal";
import { useGames } from "../hooks/useGames";
import { useAuth } from "../context/AuthContext";

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
  const { isAuthenticated } = useAuth();
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [activeView, setActiveView] = useState<"all" | "favorites" | "recent">("all");

  // Sync to URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.append("page", page.toString());
    if (sort !== defaultSort) params.append("sort", sort);
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (provider) params.append("provider", provider);

    const queryString = params.toString();
    const currentQuery = searchParams.toString();
    if (queryString !== currentQuery) {
      router.replace(queryString ? `?${queryString}` : "");
    }
  }, [page, sort, category, search, provider, router, defaultSort, searchParams]);

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

  // Load user's favorites when authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setFavoriteIds(new Set());
        setFavoriteGames([]);
        setRecentGames([]);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = (await res.json()) as { data: Array<{ game: Game; gameId: string }> };
        const favs = json.data || [];
        const ids = new Set<string>(favs.map((f) => f.game.id));
        const gamesList = favs.map((f) => f.game);
        setFavoriteIds(ids);
        setFavoriteGames(gamesList);
      } catch (err) {
        console.error("Load favorites error", err);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    const loadRecent = async () => {
      if (!isAuthenticated) return;
      setRecentLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`/api/games/recent?limit=8`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = (await res.json()) as { data: Game[] };
        setRecentGames(json.data || []);
      } catch (err) {
        console.error("Load recent games error", err);
      } finally {
        setRecentLoading(false);
      }
    };

    loadRecent();
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeView === "recent" && recentGames.length === 0 && !recentLoading) {
      setActiveView("all");
    }
  }, [activeView, recentGames.length, recentLoading]);

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

      const url = `/api/games/${encodeURIComponent(safeId)}/play`;
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
      let errBody: unknown = null;
      try {
        errBody = await response.json();
      } catch {
        // ignore JSON parse errors
      }

      console.error("Play game failed", response.status, errBody);
      alert((errBody as { message?: string })?.message || `Failed to start game session (status ${response.status})`);
    } catch (err) {
      console.error("Play game error:", err);
      alert("Error starting game session");
    }
  };

  // Toggle favorite with optimistic UI
  const handleFavoriteToggle = async (gameId: string, shouldFavorite: boolean) => {
    if (!isAuthenticated) {
      alert("Please log in to favorite games");
      return;
    }

    const token = localStorage.getItem("auth_token");
    
    // Save previous state for revert if needed
    const prevFavoriteIds = new Set(favoriteIds);
    const prevFavoriteGames = [...favoriteGames];
    
    // Optimistic update
    const updated = new Set(prevFavoriteIds);
    if (shouldFavorite) {
      updated.add(gameId);
      // Find the game object from current view and add to favoriteGames immediately
      const gameToAdd = games.find((g) => g.id === gameId);
      if (gameToAdd && !favoriteGames.find((g) => g.id === gameId)) {
        setFavoriteGames((g) => [gameToAdd, ...g]);
      }
    } else {
      updated.delete(gameId);
      // If viewing favorites, remove from display
      if (activeView === "favorites") {
        setFavoriteGames((g) => g.filter((x) => x.id !== gameId));
      } else {
        // Not viewing favorites, just remove from the list
        setFavoriteGames((g) => g.filter((x) => x.id !== gameId));
      }
    }
    setFavoriteIds(updated);

    try {
      const method = shouldFavorite ? "POST" : "DELETE";
      const res = await fetch(`/api/favorites/${encodeURIComponent(gameId)}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Favorite API ${method} failed`);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
      // Revert to previous state
      setFavoriteIds(prevFavoriteIds);
      setFavoriteGames(prevFavoriteGames);
      alert("Failed to update favorite");
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

  // Decide which list to render depending on view
  const displayedGames =
    activeView === "favorites"
      ? favoriteGames
      : activeView === "recent"
      ? recentGames
      : games || [];

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

      {/* Toggle: All Games / My Favorites / Recently Played */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("all")}
            className={`rounded-md px-3 py-1 text-xs md:text-sm font-medium transition-colors ${
              activeView === "all"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setActiveView("favorites")}
            className={`rounded-md px-3 py-1 text-xs md:text-sm font-medium transition-colors ${
              activeView === "favorites"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Favorites ({favoriteGames.length})
          </button>
          {isAuthenticated && recentGames.length > 0 && (
            <button
              onClick={() => setActiveView("recent")}
              className={`rounded-md px-3 py-1 text-xs md:text-sm font-medium transition-colors ${
                activeView === "recent"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Recently Played ({recentGames.length})
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {activeView === "favorites"
            ? `${favoriteGames.length} favorite(s)`
            : activeView === "recent"
            ? recentLoading
              ? "Loading..."
              : `${recentGames.length} recent`
            : `${pagination.total} total`}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 dark:border-red-900/40 dark:bg-red-950/40">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-800 dark:text-red-200">Error</p>
            <p className="text-red-600 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="h-40 w-full animate-pulse bg-gray-200 dark:bg-slate-800" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-8 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Games Grid */}
      {!loading && displayedGames.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={handlePlay}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorited={favoriteIds.has(game.id)}
              />
            ))}
          </div>

          {/* Pagination (only for All Games list) */}
          {activeView === "all" && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.total} total games)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-100 dark:hover:bg-slate-900"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= pagination.totalPages}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-100 dark:hover:bg-slate-900"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && displayedGames.length === 0 && (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">No games found</p>
            <p className="text-gray-600 dark:text-gray-400">
              {activeView === "recent"
                ? "Play a game to see it here"
                : "Try adjusting your filters"}
            </p>
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
