import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    price: bigint;
}
export type Time = bigint;
export interface Order {
    id: bigint;
    status: OrderStatus;
    user: Principal;
    timestamp: Time;
    items: Array<OrderItem>;
    totalPrice: bigint;
}
export interface OrderItem {
    quantity: bigint;
    menuItemId: bigint;
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    outForDelivery = "outForDelivery",
    inPreparation = "inPreparation",
    delivered = "delivered"
}
export interface backendInterface {
    createMenuItem(name: string, description: string, price: bigint, imageUrl: string): Promise<MenuItem>;
    getMenu(): Promise<Array<MenuItem>>;
    getOrderHistory(): Promise<Array<Order>>;
    getOrderStatus(orderId: bigint): Promise<OrderStatus>;
    placeOrder(items: Array<OrderItem>): Promise<Order>;
    setMenuItemAvailability(menuItemId: bigint, isAvailable: boolean): Promise<void>;
}
