export interface AssetContext {
  funding: string;
  openInterest: string;
  prevDayPx: string;
  dayNtlVlm: string;
  premium: string;
  oraclePx: string;
  markPx: string;
  midPx: string;
  impactPxs: [string, string];
}

export interface AssetMeta {
  name: string;
  szDecimals: number;
  maxLeverage: number;
}

export interface MetaAndAssetCtxs {
  meta: { universe: AssetMeta[] };
  assetCtxs: AssetContext[];
}

export interface L2BookLevel {
  px: string;
  sz: string;
  n: number;
}

export interface L2Book {
  coin: string;
  levels: [L2BookLevel[], L2BookLevel[]]; // [bids, asks]
}

export interface UserPosition {
  coin: string;
  entryPx: string | null;
  leverage: { type: string; value: number };
  liquidationPx: string | null;
  marginUsed: string;
  positionValue: string;
  returnOnEquity: string;
  szi: string;
  unrealizedPnl: string;
}

export interface ClearinghouseState {
  assetPositions: { position: UserPosition }[];
  crossMarginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
    totalRawUsd: string;
  };
  marginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
  };
}
