import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import AppLayout from './components/AppLayout';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderLookupPage from './pages/OrderLookupPage';
import MenuManagementPage from './pages/MenuManagementPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MenuPage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation/$orderId',
  component: OrderConfirmationPage,
});

const lookupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lookup',
  component: OrderLookupPage,
});

const manageMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manage-menu',
  component: MenuManagementPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  cartRoute,
  checkoutRoute,
  confirmationRoute,
  lookupRoute,
  manageMenuRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
