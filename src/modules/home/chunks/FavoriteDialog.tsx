import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface GetFavoriteDTO {
  foodId: string;
  name: string;
  eachPrice: number;
  cookingTime: number;
  foodImage: string;
  foodDescription: string;
  catName: string;
}

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            My Favorites
          </DialogTitle>
          <DialogDescription>
            Your favorite foods collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {favoriteItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground">
                Start adding your favorite dishes!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteItems.map((item) => (
                <Card
                  key={item.foodId}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={item.foodImage}
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
                      onClick={() => onRemoveFavorite?.(item.foodId)}
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
                        {item.eachPrice.toLocaleString()} MMK
                      </span>
                      <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {item.cookingTime} min
                      </div>
                    </div>
                    <Button
                      className="w-full gradient-primary text-sm sm:text-base"
                      onClick={() => handleAddToCart(item.foodId, item.name)}
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
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteDialog;
