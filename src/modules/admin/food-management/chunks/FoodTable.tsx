import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Edit,
  Trash2,
  Search,
  Clock,
  DollarSign,
  UtensilsCrossed,
  Tag,
} from 'lucide-react';
import type { GetFoodDTO } from '@/api/user/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getFoodImageUrl } from '@/lib/imageUtils';

interface FoodTableProps {
  foods: GetFoodDTO[];
  onEdit: (food: GetFoodDTO) => void;
  onDelete: (foodId: string) => void;
  isLoading: boolean;
}

const FoodTable = ({ foods, onEdit, onDelete, isLoading }: FoodTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<GetFoodDTO | null>(null);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));
  const [filteredFoods, setFilteredFoods] = useState<GetFoodDTO[]>(foods);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const filtered = foods.filter((food) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        food.name?.toLowerCase().includes(searchLower) ||
        food.catName?.toLowerCase().includes(searchLower) ||
        food.foodDescription?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredFoods(filtered);
  }, [searchQuery, foods]);

  const handleDeleteClick = (food: GetFoodDTO) => {
    setSelectedFood(food);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFood?.foodId) {
      onDelete(selectedFood.foodId);
    }
    setDeleteDialogOpen(false);
    setSelectedFood(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          <p style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>Loading foods...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search Bar */}
        <div
          className="p-4 rounded-xl border backdrop-blur-sm"
          style={{
            backgroundColor: isDark ? 'rgba(39, 39, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDark ? '#3f3f46' : '#e4e4e7',
          }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#f59e0b' }} />
            <Input
              placeholder="Search foods by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-0"
              style={{
                backgroundColor: isDark ? '#27272a' : '#f4f4f5',
                color: isDark ? '#fff' : '#000',
              }}
            />
          </div>
        </div>

        {/* Foods Grid */}
        {filteredFoods.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl border"
            style={{
              backgroundColor: isDark ? '#27272a' : '#fff',
              borderColor: isDark ? '#3f3f46' : '#e4e4e7',
            }}
          >
            <UtensilsCrossed className="w-16 h-16 mx-auto mb-4" style={{ color: isDark ? '#52525b' : '#d4d4d8' }} />
            <p className="text-lg font-medium" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
              {searchQuery ? 'No foods found matching your search' : 'No foods available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <div
                key={food.foodId}
                className="group relative rounded-xl border p-6 hover:shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: isDark ? '#27272a' : '#fff',
                  borderColor: isDark ? '#3f3f46' : '#e4e4e7',
                }}
              >
                {/* Category Badge - Top Right */}
                <div className="absolute top-4 right-4">
                  <Badge
                    className="gap-1.5 px-3 py-1"
                    style={{
                      backgroundColor: 'rgba(251, 146, 60, 0.15)',
                      color: '#f97316',
                      border: '1px solid #f97316',
                    }}
                  >
                    <Tag className="w-3 h-3" />
                    {food.catName || 'Uncategorized'}
                  </Badge>
                </div>

                {/* Food Image & Name */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2" style={{ borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
                    {food.foodImage ? (
                      <img
                        src={getFoodImageUrl(food.foodImage)}
                        alt={food.name || 'Food'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
                            parent.innerHTML = '<span class="text-3xl">🍔</span>';
                            parent.style.display = 'flex';
                            parent.style.alignItems = 'center';
                            parent.style.justifyContent = 'center';
                          }
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}
                      >
                        <span className="text-3xl">🍔</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1" style={{ color: isDark ? '#fff' : '#000' }}>
                      {food.name || 'Unnamed Food'}
                    </h3>
                    {food.foodDescription && (
                      <p className="text-sm line-clamp-2" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>
                        {food.foodDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Food Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: isDark ? '#3f3f46' : '#f4f4f5' }}
                      >
                        <DollarSign className="w-4 h-4" style={{ color: '#22c55e' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>Price</p>
                        <p className="text-lg font-bold" style={{ color: '#22c55e' }}>
                          ${food.eachPrice?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: isDark ? '#3f3f46' : '#f4f4f5' }}
                      >
                        <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>Time</p>
                        <p className="text-sm font-semibold" style={{ color: isDark ? '#d4d4d8' : '#52525b' }}>
                          {food.cookingTime} min
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: isDark ? '#3f3f46' : '#fef3c7' }}
                    >
                      <p className="text-xs mb-1" style={{ color: isDark ? '#71717a' : '#92400e' }}>Cost</p>
                      <p className="text-base font-bold" style={{ color: isDark ? '#fbbf24' : '#f59e0b' }}>
                        ${food.cost?.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: isDark ? '#3f3f46' : '#d1fae5' }}
                    >
                      <p className="text-xs mb-1" style={{ color: isDark ? '#71717a' : '#065f46' }}>Profit</p>
                      <p className="text-base font-bold" style={{ color: isDark ? '#22c55e' : '#10b981' }}>
                        ${food.profit?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {food.othertopicName && food.othertopicName.length > 0 && (
                    <div>
                      <p className="text-xs mb-2" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>Topics</p>
                      <div className="flex flex-wrap gap-1">
                        {food.othertopicName.slice(0, 3).map((topic, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                            style={{
                              backgroundColor: isDark ? '#3f3f46' : '#faf5ff',
                              color: '#8b5cf6',
                              borderColor: '#8b5cf6',
                            }}
                          >
                            {topic}
                          </Badge>
                        ))}
                        {food.othertopicName.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              backgroundColor: isDark ? '#3f3f46' : '#f4f4f5',
                              color: isDark ? '#a1a1aa' : '#71717a',
                              borderColor: isDark ? '#52525b' : '#d4d4d8',
                            }}
                          >
                            +{food.othertopicName.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t" style={{ borderColor: isDark ? '#3f3f46' : '#e4e4e7' }}>
                  <Button
                    onClick={() => onEdit(food)}
                    variant="outline"
                    className="flex-1 gap-2"
                    style={{
                      backgroundColor: isDark ? '#3f3f46' : '#f4f4f5',
                      color: isDark ? '#fff' : '#000',
                      borderColor: isDark ? '#52525b' : '#d4d4d8',
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(food)}
                    variant="destructive"
                    className="flex-1 gap-2"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{selectedFood?.name}". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FoodTable;
