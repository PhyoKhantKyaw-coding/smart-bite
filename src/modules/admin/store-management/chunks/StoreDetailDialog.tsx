import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Package, Store, Map } from 'lucide-react';
import ClickableMap from '@/components/ClickableMap';
import type { GetStoreDTO } from '@/api/store/types';
import type { GetFoodDTO } from '@/api/food/types';
import { getAllFoods } from '@/api/food';

interface StoreDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: GetStoreDTO | null;
}

const StoreDetailDialog = ({ open, onOpenChange, store }: StoreDetailDialogProps) => {
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));
  const [foods, setFoods] = useState<GetFoodDTO[]>([]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await getAllFoods();
        if (response && response.data) {
          setFoods(response.data);
        }
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };
    if (open) {
      fetchFoods();
    }
  }, [open]);

  if (!store) return null;

  const getFoodName = (foodId: string) => {
    const food = foods.find(f => f.foodId === foodId);
    return food?.name || 'Unknown Food';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="overflow-y-auto" 
        style={{ 
          backgroundColor: isDark ? '#27272a' : '#fff', 
          color: isDark ? '#fff' : '#000', 
          width: '90vw',
          maxWidth: '90vw',
          height: '85vh',
          maxHeight: '85vh'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Store Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Left Column - Store Information */}
          <div className="space-y-6 overflow-y-auto pr-2">
            {/* Basic Info Card */}
            <div className="p-4 rounded-lg border" style={{ 
              backgroundColor: isDark ? '#3f3f46' : '#f9fafb',
              borderColor: isDark ? '#52525b' : '#e5e7eb'
            }}>
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                  Basic Information
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Store Name
                  </label>
                  <p className="text-base font-medium mt-1" style={{ color: isDark ? '#fff' : '#000' }}>
                    {store.storeName || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Town
                  </label>
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                      {store.townName || 'N/A'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <p className="text-base mt-1" style={{ color: isDark ? '#fff' : '#000' }}>
                    {store.storePlace || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <p className="text-base mt-1" style={{ color: isDark ? '#fff' : '#000' }}>
                    {store.storePhNo || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Coordinates
                  </label>
                  <p className="text-sm mt-1" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                    {store.storeLatitude && store.storeLongitude 
                      ? `${store.storeLatitude.toFixed(6)}, ${store.storeLongitude.toFixed(6)}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory Card */}
            <div className="p-4 rounded-lg border" style={{ 
              backgroundColor: isDark ? '#3f3f46' : '#f9fafb',
              borderColor: isDark ? '#52525b' : '#e5e7eb'
            }}>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                  Store Inventory
                </h3>
              </div>

              {store.inventory && store.inventory.length > 0 ? (
                <div className="space-y-2">
                  {store.inventory.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-md"
                      style={{ 
                        backgroundColor: isDark ? '#27272a' : '#fff',
                        borderLeft: '4px solid',
                        borderColor: '#8b5cf6'
                      }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                          {getFoodName(item.foodId || '')}
                        </p>
                        <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                          Food ID: {item.foodId?.substring(0, 8)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Qty: {item.availableQty || 0}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  No inventory items available
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="space-y-3 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                Store Location
              </h3>
            </div>
            
            <div className="flex-1 rounded-lg overflow-hidden border-2" style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
              <ClickableMap
                latitude={store.storeLatitude || 16.7967}
                longitude={store.storeLongitude || 96.1610}
                onChange={() => {}}
                clickable={false}
                storeName={store.storeName || 'Store Location'}
              />
            </div>

            <div className="p-3 rounded-md" style={{ 
              backgroundColor: isDark ? '#3f3f46' : '#f3f4f6'
            }}>
              <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                📍 This map shows the exact location of the store. The marker indicates the store's coordinates.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreDetailDialog;
