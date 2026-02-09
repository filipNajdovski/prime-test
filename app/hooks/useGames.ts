"use client";

import { useState, useEffect } from "react";
import { PaginatedResponse, Game } from "@/lib/types";

interface UseGamesProps {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  provider?: string;
  sort?: string;
}

export function useGames({
  page = 1,
  limit = 12,
  search = "",
  category = "",
  provider = "",
  sort = "popularity",
}: UseGamesProps = {}) {
  const [data, setData] = useState<Game[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (provider) params.append("provider", provider);
        params.append("sort", sort);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await fetch(
          `${baseUrl}/api/games?${params}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const json: PaginatedResponse<Game> = await response.json();
        setData(json.data);
        setPagination(json.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [page, limit, search, category, provider, sort]);

  return { data, pagination, loading, error };
}
