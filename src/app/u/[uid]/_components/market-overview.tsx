"use client";

import MotionWrapper from "@/components/global/motion-wrapper";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

const MarketOverview = () => {
  const { theme } = useTheme();

  const marketOverviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marketOverviewScript = document.createElement("script");
    marketOverviewScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    marketOverviewScript.async = true;
    marketOverviewScript.innerHTML = JSON.stringify({
      colorTheme: theme === "dark" ? "dark" : "light",
      dateRange: "3M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "100%",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(42, 46, 57, 0)",
      scaleFontColor: "rgba(209, 212, 220, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      tabs: [
        {
          title: "Indices",
          symbols: [
            {
              s: "BSE:SENSEX",
            },
            {
              s: "BSE:NIFTY",
            },
            {
              s: "BSE:BANKNIFTY",
            },
            {
              s: "BSE:NIFTY_MID_SELECT",
            },
            {
              s: "BSE:CNXFINANCE",
            },
          ],
          originalTitle: "Indices",
        },
        {
          title: "Futures",
          symbols: [
            {
              s: "CME_MINI:ES1!",
              d: "S&P 500",
            },
            {
              s: "CME:6E1!",
              d: "Euro",
            },
            {
              s: "COMEX:GC1!",
              d: "Gold",
            },
            {
              s: "NYMEX:CL1!",
              d: "WTI Crude Oil",
            },
            {
              s: "NYMEX:NG1!",
              d: "Gas",
            },
            {
              s: "CBOT:ZC1!",
              d: "Corn",
            },
          ],
          originalTitle: "Futures",
        },
        {
          title: "Bonds",
          symbols: [
            {
              s: "CBOT:ZB1!",
              d: "T-Bond",
            },
            {
              s: "CBOT:UB1!",
              d: "Ultra T-Bond",
            },
            {
              s: "EUREX:FGBL1!",
              d: "Euro Bund",
            },
            {
              s: "EUREX:FBTP1!",
              d: "Euro BTP",
            },
            {
              s: "EUREX:FGBM1!",
              d: "Euro BOBL",
            },
          ],
          originalTitle: "Bonds",
        },
        {
          title: "Forex",
          symbols: [
            {
              s: "FX:EURUSD",
              d: "EUR to USD",
            },
            {
              s: "FX:GBPUSD",
              d: "GBP to USD",
            },
            {
              s: "FX:USDJPY",
              d: "USD to JPY",
            },
            {
              s: "FX:USDCHF",
              d: "USD to CHF",
            },
            {
              s: "FX:AUDUSD",
              d: "AUD to USD",
            },
            {
              s: "FX:USDCAD",
              d: "USD to CAD",
            },
          ],
          originalTitle: "Forex",
        },
      ],
    });
    marketOverviewRef.current?.appendChild(marketOverviewScript);

    return () => {
      if (marketOverviewRef.current) {
        marketOverviewRef.current.innerHTML = ""; // Cleanup relative volume widget
      }
    };
  }, []);

  return (
    <MotionWrapper isVisible={true} duration={0.99}>
      <div className="tradingview-widget-container" ref={marketOverviewRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </MotionWrapper>
  );
};

export default MarketOverview;

// <!-- TradingView Widget BEGIN -->
// <div class="tradingview-widget-container">
//   <div class="tradingview-widget-container__widget"></div>
//   <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>
//   <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>
//   {
//   "c
