import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveryDashboardView from "./DeliveryDashboardView";
import DeliveredOrders from "./chunks/DeliveredOrders";
import OrdersForDelivery from "./chunks/OrdersForDelivery";

const DeliveryView = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="dashboard" className="text-sm md:text-base">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-sm md:text-base">
            Orders for Delivery
          </TabsTrigger>
          <TabsTrigger value="delivered" className="text-sm md:text-base">
            Delivered Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0">
          <DeliveryDashboardView />
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <OrdersForDelivery />
        </TabsContent>

        <TabsContent value="delivered" className="mt-0">
          <DeliveredOrders />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryView;
