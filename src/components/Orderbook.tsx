"use client";

import {useState, useEffect} from "react";
import {fetchL2Book} from "@/lib/api";
import {L2Book} from "@/lib/types";

function Orderbook({coin, maxLevels = 15}: {coin: string, maxLevels?: number}) {
    const [data, setData] = useState<L2Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchData = () => {
        fetchL2Book(coin).then((data) => { setData(data);})
    };
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }; [coin]);
