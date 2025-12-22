import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingCart, Package, Edit, X } from "lucide-react";
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
  onOpenChange,
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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => onOpenChange(false)}>
        <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-200 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          {/* Modern gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-orange-50/50 via-white to-amber-50/50 rounded-3xl"></div>
          
          <div className="relative flex-1 overflow-y-auto p-6 md:p-8">
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-orange-500 to-amber-500 shadow-lg mb-4 transform hover:scale-110 transition-transform">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
                Shopping Cart
              </h1>
              <p className="text-base text-gray-600">
                Review and manage your delicious selections
              </p>
            </div>

            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-linear-to-br from-gray-100 to-gray-200 mb-6 shadow-lg">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h3>
                  <p className="text-gray-600 text-lg">Add some delicious items to get started!</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <Card key={item.foodId} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-orange-200 bg-white/90 backdrop-blur-sm hover:scale-[1.01] group">
                        <div className="flex flex-col sm:flex-row gap-4 p-4">
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

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="relative border-t border-orange-200 bg-linear-to-br from-orange-50/80 to-amber-50/80 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Total Amount</span>
              <span className="text-3xl font-bold bg-linear-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {totalAmount.toLocaleString()} MMK
              </span>
            </div>
            <Button
              onClick={handleProceedToOrder}
              className="w-full bg-linear-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              disabled={cartItems.length === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Proceed to Order
            </Button>
          </div>
        )}
      </div>
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
