import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Phone, Star, Package, Truck } from "lucide-react";

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

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  isOnline: boolean;
  currentLocation: { lat: number; lng: number };
  rating: number;
  totalDeliveries: number;
  completedToday: number;
}

interface DeliveryMapViewProps {
  deliveryPersons: DeliveryPerson[];
}

const DeliveryMapView: React.FC<DeliveryMapViewProps> = ({ deliveryPersons }) => {
  const center: [number, number] = [16.8661, 96.1951]; // Mandalay

  return (
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

        {deliveryPersons.map((person) => (
          <div key={person.id}>
            <Marker
              position={[person.currentLocation.lat, person.currentLocation.lng]}
              icon={createDeliveryIcon(person.isOnline)}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <h3 className="font-semibold text-base">{person.name}</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        className={person.isOnline ? "bg-green-500" : "bg-red-500"}
                      >
                        {person.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Phone:
                      </span>
                      <span className="font-medium">{person.phone}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium">
                        {person.vehicleType} ({person.vehicleNumber})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        Rating:
                      </span>
                      <span className="font-medium">{person.rating.toFixed(1)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        Today:
                      </span>
                      <span className="font-medium">{person.completedToday} deliveries</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold text-orange-500">
                        {person.totalDeliveries} deliveries
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Coverage circle for online delivery persons */}
            {person.isOnline && (
              <Circle
                center={[person.currentLocation.lat, person.currentLocation.lng]}
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
        ))}
      </MapContainer>
    </div>
  );
};

export default DeliveryMapView;
