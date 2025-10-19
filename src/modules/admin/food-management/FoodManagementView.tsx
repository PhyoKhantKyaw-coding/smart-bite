import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import FoodTable from './chunks/FoodTable';
import AddEditFoodDialog from './chunks/AddEditFoodDialog';
import { getAllFoods } from '@/api/user';
import type { GetFoodDTO } from '@/api/user/types';
import axios from '@/configs/axios';

const FoodManagementView = () => {
  const [foods, setFoods] = useState<GetFoodDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<GetFoodDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllFoods({ page: 1, pageSize: 1000 });
      console.log('Foods API Response:', response);
      
      if (response && response.data) {
        const foodsData = Array.isArray(response.data) ? response.data : [];
        setFoods(foodsData);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleAddNew = () => {
    setSelectedFood(null);
    setDialogOpen(true);
  };

  const handleEdit = (food: GetFoodDTO) => {
    setSelectedFood(food);
    setDialogOpen(true);
  };

  const handleSave = async (formData: FormData) => {
    setSaving(true);
    try {
      if (selectedFood?.foodId) {
        // Update existing food
        await axios.put('/Food/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Food updated successfully!');
      } else {
        // Add new food
        await axios.post('/Food/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Food added successfully!');
      }
      setDialogOpen(false);
      await fetchFoods();
    } catch (error) {
      console.error('Error saving food:', error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || 'Failed to save food'
        : 'Failed to save food';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (foodId: string) => {
    try {
      await axios.delete(`/Food/delete/${foodId}`);
      toast.success('Food deleted successfully!');
      await fetchFoods();
    } catch (error) {
      console.error('Error deleting food:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to delete food'
        : 'Failed to delete food';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Food Management
          </h1>
          <p className="mt-1" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>
            Manage your food items, categories, and pricing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchFoods}
            disabled={loading}
            className="gap-2"
            style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} style={{ color: isDark ? '#9ca3af' : '#4b5563' }} />
            Refresh
          </Button>
          <Button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Food
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Foods</p>
              <p className="text-2xl font-bold text-blue-900">{foods.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍔</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Avg Price</p>
              <p className="text-2xl font-bold text-green-900">
                ${(foods.reduce((sum, f) => sum + (f.eachPrice || 0), 0) / (foods.length || 1)).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Total Profit</p>
              <p className="text-2xl font-bold text-yellow-900">
                ${foods.reduce((sum, f) => sum + (f.profit || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Categories</p>
              <p className="text-2xl font-bold text-purple-900">
                {new Set(foods.map(f => f.catName)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">📂</span>
            </div>
          </div>
        </div>
      </div>

      {/* Food Table */}
      <FoodTable
        foods={foods}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />

      {/* Add/Edit Dialog */}
      <AddEditFoodDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        food={selectedFood}
        onSave={handleSave}
        isLoading={saving}
      />
    </div>
  );
};

export default FoodManagementView;
