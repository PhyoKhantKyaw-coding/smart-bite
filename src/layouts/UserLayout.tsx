import Header from "@/hooks/Header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import { DialogProvider, useDialogContext } from "@/contexts/DialogContext";
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { getCart, getFavorites, addToCart as addToCartAPI } from "@/api/user";
import CartDialog from "@/modules/home/chunks/CartDialog";
import FavoriteDialog from "@/modules/home/chunks/FavoriteDialog";
import OrdersDialog from "@/modules/home/chunks/OrdersDialog";
import type { GetCartDTO, GetFavoriteDTO } from "@/api/user/types";
import { toast } from "sonner";

const UserLayoutContent = () => {
  const { user } = useAuth();
  const { showCartDialog, setShowCartDialog, showFavoriteDialog, setShowFavoriteDialog } = useDialogContext();
  
  const [cartItems, setCartItems] = useState<GetCartDTO[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<GetFavoriteDTO[]>([]);
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'user') return;
    
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
    if (!user || user.role !== 'user') return;
    
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

  const handleCartClick = useCallback(async () => {
    await fetchCart();
    setShowCartDialog(true);
  }, [fetchCart, setShowCartDialog]);

  const handleFavoriteClick = useCallback(async () => {
    await fetchFavorites();
    setShowFavoriteDialog(true);
  }, [fetchFavorites, setShowFavoriteDialog]);

  const handleOrderHistoryClick = useCallback(async () => {
    // Open the new OrdersDialog instead of the old OrderHistoryDialog
    setShowOrdersDialog(true);
  }, []);

  const handleHomeClick = () => {
    setShowCartDialog(false);
    setShowFavoriteDialog(false);
    setShowOrdersDialog(false);
  };

  const handleRemoveCartItem = (foodId: string) => {
    setCartItems(cartItems.filter((item) => item.foodId !== foodId));
    toast.success("Item removed from cart");
  };

  const handleProceedToOrder = () => {
    setShowCartDialog(false);
    toast.info("Order placed successfully!");
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onCartClick={handleCartClick}
        onFavoriteClick={handleFavoriteClick}
        onOrderHistoryClick={handleOrderHistoryClick}
        onHomeClick={handleHomeClick}
      />
      <main className="flex-1 w-full">
        <div className="">
          <Outlet />
        </div>
      </main>
      <Footer />
      
      {/* Dialogs - Available on all pages */}
      <CartDialog 
        open={showCartDialog} 
        onOpenChange={setShowCartDialog} 
        cartItems={cartItems} 
        onRemoveItem={handleRemoveCartItem} 
        onProceedToOrder={handleProceedToOrder} 
        onRefreshCart={fetchCart} 
      />
      
      <FavoriteDialog 
        open={showFavoriteDialog} 
        onOpenChange={setShowFavoriteDialog} 
        favoriteItems={favoriteItems} 
        onRemoveFavorite={handleRemoveFavorite} 
        onAddToCart={handleAddToCartFromFavorite} 
      />
      


      <OrdersDialog 
        open={showOrdersDialog} 
        onOpenChange={setShowOrdersDialog} 
      />
    </div>
  );
};

const UserLayout = () => {
  return (
    <DialogProvider>
      <UserLayoutContent />
    </DialogProvider>
  );
};

export default UserLayout;
