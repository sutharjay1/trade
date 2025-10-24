"use client";

import React, { memo, useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hook/use-toast";
import { trpc } from "@/trpc/client";
import { useUser } from "@/hook/useUser";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { OrderTags } from "@/lib/trading-utils";

interface QuickTradeProps {
  stockData: {
    tradingSymbol: string;
    exchange: string;
    lastPrice: number;
    dayChangePercentage: number;
  };
  className?: string;
}

// Memoized quantity input component
const QuantityInput = memo<{
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  stockPrice: number;
}>(({ quantity, onQuantityChange, stockPrice }) => {
  const handleQuantityChange = useCallback((value: string) => {
    const numValue = parseInt(value) || 1;
    onQuantityChange(Math.max(1, numValue));
  }, [onQuantityChange]);

  const totalValue = useMemo(() => quantity * stockPrice, [quantity, stockPrice]);

  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantity</Label>
      <Input
        id="quantity"
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => handleQuantityChange(e.target.value)}
        className="text-center text-lg font-semibold"
      />
      <div className="text-sm text-muted-foreground text-center">
        Total: {formatPrice(totalValue)}
      </div>
    </div>
  );
});

QuantityInput.displayName = "QuantityInput";

// Memoized action buttons
const TradeButtons = memo<{
  onBuy: () => void;
  onSell: () => void;
  isBuyLoading: boolean;
  isSellLoading: boolean;
  isConnected: boolean;
  stockPrice: number;
  dayChangePercentage: number;
}>(({ onBuy, onSell, isBuyLoading, isSellLoading, isConnected, stockPrice, dayChangePercentage }) => {
  if (!isConnected) {
    return (
      <div className="text-center py-4">
        <Badge variant="destructive" className="mb-2">
          Connect to Kite to trade
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onBuy}
          disabled={isBuyLoading || isSellLoading}
          className="bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold"
        >
          {isBuyLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <TrendingUp className="h-5 w-5 mr-2" />
          )}
          Buy
        </Button>
        <Button
          onClick={onSell}
          disabled={isBuyLoading || isSellLoading}
          variant="destructive"
          className="h-12 text-lg font-semibold"
        >
          {isSellLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <TrendingDown className="h-5 w-5 mr-2" />
          )}
          Sell
        </Button>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold">
          {formatPrice(stockPrice)}
        </div>
        <Badge 
          variant={dayChangePercentage > 0 ? "default" : "destructive"}
          className="mt-1"
        >
          {dayChangePercentage > 0 ? "+" : ""}
          {dayChangePercentage.toFixed(2)}%
        </Badge>
      </div>
    </div>
  );
});

TradeButtons.displayName = "TradeButtons";

// Main quick trade component
const QuickTrade = memo<QuickTradeProps>(({ stockData, className }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Check if user is connected to Kite
  const { data: isConnected, isLoading: isCheckingConnection } = trpc.kite.isConnectedKite.useQuery(
    { id: user?.id?.toString() ?? "" },
    { enabled: !!user?.id }
  );

  // Place order mutation
  const placeOrderMutation = trpc.kite.placeOrder.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Order Placed Successfully",
        description: `Order ID: ${data.order_id}`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Memoized quantity change handler
  const handleQuantityChange = useCallback((newQuantity: number) => {
    setQuantity(newQuantity);
  }, []);

  // Memoized buy handler
  const handleBuy = useCallback(() => {
    if (!user?.id || !isConnected) return;

    const orderData = {
      userId: user.id.toString(),
      tradingsymbol: stockData.tradingSymbol,
      exchange: stockData.exchange,
      transaction_type: "BUY" as const,
      order_type: "MARKET" as const,
      quantity: quantity,
      product: "CNC" as const,
      validity: "DAY" as const,
      market_protection: 2, // 2% market protection
      tag: OrderTags.quickBuy(stockData.tradingSymbol),
    };

    placeOrderMutation.mutate(orderData);
  }, [user?.id, isConnected, stockData, quantity, placeOrderMutation]);

  // Memoized sell handler
  const handleSell = useCallback(() => {
    if (!user?.id || !isConnected) return;

    const orderData = {
      userId: user.id.toString(),
      tradingsymbol: stockData.tradingSymbol,
      exchange: stockData.exchange,
      transaction_type: "SELL" as const,
      order_type: "MARKET" as const,
      quantity: quantity,
      product: "CNC" as const,
      validity: "DAY" as const,
      market_protection: 2, // 2% market protection
      tag: OrderTags.quickSell(stockData.tradingSymbol),
    };

    placeOrderMutation.mutate(orderData);
  }, [user?.id, isConnected, stockData, quantity, placeOrderMutation]);

  // Loading state
  if (isCheckingConnection) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Quick Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Trade</CardTitle>
        <div className="text-sm text-muted-foreground">
          {stockData.tradingSymbol} • {stockData.exchange}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <QuantityInput
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          stockPrice={stockData.lastPrice}
        />
        <TradeButtons
          onBuy={handleBuy}
          onSell={handleSell}
          isBuyLoading={placeOrderMutation.isPending}
          isSellLoading={placeOrderMutation.isPending}
          isConnected={!!isConnected}
          stockPrice={stockData.lastPrice}
          dayChangePercentage={stockData.dayChangePercentage}
        />
      </CardContent>
    </Card>
  );
});

QuickTrade.displayName = "QuickTrade";

export default QuickTrade;
