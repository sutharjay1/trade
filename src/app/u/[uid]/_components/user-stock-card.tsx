"use client";

import MotionWrapper from "@/components/global/motion-wrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { P } from "@/components/ui/typography";
import { useModal } from "@/hook/use-modal";
import { formatPrice, stockGraphColor } from "@/lib/utils";
import { Portfolio } from "@prisma/client";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

type Props = {
  stock: Portfolio | any;
};

const UserStockCard = ({ stock }: Props) => {
  const { theme } = useTheme();

  const userStocksRef = useRef<HTMLDivElement>(null);
  const [selectedStock, setSelectedStock] = useState<Portfolio | null>();
  const [relatedCompanyData, setRelatedCompanyData] = useState<any>(null);

  useEffect(() => {
    const userStocksScript = document.createElement("script");
    userStocksScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    userStocksScript.async = true;
    userStocksScript.innerHTML = JSON.stringify({
      symbol: `${stock.exchange}:${stock.tradingSymbol}`,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "12M",
      colorTheme: theme === "dark" ? "dark" : "light",
      trendLineColor: stockGraphColor(stock.tradingSymbol.length.toString()),
      underLineColor: stockGraphColor(stock.tradingSymbol.length.toString()),
      underLineBottomColor: "rgba(109, 158, 235, 0)",
      isTransparent: false,
      autosize: true,
      largeChartUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/chart/${stock.tradingSymbol}`,
      chartOnly: true,
      noTimeScale: true,
    });
    userStocksRef.current?.appendChild(userStocksScript);

    return () => {
      if (userStocksRef.current) {
        userStocksRef.current.innerHTML = "";
      }
    };
  }, [stock, theme]);

  const { isOpen, modalType, onClose, onOpen, stockData, updateStockData } =
    useModal();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      <MotionWrapper isVisible={true} duration={0.99} className="w-full">
        <Link href={`/stock/${stock.tradingSymbol}`}>
          <Card className="shadow-lg transition-transform transform ">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                {stock.tradingSymbol}
              </CardTitle>
              <span className="text-sm text-gray-500">{stock.exchange}</span>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <P className="text-sm font-semibold">Opening Price</P>
                  <P className="text-lg text-green-600">
                    {formatPrice(stock.lastPrice.toFixed(2))}
                  </P>
                </div>
                <div>
                  <P className="text-sm font-semibold">Closing Price</P>
                  <P className="text-lg text-red-600">
                    {formatPrice(stock.closePrice.toFixed(2))}
                  </P>
                </div>
                <div>
                  <P className="text-sm font-semibold">Average Price</P>
                  <P className="text-lg">
                    {formatPrice(stock.averagePrice.toFixed(2))}
                  </P>
                </div>
                <div>
                  <P className="text-sm font-semibold">Last Price</P>
                  <P className="text-lg">
                    {formatPrice(stock.lastPrice.toFixed(2))}
                  </P>
                </div>
                <div>
                  <P className="text-sm font-semibold">P&L</P>
                  <P
                    className={`text-lg ${stock.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatPrice(stock.pnl.toFixed(2))}
                  </P>
                </div>
                <div>
                  <P className="text-sm font-semibold">Day Change %</P>
                  <div className="flex items-center justify-start gap-2">
                    <Badge
                      size="sm"
                      rounded="sm"
                      variant={
                        stock.dayChangePercentage >= 0
                          ? "success"
                          : "destructive"
                      }
                      className="text-base "
                    >
                      {stock.dayChangePercentage.toFixed(2)}%
                    </Badge>
                    {stock.dayChangePercentage >= 0 ? (
                      <TrendingUp />
                    ) : (
                      <TrendingDown />
                    )}
                  </div>
                </div>
              </div>
              <div
                className="tradingview-widget-container overflow-hidden"
                ref={userStocksRef}
              ></div>
              {relatedCompanyData && (
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h3 className="text-sm font-semibold">Related Company:</h3>
                  <P>{relatedCompanyData.name}</P>
                  <P>{relatedCompanyData.description}</P>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      </MotionWrapper>
    </>
  );
};

export default UserStockCard;
