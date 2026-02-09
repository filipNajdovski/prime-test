"use client";

import { useState, useMemo, memo } from "react";
import { Game } from "@/lib/types";
import { useGames } from "../hooks/useGames";

interface SearchBarProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onProviderChange: (provider: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  currentSearch: string;
  currentCategory: string;
  currentProvider: string;
  currentSort: string;
  allGames: Game[];
  loading?: boolean;
}

const SearchBarComponent = ({
  onSearchChange,
  onCategoryChange,
  onProviderChange,
  onSortChange,
  onClearFilters,
  currentSearch,
  currentCategory,
  currentProvider,
  currentSort,
  allGames,
  loading = false,
}: SearchBarProps) => {
  const [localSearch, setLocalSearch] = useState(currentSearch);

  // Handle search button click or Enter key
  const handleSearch = () => {
    onSearchChange(localSearch);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Extract unique providers from all games
  const providers = useMemo(() => {
    const unique = new Set(allGames.map((g) => g.provider));
    return Array.from(unique).sort();
  }, [allGames]);

  const hasActiveFilters =
    currentSearch || currentCategory || currentProvider || currentSort !== "popularity";

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Search Input with Button */}
      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search Games
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="search"
            type="text"
            placeholder="Search by game name, provider, or description..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {/* Category Filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={currentCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          >
            <option value="">All Categories</option>
            <option value="SLOT">Slots</option>
            <option value="LIVE">Live</option>
            <option value="TABLE">Table</option>
            <option value="JACKPOT">Jackpot</option>
          </select>
        </div>

        {/* Provider Filter */}
        <div>
          <label
            htmlFor="provider"
            className="block text-sm font-medium text-gray-700"
          >
            Provider
          </label>
          <select
            id="provider"
            value={currentProvider}
            onChange={(e) => onProviderChange(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          >
            <option value="">All Providers</option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700"
          >
            Sort By
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          >
            <option value="popularity">Popularity</option>
            <option value="name">Name (A-Z)</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={onClearFilters}
              className="w-full rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 disabled:opacity-50"
              disabled={loading}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {currentSearch && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              Search: {currentSearch}
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 font-bold hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {currentCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
              Category: {currentCategory}
              <button
                onClick={() => onCategoryChange("")}
                className="ml-1 font-bold hover:text-purple-900"
              >
                ×
              </button>
            </span>
          )}
          {currentProvider && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Provider: {currentProvider}
              <button
                onClick={() => onProviderChange("")}
                className="ml-1 font-bold hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
          {currentSort !== "popularity" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
              Sort: {currentSort}
              <button
                onClick={() => onSortChange("popularity")}
                className="ml-1 font-bold hover:text-orange-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const SearchBar = memo(SearchBarComponent);
