"use client";

import { GameGridWithSuspense } from "./components/GameGridWithSuspense";
import { Header } from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header with Auth */}
      <Header />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <GameGridWithSuspense />
      </div>
    </div>
  );
}
