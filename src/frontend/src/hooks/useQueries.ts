import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MenuItem, Order, OrderItem, OrderStatus } from '../backend';

export function useGetMenu() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenu();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Order, Error, OrderItem[]>({
    mutationFn: async (items: OrderItem[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.placeOrder(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrderStatus(orderId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<OrderStatus>({
    queryKey: ['order-status', orderId?.toString()],
    queryFn: async () => {
      if (!actor || !orderId) throw new Error('Invalid order ID');
      return actor.getOrderStatus(orderId);
    },
    enabled: !!actor && !isFetching && orderId !== null,
    retry: false,
  });
}

export function useGetOrderHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<MenuItem, Error, { name: string; description: string; price: bigint; imageUrl: string }>({
    mutationFn: async ({ name, description, price, imageUrl }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createMenuItem(name, description, price, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
}

export function useSetMenuItemAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { menuItemId: bigint; isAvailable: boolean }>({
    mutationFn: async ({ menuItemId, isAvailable }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setMenuItemAvailability(menuItemId, isAvailable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
}
