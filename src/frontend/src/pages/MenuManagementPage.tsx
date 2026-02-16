import { useState } from 'react';
import { useGetMenu, useCreateMenuItem, useSetMenuItemAvailability } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MenuManagementPage() {
  const { data: menu, isLoading, error } = useGetMenu();
  const createMenuItem = useCreateMenuItem();
  const setAvailability = useSetMenuItemAvailability();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const priceInCents = Math.round(parseFloat(formData.price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error('Please enter a valid price.');
      return;
    }

    try {
      await createMenuItem.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: BigInt(priceInCents),
        imageUrl: formData.imageUrl || 'https://example.com/images/default.jpg',
      });
      toast.success(`${formData.name} has been added to the menu!`);
      setFormData({ name: '', description: '', price: '', imageUrl: '' });
    } catch (err) {
      toast.error('Failed to create menu item. Please try again.');
    }
  };

  const handleToggleAvailability = async (menuItemId: bigint, currentAvailability: boolean) => {
    try {
      await setAvailability.mutateAsync({
        menuItemId,
        isAvailable: !currentAvailability,
      });
      toast.success(`Item availability updated!`);
    } catch (err) {
      toast.error('Failed to update availability. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Menu</h1>
        <p className="text-muted-foreground">Add new dishes and manage availability</p>
      </div>

      {/* Create New Dish Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Dish</CardTitle>
          <CardDescription>Create a new menu item for your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dish Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Spaghetti Bolognese"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your delicious dish..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (in dollars) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 12.50"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={createMenuItem.isPending}>
              {createMenuItem.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dish
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Menu Items */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Current Menu Items</h2>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading menu</AlertTitle>
            <AlertDescription>
              We couldn't load the menu items. Please refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.map((item) => (
              <Card key={item.id.toString()}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-primary">
                    ${(Number(item.price) / 100).toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`available-${item.id}`} className="text-sm font-medium">
                      Available
                    </Label>
                    <Switch
                      id={`available-${item.id}`}
                      checked={item.available}
                      onCheckedChange={() => handleToggleAvailability(item.id, item.available)}
                      disabled={setAvailability.isPending}
                    />
                  </div>
                  {setAvailability.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No menu items</AlertTitle>
            <AlertDescription>
              Add your first dish using the form above!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
