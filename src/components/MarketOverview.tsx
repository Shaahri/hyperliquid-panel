"use client";

import { useEffect, useState } from "react";
import { fetchMetaAndAssetCtxs } from "@/lib/api";
import { AssetMeta, AssetContext } from "@/lib/types";
import { formatUsd, formatPercent, formatVolume } from "@/lib/format";

type CombinedAsset = AssetMeta & AssetContext;

export default function MarketOverview() {
  const [data, setData] = useState<CombinedAsset[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetaAndAssetCtxs()
      .then((result) => {
        const combined = result.meta.universe.map((asset, i) => ({
          ...asset,
          ...result.assetCtxs[i],
        }));
        combined.sort(
          (a, b) => parseFloat(b.dayNtlVlm) - parseFloat(a.dayNtlVlm)
        );
        setData(combined);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="overflow-auto max-h-[600px]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-[#0d1117]">
          <tr className="text-gray-400 text-left border-b border-gray-700">
            <th className="py-2 px-3">Asset</th>
            <th className="py-2 px-3 text-right">Mark Price</th>
            <th className="py-2 px-3 text-right">24h Change</th>
            <th className="py-2 px-3 text-right">Funding</th>
            <th className="py-2 px-3 text-right">Open Interest</th>
            <th className="py-2 px-3 text-right">Volume</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => {
            const markPx = parseFloat(item.markPx);
            const prevDayPx = parseFloat(item.prevDayPx);
            const change = ((markPx - prevDayPx) / prevDayPx) * 100;

            return (
              <tr
                key={item.name}
                className="border-b border-gray-800 hover:bg-gray-800/50"
              >
                <td className="py-2 px-3 font-medium">{item.name}</td>
                <td className="py-2 px-3 text-right">
                  {formatUsd(item.markPx)}
                </td>
                <td
                  className={`py-2 px-3 text-right ${
                    change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(2)}%
                </td>
                <td className="py-2 px-3 text-right">
                  {formatPercent(item.funding)}
                </td>
                <td className="py-2 px-3 text-right">
                  {formatVolume(item.openInterest)}
                </td>
                <td className="py-2 px-3 text-right">
                  {formatVolume(item.dayNtlVlm)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
