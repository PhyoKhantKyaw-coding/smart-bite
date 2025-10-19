import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { getFoodById } from '@/api/user';
import type { ResponseFoodDTO } from '@/api/user/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foodId: string;
  onAddToCart: (foodId: string) => void;
  onAddToFavorite: (foodId: string) => void;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  onOpenChange,
  foodId,
  onAddToCart,
  onAddToFavorite,
}) => {
  const [product, setProduct] = useState<ResponseFoodDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await getFoodById(foodId);
      if (response.data) {
        setProduct(response.data);
      } else {
        toast.error('Product not found');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && foodId) {
      fetchProductDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, foodId]);

  const handleAddToCart = () => {
    onAddToCart(foodId);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleAddToFavorite = () => {
    onAddToFavorite(foodId);
    toast.success('Added to favorites!');
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!product?.foodDTO) {
    return null;
  }

  const food = product.foodDTO;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {food.name}
          </DialogTitle>
          <DialogDescription>
            {food.catName && <Badge className="gradient-primary">{food.catName}</Badge>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          {food.foodImage && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={food.foodImage ? `https://localhost:7112/api/${food.foodImage}` : '/placeholder-food.jpg'}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Price and Time Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">
                ${food.eachPrice?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{food.cookingTime} mins</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-600">{food.foodDescription || 'No description available'}</p>
          </div>

          {/* Topics/Tags */}
          {product.otherTopics && product.otherTopics.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Additional Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.otherTopics.map((topic, index) => (
                  <Badge key={index} variant="outline">
                    {topic.topicName}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Topics from othertopicName */}
          {food.othertopicName && food.othertopicName.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {food.othertopicName.map((topic, index) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Quantity Selector */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Quantity</h3>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                className="h-10 w-10"
              >
                -
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                className="h-10 w-10"
              >
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAddToCart}
              className="flex-1 gradient-primary text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart ({quantity})
            </Button>
            <Button
              onClick={handleAddToFavorite}
              variant="outline"
              className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              <Heart className="w-4 h-4 mr-2" />
              Add to Favorites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
