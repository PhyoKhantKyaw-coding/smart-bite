import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Trash2, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
import type { GetFavoriteDTO } from "@/api/user/types";
import { getFoodImageUrl } from "@/lib/imageUtils";

interface FavoriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favoriteItems: GetFavoriteDTO[];
  onRemoveFavorite?: (foodId: string) => void;
  onAddToCart?: (foodId: string) => void;
}

const FavoriteDialog: React.FC<FavoriteDialogProps> = ({
  open,
  onOpenChange,
  favoriteItems,
  onRemoveFavorite,
  onAddToCart,
}) => {
  const handleAddToCart = (foodId: string, name: string) => {
    onAddToCart?.(foodId);
    toast.success(`${name} added to cart!`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => onOpenChange(false)}>
      <div className="relative w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-red-200 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-red-50/50 via-white to-pink-50/50 rounded-3xl"></div>
        
        <div className="relative h-full overflow-y-auto p-6 md:p-8">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-red-500 to-pink-500 shadow-lg mb-4 animate-pulse">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-br from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
              My Favorites
            </h1>
            <p className="text-base text-gray-600">
              Your handpicked collection of delicious dishes
            </p>
          </div>

          <div className="space-y-6">
            {favoriteItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-linear-to-br from-red-100 to-pink-200 mb-6 shadow-lg">
                  <Heart className="w-16 h-16 text-red-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">No favorites yet</h3>
                <p className="text-gray-600 text-lg">
                  Start adding your favorite dishes!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteItems.map((item) => (
                  <Card
                    key={item.foodId}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-red-200 bg-white backdrop-blur-sm hover:scale-105 group"
                  >
                  <div className="relative">
                    <img
                      src={getFoodImageUrl(item.foodImage)}
                      alt={item.name}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-white/90 text-foreground hover:bg-white text-xs sm:text-sm">
                      {item.catName}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 h-8 w-8 sm:h-10 sm:w-10"
                      onClick={() => item.foodId && onRemoveFavorite?.(item.foodId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.foodDescription}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg sm:text-xl font-bold text-primary">
                        {(item.eachPrice || 0).toLocaleString()} MMK
                      </span>
                      <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {item.cookingTime} min
                      </div>
                    </div>
                    <Button
                      className="w-full bg-linear-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                      onClick={() => item.foodId && handleAddToCart(item.foodId, item.name || '')}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default FavoriteDialog;
