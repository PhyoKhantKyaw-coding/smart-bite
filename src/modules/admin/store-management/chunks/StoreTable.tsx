import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MapPin, Search, Phone, Loader2, Eye } from 'lucide-react';
import { getStoreById } from '@/api/store';
import { toast } from 'sonner';
import StoreDetailDialog from './StoreDetailDialog';
import type { GetStoreDTO } from '@/api/store/types';

interface StoreTableProps {
  stores: GetStoreDTO[];
  onEdit: (store: GetStoreDTO) => void;
  onDelete: (storeId: string) => void;
  onViewMap: (store: GetStoreDTO) => void;
  isLoading: boolean;
}

const StoreTable = ({ stores, onEdit, onDelete, onViewMap, isLoading }: StoreTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStores, setFilteredStores] = useState<GetStoreDTO[]>(stores);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));
  const [loadingStoreId, setLoadingStoreId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<GetStoreDTO | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const filtered = stores.filter(store =>
      store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storePlace?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.townName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storePhNo?.includes(searchTerm)
    );
    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  const handleEdit = async (storeId: string) => {
    try {
      setLoadingStoreId(storeId);
      const response = await getStoreById(storeId);
      
      if (response.data) {
        onEdit(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch store details');
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      toast.error('Failed to load store data');
    } finally {
      setLoadingStoreId(null);
    }
  };

  const handleViewDetail = async (storeId: string) => {
    try {
      setLoadingStoreId(storeId);
      const response = await getStoreById(storeId);
      
      if (response.data) {
        setSelectedStore(response.data);
        setDetailDialogOpen(true);
      } else {
        toast.error(response.message || 'Failed to fetch store details');
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      toast.error('Failed to load store data');
    } finally {
      setLoadingStoreId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Store Detail Dialog */}
      <StoreDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        store={selectedStore}
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search stores by name, place, town, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border" style={{ backgroundColor: isDark ? '#27272a' : '#fff' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Store Name</TableHead>
              <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Town</TableHead>
              <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Location</TableHead>
              <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Contact</TableHead>
              <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Coordinates</TableHead>
              <TableHead className="text-right" style={{ color: isDark ? '#fff' : '#000' }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No stores found matching your search' : 'No stores available'}
                </TableCell>
              </TableRow>
            ) : (
              filteredStores.map((store) => (
                <TableRow key={store.storeId}>
                  <TableCell>
                    <div className="font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                      {store.storeName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                      {store.townName || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    {store.storePlace || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      <Phone className="w-3 h-3" />
                      {store.storePhNo || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    <div className="text-xs">
                      {store.storeLatitude && store.storeLongitude 
                        ? `${store.storeLatitude.toFixed(4)}, ${store.storeLongitude.toFixed(4)}`
                        : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(store.storeId)}
                        disabled={loadingStoreId === store.storeId}
                        className="gap-1"
                        style={{ 
                          backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#52525b' : '#d1d5db'
                        }}
                      >
                        {loadingStoreId === store.storeId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Detail
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewMap(store)}
                        className="gap-1"
                        style={{ 
                          backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#52525b' : '#d1d5db'
                        }}
                      >
                        <MapPin className="w-4 h-4" />
                        Map
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(store.storeId)}
                        disabled={loadingStoreId === store.storeId}
                        className="gap-1"
                        style={{ 
                          backgroundColor: isDark ? '#3f3f46' : '#f3f4f6',
                          color: isDark ? '#fff' : '#000',
                          borderColor: isDark ? '#52525b' : '#d1d5db'
                        }}
                      >
                        {loadingStoreId === store.storeId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(store.storeId)}
                        className="gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StoreTable;
