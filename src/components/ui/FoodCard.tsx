import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Clock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FoodCardProps {
  food: {
    foodId: string;
    name: string;
    eachPrice: number;
    foodImage: string;
    foodDescription: string;
    cookingTime: number;
    catName: string;
  };
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onAddToCart, onToggleFavorite, isFavorite = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      return;
    }
    onAddToCart?.();
    toast.success("Added to cart!");
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Please login to add favorites");
      navigate("/auth");
      return;
    }
    onToggleFavorite?.();
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites!");
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-300 cursor-pointer group hover:shadow-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={food.foodImage}
          alt={food.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <Badge className="bg-white/90 text-foreground hover:bg-white">{food.catName}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{food.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{food.foodDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{food.eachPrice.toLocaleString()} MMK</span>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {food.cookingTime} min
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gradient-primary" 
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
