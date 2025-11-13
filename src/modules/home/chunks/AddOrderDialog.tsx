import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  CreditCard,
  Home,
  QrCode,
  ShoppingCart,
  Check,
  X,
} from "lucide-react";
import type { GetCartDTO } from "@/api/user/types";
import { addOrder } from "@/api/delivery";
import { toast } from "sonner";
import KPayQRDialog from "./KPayQRDialog";
import MapSelectionDialog from "./MapSelectionDialog";

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: GetCartDTO[];
  onOrderSuccess?: () => void;
}

const AddOrderDialog: React.FC<AddOrderDialogProps> = ({
  open,
  onOpenChange,
  cartItems,
  onOrderSuccess,
}) => {
  const [orderDescription, setOrderDescription] = useState("");
  const [paymentType, setPaymentType] = useState<"Cash" | "KPay">("Cash");
  const [selectedLocation, setSelectedLocation] = useState<MapDTO | null>(null);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const addOrderMutation = addOrder.useMutation({
    onSuccess: (response) => {
      if (response.status === 0) {
        toast.success("Order placed successfully!");
        onOrderSuccess?.();
        onOpenChange(false);
        resetForm();
      } else {
        toast.error(response.message || "Failed to place order");
      }
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order");
      setIsProcessing(false);
    },
  });

  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.eachPrice || 0) * (item.quantity || 0),
    0
  );

  const resetForm = () => {
    setOrderDescription("");
    setPaymentType("Cash");
    setSelectedLocation(null);
    setIsProcessing(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            place: "Current Location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success("Current location detected");
        },
        () => {
          toast.error("Unable to get current location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedLocation) {
      toast.error("Please select delivery location");
      return;
    }

    if (paymentType === "KPay") {
      setShowQRDialog(true);
    } else {
      processOrder();
    }
  };

  const processOrder = () => {
    setIsProcessing(true);

    const orderData: AddOrderDTO = {
      orderdetail: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: item.quantity,
        topics: item.topics?.map((t) => ({ otherId: t.topicId })),
      })),
      townId: undefined, // townId will be handled by backend based on user
      orderplaceMap: selectedLocation!,
      orderDescription,
      paymentType,
      paymentAmount: totalAmount,
    };

    addOrderMutation.mutate(orderData);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:w-[85%] md:w-[75%] lg:w-[60%] max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              Complete Your Order
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Review your order and select delivery details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4">
            {/* Order Items Summary */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.foodId} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {item.eachPrice?.toLocaleString()} MMK × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {((item.eachPrice || 0) * (item.quantity || 0)).toLocaleString()} MMK
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">{totalAmount.toLocaleString()} MMK</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Location */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Location
                </h3>
                {selectedLocation ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-green-900">{selectedLocation.place}</p>
                        <p className="text-xs text-green-700">
                          Lat: {selectedLocation.latitude?.toFixed(6)}, Lng:{" "}
                          {selectedLocation.longitude?.toFixed(6)}
                        </p>
                      </div>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-yellow-800">No location selected</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={getCurrentLocation}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Current Location
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowMapDialog(true)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Choose on Map
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Description */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Order Notes (Optional)</h3>
                <Textarea
                  placeholder="Add special instructions for your order..."
                  value={orderDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrderDescription(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h3>
                <RadioGroup value={paymentType} onValueChange={(v: string) => setPaymentType(v as "Cash" | "KPay")}>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="Cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">Pay when you receive</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="KPay" id="kpay" />
                    <Label htmlFor="kpay" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5" />
                        <div>
                          <p className="font-medium">KPay</p>
                          <p className="text-xs text-muted-foreground">Scan QR to pay now</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex-1 text-sm"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                className="flex-1 gradient-primary text-sm"
                onClick={handlePlaceOrder}
                disabled={!selectedLocation || isProcessing}
              >
                <Check className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MapSelectionDialog
        open={showMapDialog}
        onOpenChange={setShowMapDialog}
        onLocationSelect={setSelectedLocation}
      />

      <KPayQRDialog
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
        amount={totalAmount}
        onPaymentComplete={processOrder}
      />
    </>
  );
};

export default AddOrderDialog;
