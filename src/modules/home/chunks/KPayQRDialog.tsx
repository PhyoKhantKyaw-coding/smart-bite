import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Check, X } from "lucide-react";
import { toast } from "sonner";

interface KPayQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  onPaymentComplete: () => void;
}

const KPayQRDialog: React.FC<KPayQRDialogProps> = ({
  open,
  onOpenChange,
  amount,
  onPaymentComplete,
}) => {
  const [isPaid, setIsPaid] = useState(false);

  const handlePaymentConfirm = () => {
    setIsPaid(true);
    toast.success("Payment confirmed!");
    onPaymentComplete();
    onOpenChange(false);
    setIsPaid(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90%] md:w-[85%] max-w-md max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            KPay Payment
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Scan QR code to complete payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 sm:p-6 text-center">
            <div className="bg-white p-3 sm:p-4 rounded-lg inline-block">
              {/* QR Code placeholder - integrate with KPay API */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-100 flex items-center justify-center border-2">
                <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-1">
                {amount.toLocaleString()} MMK
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-yellow-800">
              After scanning and completing payment, click "Payment Completed" button below
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="flex-1 text-sm"
              onClick={() => {
                onOpenChange(false);
                setIsPaid(false);
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              className="flex-1 gradient-primary text-sm"
              onClick={handlePaymentConfirm}
              disabled={isPaid}
            >
              <Check className="w-4 h-4 mr-2" />
              Payment Completed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KPayQRDialog;
