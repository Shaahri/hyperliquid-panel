"use client";

import { useEffect } from "react";
import { fetchMetaAndAssetCtxs } from "@/lib/api";

export default function Home() {
  useEffect(() => {
    fetchMetaAndAssetCtxs().then((data) => {
      console.log("Meta:", data.meta)
      console.log("Asset Contexts:", data.assetCtxs);
      console.log("First asset:", data.meta.universe[0].name);
      console.log("First asset context:", data.assetCtxs[0]);
    });
  }, []);



  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Hyperliquid Data Panel</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-700 rounded-lg p-4 min-h-[300px]">
          <h2 className="text-lg font-semibold text-gray-400">Market Overview</h2>
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
