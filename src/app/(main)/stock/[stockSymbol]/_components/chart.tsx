"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useRef, useMemo, memo } from "react";

type Props = {
  exchange: string;
  tradingSymbol: string;
};

const ChartSymbol: React.FC<Props> = memo(({ exchange, tradingSymbol }) => {
  const { theme } = useTheme();
  const stockRef = useRef<HTMLDivElement | null>(null);

  // Memoize the script configuration to prevent recreation on every render
  const scriptConfig = useMemo(() => ({
    autosize: true,
    symbol: `${exchange}:${tradingSymbol}`,
    timezone: "Etc/UTC",
    theme: theme === "dark" ? "dark" : "light",
  }), [exchange, tradingSymbol, theme]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(scriptConfig);
    stockRef.current?.appendChild(script);

    return () => {
      if (stockRef.current) {
        stockRef.current.innerHTML = "";
      }
    };
  }, [scriptConfig]);

  return (
    <div className="h-96">
      <div
        className="tradingview-widget-container overflow-hidden h-fit flex-1 flex-grow "
        ref={stockRef}
      ></div>
    </div>
  );
});

ChartSymbol.displayName = "ChartSymbol";

export default ChartSymbol;
