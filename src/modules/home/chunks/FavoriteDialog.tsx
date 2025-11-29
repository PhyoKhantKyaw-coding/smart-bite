import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Trash2, ShoppingCart } from "lucide-react";
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
    <div className="relative w-[80%] mx-auto overflow-hidden text-yellow-900 border-4 border-yellow-400 shadow-lg rounded-[48px]" style={{ background: 'linear-gradient(120deg, #fffbe6 0%, #fbbf24 100%)', minHeight: '500px', maxHeight: '600px' }}>
      <div className="container max-w-5xl mx-auto h-full overflow-y-auto scrollbar-hide py-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-red-400 to-pink-500 shadow-lg mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Favorites
          </h1>
          <p className="text-sm sm:text-base text-yellow-800 opacity-80">
            Your handpicked collection of delicious dishes
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {favoriteItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-red-100 to-pink-200 mb-6">
                <Heart className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No favorites yet</h3>
              <p className="text-gray-500 text-lg">
                Start adding your favorite dishes!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favoriteItems.map((item) => (
                <Card
                  key={item.foodId}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-yellow-300 bg-white/95 backdrop-blur-sm hover:scale-105 hover:-rotate-1"
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
                      className="w-full gradient-primary text-sm sm:text-base"
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
  );
};

export default FavoriteDialog;
