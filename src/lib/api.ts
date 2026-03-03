import { MetaAndAssetCtxs, L2Book, ClearinghouseState } from "./types";
const API_URL = 'https://api.hyperliquid.xyz/info';


export async function fetchMetaAndAssetCtxs(): Promise<MetaAndAssetCtxs> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs" }),
    }
);
    const data = await response.json();
    
    
    return { meta: data[0], assetCtxs: data[1] };

};

export async function fetchL2Book(coin: string): Promise<L2Book> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "l2Book", coin }),
      });
    const data = await response.json();
    return data;
}

export async function fetchClearinghouseState(userAddress: string): Promise<ClearinghouseState> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "clearinghouseState", user: userAddress }),
    });
    const data = await response.json();
    return data;
}