"use client";

import { Game } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";

interface GamePlayModalProps {
  game: Game;
  token: string;
  sessionId: string;
  onClose: () => void;
}

export function GamePlayModal({
  game,
  token,
  // sessionId,
  onClose,
}: GamePlayModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEndSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/games/${game.id}/end`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to end session");
      }

      // Close modal after successfully ending session
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleEndSession}
          disabled={loading}
          className="absolute top-4 right-4 z-10 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-900 disabled:opacity-50"
          title="Close and end session"
        >
          ✕
        </button>

        {/* Game Header */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-200">
          <Image
            src={game.thumbnail}
            alt={game.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold">{game.title}</h2>
            <p className="text-sm text-gray-200">{game.provider}</p>
          </div>
        </div>

        {/* Game Content */}
        <div className="p-6 space-y-6">
          {/* Game Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {game.category}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Provider</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {game.provider}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium text-gray-600">About</p>
            <p className="mt-2 text-gray-700 leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Popularity */}
          <div>
            <p className="text-sm font-medium text-gray-600">Popularity</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${game.popularity}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {game.popularity}%
              </span>
            </div>
          </div>

          {/* Placeholder Game Area */}
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-600">Game Screen Placeholder</p>
            <p className="mt-2 text-2xl font-bold text-gray-400">🎮</p>
            <p className="mt-2 text-gray-600">
              Game session active. Click &quot;Exit Game&quot; to end your session.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleEndSession}
              disabled={loading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Ending..." : "Exit Game"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
