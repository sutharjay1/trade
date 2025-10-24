"use client";

import React, { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import getUserStockSymbolData from "./_actions/getUserStockSymbolData";
import { Portfolio } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { formatKey, formatPrice } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartSymbol from "./_components/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TradingButtons from "@/components/trading/trading-buttons";
import QuickTrade from "@/components/trading/quick-trade";
import OrderManagement from "@/components/trading/order-management";

type Props = {
  params: { stockSymbol: string };
};

const StockSymbol = ({ params }: Props) => {
  const {
    data: stockSymbol,
    isLoading: isLoadingStockSymbol,
    error: stockSymbolError,
  } = useQuery<Portfolio>(
    ["stockSymbol", params.stockSymbol],
    () => getUserStockSymbolData({ stockSymbol: params.stockSymbol }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const {
    data: predictions,
    isLoading: isLoadingPredictions,
    error: predictionError,
  } = useQuery(
    ["predictions", params.stockSymbol],
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PREDICT_URL}/predict/${params.stockSymbol}`,
      );
      if (!response.ok) throw new Error("Failed to fetch prediction data");
      return response.json();
    },
    {
      enabled: !!stockSymbol,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const {
    data: additionalData,
    isLoading: isLoadingAdditionalData,
    error: additionalDataError,
  } = useQuery(
    ["additionalData", params.stockSymbol],
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PREDICT_URL}/stock-data/${params.stockSymbol}`,
      );
      if (!response.ok)
        throw new Error("Failed to fetch additional stock data");
      return response.json();
    },
    {
      enabled: !!stockSymbol,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );

  const renderPredictionCard = useCallback(
    (title: string, prediction: any, isUp: boolean) => (
      <Card className="mt-4">
        <CardHeader className=" flex  flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <CardTitle></CardTitle>

          <Badge
            size="sm"
            rounded="sm"
            variant={!isUp ? "success" : "destructive"}
            className="text-base "
          >
            {!isUp ? <TrendingUp /> : <TrendingDown />}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Prediction:</strong> {prediction.prediction}
            </div>
            <div>
              <strong>Current Value:</strong>{" "}
              {formatPrice(prediction.currentValue)}
            </div>
            <div>
              <strong>Potential Value:</strong>{" "}
              {formatPrice(prediction.potentialValue)}
            </div>
            <div>
              <strong>Potential Profit/Loss:</strong>{" "}
              {formatPrice(prediction.profitLoss)}
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    [],
  );

  const renderSkeletonCard = useCallback(
    () => (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[100px]" />
        </CardContent>
      </Card>
    ),
    [],
  );

  const renderStockInfo = useCallback(
    () => (
      <Card>
        <CardHeader>
          <CardTitle>
            {stockSymbol?.tradingSymbol || (
              <Skeleton className="h-6 w-[150px]" />
            )}
          </CardTitle>
          <CardDescription>
            {stockSymbol?.exchange || <Skeleton className="h-4 w-[100px]" />}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stockSymbol ? (
            <>
              <div className="text-3xl font-bold mb-2">
                {formatPrice(stockSymbol.lastPrice)}
              </div>
              <div
                className={`text-sm ${stockSymbol.dayChangePercentage > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {stockSymbol.dayChangePercentage > 0 ? (
                  <ArrowUpIcon className="inline" />
                ) : (
                  <ArrowDownIcon className="inline" />
                )}
                {stockSymbol.dayChange.toFixed(2)} (
                {stockSymbol.dayChangePercentage.toFixed(2)}%)
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[80px]" />
            </>
          )}
        </CardContent>
      </Card>
    ),
    [stockSymbol],
  );

  return (
    <Tabs defaultValue="trading">
      <TabsList>
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="predictions">Predictions</TabsTrigger>
      </TabsList>

      <TabsContent value="trading">
        <div className="flex flex-col lg:flex-row gap-4 ">
          <div className="w-full lg:w-1/3">
            {renderStockInfo()}

            {/* Trading Components */}
            {stockSymbol && (
              <div className="mt-4 space-y-4">
                {/* <QuickTrade
                  stockData={{
                    tradingSymbol: stockSymbol.tradingSymbol,
                    exchange: stockSymbol.exchange,
                    lastPrice: stockSymbol.lastPrice,
                    dayChangePercentage: stockSymbol.dayChangePercentage,
                  }}
                /> */}
                <TradingButtons
                  stockData={{
                    tradingSymbol: stockSymbol.tradingSymbol,
                    exchange: stockSymbol.exchange,
                    lastPrice: stockSymbol.lastPrice,
                    dayChangePercentage: stockSymbol.dayChangePercentage,
                  }}
                />
              </div>
            )}

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="performance">
                <AccordionTrigger>Performance</AccordionTrigger>
                <AccordionContent>
                  {isLoadingStockSymbol || isLoadingAdditionalData ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <div>
                          <strong>Open:</strong>
                          {stockSymbol
                            ? formatPrice(stockSymbol.price.toString())
                            : "N/A"}
                        </div>
                        <div>
                          <strong>High:</strong> ₹
                          {stockSymbol
                            ? (stockSymbol.lastPrice + 10).toFixed(2)
                            : "N/A"}
                        </div>
                        <div>
                          <strong>Low:</strong> ₹
                          {stockSymbol
                            ? (stockSymbol.lastPrice - 10).toFixed(2)
                            : "N/A"}
                        </div>
                        <div>
                          <strong>Close:</strong> ₹
                          {stockSymbol
                            ? stockSymbol.closePrice.toFixed(2)
                            : "N/A"}
                        </div>
                        <div>
                          <strong>52 Week High:</strong> ₹
                          {stockSymbol
                            ? (stockSymbol.lastPrice * 1.2).toFixed(2)
                            : "N/A"}
                        </div>
                        <div>
                          <strong>52 Week Low:</strong> ₹
                          {stockSymbol
                            ? (stockSymbol.lastPrice * 0.8).toFixed(2)
                            : "N/A"}
                        </div>
                      </div>

                      {additionalData?.performance &&
                        Object.entries(additionalData.performance).map(
                          ([key, value]) => (
                            <div key={key}>
                              <strong>{key}:</strong> {value as React.ReactNode}
                            </div>
                          ),
                        )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="fundamentals">
                <AccordionTrigger>Fundamentals</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div>
                      <strong>Market Cap:</strong> ₹
                      {stockSymbol
                        ? (
                            stockSymbol.lastPrice * stockSymbol.quantity
                          ).toFixed(2)
                        : "N/A"}{" "}
                      Cr
                    </div>
                    <div>
                      <strong>P/E Ratio:</strong>{" "}
                      {stockSymbol && stockSymbol.pnl !== 0
                        ? (
                            stockSymbol.lastPrice /
                            (stockSymbol.pnl / stockSymbol.quantity)
                          ).toFixed(2)
                        : "N/A"}
                    </div>
                    <div>
                      <strong>EPS (TTM):</strong> ₹
                      {stockSymbol
                        ? (stockSymbol.pnl / stockSymbol.quantity).toFixed(2)
                        : "N/A"}
                    </div>
                    <div>
                      <strong>Dividend Yield:</strong>{" "}
                      {stockSymbol &&
                      stockSymbol.lastPrice * stockSymbol.quantity !== 0
                        ? (
                            (stockSymbol.pnl /
                              (stockSymbol.lastPrice * stockSymbol.quantity)) *
                            100
                          ).toFixed(2)
                        : "N/A"}
                      %
                    </div>
                    {additionalData?.fundamentals &&
                      Object.entries(additionalData.fundamentals).map(
                        ([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {value as React.ReactNode}
                          </div>
                        ),
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="growth">
                <AccordionTrigger>Growth</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {additionalData?.growth &&
                      Object.entries(additionalData.growth).map(
                        ([key, value]) => (
                          <div key={key}>
                            <strong>{formatKey(key)}:</strong>{" "}
                            {value as React.ReactNode}
                          </div>
                        ),
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="w-full lg:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Price Chart</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAdditionalData ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ChartSymbol
                    exchange={stockSymbol?.exchange!}
                    tradingSymbol={stockSymbol?.tradingSymbol!}
                  />
                )}
              </CardContent>
            </Card>

            {/* Order Management */}
            <div className="mt-4">
              <OrderManagement />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="predictions">
        <div className="">
          {isLoadingPredictions ? (
            <Skeleton className="h-12 w-full mt-4" />
          ) : (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPredictions ? (
                    <div className="space-y-4">
                      <Skeleton className="h-[100px] w-full" />
                      <Skeleton className="h-[100px] w-full" />
                      <Skeleton className="h-[100px] w-full" />
                    </div>
                  ) : predictions ? (
                    <div className="space-y-4">
                      {renderPredictionCard(
                        "Next Day Prediction",
                        predictions.nextDay,
                        predictions.prediction,
                      )}
                      {renderPredictionCard(
                        "Next Week Prediction",
                        predictions.nextWeek,
                        predictions.prediction,
                      )}
                      {renderPredictionCard(
                        "Next Month Prediction",
                        predictions.nextMonth,
                        predictions.prediction,
                      )}
                    </div>
                  ) : (
                    <div>No predictions available.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}{" "}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default StockSymbol;
