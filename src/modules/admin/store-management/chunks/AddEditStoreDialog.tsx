import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Plus, Trash2, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import ClickableMap from '@/components/ClickableMap';
import type { GetStoreDTO, StoreInventoryDTO, TownDTO, AddTownDTO } from '@/api/store/types';
import type { GetFoodDTO } from '@/api/food/types';
import { getAllFoods } from '@/api/food';
import { addTown, getAllTowns } from '@/api/store';

interface AddEditStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store?: GetStoreDTO | null;
  towns: TownDTO[];
  onSave: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
}

const AddEditStoreDialog = ({ open, onOpenChange, store, towns: initialTowns, onSave, isLoading }: AddEditStoreDialogProps) => {
  const [formData, setFormData] = useState({
    storeName: '',
    storePlace: '',
    storePhNo: '',
    townId: '',
    storeLatitude: '',
    storeLongitude: '',
  });
  const [inventory, setInventory] = useState<(StoreInventoryDTO & { inventoryId?: string })[]>([]);
  const [foods, setFoods] = useState<GetFoodDTO[]>([]);
  const [towns, setTowns] = useState<TownDTO[]>(initialTowns);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savingTown, setSavingTown] = useState(false);
  const [showingTownForm, setShowingTownForm] = useState(false);
  const [townFormData, setTownFormData] = useState({
    townName: '',
    centerLatitude: '',
    centerLongitude: '',
    radiusKm: '',
  });
  const rowsPerPage = 3;

  // Update towns when initialTowns changes
  useEffect(() => {
    setTowns(initialTowns);
  }, [initialTowns]);

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

  useEffect(() => {
    if (store) {
      // Find townId by townName if townId is not provided
      let townIdToSet = store.townId || '';
      if (!townIdToSet && store.townName && towns.length > 0) {
        const matchingTown = towns.find(t => t.townName === store.townName);
        if (matchingTown) {
          townIdToSet = matchingTown.townId || '';
        }
      }

      setFormData({
        storeName: store.storeName || '',
        storePlace: store.storePlace || '',
        storePhNo: store.storePhNo || '',
        townId: townIdToSet,
        storeLatitude: store.storeLatitude?.toString() || '',
        storeLongitude: store.storeLongitude?.toString() || '',
      });
      // Populate inventory from store data
      if (store.inventory && store.inventory.length > 0) {
        setInventory(store.inventory.map(item => ({
          inventoryId: item.inventoryId,
          foodId: item.foodId || '',
          availableQty: item.availableQty || 0,
        })));
      } else {
        setInventory([]);
      }
      // Reset to first page when editing
      setCurrentPage(1);
    } else {
      // Default to Yangon coordinates for new store
      setFormData({
        storeName: '',
        storePlace: '',
        storePhNo: '',
        townId: '',
        storeLatitude: '16.7967',
        storeLongitude: '96.1610',
      });
      setInventory([]);
      setCurrentPage(1);
    }
  }, [store, towns]);

  const handleMapClick = (lat: number, lng: number) => {
    if (showingTownForm) {
      // Update town form when in town mode
      setTownFormData({
        ...townFormData,
        centerLatitude: lat.toFixed(6),
        centerLongitude: lng.toFixed(6),
      });
      
      // Auto-fill town name via reverse geocoding
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const townName = data.address?.city || data.address?.town || data.address?.county || data.address?.state || '';
          if (townName) {
            setTownFormData(prev => ({ ...prev, townName }));
          }
        })
        .catch(error => console.error('Error fetching location name:', error));
    } else {
      // Update store form when in store mode
      setFormData({
        ...formData,
        storeLatitude: lat.toFixed(6),
        storeLongitude: lng.toFixed(6),
      });
    }
  };

  const handleAddInventoryItem = () => {
    setInventory([...inventory, { foodId: '', availableQty: 0 }]);
    // Reset to last page when adding new item
    const newTotalPages = Math.ceil((inventory.length + 1) / rowsPerPage);
    setCurrentPage(newTotalPages);
  };

  const handleRemoveInventoryItem = (index: number) => {
    const globalIndex = (currentPage - 1) * rowsPerPage + index;
    setInventory(inventory.filter((_, i) => i !== globalIndex));
    // Adjust page if current page becomes empty
    const newTotalPages = Math.ceil((inventory.length - 1) / rowsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleInventoryChange = (index: number, field: 'foodId' | 'availableQty', value: string | number) => {
    const globalIndex = (currentPage - 1) * rowsPerPage + index;
    const newInventory = [...inventory];
    newInventory[globalIndex] = { ...newInventory[globalIndex], [field]: value };
    setInventory(newInventory);
  };

  const handleSaveTown = async (data: AddTownDTO) => {
    setSavingTown(true);
    try {
      await addTown(data);
      toast.success('Town added successfully!');
      
      // Refresh towns list
      const response = await getAllTowns();
      if (response && response.data) {
        setTowns(response.data);
        // Set the newly added town (last one) as selected
        const newTown = response.data[response.data.length - 1];
        if (newTown && newTown.townId) {
          setFormData({ ...formData, townId: newTown.townId });
        }
      }
      
      // Reset town form and hide it
      setShowingTownForm(false);
      setTownFormData({
        townName: '',
        centerLatitude: '',
        centerLongitude: '',
        radiusKm: '',
      });
    } catch (error) {
      console.error('Error saving town:', error);
      toast.error('Failed to save town');
    } finally {
      setSavingTown(false);
    }
  };

  const handleAddNewTown = () => {
    setShowingTownForm(true);
    setShowMap(true); // Ensure map is shown
    // Set default Yangon coordinates for town
    setTownFormData({
      townName: '',
      centerLatitude: '16.7967',
      centerLongitude: '96.1610',
      radiusKm: '5',
    });
  };

  const handleCancelTownForm = () => {
    setShowingTownForm(false);
    setTownFormData({
      townName: '',
      centerLatitude: '',
      centerLongitude: '',
      radiusKm: '',
    });
  };

  const handleSubmitTownForm = async () => {
    if (!townFormData.townName || !townFormData.centerLatitude || !townFormData.centerLongitude) {
      toast.error('Please fill in all required town fields');
      return;
    }

    const townData: AddTownDTO = {
      townName: townFormData.townName,
      centerLatitude: parseFloat(townFormData.centerLatitude),
      centerLongitude: parseFloat(townFormData.centerLongitude),
      radiusKm: parseFloat(townFormData.radiusKm) || 5,
    };

    await handleSaveTown(townData);
  };

  // Pagination calculations
  const totalPages = Math.ceil(inventory.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentInventory = inventory.slice(startIndex, endIndex);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.storeName || !formData.townId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const submitData = {
      ...(store?.storeId && { storeId: store.storeId }),
      townId: formData.townId,
      storeName: formData.storeName,
      storePlace: formData.storePlace,
      storePhNo: formData.storePhNo,
      storeLatitude: parseFloat(formData.storeLatitude) || 0,
      storeLongitude: parseFloat(formData.storeLongitude) || 0,
      inventory: inventory
        .filter(item => item.foodId && item.availableQty)
        .map(item => ({
          ...(item.inventoryId && { inventoryId: item.inventoryId }),
          foodId: item.foodId,
          availableQty: item.availableQty,
        })),
    };

    await onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="overflow-y-auto" 
        style={{ 
          backgroundColor: isDark ? '#27272a' : '#fff', 
          color: isDark ? '#fff' : '#000', 
          width: showMap ? '90vw' : '80vw',
          maxWidth: showMap ? '90vw' : '80vw',
          height: '85vh',
          maxHeight: '85vh'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            {store ? 'Edit Store' : 'Add New Store'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
          {/* Three Column Layout: Form Left, Map Center, Inventory Right (when map shown) */}
          <div className={`grid gap-6 flex-1 overflow-hidden ${showMap ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {/* Left Column - Store Form */}
            <div className="space-y-3 overflow-y-auto pr-2">
              <div className="space-y-2">
                <label htmlFor="storeName" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                  Store Name *
                </label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="e.g., Downtown Branch"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="townId" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                  Town *
                </label>
                <div className="flex gap-2">
                  <select
                    id="townId"
                    value={formData.townId}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        handleAddNewTown();
                      } else {
                        setFormData({ ...formData, townId: e.target.value });
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ backgroundColor: isDark ? '#3f3f46' : '#fff', color: isDark ? '#fff' : '#000' }}
                    required
                  >
                    <option value="">Select Town</option>
                    {towns.map((town) => (
                      <option key={town.townId} value={town.townId}>
                        {town.townName}
                      </option>
                    ))}
                    <option value="__ADD_NEW__" style={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold' }}>
                      + Add New Town
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="storePlace" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                  Location
                </label>
                <Input
                  id="storePlace"
                  value={formData.storePlace}
                  onChange={(e) => setFormData({ ...formData, storePlace: e.target.value })}
                  placeholder="e.g., Main Street"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="storePhNo" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                  Phone Number
                </label>
                <Input
                  id="storePhNo"
                  value={formData.storePhNo}
                  onChange={(e) => setFormData({ ...formData, storePhNo: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label htmlFor="latitude" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                    Latitude
                  </label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.storeLatitude}
                    onChange={(e) => setFormData({ ...formData, storeLatitude: e.target.value })}
                    placeholder="16.7967"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="longitude" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                    Longitude
                  </label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.storeLongitude}
                    onChange={(e) => setFormData({ ...formData, storeLongitude: e.target.value })}
                    placeholder="96.1610"
                  />
                </div>
              </div>

              {/* Choose from Map Button */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMap(!showMap)}
                  className="w-full gap-2"
                  style={{ 
                    backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                    color: isDark ? '#fff' : '#000',
                    borderColor: isDark ? '#52525b' : '#d1d5db'
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  {showMap ? 'Hide Map' : 'Choose from Map'}
                </Button>
              </div>
            </div>

            {/* Center Column - Map or Town Form (Conditional) */}
            {showMap && (
              <div className="space-y-3 flex flex-col overflow-hidden">
                {showingTownForm ? (
                  /* Town Form Mode */
                  <>
                    <label className="text-sm font-medium flex items-center gap-2" style={{ color: isDark ? '#fff' : '#000' }}>
                      <MapPin className="w-4 h-4" />
                      Add New Town
                    </label>

                    {/* Town Form Fields */}
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                      <div className="space-y-2">
                        <label htmlFor="townName" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                          Town Name *
                        </label>
                        <Input
                          id="townName"
                          value={townFormData.townName}
                          onChange={(e) => setTownFormData({ ...townFormData, townName: e.target.value })}
                          placeholder="e.g., Yangon"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <label htmlFor="townLat" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                            Center Latitude *
                          </label>
                          <Input
                            id="townLat"
                            type="number"
                            step="any"
                            value={townFormData.centerLatitude}
                            onChange={(e) => setTownFormData({ ...townFormData, centerLatitude: e.target.value })}
                            placeholder="16.7967"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="townLng" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                            Center Longitude *
                          </label>
                          <Input
                            id="townLng"
                            type="number"
                            step="any"
                            value={townFormData.centerLongitude}
                            onChange={(e) => setTownFormData({ ...townFormData, centerLongitude: e.target.value })}
                            placeholder="96.1610"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="radiusKm" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                          Radius (km)
                        </label>
                        <Input
                          id="radiusKm"
                          type="number"
                          step="0.1"
                          value={townFormData.radiusKm}
                          onChange={(e) => setTownFormData({ ...townFormData, radiusKm: e.target.value })}
                          placeholder="5"
                        />
                      </div>

                      {/* Map for Town */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                          Click map to set town center
                        </label>
                        <div className="w-full h-[250px] rounded-lg overflow-hidden border-2" style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
                          <ClickableMap
                            latitude={parseFloat(townFormData.centerLatitude) || 16.7967}
                            longitude={parseFloat(townFormData.centerLongitude) || 96.1610}
                            onChange={handleMapClick}
                            clickable={true}
                            storeName={townFormData.townName || 'Town Center'}
                          />
                        </div>
                        <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                          Click on the map to set town center. Town name will auto-fill.
                        </p>
                      </div>

                      {/* Town Form Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelTownForm}
                          className="flex-1"
                          style={{ 
                            backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                            color: isDark ? '#fff' : '#000',
                            borderColor: isDark ? '#52525b' : '#d1d5db'
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSubmitTownForm}
                          disabled={savingTown}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {savingTown ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Town'
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Store Location Map Mode */
                  <>
                    <label className="text-sm font-medium flex items-center gap-2" style={{ color: isDark ? '#fff' : '#000' }}>
                      <MapPin className="w-4 h-4" />
                      Select Store Location on Map
                    </label>
                    <div className="flex-1 rounded-lg overflow-hidden border-2" style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
                      <ClickableMap
                        latitude={parseFloat(formData.storeLatitude) || 16.7967}
                        longitude={parseFloat(formData.storeLongitude) || 96.1610}
                        onChange={handleMapClick}
                        clickable={true}
                        storeName={formData.storeName || 'Store Location'}
                      />
                    </div>
                    <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      Click on the map to set store location
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Right Column - Store Inventory Management */}
            <div className="space-y-3 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: isDark ? '#fff' : '#000' }}>
                  <Package className="w-4 h-4" />
                  Store Inventory
                </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddInventoryItem}
                    className="gap-2"
                    style={{ 
                      backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                      color: isDark ? '#fff' : '#000',
                      borderColor: isDark ? '#52525b' : '#d1d5db'
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>

                {inventory.length > 0 && (
                  <div className="flex-1 flex flex-col overflow-hidden rounded-lg border" style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
                    <div className="flex-1 overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0" style={{ backgroundColor: isDark ? '#3f3f46' : '#f3f4f6' }}>
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                              Food Item
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentInventory.map((item, index) => (
                          <tr 
                            key={index} 
                            className="border-t" 
                            style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}
                          >
                            <td className="px-4 py-3">
                              <select
                                value={item.foodId}
                                onChange={(e) => handleInventoryChange(index, 'foodId', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                style={{ backgroundColor: isDark ? '#27272a' : '#fff', color: isDark ? '#fff' : '#000' }}
                              >
                                <option value="">Select Food</option>
                                {foods.map((food) => (
                                  <option key={food.foodId} value={food.foodId}>
                                    {food.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                value={item.availableQty}
                                onChange={(e) => handleInventoryChange(index, 'availableQty', parseInt(e.target.value) || 0)}
                                placeholder="Qty"
                                className="w-full"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveInventoryItem(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb', backgroundColor: isDark ? '#27272a' : '#fff' }}>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="gap-1"
                            style={{ 
                              backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                              color: isDark ? '#fff' : '#000',
                              borderColor: isDark ? '#52525b' : '#d1d5db'
                            }}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, idx) => (
                              typeof page === 'number' ? (
                                <Button
                                  key={idx}
                                  type="button"
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className={currentPage === page ? "bg-gradient-to-r from-purple-500 to-blue-500" : ""}
                                  style={currentPage === page ? {} : { 
                                    backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                                    color: isDark ? '#fff' : '#000',
                                    borderColor: isDark ? '#52525b' : '#d1d5db'
                                  }}
                                >
                                  {page}
                                </Button>
                              ) : (
                                <span key={idx} className="px-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                                  {page}
                                </span>
                              )
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="gap-1"
                            style={{ 
                              backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                              color: isDark ? '#fff' : '#000',
                              borderColor: isDark ? '#52525b' : '#d1d5db'
                            }}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons in Inventory Section */}
                <div className="flex gap-2 pt-4 border-t" style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                    className="flex-1"
                    style={{ 
                      backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                      color: isDark ? '#fff' : '#000',
                      borderColor: isDark ? '#52525b' : '#d1d5db'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {store ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>{store ? 'Update Store' : 'Add Store'}</>
                    )}
                  </Button>
                </div>
              </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditStoreDialog;
