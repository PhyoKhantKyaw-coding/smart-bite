import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import AddEditDeliveryDialog from "./chunks/AddEditDeliveryDialog";
import DeliveryMapView from "./chunks/DeliveryMapView";
// import DeliveryStatsCards from "./chunks/DeliveryStatsCards";
// import DeliveryPerformanceChart from "./chunks/DeliveryPerformanceChart";
import DeliveryTable from "./chunks/DeliveryTable";
import { getAllDeliveries, deleteDelivery } from "@/api/delivery";

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  email: string;
  townId?: string;
  townName?: string;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  isOnline: boolean;
  currentLocation: { lat: number; lng: number };
  rating: number;
  totalDeliveries: number;
  completedToday: number;
  earnings: number;
  joinedDate: string;
  profile?: string;
}

const DeliveryManagementView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryPerson | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDeliveries = async () => {
    try {
      const response = await getAllDeliveries({
        page,
        pageSize,
        query: searchQuery,
      });
      
      if (response.data?.data) {
        const mappedData: DeliveryPerson[] = response.data.data.map((d) => ({
          id: d.deliveryId || "",
          name: d.deliveryName || "",
          phone: d.phNo || "",
          email: d.email || "",
          townId: d.townId || "",
          townName: d.townName || "",
          vehicleType: "Bicycle",
          vehicleNumber: "N/A",
          status: d.isOnline ? "Active" : "Inactive",
          isOnline: d.isOnline || false,
          currentLocation: {
            lat: d.currentLatitude || 16.8661,
            lng: d.currentLongitude || 96.1951,
          },
          rating: 5.0,
          totalDeliveries: 0,
          completedToday: 0,
          earnings: 0,
          joinedDate: new Date().toISOString().split("T")[0],
          profile: d.profile,
        }));
        setDeliveryPersons(mappedData);
        setTotalCount(response.data.totalCount || 0);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
      console.error("Failed to fetch deliveries:", error);
      toast.error("Failed to load delivery personnel");
    }
  };

  useEffect(() => {
    fetchDeliveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleEdit = (delivery: DeliveryPerson) => {
    setSelectedDelivery(delivery);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteDelivery(id);
      if (response.status === 200 || response.status === 201) {
        toast.success("Delivery person deleted successfully");
        fetchDeliveries();
      } else {
        toast.error(response.message || "Failed to delete delivery person");
      }
    } catch (error) {
      console.error("Failed to delete delivery:", error);
      toast.error("Failed to delete delivery person");
    }
  };

  const handleAdd = () => {
    setSelectedDelivery(null);
    setShowAddDialog(true);
  };

  const filteredDeliveryPersons = deliveryPersons;

  // const stats = {
  //   totalDeliveries: totalCount,
  //   activeDeliveries: deliveryPersons.filter((d) => d.status === "Active").length,
  //   onlineNow: deliveryPersons.filter((d) => d.isOnline).length,
  //   totalEarnings: deliveryPersons.reduce((sum, d) => sum + (d.earnings || 0), 0),
  //   todayDeliveries: deliveryPersons.reduce((sum, d) => sum + (d.completedToday || 0), 0),
  //   avgRating: deliveryPersons.length > 0 ? (deliveryPersons.reduce((sum, d) => sum + (d.rating || 0), 0) / deliveryPersons.length).toFixed(1) : "0",
  // };

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
        {/* <DeliveryStatsCards stats={stats} /> */}

        {/* Performance Chart */}
        {/* <DeliveryPerformanceChart /> */}

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
              <>
                <DeliveryTable
                  deliveryPersons={filteredDeliveryPersons}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {deliveryPersons.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, totalCount)} of {totalCount} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (page <= 3) {
                          pageNumber = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = page - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNumber}
                            variant={page === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNumber)}
                            className={page === pageNumber ? "gradient-primary" : ""}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages || totalPages === 0}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
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
          onSave={fetchDeliveries}
        />
      </div>
    </div>
  );
};

export default DeliveryManagementView;
