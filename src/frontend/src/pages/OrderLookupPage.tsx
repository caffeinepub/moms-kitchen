import { useState } from 'react';
import { useGetOrderStatus, useGetOrderHistory } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Package, AlertCircle, RefreshCw } from 'lucide-react';
import {
  normalizeOrderStatus,
  getOrderStatusLabel,
  getOrderStatusMessage,
  getOrderStatusVariant,
} from '../utils/orderStatus';

export default function OrderLookupPage() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searchedOrderId, setSearchedOrderId] = useState<bigint | null>(null);

  const { data: orders } = useGetOrderHistory();
  const { data: status, isLoading, error, refetch } = useGetOrderStatus(searchedOrderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = BigInt(orderIdInput);
      setSearchedOrderId(id);
    } catch {
      setSearchedOrderId(null);
    }
  };

  const order = orders?.find((o) => o.id === searchedOrderId);

  const isConnectionError = error && error.message?.includes('Actor not initialized');
  const isOrderNotFound = error && !isConnectionError;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
        <p className="text-muted-foreground">Enter your order ID to check its status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <div className="flex gap-2">
                <Input
                  id="orderId"
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="Enter your order ID"
                  className="flex-1"
                />
                <Button type="submit" disabled={!orderIdInput.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading && searchedOrderId && (
        <Card>
          <CardContent className="py-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Loading order details...</p>
          </CardContent>
        </Card>
      )}

      {isConnectionError && searchedOrderId && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>Unable to fetch order status. Please check your connection.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isOrderNotFound && searchedOrderId && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Order not found. Please check your order ID and try again.
          </AlertDescription>
        </Alert>
      )}

      {status && order && searchedOrderId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order #{searchedOrderId.toString()}</CardTitle>
              <Badge variant={getOrderStatusVariant(status)}>
                {getOrderStatusLabel(status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>{getOrderStatusMessage(status)}</AlertDescription>
            </Alert>

            <div>
              <h3 className="font-semibold mb-3">Order Details</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Item #{item.menuItemId.toString()} × {item.quantity.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${(Number(order.totalPrice) / 100).toFixed(2)}</span>
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p>Order placed: {new Date(Number(order.timestamp) / 1000000).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {searchedOrderId === null && orderIdInput && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please enter a valid order ID (numbers only).</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
