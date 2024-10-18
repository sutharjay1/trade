"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWindowSize } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

type Props = {
  params: {
    stock: string;
  };
};

const Chart = ({ params }: Props) => {
  const { stock } = params;
  const { theme } = useTheme();

  const searchParam = useSearchParams();

  const stockParam = searchParam.get("tvwidgetsymbol");

  console.log("stockParam", stockParam);

  const stockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(
      // {
      //     "autosize": false,
      //     "symbol": stockParam ? stockParam : `BSE:${stock}`,
      //     "timezone": "Etc/UTC",
      //     "theme": theme === "dark" ? "dark" : "light",
      //     "style": "1",
      //     "locale": "en",
      //     "withdateranges": true,
      //     "range": "YTD",
      //     "hide_side_toolbar": false,
      //     "allow_symbol_change": true,
      //     "save_image": false,
      //     "details": true,
      //     "calendar": false,
      //     "support_host": "https://www.tradingview.com"
      // }

      {
        autosize: true,
        width: getWindowSize()[0],
        height: getWindowSize()[1] - 50,
        symbol: stockParam ? stockParam : `BSE:${stock}`,
        timezone: "Etc/UTC",
        theme: theme === "dark" ? "dark" : "light",
        style: "1",
        locale: "en",
        withdateranges: true,
        range: "YTD",
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        details: true,
        calendar: false,
        support_host: "https://www.tradingview.com",
      },
    );
    stockRef?.current?.appendChild(script);

    return () => {
      if (stockRef.current) {
        stockRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow h-full">
        <div
          className="tradingview-widget-container overflow-hidden h-screen flex-1 flex-grow "
          ref={stockRef}
        ></div>
      </div>
    </div>
  );
};

export default Chart;
