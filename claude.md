# CLAUDE.md — Hyperliquid Data Panel

## Role
Coding tutor. ONE step at a time. Wait for completion. Review, then move on.

## Rules
1. One step at a time — wait for user to complete or ask for help
2. Claude writes scaffolding/config, user writes logic
3. Don't write their code — hints first, escalate: concept → pseudocode → partial → full (only if asked)
4. Checkpoints are gates — review + suggest one improvement before proceeding
5. Explain WHY, not just WHAT
6. Update progress tracker `[ ]` → `[x]` after each step

## Project
- **Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, lightweight-charts
- **API:** `POST https://api.hyperliquid.xyz/info` (JSON body)
- **WS:** `wss://api.hyperliquid.xyz/ws`

---

## Progress

### Done
- [x] Phase 0 — Setup, dark theme, 4-panel grid
- [x] Phase 1 — types.ts, api.ts (3 fetch functions), console tested
- [x] Phase 2 — format.ts, MarketOverview.tsx (live table, volume-sorted, colored changes)

### Current
- [x] Homework: Read MarketOverview.tsx, experiment with .map(), useEffect, formatting
- [x] 3.1 — Claude explains orderbook concepts
- [ ] 3.2 — User builds Orderbook.tsx (IN PROGRESS: state + useEffect + 2s polling done, needs JSX rendering + export)
- [ ] 3.0 ✓ CHECKPOINT: Orderbook updates every 2s, depth bars, spread visible

### Upcoming
- [ ] 4.1–4.4 — WebSocket integration (ws manager, hook, refactor orderbook + market overview)
- [ ] 5.1–5.2 — Account positions (config.ts, Positions.tsx)
- [ ] 6.1–6.3 — Price chart (lightweight-charts, fetchCandles, interval selector)
- [ ] 7.1 — Funding rate history (SOLO — no scaffolding)
- [ ] 8.1–8.2 — Dashboard layout + polish
- [ ] 9.1–9.2 — Final review + stretch goal

---

## Next Phase Details

### PHASE 3: Orderbook Visualization
**Goal:** Orderbook concepts, depth visualization

**3.1 — Claude explains:** Bids (buys, green, highest first), asks (sells, red, lowest first), spread (best bid/ask gap), cumulative size (running total = liquidity walls).

**3.2 — User builds** `Orderbook.tsx`:
- Props: `{coin, maxLevels=15}`
- Asks top (red), bids bottom (green)
- Columns: Price | Size | Cumulative
- Depth bars: `width = cumSize/maxCumSize`
- Spread display, 2s polling with cleanup

**Checkpoint:** Correct bid/ask, proportional depth bars, spread correct, interval cleanup.

### PHASE 4: WebSocket Integration
**Goal:** Real-time streams, replace polling

**4.1 — Claude builds** `websocket.ts`: HyperliquidWS class (connect, reconnect w/ backoff, subscribe/unsubscribe, message routing, resubscribe on reconnect)
**4.2 — User creates** `useHyperliquidWS` hook (shared instance, connect on mount)
**4.3 — User refactors** Orderbook: replace setInterval with WS `l2Book` subscription
**4.4 — User adds** `allMids` WS subscription to MarketOverview

**Checkpoint:** WS frames in DevTools, no polling, proper cleanup.

---

## API Reference

| Type | Body | Returns |
|---|---|---|
| `metaAndAssetCtxs` | `{"type":"metaAndAssetCtxs"}` | Market meta + live data (tuple) |
| `l2Book` | `{"type":"l2Book","coin":"BTC"}` | Orderbook bids & asks |
| `clearinghouseState` | `{"type":"clearinghouseState","user":"0x..."}` | Positions & margin |
| `allMids` | `{"type":"allMids"}` | All mid prices |
| `candleSnapshot` | `{"type":"candleSnapshot","req":{"coin":"BTC","interval":"1h","startTime":...,"endTime":...}}` | OHLCV candles |
| `fundingHistory` | `{"type":"fundingHistory","coin":"BTC","startTime":...}` | Funding history |

**WS:** `{"method":"subscribe","subscription":{"type":"<l2Book|allMids|candle|trades>","coin":"BTC"}}`
**Rate limits:** REST 1200 wt/min, light calls wt 2, heavy wt 20, WS max 1000 subs/IP
