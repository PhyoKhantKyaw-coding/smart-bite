import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingCart, Package, Edit } from "lucide-react";
import type { GetCartDTO, OtherTopicModel } from "@/api/user/types";
import { useState } from "react";
import AddOrderDialog from "./AddOrderDialog";
import EditCartItemDialog from "./EditCartItemDialog";
import { getFoodImageUrl } from "@/lib/imageUtils";
import { updateCart, removeFromCart } from "@/api/user";
import { toast } from "sonner";

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: GetCartDTO[];
  onUpdateQuantity?: (foodId: string, quantity: number) => void;
  onRemoveItem?: (foodId: string) => void;
  onProceedToOrder?: () => void;
  onRefreshCart?: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({
  open,
  cartItems,
  onRemoveItem,
  onProceedToOrder,
  onRefreshCart,
}) => {
  const [showAddOrderDialog, setShowAddOrderDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<GetCartDTO | null>(null);

  if (!open) return null;

  const handleEditItem = (item: GetCartDTO) => {
    setEditingItem(item);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async (foodId: string, quantity: number, selectedTopics: OtherTopicModel[]) => {
    try {
      await updateCart({
        foodId,
        quantity,
        topics: selectedTopics.map(t => ({ otherId: t.topicId })),
      });
      toast.success("Cart item updated successfully!");
      onRefreshCart?.();
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error("Failed to update cart item");
    }
  };

  const handleRemoveItem = async (foodId: string) => {
    try {
      await removeFromCart(foodId);
      toast.success("Item removed from cart");
      onRemoveItem?.(foodId);
      onRefreshCart?.();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.eachPrice || 0) * (item.quantity || 0), 0);
  };

  const totalAmount = calculateTotal();

  const handleProceedToOrder = () => {
    setShowAddOrderDialog(true);
  };

  return (
    <>
      <div className="relative w-[80%] mx-auto overflow-hidden text-yellow-900 border-4 border-yellow-400 shadow-lg rounded-[48px] flex flex-col" style={{ background: 'linear-gradient(120deg, #fffbe6 0%, #fbbf24 100%)', minHeight: '500px', maxHeight: '600px' }}>
        <div className="container max-w-4xl mx-auto flex-1 overflow-y-auto scrollbar-hide py-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-orange-400 to-pink-500 shadow-lg mb-4">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Shopping Cart
            </h1>
            <p className="text-sm sm:text-base text-yellow-800 opacity-80">
              Review and manage your delicious selections
            </p>
          </div>

          <div className="space-y-4 pb-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-gray-100 to-gray-200 mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h3>
                <p className="text-gray-500 text-lg">Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.foodId} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-yellow-300 bg-white/95 backdrop-blur-sm hover:scale-[1.02]">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
                        <img
                          src={getFoodImageUrl(item.foodImage)}
                          alt={item.name}
                          className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {item.catName}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditItem(item)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => item.foodId && handleRemoveItem(item.foodId)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {item.topics && item.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.topics.map((topic, idx) => (
                                <Badge key={topic.topicId || idx} variant="secondary" className="text-xs">
                                  {topic.topicName}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Quantity:</span>
                              <span className="font-semibold text-base">
                                {item.quantity || 0}
                              </span>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {(item.eachPrice || 0).toLocaleString()} MMK each
                              </p>
                              <p className="text-base sm:text-lg font-bold text-primary">
                                {((item.eachPrice || 0) * (item.quantity || 0)).toLocaleString()} MMK
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-yellow-400 bg-linear-to-r from-yellow-50 to-yellow-100 p-3">
            <div className="container max-w-4xl mx-auto">
              <div className="flex items-center justify-between text-sm sm:text-base mb-2">
                <span className="font-semibold">Total Amount</span>
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {totalAmount.toLocaleString()} MMK
                </span>
              </div>
              <Button
                onClick={handleProceedToOrder}
                className="w-full gradient-primary text-base py-4"
                disabled={cartItems.length === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Proceed to Order
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddOrderDialog
        open={showAddOrderDialog}
        onOpenChange={setShowAddOrderDialog}
        cartItems={cartItems}
        onOrderSuccess={onProceedToOrder}
      />

      {editingItem && (
        <EditCartItemDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          cartItem={editingItem}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default CartDialog;
