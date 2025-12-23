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

// Custom delivery person icon with name
const createDeliveryIcon = (name: string, isOnline: boolean) => {
  const color = isOnline ? '#22c55e' : '#ef4444';
  const bgColor = isOnline ? '#dcfce7' : '#fee2e2';
  
  return L.divIcon({
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="
          background: ${bgColor};
          border: 3px solid ${color};
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div style="
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          margin-top: 4px;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid ${color};
          color: ${color};
        ">${name}</div>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid white;
        "></div>
      </div>
    `,
    className: 'custom-delivery-icon',
    iconSize: [48, 80],
    iconAnchor: [24, 80],
    popupAnchor: [0, -80],
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

      <div className="h-[600px] rounded-lg overflow-hidden border" style={{ zIndex: 1, position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
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
                  icon={createDeliveryIcon(person.deliveryName || 'Delivery', person.isOnline || false)}
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
