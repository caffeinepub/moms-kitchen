import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrderHistory } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getOrderStatusLabel,
  getOrderStatusVariant,
} from '../utils/orderStatus';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/confirmation/$orderId' });
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetOrderHistory();

  const order = orders?.find((o) => o.id.toString() === orderId);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <p className="text-muted-foreground">We couldn't find this order.</p>
        <Button onClick={() => navigate({ to: '/menu' })}>Return to Menu</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
        <p className="text-lg text-muted-foreground">
          Thank you for your order. We'll start preparing it right away.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order #{order.id.toString()}</CardTitle>
            <Badge variant={getOrderStatusVariant(order.status)}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
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

      <div className="flex gap-4">
        <Button onClick={() => navigate({ to: '/menu' })} variant="outline" className="flex-1">
          <Home className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
        <Button onClick={() => navigate({ to: '/lookup' })} className="flex-1">
          Track Order
        </Button>
      </div>
    </div>
  );
}
