import { useState, useEffect, useCallback } from "react";
import HeroSection from "./chunks/HeroSection";
import FoodCard from "@/components/FoodCard";
import CartDialog from "./chunks/CartDialog";
import FavoriteDialog from "./chunks/FavoriteDialog";
import OrderHistoryDialog from "./chunks/OrderHistoryDialog";
import ProductDetailDialog from "./chunks/ProductDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useDialogContext } from "@/contexts/DialogContext";
import { useAuth } from "@/hooks/UseAuth";
import { getAllFoods, getAllCategories, addToCart as addToCartAPI, addToFavorite as addToFavoriteAPI, getCart, getFavorites } from "@/api/user";
import { getMyOrders } from "@/api/delivery";
import type { GetFoodDTO, CategoryDTO, GetCartDTO, GetFavoriteDTO } from "@/api/user/types";

const Home = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [foods, setFoods] = useState<GetFoodDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [cartItems, setCartItems] = useState<GetCartDTO[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<GetFavoriteDTO[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { showCartDialog, setShowCartDialog, showFavoriteDialog, setShowFavoriteDialog, showOrderHistoryDialog, setShowOrderHistoryDialog } = useDialogContext();

  // Use real API for order history
  const { data: ordersResponse, refetch: refetchOrders } = getMyOrders.useQuery({
    enabled: !!user && user.role === 'user',
  });

  const orderHistory = ordersResponse?.data || [];

  const handleRefreshOrders = async () => {
    await refetchOrders();
  };

  const fetchFoods = useCallback(async () => {
    setLoadingFoods(true);
    try {
      const response = await getAllFoods({ page: 1, pageSize: 100 });

      
      if (response && response.data) {
        // Check if data is an array or needs to be extracted
        const foodsData = Array.isArray(response.data) ? response.data : [];

        setFoods(foodsData);
      } else {
        console.warn('No foods data in response');
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast.error('Failed to load foods');
    } finally {
      setLoadingFoods(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await getAllCategories();

      
      if (response && response.data) {
        const categoriesData = Array.isArray(response.data) ? response.data : [];

        setCategories(categoriesData);
      } else {
        console.warn('No categories data in response');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    // Only fetch if user is logged in with 'user' role
    if (!user || user.role !== 'user') {
  return;
    }
    
    try {
      const response = await getCart();
      
      if (response && response.data) {
        const cartData = Array.isArray(response.data) ? response.data : [];
        setCartItems(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [user]);

  const fetchFavorites = useCallback(async () => {
    // Only fetch if user is logged in with 'user' role
    if (!user || user.role !== 'user') {
 return;
    }
    
    try {
      const response = await getFavorites();
      
      if (response && response.data) {
        const favoritesData = Array.isArray(response.data) ? response.data : [];
        setFavoriteItems(favoritesData);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [user]);

  // Fetch foods and categories only once on mount
  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, [fetchFoods, fetchCategories]);

  // Fetch cart and favorites only when user changes
  useEffect(() => {
    fetchCart();
    fetchFavorites();
  }, [fetchCart, fetchFavorites]);

  const filteredFoods = foods.filter((food) => {
    const matchesCategory = !selectedCategory || food.catName === selectedCategory;
    const matchesSearch = food.name?.toLowerCase().includes(searchQuery.toLowerCase()) || food.foodDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUpdateCartQuantity = (foodId: string, quantity: number) => {
    setCartItems(cartItems.map((item) => item.foodId === foodId ? { ...item, quantity } : item));
  };

  const handleRemoveCartItem = (foodId: string) => {
    setCartItems(cartItems.filter((item) => item.foodId !== foodId));
    toast.success("Item removed from cart");
  };

  const handleProceedToOrder = () => {
    setShowCartDialog(false);
    toast.info("Order feature coming soon!");
  };

  const handleRemoveFavorite = (foodId: string) => {
    setFavoriteItems(favoriteItems.filter((item) => item.foodId !== foodId));
    toast.success("Removed from favorites");
  };

  const handleAddToCartFromFavorite = async (foodId: string) => {
    try {
      await addToCartAPI({ foodId, quantity: 1, topics: [] });
      await fetchCart();
      toast.success("Added to cart!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add to cart");
    }
  };

  const handleReorder = async (orderId: string) => {
    try {
      const order = orderHistory.find((o) => o.orderId === orderId);
      if (order && order.cartDTOs) {
        // Add all items from the order back to cart
        for (const item of order.cartDTOs) {
          if (item.foodId) {
            await addToCartAPI({ 
              foodId: item.foodId, 
              quantity: item.quantity || 1, 
              topics: item.topics?.map(t => ({ topicId: t.topicId, topicName: t.topicName })) || [] 
            });
          }
        }
        await fetchCart();
        toast.success("Items added to cart!");
        setShowOrderHistoryDialog(false);
      }
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error("Failed to reorder items");
    }
  };

  const handleAddToCart = async (foodId: string) => {
    try {
      await addToCartAPI({ foodId, quantity: 1, topics: [] });
      await fetchCart();
      toast.success("Added to cart!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add to cart");
    }
  };

  const handleToggleFavorite = async (foodId: string) => {
    const isFavorite = favoriteItems.some((item) => item.foodId === foodId);
    try {
      if (isFavorite) {
        setFavoriteItems(favoriteItems.filter((item) => item.foodId !== foodId));
        toast.success("Removed from favorites");
      } else {
        await addToFavoriteAPI(foodId);
        await fetchFavorites();
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update favorites");
    }
  };

  const handleShowProductDetail = (foodId: string) => {
    setSelectedFoodId(foodId);
    setShowProductDetail(true);
  };

  return (
    <>
      <div className="p-9" style={{ background: 'linear-gradient(120deg, #fffbe6 0%, #fbbf24 100%)' }}>
        <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <section className="py-4 bg-muted/30 w-full rounded-2xl border-b">
          <div className="container">
            <div className="flex gap-3 ml-2 overflow-x-auto scrollbar-hide pb-2">
              <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => setSelectedCategory(null)} className={selectedCategory === null ? "gradient-primary" : "text-black"} disabled={loadingCategories}>All</Button>
              {loadingCategories ? (
                <div className="flex gap-3">{[...Array(5)].map((_, i) => (<Skeleton key={i} className="h-10 w-24" />))}</div>
              ) : (
                categories.map((category) => (<Button key={category.catName} variant={selectedCategory === category.catName ? "default" : "outline"} onClick={() => setSelectedCategory(category.catName || null)} className={selectedCategory === category.catName ? "gradient-primary" : "text-black"}>{category.catName}</Button>))
              )}
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">{selectedCategory || "All Foods"}</h2>
              <Badge variant="secondary" className="text-sm">{filteredFoods.length} items</Badge>
            </div>
            {loadingFoods ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{[...Array(8)].map((_, i) => (<div key={i} className="space-y-4"><Skeleton className="h-48 w-full rounded-lg" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>))}</div>
            ) : filteredFoods.length === 0 ? (
              <div className="text-center py-12"><p className="text-muted-foreground text-lg">No items found. Try a different search or category.</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFoods.map((food) => (<FoodCard key={food.foodId} food={food} onAddToCart={() => handleAddToCart(food.foodId!)} onToggleFavorite={() => handleToggleFavorite(food.foodId!)} isFavorite={favoriteItems.some((item) => item.foodId === food.foodId)} onClick={() => handleShowProductDetail(food.foodId!)} />))}
              </div>
            )}
          </div>
        </section>
      </div>
      {selectedFoodId && (<ProductDetailDialog open={showProductDetail} onOpenChange={setShowProductDetail} foodId={selectedFoodId} onAddToCart={handleAddToCart} onAddToFavorite={handleToggleFavorite} />)}
      <CartDialog open={showCartDialog} onOpenChange={setShowCartDialog} cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveCartItem} onProceedToOrder={handleProceedToOrder} />
      <FavoriteDialog open={showFavoriteDialog} onOpenChange={setShowFavoriteDialog} favoriteItems={favoriteItems} onRemoveFavorite={handleRemoveFavorite} onAddToCart={handleAddToCartFromFavorite} />
      <OrderHistoryDialog open={showOrderHistoryDialog} onOpenChange={setShowOrderHistoryDialog} orders={orderHistory} onReorder={handleReorder} onRefresh={handleRefreshOrders} />
    </>
  );
};

export default Home;
