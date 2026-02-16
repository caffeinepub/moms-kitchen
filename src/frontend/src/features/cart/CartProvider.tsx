import { createContext, ReactNode, useReducer, useEffect } from 'react';
import type { MenuItem } from '../../backend';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: bigint }
  | { type: 'UPDATE_QUANTITY'; payload: { id: bigint; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

export interface CartContextType {
  items: CartItem[];
  dispatch: React.Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'moms-kitchen-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.menuItem.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return { items: newItems };
      }
      return { items: [...state.items, { menuItem: action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((item) => item.menuItem.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { items: state.items.filter((item) => item.menuItem.id !== action.payload.id) };
      }
      return {
        items: state.items.map((item) =>
          item.menuItem.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD_CART':
      return { items: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert bigint strings back to bigint
        const items = parsed.map((item: any) => ({
          ...item,
          menuItem: {
            ...item.menuItem,
            id: BigInt(item.menuItem.id),
            price: BigInt(item.menuItem.price),
          },
        }));
        dispatch({ type: 'LOAD_CART', payload: items });
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Convert bigint to string for JSON serialization
      const serializable = state.items.map((item) => ({
        ...item,
        menuItem: {
          ...item.menuItem,
          id: item.menuItem.id.toString(),
          price: item.menuItem.price.toString(),
        },
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }, [state.items]);

  return <CartContext.Provider value={{ items: state.items, dispatch }}>{children}</CartContext.Provider>;
}
