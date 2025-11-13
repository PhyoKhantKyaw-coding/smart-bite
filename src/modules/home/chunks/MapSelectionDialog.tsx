import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import ClickableMap from "@/components/ClickableMap";

interface MapSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: MapDTO) => void;
}

const MapSelectionDialog: React.FC<MapSelectionDialogProps> = ({
  open,
  onOpenChange,
  onLocationSelect,
}) => {
  const [selectedLat, setSelectedLat] = useState(16.8661); // Mandalay default
  const [selectedLng, setSelectedLng] = useState(96.1951);

  useEffect(() => {
    if (open && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLat(position.coords.latitude);
          setSelectedLng(position.coords.longitude);
        },
        () => {
          toast.info("Using default location");
        }
      );
    }
  }, [open]);

  const handleLocationChange = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const handleConfirm = () => {
    onLocationSelect({
      place: "Selected Location",
      latitude: selectedLat,
      longitude: selectedLng,
    });
    toast.success("Location selected successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90%] md:w-[85%] lg:w-[75%] max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            Select Delivery Location
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Click on the map to select your delivery location
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Interactive map */}
          <div className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border">
            <ClickableMap
              latitude={selectedLat}
              longitude={selectedLng}
              onChange={handleLocationChange}
              clickable={true}
              storeName="Delivery Location"
            />
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Selected: Lat {selectedLat.toFixed(6)}, Lng {selectedLng.toFixed(6)}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" className="flex-1 text-sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 gradient-primary text-sm" onClick={handleConfirm}>
              <Check className="w-4 h-4 mr-2" />
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapSelectionDialog;
