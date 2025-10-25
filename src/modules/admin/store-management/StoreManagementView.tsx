import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Store, Package, MapPinned, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import StoreTable from './chunks/StoreTable';
import AddEditStoreDialog from './chunks/AddEditStoreDialog';
import StoreMapDialog from './chunks/StoreMapDialog';
import AddEditTownDialog from './chunks/AddEditTownDialog';
import { getAllStores, addStore, updateStore, deleteStore, getAllTowns, addTown } from '@/api/store';
import type { GetStoreDTO, TownDTO, AddStoreDTO, StoreDTO, AddTownDTO } from '@/api/store/types';

const StoreManagementView = () => {
  const [stores, setStores] = useState<GetStoreDTO[]>([]);
  const [towns, setTowns] = useState<TownDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [townDialogOpen, setTownDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<GetStoreDTO | null>(null);
  const [selectedTown, setSelectedTown] = useState<TownDTO | null>(null);
  const [viewMapStore, setViewMapStore] = useState<GetStoreDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllStores();
      if (response && response.data) {
        setStores(response.data);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTowns = useCallback(async () => {
    try {
      const response = await getAllTowns();
      if (response && response.data) {
        setTowns(response.data);
      }
    } catch (error) {
      console.error('Error fetching towns:', error);
      toast.error('Failed to load towns');
    }
  }, []);

  useEffect(() => {
    fetchStores();
    fetchTowns();
  }, [fetchStores, fetchTowns]);

  const handleAddNew = () => {
    setSelectedStore(null);
    setDialogOpen(true);
  };

  const handleEdit = (store: GetStoreDTO) => {
    setSelectedStore(store);
    setDialogOpen(true);
  };

  const handleViewMap = (store: GetStoreDTO) => {
    setViewMapStore(store);
    setMapDialogOpen(true);
  };

  const handleAddNewTown = () => {
    setSelectedTown(null);
    setTownDialogOpen(true);
  };

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      if (selectedStore?.storeId) {
        // Update store with inventory
        await updateStore(selectedStore.storeId, data as unknown as StoreDTO);
        toast.success('Store updated successfully!');
      } else {
        // Add store with inventory
        await addStore(data as unknown as AddStoreDTO);
        toast.success('Store added successfully!');
      }
      setDialogOpen(false);
      await fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      toast.error('Failed to save store');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTown = async (data: AddTownDTO) => {
    setSaving(true);
    try {
      await addTown(data);
      toast.success('Town added successfully!');
      setTownDialogOpen(false);
      await fetchTowns();
    } catch (error) {
      console.error('Error saving town:', error);
      toast.error('Failed to save town');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (storeId: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    
    try {
      await deleteStore(storeId);
      toast.success('Store deleted successfully!');
      await fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('Failed to delete store');
    }
  };

  // Group stores by town
  const storesByTown = stores.reduce((acc, store) => {
    const townName = store.townName || 'Unassigned';
    if (!acc[townName]) {
      acc[townName] = [];
    }
    acc[townName].push(store);
    return acc;
  }, {} as Record<string, GetStoreDTO[]>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Store Management
          </h1>
          <p className="mt-1" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
            Manage your stores, locations, and inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchStores}
            disabled={loading}
            className="gap-2"
            style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ color: isDark ? '#9ca3af' : '#4b5563' }} />
            Refresh
          </Button>
          <Button
            onClick={handleAddNewTown}
            variant="outline"
            className="gap-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <MapPinned className="w-4 h-4" />
            Add Town
          </Button>
          <Button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Store
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Stores</p>
              <p className="text-2xl font-bold text-purple-900">{stores.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Towns Covered</p>
              <p className="text-2xl font-bold text-blue-900">{Object.keys(storesByTown).length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <MapPinned className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Stores</p>
              <p className="text-2xl font-bold text-green-900">{stores.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Avg per Town</p>
              <p className="text-2xl font-bold text-orange-900">
                {Object.keys(storesByTown).length > 0 
                  ? (stores.length / Object.keys(storesByTown).length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <MapPinned className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stores by Town */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: isDark ? '#fff' : '#000' }}>
            <MapPinned className="w-6 h-6 text-purple-500" />
            Stores by Town
          </h2>
          <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            Click any store to view on map
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(storesByTown).map(([townName, townStores]) => (
            <div 
              key={townName}
              className="rounded-xl overflow-hidden border"
              style={{ 
                backgroundColor: isDark ? '#27272a' : '#fff',
                borderColor: isDark ? '#3f3f46' : '#e5e7eb'
              }}
            >
              {/* Town Header */}
              <div 
                className="px-4 py-3 border-b"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                  borderColor: isDark ? '#3f3f46' : '#e5e7eb'
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <MapPinned className="w-5 h-5" />
                    {townName}
                  </h3>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
                    {townStores.length} {townStores.length === 1 ? 'store' : 'stores'}
                  </span>
                </div>
              </div>

              {/* Store Cards */}
              <div className="p-3 space-y-2">
                {townStores.map((store) => (
                  <div
                    key={store.storeId}
                    className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all duration-200 group"
                    style={{ 
                      backgroundColor: isDark ? '#3f3f46' : '#f9fafb',
                      borderColor: isDark ? '#52525b' : '#e5e7eb'
                    }}
                    onClick={() => handleViewMap(store)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium mb-1 group-hover:text-purple-500 transition-colors" style={{ color: isDark ? '#fff' : '#000' }}>
                          {store.storeName}
                        </div>
                        <div className="text-sm flex items-center gap-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                          <MapPin className="w-3 h-3" />
                          {store.storePlace}
                        </div>
                        {store.storePhNo && (
                          <div className="text-xs mt-1 flex items-center gap-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                            <Phone className="w-3 h-3" />
                            {store.storePhNo}
                          </div>
                        )}
                      </div>
                      <MapPin className="w-5 h-5 text-purple-400 group-hover:text-purple-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
          All Stores
        </h2>
        <StoreTable
          stores={stores}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMap={handleViewMap}
          isLoading={loading}
        />
      </div>

      {/* Add/Edit Store Dialog */}
      <AddEditStoreDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        store={selectedStore}
        towns={towns}
        onSave={handleSave}
        isLoading={saving}
      />

      {/* Add/Edit Town Dialog */}
      <AddEditTownDialog
        open={townDialogOpen}
        onOpenChange={setTownDialogOpen}
        town={selectedTown}
        onSave={handleSaveTown}
        isLoading={saving}
      />

      {/* Map View Dialog */}
      <StoreMapDialog
        open={mapDialogOpen}
        onOpenChange={setMapDialogOpen}
        store={viewMapStore}
      />
    </div>
  );
};

export default StoreManagementView;
