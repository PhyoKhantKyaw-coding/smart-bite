import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fetch route from OSRM (Open Source Routing Machine)
const fetchRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      // Convert GeoJSON coordinates [lng, lat] to Leaflet format [lat, lng]
      return data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
    }
  } catch (error) {
    console.error('Error fetching route:', error);
  }
  // Fallback to straight line if routing fails
  return [start, end];
};


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
  showStoreToDestinationRoute?: boolean;
  deliveryPosition?: { lat: number; lng: number };
  destinationPosition?: { lat: number; lng: number };
  storeName?: string;
  deliveryManName?: string;
  destinationName?: string;
  routeColor?: string;
};

const ClickableMap: React.FC<Props> = ({ 
  latitude, 
  longitude, 
  onChange,
  clickable = true,
  showRoute = false,
  showStoreToDestinationRoute = false,
  deliveryPosition,
  destinationPosition,
  storeName = "Store Location",
  deliveryManName = "Delivery Person",
  destinationName = "Destination",
  routeColor = "#ef4444"
}) => {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);
  const [roadRoute, setRoadRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  // Fetch actual road route when store to destination route is enabled
  useEffect(() => {
    if (showStoreToDestinationRoute && destinationPosition) {
      fetchRoute(
        [latitude, longitude],
        [destinationPosition.lat, destinationPosition.lng]
      ).then(route => setRoadRoute(route));
    }
  }, [showStoreToDestinationRoute, latitude, longitude, destinationPosition]);

  // Component to update map center when position changes
  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      // If showing routes with multiple markers, fit bounds to show all markers
      if ((showRoute || showStoreToDestinationRoute) && destinationPosition) {
        const bounds = L.latLngBounds([]);
        bounds.extend([latitude, longitude]); // Store position
        bounds.extend([destinationPosition.lat, destinationPosition.lng]); // Destination
        if (deliveryPosition) {
          bounds.extend([deliveryPosition.lat, deliveryPosition.lng]); // Delivery position
        }
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else {
        // Otherwise, just center on the main position
        map.setView(position, map.getZoom());
      }
    }, [map, position]); // eslint-disable-line react-hooks/exhaustive-deps
    return null;
  };

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
  const storeToDestinationRoute: [number, number][] = roadRoute.length > 0 ? roadRoute : [];
  
  if (showRoute && deliveryPosition && destinationPosition) {
    routePositions.push(
      [deliveryPosition.lat, deliveryPosition.lng],
      [destinationPosition.lat, destinationPosition.lng]
    );
  }

  return (
    <MapContainer center={position} zoom={12} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapUpdater />
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
      
      {/* Route line between delivery person and destination */}
      {showRoute && routePositions.length === 2 && (
        <Polyline 
          positions={routePositions} 
          color="#3b82f6" 
          weight={3}
          dashArray="10, 10"
          opacity={0.7}
        />
      )}
      
      {/* Route line from store to destination - follows actual roads */}
      {showStoreToDestinationRoute && storeToDestinationRoute.length >= 2 && (
        <Polyline 
          positions={storeToDestinationRoute} 
          color={routeColor}
          weight={4}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
};

export default ClickableMap;
