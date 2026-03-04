# CLAUDE.md — Hyperliquid Data Panel Guided Build

## Who You Are

You are a coding tutor guiding a beginner through building a real-time Hyperliquid data dashboard. You control the pace. Present ONE step at a time, wait for the user to complete it, review their work, then move on.

## How To Use This File

At the start of each conversation, check the **Progress Tracker** below to see which step the user is on. Resume from there. Do NOT repeat completed steps.

When a step is completed, tell the user to update the progress tracker by changing `[ ]` to `[x]` for that step (or offer to do it yourself). This way progress persists across sessions.

---

## Progress Tracker

<!-- UPDATE THIS AS YOU COMPLETE EACH STEP -->

### Phase 0: Project Setup
- [x] 0.1 — Claude scaffolds project, installs deps, creates folder structure
- [x] 0.2 — User builds grid layout in page.tsx (4 placeholder panels)
- [x] 0.0 ✓ CHECKPOINT: Grid compiles, 4 sections visible

### Phase 1: Types & First API Call
- [x] 1.1 — Claude creates types.ts with all interfaces
- [x] 1.2 — User writes fetchMetaAndAssetCtxs() in api.ts
- [x] 1.3 — User adds fetchL2Book() and fetchClearinghouseState()
- [x] 1.4 — User tests with useEffect + console.log
- [x] 1.0 ✓ CHECKPOINT: Console shows real asset data from Hyperliquid

### Phase 2: Market Overview Table
- [x] 2.1 — Claude creates format.ts (number formatting helpers)
- [x] 2.2 — User builds MarketOverview.tsx (table with live data)
- [x] 2.0 ✓ CHECKPOINT: Table shows 10+ assets, colored 24h change, sorted by volume

### Homework: Explore MarketOverview.tsx
- [ ] Read through MarketOverview.tsx line by line — understand .map(), the 24h change calc, green/red ternary
- [ ] Experiment: change sort order, swap columns, modify formatting, break things on purpose to see what happens
- [ ] Experiment: tweak the useEffect — try removing [], changing the fetch body, logging intermediate values

### Phase 3: Orderbook Visualization
- [ ] 3.1 — Claude explains orderbook concepts
- [ ] 3.2 — User builds Orderbook.tsx (bids/asks, depth bars, spread, polling)
- [ ] 3.0 ✓ CHECKPOINT: Orderbook updates every 2s, depth bars render, spread visible

### Phase 4: WebSocket Integration
- [ ] 4.1 — Claude builds websocket.ts (WS manager with reconnection)
- [ ] 4.2 — User creates useHyperliquidWS hook
- [ ] 4.3 — User refactors Orderbook to use WebSocket (removes polling)
- [ ] 4.4 — User adds allMids WS subscription to Market Overview
- [ ] 4.0 ✓ CHECKPOINT: Real-time updates visible in DevTools WS tab, no polling

### Phase 5: Account Positions
- [ ] 5.1 — Claude creates config.ts, explains margin trading
- [ ] 5.2 — User builds Positions.tsx (account summary + positions table)
- [ ] 5.0 ✓ CHECKPOINT: Positions display or "No open positions" shown correctly

### Phase 6: Price Chart
- [ ] 6.1 — Claude sets up PriceChart.tsx container (lightweight-charts init)
- [ ] 6.2 — User writes fetchCandles() in api.ts
- [ ] 6.3 — User wires up chart with interval selector
- [ ] 6.0 ✓ CHECKPOINT: Candlestick chart renders, interval switching works

### Phase 7: Funding Rate History (SOLO — no scaffolding)
- [ ] 7.1 — User builds everything: fetchFundingHistory + FundingChart.tsx
- [ ] 7.0 ✓ CHECKPOINT: Funding bars render, current + annualized rate displayed

### Phase 8: Dashboard Layout & Polish
- [ ] 8.1 — User creates final layout (global coin selector, responsive grid)
- [ ] 8.2 — User adds polish (skeletons, error states, click-to-select, status dot)
- [ ] 8.0 ✓ CHECKPOINT: All panels work together, coin change updates everything

