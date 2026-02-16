import { OrderStatus } from '../backend';

/**
 * Normalize OrderStatus enum value to a stable string key
 */
export function normalizeOrderStatus(status: OrderStatus | string | unknown): string {
  // Handle enum values
  if (typeof status === 'string') {
    return status;
  }
  
  // Handle object variants (e.g., { pending: null })
  if (typeof status === 'object' && status !== null) {
    const keys = Object.keys(status);
    if (keys.length > 0) {
      return keys[0];
    }
  }
  
  // Fallback for unknown status
  return 'unknown';
}

/**
 * Get human-readable label for order status
 */
export function getOrderStatusLabel(status: OrderStatus | string | unknown): string {
  const normalized = normalizeOrderStatus(status);
  
  const labels: Record<string, string> = {
    pending: 'Pending',
    inPreparation: 'In Preparation',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    unknown: 'Unknown Status',
  };
  
  return labels[normalized] || 'Unknown Status';
}

/**
 * Get status message for order status
 */
export function getOrderStatusMessage(status: OrderStatus | string | unknown): string {
  const normalized = normalizeOrderStatus(status);
  
  const messages: Record<string, string> = {
    pending: 'Your order has been received and is waiting to be prepared.',
    inPreparation: 'Your delicious meal is being prepared with love!',
    outForDelivery: 'Your order is on its way to you!',
    delivered: 'Your order has been delivered. Enjoy your meal!',
    cancelled: 'This order has been cancelled.',
    unknown: 'Order status is currently unavailable.',
  };
  
  return messages[normalized] || 'Order status is currently unavailable.';
}

/**
 * Get badge variant for order status
 */
export function getOrderStatusVariant(
  status: OrderStatus | string | unknown
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const normalized = normalizeOrderStatus(status);
  
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    inPreparation: 'default',
    outForDelivery: 'default',
    delivered: 'default',
    cancelled: 'destructive',
    unknown: 'outline',
  };
  
  return variants[normalized] || 'outline';
}
