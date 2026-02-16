import { useGetMenu } from '../hooks/useQueries';
import { useCart } from '../features/cart/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function MenuPage() {
  const { data: menu, isLoading, error, refetch } = useGetMenu();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    if (!item.available) {
      toast.error('This item is currently unavailable.');
      return;
    }
    addItem(item);
    toast.success(`Added ${item.name} to cart`);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading menu</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>We couldn't load the menu. Please try again.</span>
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
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <img
          src="/assets/generated/moms-kitchen-hero.dim_1600x600.png"
          alt="Moms Kitchen"
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 md:p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Moms Kitchen</h1>
            <p className="text-lg md:text-xl opacity-90">Delicious home-cooked meals, made with love</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Our Menu</h2>
          <p className="text-muted-foreground">Fresh, homemade dishes prepared daily</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : menu && menu.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
              <Card 
                key={item.id.toString()} 
                className={`flex flex-col hover:shadow-lg transition-shadow ${!item.available ? 'opacity-60' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    {!item.available && (
                      <Badge variant="secondary" className="shrink-0">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-bold text-primary">
                    ${(Number(item.price) / 100).toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleAddToCart(item)} 
                    className="w-full" 
                    size="lg"
                    disabled={!item.available}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {item.available ? 'Add to Cart' : 'Unavailable'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No items available</AlertTitle>
            <AlertDescription>
              Our menu is being updated. Please check back soon!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
