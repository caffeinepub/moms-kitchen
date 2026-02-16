import { useContext } from 'react';
import { CartContext } from './CartProvider';
import type { MenuItem } from '../../backend';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  const { items, dispatch } = context;

  const addItem = (menuItem: MenuItem) => {
    // Defensive check: prevent adding unavailable items
    if (!menuItem.available) {
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: menuItem });
  };

  const removeItem = (id: bigint) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: bigint, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.menuItem.price) * item.quantity,
    0
  );

  const getLineTotal = (price: bigint, quantity: number) => {
    return Number(price) * quantity;
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    getLineTotal,
  };
}
