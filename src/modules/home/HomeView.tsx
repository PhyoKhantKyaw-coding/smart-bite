import { useState } from "react";
import HeroSection from "./chunks/HeroSection";
import FoodCard from "@/components/FoodCard";
import CartDialog from "./chunks/CartDialog";
import FavoriteDialog from "./chunks/FavoriteDialog";
import OrderHistoryDialog from "./chunks/OrderHistoryDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  mockCategories,
  mockFoods,
  mockCartItems,
  mockFavoriteItems,
  mockOrderHistory,
} from "@/lib/mockData";
import { toast } from "sonner";
import { useDialogContext } from "@/contexts/DialogContext";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get dialog state from context
  const { 
    showCartDialog, 
    setShowCartDialog, 
    showFavoriteDialog, 
    setShowFavoriteDialog, 
    showOrderHistoryDialog, 
    setShowOrderHistoryDialog 
  } = useDialogContext();

  // Data states
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [favoriteItems, setFavoriteItems] = useState(mockFavoriteItems);

  const filteredFoods = mockFoods.filter((food) => {
    const matchesCategory = !selectedCategory || food.catId === selectedCategory;
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.foodDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && food.activeFlag;
  });

  // Cart handlers
  const handleUpdateCartQuantity = (foodId: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.foodId === foodId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (foodId: string) => {
    setCartItems(cartItems.filter((item) => item.foodId !== foodId));
    toast.success("Item removed from cart");
  };

  const handleProceedToOrder = () => {
    setShowCartDialog(false);
    toast.info("Order feature coming soon!");
  };

  // Favorite handlers
  const handleRemoveFavorite = (foodId: string) => {
    setFavoriteItems(favoriteItems.filter((item) => item.foodId !== foodId));
    toast.success("Removed from favorites");
  };

  const handleAddToCartFromFavorite = (foodId: string) => {
    const favoriteItem = favoriteItems.find((item) => item.foodId === foodId);
    if (favoriteItem) {
      const cartItem = {
        ...favoriteItem,
        quantity: 1,
        topics: [],
      };
      setCartItems([...cartItems, cartItem]);
      toast.success("Added to cart!");
    }
  };

  const handleReorder = (orderId: string) => {
    const order = mockOrderHistory.find((o) => o.orderId === orderId);
    if (order) {
      const reorderItems = order.cartDTOs.map((item) => ({
        foodId: item.name,
        name: item.name,
        eachPrice: item.eachPrice,
        cookingTime: item.cookingTime,
        foodImage: item.foodImage,
        foodDescription: item.foodDescription,
        catName: item.catName,
        quantity: item.quantity,
        topics: item.topics,
      }));
      setCartItems([...cartItems, ...reorderItems]);
      toast.success("Items added to cart!");
      setShowOrderHistoryDialog(false);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Categories */}
        <section className="py-4 bg-muted/30 w-full rounded-2xl border-b">
          <div className="container">
            <div className="flex gap-3 ml-2 overflow-x-auto scrollbar-hide pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "gradient-primary" : "text-black"}
              >
                All
              </Button>
              {mockCategories
                .filter((c) => c.activeFlag)
                .map((category) => (
                  <Button
                    key={category.catId}
                    variant={selectedCategory === category.catId ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.catId)}
                    className={
                      selectedCategory === category.catId ? "gradient-primary" : "text-black"
                    }
                  >
                    {category.catName}
                  </Button>
                ))}
            </div>
          </div>
        </section>

        {/* Food Grid */}
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {selectedCategory
                  ? mockCategories.find((c) => c.catId === selectedCategory)?.catName
                  : "All Foods"}
              </h2>
              <Badge variant="secondary" className="text-sm">
                {filteredFoods.length} items
              </Badge>
            </div>
            {filteredFoods.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No items found. Try a different search or category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFoods.map((food) => (
                  <FoodCard
                    key={food.foodId}
                    food={food}
                    onAddToCart={() => {
                      const cartItem = {
                        foodId: food.foodId,
                        name: food.name,
                        eachPrice: food.eachPrice,
                        cookingTime: food.cookingTime,
                        foodImage: food.foodImage,
                        foodDescription: food.foodDescription,
                        catName: food.catName,
                        quantity: 1,
                        topics: [],
                      };
                      setCartItems([...cartItems, cartItem]);
                      toast.success("Added to cart!");
                    }}
                    onToggleFavorite={() => {
                      const isFavorite = favoriteItems.some((item) => item.foodId === food.foodId);
                      if (isFavorite) {
                        setFavoriteItems(favoriteItems.filter((item) => item.foodId !== food.foodId));
                        toast.success("Removed from favorites");
                      } else {
                        const favoriteItem = {
                          foodId: food.foodId,
                          name: food.name,
                          eachPrice: food.eachPrice,
                          cookingTime: food.cookingTime,
                          foodImage: food.foodImage,
                          foodDescription: food.foodDescription,
                          catName: food.catName,
                          quantity: 1,
                          topics: [],
                        };
                        setFavoriteItems([...favoriteItems, favoriteItem]);
                        toast.success("Added to favorites!");
                      }
                    }}
                    isFavorite={favoriteItems.some((item) => item.foodId === food.foodId)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Cart Dialog */}
      <CartDialog
        open={showCartDialog}
        onOpenChange={setShowCartDialog}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToOrder={handleProceedToOrder}
      />

      {/* Favorite Dialog */}
      <FavoriteDialog
        open={showFavoriteDialog}
        onOpenChange={setShowFavoriteDialog}
        favoriteItems={favoriteItems}
        onRemoveFavorite={handleRemoveFavorite}
        onAddToCart={handleAddToCartFromFavorite}
      />

      {/* Order History Dialog */}
      <OrderHistoryDialog
        open={showOrderHistoryDialog}
        onOpenChange={setShowOrderHistoryDialog}
        orders={mockOrderHistory}
        onReorder={handleReorder}
      />
    </>
  );
};

export default Home;
