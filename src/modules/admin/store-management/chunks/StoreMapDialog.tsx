import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { GetStoreDTO } from '@/api/store/types';
import { MapPin, Phone, MapPinned } from 'lucide-react';
import ClickableMap from '@/components/ClickableMap';

interface StoreMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: GetStoreDTO | null;
}

const StoreMapDialog = ({ open, onOpenChange, store }: StoreMapDialogProps) => {
  if (!store) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            {store.storeName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Store Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <MapPinned className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-xs text-gray-600">Town</div>
                <div className="font-semibold text-purple-900">{store.townName || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs text-gray-600">Location</div>
                <div className="font-semibold text-blue-900">{store.storePlace || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-xs text-gray-600">Phone</div>
                <div className="font-semibold text-green-900">{store.storePhNo || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-xs text-gray-600">Coordinates</div>
                <div className="font-semibold text-orange-900 text-sm">
                  {store.storeLatitude?.toFixed(6)}, {store.storeLongitude?.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] rounded-lg overflow-hidden border-2 border-gray-200">
            <ClickableMap
              latitude={store.storeLatitude || 16.7967}
              longitude={store.storeLongitude || 96.1610}
              clickable={false}
              storeName={store.storeName || 'Store'}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreMapDialog;
