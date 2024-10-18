"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

type Props = {
  exchange: string;
  tradingSymbol: string;
};

const ChartSymbol: React.FC<Props> = ({ exchange, tradingSymbol }) => {
  const { theme } = useTheme();
  const stockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `${exchange}:${tradingSymbol}`,
      timezone: "Etc/UTC",
      theme: theme === "dark" ? "dark" : "light",
    });
    stockRef.current?.appendChild(script);

    return () => {
      if (stockRef.current) {
        stockRef.current.innerHTML = "";
      }
    };
  }, [exchange, tradingSymbol, theme]);

  return (
    <div className="h-96">
      <div
        className="tradingview-widget-container overflow-hidden h-fit flex-1 flex-grow "
        ref={stockRef}
      ></div>
    </div>
  );
};

export default ChartSymbol;
