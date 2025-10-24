"use client";

import React, { memo, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/trpc/client";
import { useUser } from "@/hook/useUser";
import { useToast } from "@/hook/use-toast";
import { formatPrice } from "@/lib/utils";
import { 
  X, 
  Edit, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface OrderManagementProps {
  className?: string;
}

// Memoized order status badge component
const OrderStatusBadge = memo<{ status: string }>(({ status }) => {
  const getStatusConfig = useCallback((status: string) => {
    switch (status) {
      case "COMPLETE":
        return { variant: "default" as const, icon: CheckCircle, color: "text-green-600" };
      case "OPEN":
        return { variant: "secondary" as const, icon: Clock, color: "text-blue-600" };
      case "CANCELLED":
        return { variant: "destructive" as const, icon: XCircle, color: "text-red-600" };
      case "REJECTED":
        return { variant: "destructive" as const, icon: AlertCircle, color: "text-red-600" };
      default:
        return { variant: "outline" as const, icon: Clock, color: "text-gray-600" };
    }
  }, []);

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
});

OrderStatusBadge.displayName = "OrderStatusBadge";

// Memoized order row component
const OrderRow = memo<{
  order: any;
  onModify: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onViewHistory: (orderId: string) => void;
  isModifying: boolean;
  isCancelling: boolean;
}>(({ order, onModify, onCancel, onViewHistory, isModifying, isCancelling }) => {
  const isActionable = order.status === "OPEN" || order.status === "PENDING";
  const isBuyOrder = order.transaction_type === "BUY";

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {isBuyOrder ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          {order.tradingsymbol}
        </div>
      </TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>
        {order.order_type === "MARKET" ? "Market" : formatPrice(order.price || 0)}
      </TableCell>
      <TableCell>
        {order.average_price ? formatPrice(order.average_price) : "-"}
      </TableCell>
      <TableCell>
        {order.filled_quantity}/{order.quantity}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {isActionable && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onModify(order.order_id)}
                disabled={isModifying}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancel(order.order_id)}
                disabled={isCancelling}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewHistory(order.order_id)}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

OrderRow.displayName = "OrderRow";

// Main order management component
const OrderManagement = memo<OrderManagementProps>(({ className }) => {
  const { user } = useUser();
  const { toast } = useToast();

  // Fetch orders
  const { 
    data: ordersData, 
    isLoading: isLoadingOrders, 
    refetch: refetchOrders 
  } = trpc.kite.getOrders.useQuery(
    { userId: user?.id?.toString() ?? "" },
    { 
      enabled: !!user?.id,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  // Mutations
  const cancelOrderMutation = trpc.kite.cancelOrder.useMutation({
    onSuccess: () => {
      toast({
        title: "Order Cancelled",
        description: "Order has been cancelled successfully",
        variant: "default",
      });
      refetchOrders();
    },
    onError: (error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const modifyOrderMutation = trpc.kite.modifyOrder.useMutation({
    onSuccess: () => {
      toast({
        title: "Order Modified",
        description: "Order has been modified successfully",
        variant: "default",
      });
      refetchOrders();
    },
    onError: (error) => {
      toast({
        title: "Modification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Memoized handlers
  const handleCancel = useCallback((orderId: string) => {
    if (!user?.id) return;
    cancelOrderMutation.mutate({ userId: user.id.toString(), order_id: orderId });
  }, [user?.id, cancelOrderMutation]);

  const handleModify = useCallback((orderId: string) => {
    // This would open a modal or form for modification
    toast({
      title: "Modify Order",
      description: "Order modification feature coming soon",
      variant: "default",
    });
  }, [toast]);

  const handleViewHistory = useCallback((orderId: string) => {
    // This would show order history
    toast({
      title: "Order History",
      description: "Order history feature coming soon",
      variant: "default",
    });
  }, [toast]);

  // Memoized orders list
  const orders = useMemo(() => {
    if (!ordersData?.orders) return [];
    return ordersData.orders.slice(0, 10); // Show only recent 10 orders
  }, [ordersData?.orders]);

  // Loading state
  if (isLoadingOrders) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <div className="text-sm text-muted-foreground">
          Showing {orders.length} recent orders
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Avg Price</TableHead>
                  <TableHead>Filled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <OrderRow
                    key={order.order_id}
                    order={order}
                    onModify={handleModify}
                    onCancel={handleCancel}
                    onViewHistory={handleViewHistory}
                    isModifying={modifyOrderMutation.isPending}
                    isCancelling={cancelOrderMutation.isPending}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

OrderManagement.displayName = "OrderManagement";

export default OrderManagement;
