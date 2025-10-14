import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Calendar, User, Store, Bike, CreditCard, Package } from "lucide-react";

interface VoucherDTO {
  orderId: string;
  userName: string;
  townName: string;
  storeName: string;
  deliveryName: string;
  paymentType: string;
  orderDescription: string;
  status: string;
  totalPrice: number;
  totalCost: number;
  totalProfit: number;
  estimatedDeliveryTime: number;
  deliveryStarted?: Date;
  deliveredTime?: Date;
  cartDTOs: OrderDetailDTO[];
}

interface OrderDetailDTO {
  totalPrice: number;
  name: string;
  eachPrice: number;
  cookingTime: number;
  foodImage: string;
  foodDescription: string;
  catName: string;
  quantity: number;
  topics?: OtherTopicModel[];
}

interface OtherTopicModel {
  otherId: string;
  otherName: string;
}

interface VoucherProps {
  voucher: VoucherDTO;
}

const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Voucher: React.FC<VoucherProps> = ({ voucher }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "delivering":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-lg">
      {/* Header Section */}
      <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Order Voucher</h2>
            <p className="text-sm opacity-90">Order #{voucher.orderId.slice(0, 8)}</p>
          </div>
          <Badge className={`${getStatusColor(voucher.status)} text-white text-sm px-4 py-2`}>
            {voucher.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{voucher.userName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{voucher.townName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            <span>{voucher.storeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4" />
            <span>{voucher.deliveryName}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Order Items */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items
          </h3>
          
          {voucher.cartDTOs.map((item, index) => (
            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <img
                src={item.foodImage}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.foodDescription}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {item.catName}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {item.eachPrice.toLocaleString()} MMK
                    </p>
                    <p className="text-sm text-muted-foreground">x {item.quantity}</p>
                  </div>
                </div>
                
                {item.topics && item.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.topics.map((topic, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {topic.otherName}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.cookingTime} min
                  </div>
                  <div className="font-semibold">
                    Subtotal: {item.totalPrice.toLocaleString()} MMK
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Payment:</span>
              <span className="font-medium">{voucher.paymentType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Est. Delivery:</span>
              <span className="font-medium">{voucher.estimatedDeliveryTime} min</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {voucher.deliveryStarted && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Started:</span>
                <span className="font-medium">
                  {formatDateTime(voucher.deliveryStarted)}
                </span>
              </div>
            )}
            {voucher.deliveredTime && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Delivered:</span>
                <span className="font-medium">
                  {formatDateTime(voucher.deliveredTime)}
                </span>
              </div>
            )}
          </div>
        </div>

        {voucher.orderDescription && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">Note: </span>
              {voucher.orderDescription}
            </p>
          </div>
        )}

        <Separator className="my-6" />

        {/* Total Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              {voucher.totalPrice.toLocaleString()} MMK
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Cost</span>
            <span>{voucher.totalCost.toLocaleString()} MMK</span>
          </div>
          <div className="flex items-center justify-between text-sm text-green-600">
            <span>Profit</span>
            <span className="font-semibold">+{voucher.totalProfit.toLocaleString()} MMK</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Voucher;