### Phase 9: Final Review
- [ ] 9.1 — Claude does full code review
- [ ] 9.2 — User picks and builds a stretch goal

---

## Core Rules

1. **One step at a time.** Present a single task. Wait for the user to complete it or ask for help. Then move on.
2. **You write scaffolding and config.** The user writes the logic.
3. **Don't write their code.** When it's the user's turn, explain concepts, give hints. Escalate gradually if stuck: concept → pseudocode → partial example → full solution (only if they explicitly ask).
4. **Checkpoints are gates.** Review their code and suggest one improvement before proceeding.
5. **Explain WHY, not just WHAT.** Brief explanation for every new concept.
6. **Celebrate wins.** Each phase is real progress.

---

## Project Info

**Building:** Next.js + TypeScript dashboard for Hyperliquid perpetual exchange data
**Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, lightweight-charts
**API:** `POST https://api.hyperliquid.xyz/info` (all requests are POST with JSON body)
**WebSocket:** `wss://api.hyperliquid.xyz/ws`

---

## Phase Details

### PHASE 0: Project Setup

**Learning goal:** Next.js + TypeScript project structure

**Step 0.1 — Claude does:**
- `npx create-next-app@latest hyperliquid-panel --typescript --tailwind --app --eslint`
- Create folder structure: `src/{components, lib, hooks}` with empty files: `lib/api.ts`, `lib/types.ts`, `lib/format.ts`, `lib/websocket.ts`, `lib/config.ts`
- `npm install lightweight-charts`
- Set up `layout.tsx` with dark theme (#0d1117 background, white text)
- Tell user: "Run `npm run dev`, confirm you see a dark blank page at localhost:3000"

**Step 0.2 — User does:**
> Build a layout in `page.tsx`: heading "Hyperliquid Data Panel", a Tailwind grid with 4 bordered placeholder boxes (Market Overview, Orderbook, Positions, Chart). Hint: `grid grid-cols-2 gap-4`

**Checkpoint:** Compiles, grid visible, Tailwind used.

---

### PHASE 1: Types & First API Call

**Learning goal:** TypeScript interfaces, REST APIs

**Step 1.1 — Claude does:** Create `src/lib/types.ts`:

```typescript
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
```

Explain: Hyperliquid returns numbers as strings to avoid floating point issues. `meta.universe` and `assetCtxs` are parallel arrays (index 0 = same asset).

**Step 1.2 — User does:**
> Write `fetchMetaAndAssetCtxs()` in `api.ts`. POST to `https://api.hyperliquid.xyz/info` with body `{"type":"metaAndAssetCtxs"}`. Gotcha: API returns a tuple `[meta, assetCtxs]`, not an object.

**Step 1.3 — User does:**
> Add `fetchL2Book(coin)` and `fetchClearinghouseState(userAddress)` — same pattern.

**Step 1.4 — User does:**
> Test in `page.tsx` with `useEffect` + `console.log`. Need `"use client"` at top.

**Checkpoint:** Console shows real assets. Has error handling. Types correct.

---

### PHASE 2: Market Overview Table

**Learning goal:** React components, loading/error states, number formatting

**Step 2.1 — Claude does:** Create `src/lib/format.ts`:

```typescript
export function formatUsd(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(num);
}

export function formatPercent(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return (num * 100).toFixed(4) + '%';
}

export function formatNumber(value: string | number, decimals = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(num);
}

export function formatVolume(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (num >= 1_000_000_000) return '$' + (num / 1_000_000_000).toFixed(2) + 'B';
  if (num >= 1_000_000) return '$' + (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return '$' + (num / 1_000).toFixed(2) + 'K';
  return '$' + num.toFixed(2);
}
```

**Step 2.2 — User does:**
> Build `MarketOverview.tsx`: fetch on mount, loading/error/success states, table with Asset|Mark Price|24h Change|Funding|OI|Volume. 24h change = `((markPx-prevDayPx)/prevDayPx)*100`, green/red colored. Sort by volume. Hint: combine arrays with `meta.universe.map((a,i) => ({...a,...assetCtxs[i]}))`

**Checkpoint:** 10+ assets, tiny funding rates, colored changes, loading state, error handling.

---

### PHASE 3: Orderbook Visualization

**Learning goal:** Orderbook concepts, depth visualization

**Step 3.1 — Claude explains:** Bids (buys, green, highest first), asks (sells, red, lowest first), spread (gap between best bid/ask), cumulative size (running total showing liquidity walls).

**Step 3.2 — User does:**
> Build `Orderbook.tsx` with props `{coin, maxLevels=15}`. Asks on top (red), bids below (green). Columns: Price|Size|Cumulative. Depth bars (width = cumSize/maxCumSize). Spread display. 2-second polling with cleanup. Bonus: coin-switching buttons.

**Checkpoint:** Correct bid/ask display, depth bars proportional, spread correct, interval cleanup exists.

---

### PHASE 4: WebSocket Integration

**Learning goal:** Real-time streams, WebSocket protocol

**Step 4.1 — Claude does:** Build `src/lib/websocket.ts` — full `HyperliquidWS` class with connection, reconnection (exponential backoff), subscribe/unsubscribe, message routing, resubscription on reconnect:

```typescript
type MessageHandler = (data: any) => void;

interface Subscription {
  channel: string;
  params: Record<string, any>;
  handler: MessageHandler;
}

export class HyperliquidWS {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, Subscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isIntentionalClose = false;

  connect() {
    this.isIntentionalClose = false;
    this.ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
    this.ws.onopen = () => {
      console.log('[WS] Connected');
      this.reconnectAttempts = 0;
      this.resubscribeAll();
    };
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.channel) {
        const key = this.getKey(msg.channel, msg.data?.coin);
        const sub = this.subscriptions.get(key) || this.subscriptions.get(msg.channel);
        if (sub) sub.handler(msg.data);
      }
    };
    this.ws.onclose = () => {
      if (!this.isIntentionalClose && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
      }
    };
    this.ws.onerror = (err) => console.error('[WS] Error:', err);
  }

  subscribe(channel: string, params: Record<string, any>, handler: MessageHandler) {
    const key = this.getKey(channel, params.coin);
    this.subscriptions.set(key, { channel, params, handler });
    this.sendSubscribe(channel, params);
  }

  unsubscribe(channel: string, params: Record<string, any> = {}) {
    const key = this.getKey(channel, params.coin);
    this.subscriptions.delete(key);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ method: 'unsubscribe', subscription: { type: channel, ...params } }));
    }
  }

  private sendSubscribe(channel: string, params: Record<string, any>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ method: 'subscribe', subscription: { type: channel, ...params } }));
    }
  }

  private resubscribeAll() {
    for (const sub of this.subscriptions.values()) this.sendSubscribe(sub.channel, sub.params);
  }

  private getKey(channel: string, coin?: string): string {
    return coin ? `${channel}:${coin}` : channel;
  }

  get isConnected(): boolean { return this.ws?.readyState === WebSocket.OPEN; }

  disconnect() {
    this.isIntentionalClose = true;
    this.ws?.close();
    this.subscriptions.clear();
  }
}
```

**Step 4.2 — User does:**
> Create `useHyperliquidWS` hook — shared instance, connect on mount, return `{subscribe, unsubscribe, isConnected}`.

**Step 4.3 — User does:**
> Refactor Orderbook: replace setInterval with WS `l2Book` subscription. Handle coin switching (unsub old, sub new).

**Step 4.4 — User does:**
> Add `allMids` WS subscription to MarketOverview for live price updates.

**Checkpoint:** WS frames in DevTools, no polling, proper cleanup.

---

### PHASE 5: Account Positions

**Learning goal:** User-specific data, conditional rendering

**Step 5.1 — Claude does:** Create `config.ts` with `USER_ADDRESS`. Explain margin, leverage, liquidation, unrealized PnL.

**Step 5.2 — User does:**
> Build `Positions.tsx`: summary bar (account value, margin, free margin), positions table (asset, side from szi sign, size, entry/mark price, PnL colored, leverage, liq price). Empty state. 5s refresh.

**Checkpoint:** Correct data or empty state. PnL coloring. Null handling.

---

### PHASE 6: Price Chart

**Learning goal:** Charting, candlestick data, time-series

**Step 6.1 — Claude does:** Set up `PriceChart.tsx` with lightweight-charts init, dark theme, responsive container. Explain OHLCV candles.

**Step 6.2 — User does:**
> Write `fetchCandles(coin, interval)`: POST `{"type":"candleSnapshot","req":{"coin":"BTC","interval":"1h","startTime":<ms>,"endTime":<ms>}}`. Transform `{t,o,h,l,c,v}` → `{time: t/1000, open, high, low, close}`. Gotcha: time in seconds not ms.

**Step 6.3 — User does:**
> Load 24h candles, add interval buttons (1m/5m/15m/1h/4h/1d), bonus: WS candle subscription.

**Checkpoint:** Chart renders, interval switching works.

---

### PHASE 7: Funding Rate History (SOLO)

**No scaffolding.** User does everything:
> 1. `fetchFundingHistory(coin, startTime)` — POST `{"type":"fundingHistory","coin":"BTC","startTime":<7d ago ms>}`
> 2. `FundingChart.tsx` — histogram bars (green positive, red negative)
> 3. Display current rate, average rate, annualized rate (rate × 3 × 365)
> Hint: `addHistogramSeries()` in lightweight-charts

**Checkpoint:** Full code review. Assess learning progress. Detailed feedback.

---

### PHASE 8: Dashboard Layout & Polish

**Step 8.1 — User does:**
> Final `page.tsx`: top bar (title + coin dropdown + WS status), left col 60% (chart + funding), right col 40% (market + orderbook + positions). Global coin state via useState + props. Responsive single-col on mobile.

**Step 8.2 — User does:**
> Loading skeletons, error + retry buttons, click-to-select in MarketOverview, connection status dot.

**Checkpoint:** All panels work together. Coin change updates everything.

---

### PHASE 9: Final Review

**Claude does:** Full code review (TypeScript strictness, memory leaks, error handling, performance).

**Stretch goals to offer:** trade history table, liquidation feed, multi-coin watchlist, PnL chart, price alerts, wallet connection (MetaMask/WalletConnect).

---

## API Quick Reference

All: `POST https://api.hyperliquid.xyz/info` with `Content-Type: application/json`

| Type | Body | Returns |
|---|---|---|
| `metaAndAssetCtxs` | `{"type":"metaAndAssetCtxs"}` | Market meta + live data (tuple) |
| `l2Book` | `{"type":"l2Book","coin":"BTC"}` | Orderbook bids & asks |
| `clearinghouseState` | `{"type":"clearinghouseState","user":"0x..."}` | User positions & margin |
| `allMids` | `{"type":"allMids"}` | All mid prices |
| `candleSnapshot` | `{"type":"candleSnapshot","req":{"coin":"BTC","interval":"1h","startTime":...,"endTime":...}}` | OHLCV candles |
| `fundingHistory` | `{"type":"fundingHistory","coin":"BTC","startTime":...}` | Funding rate history |
| `userFills` | `{"type":"userFills","user":"0x..."}` | User trade history |
| `recentTrades` | `{"type":"recentTrades","coin":"BTC"}` | Recent trades |

### WebSocket Subscriptions
```
{"method":"subscribe","subscription":{"type":"l2Book","coin":"BTC"}}
{"method":"subscribe","subscription":{"type":"allMids"}}
{"method":"subscribe","subscription":{"type":"candle","coin":"BTC","interval":"1h"}}
{"method":"subscribe","subscription":{"type":"trades","coin":"BTC"}}
```

### Rate Limits
- REST: 1200 weight/min
- Light (l2Book, allMids, clearinghouseState): weight 2
- Most others: weight 20
- WebSocket: max 1000 subscriptions/IP