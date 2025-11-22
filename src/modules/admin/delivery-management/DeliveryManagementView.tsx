import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Truck,
  UserPlus,
  Search,
  MapPin,
  Package,
} from "lucide-react";
import AddEditDeliveryDialog from "./chunks/AddEditDeliveryDialog";
import DeliveryMapView from "./chunks/DeliveryMapView";
import DeliveryStatsCards from "./chunks/DeliveryStatsCards";
import DeliveryPerformanceChart from "./chunks/DeliveryPerformanceChart";
import DeliveryTable from "./chunks/DeliveryTable";

// Mock Data
const mockDeliveryPersons = [
  {
    id: "DLV001",
    name: "Aung Aung",
    phone: "+95 9123456789",
    email: "aung@delivery.com",
    vehicleType: "Motorcycle",
    vehicleNumber: "1A-2345",
    status: "Active",
    isOnline: true,
    currentLocation: { lat: 16.8661, lng: 96.1951 },
    rating: 4.8,
    totalDeliveries: 1250,
    completedToday: 12,
    earnings: 45000,
    joinedDate: "2024-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aung",
  },
  {
    id: "DLV002",
    name: "Kyaw Kyaw",
    phone: "+95 9234567890",
    email: "kyaw@delivery.com",
    vehicleType: "Bicycle",
    vehicleNumber: "2B-3456",
    status: "Active",
    isOnline: true,
    currentLocation: { lat: 16.8701, lng: 96.1991 },
    rating: 4.6,
    totalDeliveries: 980,
    completedToday: 8,
    earnings: 38000,
    joinedDate: "2024-02-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kyaw",
  },
  {
    id: "DLV003",
    name: "Zaw Zaw",
    phone: "+95 9345678901",
    email: "zaw@delivery.com",
    vehicleType: "Motorcycle",
    vehicleNumber: "3C-4567",
    status: "Active",
    isOnline: false,
    currentLocation: { lat: 16.8621, lng: 96.1911 },
    rating: 4.9,
    totalDeliveries: 1450,
    completedToday: 15,
    earnings: 52000,
    joinedDate: "2023-11-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zaw",
  },
  {
    id: "DLV004",
    name: "Myo Myo",
    phone: "+95 9456789012",
    email: "myo@delivery.com",
    vehicleType: "Car",
    vehicleNumber: "4D-5678",
    status: "Active",
    isOnline: true,
    currentLocation: { lat: 16.8641, lng: 96.1931 },
    rating: 4.7,
    totalDeliveries: 1100,
    completedToday: 10,
    earnings: 42000,
    joinedDate: "2024-03-05",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Myo",
  },
  {
    id: "DLV005",
    name: "Hla Hla",
    phone: "+95 9567890123",
    email: "hla@delivery.com",
    vehicleType: "Motorcycle",
    vehicleNumber: "5E-6789",
    status: "Inactive",
    isOnline: false,
    currentLocation: { lat: 16.8681, lng: 96.1971 },
    rating: 4.5,
    totalDeliveries: 750,
    completedToday: 0,
    earnings: 28000,
    joinedDate: "2024-04-12",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hla",
  },
];

const DeliveryManagementView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<typeof mockDeliveryPersons[0] | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [deliveryPersons, setDeliveryPersons] = useState(mockDeliveryPersons);

  const handleEdit = (delivery: typeof mockDeliveryPersons[0]) => {
    setSelectedDelivery(delivery);
    setShowAddDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeliveryPersons((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAdd = () => {
    setSelectedDelivery(null);
    setShowAddDialog(true);
  };

  const filteredDeliveryPersons = deliveryPersons.filter((delivery) =>
    delivery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.phone.includes(searchQuery) ||
    delivery.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalDeliveries: deliveryPersons.length,
    activeDeliveries: deliveryPersons.filter((d) => d.status === "Active").length,
    onlineNow: deliveryPersons.filter((d) => d.isOnline).length,
    totalEarnings: deliveryPersons.reduce((sum, d) => sum + d.earnings, 0),
    todayDeliveries: deliveryPersons.reduce((sum, d) => sum + d.completedToday, 0),
    avgRating: (deliveryPersons.reduce((sum, d) => sum + d.rating, 0) / deliveryPersons.length).toFixed(1),
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
              <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
              Delivery Management
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Manage delivery personnel and track performance
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? "gradient-primary" : ""}
            >
              <Package className="w-4 h-4 mr-2" />
              Table View
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
              className={viewMode === "map" ? "gradient-primary" : ""}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <DeliveryStatsCards stats={stats} />

        {/* Performance Chart */}
        <DeliveryPerformanceChart />

        {/* Search and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-xl sm:text-2xl">
                Delivery Personnel ({filteredDeliveryPersons.length})
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone, or vehicle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button onClick={handleAdd} className="gradient-primary w-full sm:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Delivery Person
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <DeliveryTable
                deliveryPersons={filteredDeliveryPersons}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <DeliveryMapView deliveryPersons={filteredDeliveryPersons} />
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <AddEditDeliveryDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          delivery={selectedDelivery}
          onSave={(data) => {
            if (selectedDelivery) {
              setDeliveryPersons((prev) =>
                prev.map((d) => (d.id === selectedDelivery.id ? { ...d, ...data } : d))
              );
            } else {
              setDeliveryPersons((prev) => [
                ...prev,
                {
                  ...data,
                  id: `DLV${String(prev.length + 1).padStart(3, "0")}`,
                  totalDeliveries: 0,
                  completedToday: 0,
                  earnings: 0,
                  rating: 5.0,
                  currentLocation: { lat: 16.8661, lng: 96.1951 },
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
                },
              ]);
            }
            setShowAddDialog(false);
          }}
        />
      </div>
    </div>
  );
};

export default DeliveryManagementView;
