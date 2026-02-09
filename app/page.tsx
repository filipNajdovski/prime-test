"use client";

import { GameGrid } from "./components/GameGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Casino Lobby</h1>
          <p className="mt-2 text-gray-600">
            Browse and play our premium selection of casino games
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <GameGrid defaultSort="popularity" />
      </div>
    </div>
  );
}
