import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Search, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../features/cart/useCart';

export default function AppHeader() {
  const navigate = useNavigate();
  const { items, totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/moms-kitchen-logo.dim_512x512.png"
              alt="Moms Kitchen"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Moms Kitchen</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Home-cooked comfort food</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/menu">Menu</Link>
            </Button>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link to="/manage-menu">
                <ChefHat className="h-4 w-4 mr-2" />
                Manage Menu
              </Link>
            </Button>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/lookup">
                <Search className="h-4 w-4 mr-2" />
                Track Order
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
