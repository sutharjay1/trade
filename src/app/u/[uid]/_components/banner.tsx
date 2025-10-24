"use client";

import MotionWrapper from "@/components/global/motion-wrapper";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

const Banner = () => {
  const { theme } = useTheme();
  const tickerTapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tickerTapeScript = document.createElement("script");
    tickerTapeScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    tickerTapeScript.async = true;
    tickerTapeScript.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
        { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "regular",
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: "en",
    });
    tickerTapeRef.current?.appendChild(tickerTapeScript);

    return () => {
      if (tickerTapeRef.current) {
        tickerTapeRef.current.innerHTML = ""; // Cleanup ticker tape widget
      }
    };
  }, []); // Correctly placed dependencies

  return (
    <MotionWrapper isVisible={true} duration={0.99}>
      <div className="tradingview-widget-container" ref={tickerTapeRef}></div>
    </MotionWrapper>
  );
};

export default Banner;
