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
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingCart, Package } from "lucide-react";
import type { GetCartDTO } from "@/api/user/types";
import { useState } from "react";
import AddOrderDialog from "./AddOrderDialog";

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: GetCartDTO[];
  onUpdateQuantity?: (foodId: string, quantity: number) => void;
  onRemoveItem?: (foodId: string) => void;
  onProceedToOrder?: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({
  open,
  onOpenChange,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToOrder,
}) => {
  const [showAddOrderDialog, setShowAddOrderDialog] = useState(false);

  const handleQuantityChange = (foodId: string, increment: boolean) => {
    const item = cartItems.find((i) => i.foodId === foodId);
    if (!item || !item.quantity) return;

    const newQuantity = increment
      ? Math.min(item.quantity + 1, 99)
      : Math.max(item.quantity - 1, 1);

    onUpdateQuantity?.(foodId, newQuantity);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.eachPrice || 0) * (item.quantity || 0), 0);
  };

  const totalAmount = calculateTotal();

  const handleProceedToOrder = () => {
    onOpenChange(false);
    setShowAddOrderDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:w-[85%] md:w-[75%] lg:w-[60%] max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              Shopping Cart
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Review and manage your cart items
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground">Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <Card key={item.foodId} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
                        <img
                          src={item.foodImage ? `https://localhost:7112/api/${item.foodImage}` : '/placeholder-food.jpg'}
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => item.foodId && onRemoveItem?.(item.foodId)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => item.foodId && handleQuantityChange(item.foodId, false)}
                                disabled={(item.quantity || 0) <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-12 text-center font-semibold">
                                {item.quantity || 0}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => item.foodId && handleQuantityChange(item.foodId, true)}
                                disabled={(item.quantity || 0) >= 99}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
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

                <Separator />

                {/* Total and Checkout */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-base sm:text-lg">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      {totalAmount.toLocaleString()} MMK
                    </span>
                  </div>

                  <Button
                    onClick={handleProceedToOrder}
                    className="w-full gradient-primary text-lg py-6"
                    disabled={cartItems.length === 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Proceed to Order
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddOrderDialog
        open={showAddOrderDialog}
        onOpenChange={setShowAddOrderDialog}
        cartItems={cartItems}
        onOrderSuccess={onProceedToOrder}
      />
    </>
  );
};

export default CartDialog;
