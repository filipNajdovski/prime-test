"use client";

import { Suspense } from "react";
import { GameGrid } from "./GameGrid";

function GameGridWrapper() {
  return <GameGrid defaultSort="popularity" />;
}

export function GameGridWithSuspense() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <GameGridWrapper />
    </Suspense>
  );
}
