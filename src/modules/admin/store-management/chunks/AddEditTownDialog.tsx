import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import ClickableMap from '@/components/ClickableMap';
import type { TownDTO, AddTownDTO } from '@/api/store/types';

interface AddEditTownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  town?: TownDTO | null;
  onSave: (data: AddTownDTO) => Promise<void>;
  isLoading: boolean;
}

const AddEditTownDialog = ({ open, onOpenChange, town, onSave, isLoading }: AddEditTownDialogProps) => {
  const [formData, setFormData] = useState({
    townName: '',
    centerLatitude: '',
    centerLongitude: '',
    radiusKm: '',
  });
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (town) {
      setFormData({
        townName: town.townName || '',
        centerLatitude: town.centerLatitude?.toString() || '',
        centerLongitude: town.centerLongitude?.toString() || '',
        radiusKm: town.radiusKm?.toString() || '',
      });
    } else {
      // Default to Yangon coordinates when adding new town
      setFormData({
        townName: '',
        centerLatitude: '16.7967',
        centerLongitude: '96.1610',
        radiusKm: '5',
      });
    }
  }, [town]);

  const handleMapClick = async (lat: number, lng: number) => {
    // Always generate town name from coordinates when clicking on map
    let townName = '';
    
    // Try to get location name from Nominatim (OpenStreetMap)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      
      // Extract meaningful location name - prioritize city/town names
      const address = data.address || {};
      townName = 
        address.city || 
        address.town || 
        address.municipality || 
        address.county || 
        address.state_district || 
        address.state || 
        `Town ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Error fetching location name:', error);
      // Fallback to coordinate-based name
      townName = `Town ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    setFormData({
      ...formData,
      townName,
      centerLatitude: lat.toFixed(6),
      centerLongitude: lng.toFixed(6),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.townName || !formData.centerLatitude || !formData.centerLongitude) {
      toast.error('Please fill in all required fields');
      return;
    }

    const submitData: TownDTO = {
      ...(town?.townId && { townId: town.townId }),
      townName: formData.townName,
      centerLatitude: parseFloat(formData.centerLatitude),
      centerLongitude: parseFloat(formData.centerLongitude),
      radiusKm: parseFloat(formData.radiusKm) || 5,
    };

    await onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto" style={{ backgroundColor: isDark ? '#27272a' : '#fff', color: isDark ? '#fff' : '#000' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {town ? 'Edit Town' : 'Add New Town'}
          </DialogTitle>
          <DialogDescription style={{ color: isDark ? '#a1a1aa' : '#6b7280' }}>
            {town ? 'Update town details below' : 'Fill in the details to add a new town'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Town Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <label htmlFor="townName" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Town Name *
              </label>
              <Input
                id="townName"
                value={formData.townName}
                onChange={(e) => setFormData({ ...formData, townName: e.target.value })}
                placeholder="e.g., Downtown, North District"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="centerLatitude" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Center Latitude *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="centerLatitude"
                  type="number"
                  step="any"
                  value={formData.centerLatitude}
                  onChange={(e) => setFormData({ ...formData, centerLatitude: e.target.value })}
                  placeholder="16.7967"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="centerLongitude" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Center Longitude *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="centerLongitude"
                  type="number"
                  step="any"
                  value={formData.centerLongitude}
                  onChange={(e) => setFormData({ ...formData, centerLongitude: e.target.value })}
                  placeholder="96.1610"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <label htmlFor="radiusKm" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Radius (Kilometers) *
              </label>
              <Input
                id="radiusKm"
                type="number"
                step="0.1"
                value={formData.radiusKm}
                onChange={(e) => setFormData({ ...formData, radiusKm: e.target.value })}
                placeholder="5.0"
                required
              />
              <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                The delivery radius from the town center
              </p>
            </div>

            {/* Interactive Map */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: isDark ? '#fff' : '#000' }}>
                <MapPin className="w-4 h-4" />
                Select Town Center on Map
              </label>
              <div className="h-[400px] rounded-lg overflow-hidden border-2" style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
                <ClickableMap
                  latitude={parseFloat(formData.centerLatitude) || 16.7967}
                  longitude={parseFloat(formData.centerLongitude) || 96.1610}
                  onChange={handleMapClick}
                  clickable={true}
                  storeName={formData.townName || 'Town Center'}
                />
              </div>
              <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                Click anywhere on the map to set the town center location. Current: ({formData.centerLatitude}, {formData.centerLongitude})
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {town ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>{town ? 'Update Town' : 'Add Town'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTownDialog;
