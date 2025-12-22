import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Bike, RefreshCw, MapPin } from "lucide-react";
import { getAllActiveDeliveryLocations } from "@/api/delivery";
import type { DeliveryLocationDTO } from "@/api/delivery/types";
import { toast } from "sonner";

// Custom icons for online/offline delivery persons
const createDeliveryIcon = (isOnline: boolean) => {
  return new L.Icon({
    iconUrl: isOnline
      ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
      : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

interface DeliveryMapViewProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const DeliveryMapView: React.FC<DeliveryMapViewProps> = ({ 
  autoRefresh = true,
  refreshInterval = 15000, // 15 seconds
}) => {
  const [deliveries, setDeliveries] = useState<DeliveryLocationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const center: [number, number] = [16.8661, 96.1951]; // Mandalay

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await getAllActiveDeliveryLocations();
      if (response.data) {
        setDeliveries(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch delivery locations:', error);
      toast.error('Failed to load delivery locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDeliveries();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Live Delivery Map</h3>
          <p className="text-sm text-muted-foreground">
            {deliveries.length} active delivery {deliveries.length === 1 ? 'person' : 'people'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchDeliveries} 
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="h-[600px] rounded-lg overflow-hidden border">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {deliveries.map((person) => {
            if (!person.currentLatitude || !person.currentLongitude) return null;
            
            return (
              <div key={person.deliveryId}>
                <Marker
                  position={[person.currentLatitude, person.currentLongitude]}
                  icon={createDeliveryIcon(person.isOnline || false)}
                >
                  <Popup>
                    <div className="p-2 min-w-[250px]">
                      <div className="flex items-center gap-2 mb-3">
                        {person.profile && (
                          <img 
                            src={person.profile} 
                            alt={person.deliveryName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-base">{person.deliveryName}</h3>
                          <Badge
                            className={person.isOnline ? "bg-green-500" : "bg-red-500"}
                          >
                            {person.isOnline ? "Online" : "Offline"}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {person.phNo && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              Phone:
                            </span>
                            <span className="font-medium">{person.phNo}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Bike className="w-3 h-3" />
                            Vehicle:
                          </span>
                          <span className="font-medium">Bicycle</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Location:
                          </span>
                          <span className="font-medium text-xs">
                            {person.currentLatitude?.toFixed(4)}, {person.currentLongitude?.toFixed(4)}
                          </span>
                        </div>

                        {person.distanceInKm !== undefined && (
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-muted-foreground">Distance:</span>
                            <span className="font-bold text-orange-500">
                              {person.distanceInKm.toFixed(2)} km
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Coverage circle for online delivery persons */}
                {person.isOnline && (
                  <Circle
                    center={[person.currentLatitude, person.currentLongitude]}
                    radius={500}
                    pathOptions={{
                      color: "#22c55e",
                      fillColor: "#22c55e",
                      fillOpacity: 0.1,
                      weight: 1,
                    }}
                  />
                )}
              </div>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default DeliveryMapView;
