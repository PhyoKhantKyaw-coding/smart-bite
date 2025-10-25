import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const storeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type Props = {
  latitude: number;
  longitude: number;
  onChange?: (lat: number, lng: number) => void;
  clickable?: boolean;
  showRoute?: boolean;
  deliveryPosition?: { lat: number; lng: number };
  destinationPosition?: { lat: number; lng: number };
  storeName?: string;
  deliveryManName?: string;
  destinationName?: string;
};

const ClickableMap: React.FC<Props> = ({ 
  latitude, 
  longitude, 
  onChange,
  clickable = true,
  showRoute = false,
  deliveryPosition,
  destinationPosition,
  storeName = "Store Location",
  deliveryManName = "Delivery Person",
  destinationName = "Destination"
}) => {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  // Component to handle clicks
  const LocationMarker = () => {
    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        if (clickable && onChange) {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
          onChange(lat, lng);
        }
      },
    });
    return (
      <Marker position={position} icon={storeIcon}>
        <Popup>{storeName}</Popup>
      </Marker>
    );
  };

  // Calculate route positions
  const routePositions: [number, number][] = [];
  if (showRoute && deliveryPosition && destinationPosition) {
    routePositions.push(
      [deliveryPosition.lat, deliveryPosition.lng],
      [destinationPosition.lat, destinationPosition.lng]
    );
  }

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: "100%", width: "100%", minHeight: "300px", borderRadius: "8px" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
      
      {/* Delivery person marker */}
      {deliveryPosition && (
        <Marker 
          position={[deliveryPosition.lat, deliveryPosition.lng]} 
          icon={deliveryIcon}
        >
          <Popup>
            <div className="font-semibold">{deliveryManName}</div>
            <div className="text-xs text-gray-600">Current Position</div>
          </Popup>
        </Marker>
      )}
      
      {/* Destination marker */}
      {destinationPosition && (
        <Marker 
          position={[destinationPosition.lat, destinationPosition.lng]} 
          icon={destinationIcon}
        >
          <Popup>
            <div className="font-semibold">{destinationName}</div>
            <div className="text-xs text-gray-600">Delivery Destination</div>
          </Popup>
        </Marker>
      )}
      
      {/* Route line */}
      {showRoute && routePositions.length === 2 && (
        <Polyline 
          positions={routePositions} 
          color="#3b82f6" 
          weight={3}
          dashArray="10, 10"
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
};

export default ClickableMap;
