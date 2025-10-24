"use client";

import React, { memo, useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hook/use-toast";
import { trpc } from "@/trpc/client";
import { useUser } from "@/hook/useUser";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { OrderTags } from "@/lib/trading-utils";

interface TradingButtonsProps {
  stockData: {
    tradingSymbol: string;
    exchange: string;
    lastPrice: number;
    dayChangePercentage: number;
  };
  className?: string;
}

interface OrderFormData {
  quantity: number;
  orderType: "MARKET" | "LIMIT" | "SL" | "SL-M";
  price?: number;
  triggerPrice?: number;
  product: "CNC" | "NRML" | "MIS" | "MTF";
  validity: "DAY" | "IOC" | "TTL";
  marketProtection: number;
}

const defaultFormData: OrderFormData = {
  quantity: 1,
  orderType: "MARKET",
  product: "CNC",
  validity: "DAY",
  marketProtection: 0,
};

// Memoized form component to prevent unnecessary re-renders
const OrderForm = memo<{
  formData: OrderFormData;
  onFormChange: (data: Partial<OrderFormData>) => void;
  stockPrice: number;
  isLimitOrder: boolean;
  isStopLossOrder: boolean;
}>(({ formData, onFormChange, stockPrice, isLimitOrder, isStopLossOrder }) => {
  const handleInputChange = useCallback(
    (field: keyof OrderFormData, value: string | number) => {
      onFormChange({ [field]: value });
    },
    [onFormChange]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="product">Product</Label>
          <Select
            value={formData.product}
            onValueChange={(value: "CNC" | "NRML" | "MIS" | "MTF") =>
              handleInputChange("product", value)
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CNC">CNC (Cash & Carry)</SelectItem>
              <SelectItem value="NRML">NRML (Normal)</SelectItem>
              <SelectItem value="MIS">MIS (Intraday)</SelectItem>
              <SelectItem value="MTF">MTF (Margin Trading)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="orderType">Order Type</Label>
        <Select
          value={formData.orderType}
          onValueChange={(value: "MARKET" | "LIMIT" | "SL" | "SL-M") =>
            handleInputChange("orderType", value)
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MARKET">Market</SelectItem>
            <SelectItem value="LIMIT">Limit</SelectItem>
            <SelectItem value="SL">Stop Loss</SelectItem>
            <SelectItem value="SL-M">Stop Loss Market</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLimitOrder && (
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.05"
            value={formData.price || ""}
            onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
            placeholder={`Current: ${formatPrice(stockPrice)}`}
            className="mt-1"
          />
        </div>
      )}

      {isStopLossOrder && (
        <div>
          <Label htmlFor="triggerPrice">Trigger Price</Label>
          <Input
            id="triggerPrice"
            type="number"
            step="0.05"
            value={formData.triggerPrice || ""}
            onChange={(e) => handleInputChange("triggerPrice", parseFloat(e.target.value) || 0)}
            placeholder={`Current: ${formatPrice(stockPrice)}`}
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label htmlFor="validity">Validity</Label>
        <Select
          value={formData.validity}
          onValueChange={(value: "DAY" | "IOC" | "TTL") =>
            handleInputChange("validity", value)
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAY">Day</SelectItem>
            <SelectItem value="IOC">IOC (Immediate or Cancel)</SelectItem>
            <SelectItem value="TTL">TTL (Time to Live)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="marketProtection">Market Protection (%)</Label>
        <Input
          id="marketProtection"
          type="number"
          min="-1"
          max="100"
          value={formData.marketProtection}
          onChange={(e) => handleInputChange("marketProtection", parseInt(e.target.value) || 0)}
          placeholder="0 = No protection, -1 = Auto"
          className="mt-1"
        />
      </div>
    </div>
  );
});

OrderForm.displayName = "OrderForm";

// Memoized action buttons to prevent re-renders
const ActionButtons = memo<{
  onBuy: () => void;
  onSell: () => void;
  isBuyLoading: boolean;
  isSellLoading: boolean;
  isConnected: boolean;
}>(({ onBuy, onSell, isBuyLoading, isSellLoading, isConnected }) => {
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
    <div className="grid grid-cols-2 gap-3">
      <Button
        onClick={onBuy}
        disabled={isBuyLoading || isSellLoading}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        {isBuyLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <TrendingUp className="h-4 w-4 mr-2" />
        )}
        Buy
      </Button>
      <Button
        onClick={onSell}
        disabled={isBuyLoading || isSellLoading}
        variant="destructive"
        size="lg"
      >
        {isSellLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <TrendingDown className="h-4 w-4 mr-2" />
        )}
        Sell
      </Button>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

// Main trading buttons component
const TradingButtons = memo<TradingButtonsProps>(({ stockData, className }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<OrderFormData>(defaultFormData);

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

  // Memoized form change handler
  const handleFormChange = useCallback((newData: Partial<OrderFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  // Memoized order type checks
  const isLimitOrder = useMemo(() => formData.orderType === "LIMIT", [formData.orderType]);
  const isStopLossOrder = useMemo(() => formData.orderType === "SL" || formData.orderType === "SL-M", [formData.orderType]);

  // Memoized buy handler
  const handleBuy = useCallback(() => {
    if (!user?.id || !isConnected) return;

    const orderData = {
      userId: user.id.toString(),
      tradingsymbol: stockData.tradingSymbol,
      exchange: stockData.exchange,
      transaction_type: "BUY" as const,
      order_type: formData.orderType,
      quantity: formData.quantity,
      product: formData.product,
      validity: formData.validity,
      ...(isLimitOrder && formData.price && { price: formData.price }),
      ...(isStopLossOrder && formData.triggerPrice && { trigger_price: formData.triggerPrice }),
      market_protection: formData.marketProtection,
      tag: OrderTags.buy(stockData.tradingSymbol),
    };

    placeOrderMutation.mutate(orderData);
  }, [user?.id, isConnected, stockData, formData, isLimitOrder, isStopLossOrder, placeOrderMutation]);

  // Memoized sell handler
  const handleSell = useCallback(() => {
    if (!user?.id || !isConnected) return;

    const orderData = {
      userId: user.id.toString(),
      tradingsymbol: stockData.tradingSymbol,
      exchange: stockData.exchange,
      transaction_type: "SELL" as const,
      order_type: formData.orderType,
      quantity: formData.quantity,
      product: formData.product,
      validity: formData.validity,
      ...(isLimitOrder && formData.price && { price: formData.price }),
      ...(isStopLossOrder && formData.triggerPrice && { trigger_price: formData.triggerPrice }),
      market_protection: formData.marketProtection,
      tag: OrderTags.sell(stockData.tradingSymbol),
    };

    placeOrderMutation.mutate(orderData);
  }, [user?.id, isConnected, stockData, formData, isLimitOrder, isStopLossOrder, placeOrderMutation]);

  // Loading state
  if (isCheckingConnection) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={stockData.dayChangePercentage > 0 ? "default" : "destructive"}>
            {stockData.dayChangePercentage > 0 ? "+" : ""}
            {stockData.dayChangePercentage.toFixed(2)}%
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatPrice(stockData.lastPrice)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <OrderForm
          formData={formData}
          onFormChange={handleFormChange}
          stockPrice={stockData.lastPrice}
          isLimitOrder={isLimitOrder}
          isStopLossOrder={isStopLossOrder}
        />
        <ActionButtons
          onBuy={handleBuy}
          onSell={handleSell}
          isBuyLoading={placeOrderMutation.isPending}
          isSellLoading={placeOrderMutation.isPending}
          isConnected={!!isConnected}
        />
      </CardContent>
    </Card>
  );
});

TradingButtons.displayName = "TradingButtons";

export default TradingButtons;
