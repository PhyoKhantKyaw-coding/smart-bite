import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Edit,
  Trash2,
  Search,
  SortAsc,
  SortDesc,
  Clock,
  DollarSign,
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

interface FoodTableProps {
  foods: GetFoodDTO[];
  onEdit: (food: GetFoodDTO) => void;
  onDelete: (foodId: string) => void;
  isLoading: boolean;
}

const FoodTable = ({ foods, onEdit, onDelete, isLoading }: FoodTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<GetFoodDTO | null>(null);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSort = (column: 'name' | 'price' | 'category') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedFoods = foods
    .filter((food) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        food.name?.toLowerCase().includes(searchLower) ||
        food.catName?.toLowerCase().includes(searchLower) ||
        food.foodDescription?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      if (sortBy === 'name') {
        aValue = a.name || '';
        bValue = b.name || '';
      } else if (sortBy === 'price') {
        aValue = a.eachPrice || 0;
        bValue = b.eachPrice || 0;
      } else if (sortBy === 'category') {
        aValue = a.catName || '';
        bValue = b.catName || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

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

  const SortIcon = ({ column }: { column: 'name' | 'price' | 'category' }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? (
      <SortAsc className="w-4 h-4 ml-1" />
    ) : (
      <SortDesc className="w-4 h-4 ml-1" />
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search foods by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredAndSortedFoods.length} of {foods.length} foods
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow style={{ color: isDark ? 'black' : 'white' }}>
                <TableHead className="w-[80px]" style={{ color: isDark ? 'white' : 'black' }}>Image</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center font-semibold hover:text-yellow-600 transition-colors"
                    style={{ color: isDark ? '#fff' : '#000' }}
                  >
                    Name
                    <SortIcon column="name" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center font-semibold hover:text-yellow-600 transition-colors"
                    style={{ color: isDark ? '#fff' : '#000' }}
                  >
                    Category
                    <SortIcon column="category" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center font-semibold hover:text-yellow-600 transition-colors"
                    style={{ color: isDark ? '#fff' : '#000' }}
                  >
                    Price
                    <SortIcon column="price" />
                  </button>
                </TableHead>
                <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Cost</TableHead>
                <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Profit</TableHead>
                <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Cooking Time</TableHead>
                <TableHead style={{ color: isDark ? '#fff' : '#000' }}>Topics</TableHead>
                <TableHead className="text-right" style={{ color: isDark ? '#fff' : '#000' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                      <span className="ml-2 text-gray-500">Loading foods...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedFoods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchQuery ? 'No foods found matching your search' : 'No foods available'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedFoods.map((food) => (
                  <TableRow key={food.foodId} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                        {food.foodImage ? (
                          <img
                            src={`https://localhost:7112/api/${food.foodImage}`}
                            alt={food.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                            <span className="text-2xl">🍔</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>{food.name}</div>
                        {food.foodDescription && (
                          <div className="text-xs text-amber-400 mt-1 max-w-[200px] truncate">
                            {food.foodDescription}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className=" text-blue-800">
                        {food.catName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-green-600 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        {food.eachPrice?.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-red-600">
                        ${food.cost?.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-yellow-600 font-medium">
                        ${food.profit?.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center" style={{ color: isDark ? '#fff' : '#000' }}>
                        <Clock className="w-4 h-4 mr-1" />
                        {food.cookingTime} min
                      </div>
                    </TableCell>
                    <TableCell>
                      {food.othertopicName && food.othertopicName.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {food.othertopicName.slice(0, 2).map((topic, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                            >
                              {topic}
                            </Badge>
                          ))}
                          {food.othertopicName.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{food.othertopicName.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(food)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(food)}
                          className="hover:bg-red-50 hover:text-red-600"
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
