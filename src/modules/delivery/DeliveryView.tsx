import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveryDashboardView from "./DeliveryDashboardView";
import DeliveredOrders from "./chunks/DeliveredOrders";
import OrdersForDelivery from "./chunks/OrdersForDelivery";
import { getOrdersByStatus } from "@/api/delivery";
import { DeliveryOrder, DeliveredOrder } from "@/types/delivery";

const DeliveryView = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [deliveringOrders, setDeliveringOrders] = useState<DeliveryOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<DeliveredOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const hasFetchedDelivery = useRef(false);
  const hasFetchedDelivered = useRef(false);

  // Fetch orders based on active tab
  useEffect(() => {
    const controller = new AbortController();

    const fetchDeliveryOrders = async () => {
      if (hasFetchedDelivery.current) return;
      hasFetchedDelivery.current = true;
      
      setLoading(true);
      try {
        // Fetch both delivery and delivering orders in parallel
        const [deliveryResponse, deliveringResponse] = await Promise.all([
          getOrdersByStatus("delivery"),
          getOrdersByStatus("delivering")
        ]);
        
        console.log("Delivery Response:", deliveryResponse);
        console.log("Delivering Response:", deliveringResponse);
        
        if (deliveryResponse.data) {
          console.log("Delivery Orders Data:", deliveryResponse.data);
          setDeliveryOrders(deliveryResponse.data as DeliveryOrder[]);
        }
        
        if (deliveringResponse.data) {
          console.log("Delivering Orders Data:", deliveringResponse.data);
          setDeliveringOrders(deliveringResponse.data as DeliveryOrder[]);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching delivery orders:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const fetchDeliveredOrders = async () => {
      if (hasFetchedDelivered.current) return;
      hasFetchedDelivered.current = true;
      
      setLoading(true);
      try {
        const deliveredResponse = await getOrdersByStatus("delivered");
        console.log("Delivered Response:", deliveredResponse);
        
        if (deliveredResponse.data) {
          console.log("Delivered Orders Data:", deliveredResponse.data);
          setDeliveredOrders(deliveredResponse.data as DeliveredOrder[]);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching delivered orders:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Fetch data based on active tab
    if (activeTab === "orders") {
      fetchDeliveryOrders();
    } else if (activeTab === "delivered") {
      fetchDeliveredOrders();
    }

    return () => {
      controller.abort();
    };
  }, [activeTab]);

  // Refresh delivery orders
  const handleRefreshDeliveryOrders = async () => {
    console.log("=== Refreshing delivery orders ===");
    setLoading(true);
    try {
      // Fetch both delivery and delivering orders in parallel
      const [deliveryResponse, deliveringResponse] = await Promise.all([
        getOrdersByStatus("delivery"),
        getOrdersByStatus("delivering")
      ]);
      
      console.log("Refresh - Delivery Response:", deliveryResponse);
      console.log("Refresh - Delivering Response:", deliveringResponse);
      
      if (deliveryResponse.data) {
        console.log("Refresh - Setting delivery orders:", deliveryResponse.data);
        setDeliveryOrders(deliveryResponse.data as DeliveryOrder[]);
      }
      
      if (deliveringResponse.data) {
        console.log("Refresh - Setting delivering orders:", deliveringResponse.data);
        setDeliveringOrders(deliveringResponse.data as DeliveryOrder[]);
      }
    } catch (error) {
      console.error("Error refreshing delivery orders:", error);
    } finally {
      setLoading(false);
      console.log("=== Refresh complete ===");
    }
  };

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
          <OrdersForDelivery 
            orders={[...deliveryOrders, ...deliveringOrders]} 
            loading={loading} 
            onRefresh={handleRefreshDeliveryOrders}
          />
        </TabsContent>

        <TabsContent value="delivered" className="mt-0">
          <DeliveredOrders orders={deliveredOrders} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryView;
