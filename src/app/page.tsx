"use client";

import MarketOverview from "@/components/MarketOverview";

export default function Home() {



  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Hyperliquid Data Panel</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-700 rounded-lg p-4 min-h-[300px]">
          <h2 className="text-lg font-semibold text-gray-400 mb-3">Market Overview</h2>
          <MarketOverview />
        </div>

        <div className="border border-gray-700 rounded-lg p-4 min-h-[300px]">
          <h2 className="text-lg font-semibold text-gray-400">Orderbook</h2>
        </div>

        <div className="border border-gray-700 rounded-lg p-4 min-h-[300px]">
          <h2 className="text-lg font-semibold text-gray-400">Positions</h2>
        </div>

        <div className="border border-gray-700 rounded-lg p-4 min-h-[300px]">
          <h2 className="text-lg font-semibold text-gray-400">Chart</h2>
        </div>
      </div>
    </main>
  );
}
