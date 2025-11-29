import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Check } from "lucide-react";
import type { GetCartDTO, OtherTopicModel } from "@/api/user/types";
import { getFoodById } from "@/api/user";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getFoodImageUrl } from "@/lib/imageUtils";

interface EditCartItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItem: GetCartDTO;
  onSave: (foodId: string, quantity: number, selectedTopics: OtherTopicModel[]) => void;
}

const EditCartItemDialog: React.FC<EditCartItemDialogProps> = ({
  open,
  onOpenChange,
  cartItem,
  onSave,
}) => {
  const [quantity, setQuantity] = useState(cartItem.quantity || 1);
  const [selectedTopics, setSelectedTopics] = useState<OtherTopicModel[]>(cartItem.topics || []);
  const [availableTopics, setAvailableTopics] = useState<OtherTopicModel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableTopics = async () => {
    if (!cartItem.foodId) return;
    
    setLoading(true);
    try {
      const response = await getFoodById(cartItem.foodId);
      if (response.data?.otherTopics) {
        // Map OtherTopicDTO to OtherTopicModel format
        const mappedTopics = response.data.otherTopics.map(topic => ({
          topicId: topic.otherId,
          topicName: topic.otherName
        }));
        setAvailableTopics(mappedTopics);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && cartItem.foodId) {
      setQuantity(cartItem.quantity || 1);
      setSelectedTopics(cartItem.topics || []);
      fetchAvailableTopics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cartItem]);

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity((prev) => Math.min(prev + 1, 99));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const toggleTopic = (topic: OtherTopicModel) => {
    const isSelected = selectedTopics.some((t) => t.topicId === topic.topicId);
    if (isSelected) {
      setSelectedTopics(selectedTopics.filter((t) => t.topicId !== topic.topicId));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSave = () => {
    if (cartItem.foodId) {
      onSave(cartItem.foodId, quantity, selectedTopics);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[85%] md:w-[70%] lg:w-[50%] max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Edit Cart Item
          </DialogTitle>
          <DialogDescription className="text-sm">
            Update quantity and customize your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-4">
            <img
              src={getFoodImageUrl(cartItem.foodImage)}
              alt={cartItem.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{cartItem.name}</h3>
              <Badge variant="outline" className="mt-1">
                {cartItem.catName}
              </Badge>
              <p className="text-lg font-bold text-primary mt-2">
                {(cartItem.eachPrice || 0).toLocaleString()} MMK
              </p>
            </div>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleQuantityChange(false)}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-16 text-center text-xl font-semibold">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleQuantityChange(true)}
                disabled={quantity >= 99}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Topics Selection */}
          <div>
            <h3 className="font-semibold mb-3">
              Additional Options {availableTopics.length > 0 && "(Optional)"}
            </h3>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : availableTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No additional options available for this item
              </p>
            ) : (
              <div className="space-y-2">
                {availableTopics.map((topic) => {
                  const isSelected = selectedTopics.some((t) => t.topicId === topic.topicId);
                  return (
                    <Button
                      key={topic.topicId}
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full justify-between ${isSelected ? "gradient-primary" : ""}`}
                      onClick={() => toggleTopic(topic)}
                    >
                      <span>{topic.topicName}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Total Price */}
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">Total Price</span>
            <span className="text-xl font-bold text-primary">
              {((cartItem.eachPrice || 0) * quantity).toLocaleString()} MMK
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 gradient-primary"
              onClick={handleSave}
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCartItemDialog;
