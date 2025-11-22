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
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { GetFoodDTO } from '@/api/user/types';
import { getAllCategories, addCategory } from '@/api/food';
import { getFoodImageUrl } from '@/lib/imageUtils';

interface AddEditFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food?: GetFoodDTO | null;
  onSave: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

const AddEditFoodDialog = ({ open, onOpenChange, food, onSave, isLoading }: AddEditFoodDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    eachPrice: '',
    cost: '',
    cookingTime: '',
    foodDescription: '',
    catId: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ catId?: string; catName?: string }[]>([]);
  const [otherTopics, setOtherTopics] = useState<string[]>(['']);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (food) {
      // Find catId from categories list by matching catName
      const category = categories.find(cat => cat.catName === food.catName);
      
      setFormData({
        name: food.name || '',
        eachPrice: food.eachPrice?.toString() || '',
        cost: food.cost?.toString() || '',
        cookingTime: food.cookingTime?.toString() || '',
        foodDescription: food.foodDescription || '',
        catId: category?.catId || '',
      });
      if (food.foodImage) {
        setImagePreview(getFoodImageUrl(food.foodImage));
      }
      setOtherTopics(food.othertopicName && food.othertopicName.length > 0 ? food.othertopicName : ['']);
    } else {
      setFormData({
        name: '',
        eachPrice: '',
        cost: '',
        cookingTime: '',
        foodDescription: '',
        catId: '',
      });
      setImagePreview(null);
      setImageFile(null);
      setOtherTopics(['']);
    }
  }, [food, categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setAddingCategory(true);
    try {
      const response = await addCategory(newCategoryName.trim());
      if (response && response.data) {
        toast.success('Category added successfully!');
        // Refresh categories list
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        // Set the new category as selected
        setFormData({ ...formData, catId: response.data.catId || '' });
        // Reset add category form
        setNewCategoryName('');
        setShowAddCategory(false);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddTopic = () => {
    setOtherTopics([...otherTopics, '']);
  };

  const handleRemoveTopic = (index: number) => {
    setOtherTopics(otherTopics.filter((_, i) => i !== index));
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...otherTopics];
    newTopics[index] = value;
    setOtherTopics(newTopics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.eachPrice || !formData.catId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const submitData = new FormData();
    submitData.append('Name', formData.name);
    submitData.append('EachPrice', formData.eachPrice);
    submitData.append('Cost', formData.cost || '0');
    submitData.append('CookingTime', formData.cookingTime || '0');
    submitData.append('FoodDescription', formData.foodDescription);
    submitData.append('CatId', formData.catId);

    if (imageFile) {
      submitData.append('FoodImage', imageFile);
    }

    // Add other topics (filter out empty strings)
    const validTopics = otherTopics.filter(topic => topic.trim() !== '');
    validTopics.forEach((topic, index) => {
      submitData.append(`OthertopicName[${index}]`, topic);
    });

    if (food?.foodId) {
      submitData.append('FoodId', food.foodId);
    }

    await onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: isDark ? '#27272a' : '#fff', color: isDark ? '#fff' : '#000' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            {food ? 'Edit Food' : 'Add New Food'}
          </DialogTitle>
          <DialogDescription style={{ color: isDark ? '#a1a1aa' : '#6b7280' }}>
            {food ? 'Update food details below' : 'Fill in the details to add a new food item'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>Food Image *</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-2">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Food Name */}
            <div className="col-span-2 space-y-2">
              <label htmlFor="name" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Food Name *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Burger Deluxe"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Category *
              </label>
              <div className="space-y-2">
                <select
                  id="category"
                  value={formData.catId}
                  onChange={(e) => setFormData({ ...formData, catId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  style={{ backgroundColor: isDark ? '#3f3f46' : '#fff', color: isDark ? '#fff' : '#000' }}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.catId} value={cat.catId}>
                      {cat.catName}
                    </option>
                  ))}
                </select>
                
                {/* Add Category Button */}
                {!showAddCategory ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddCategory(true)}
                    className="w-full gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Category
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      disabled={addingCategory}
                    />
                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={addingCategory}
                      size="sm"
                    >
                      {addingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName('');
                      }}
                      disabled={addingCategory}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Price *
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.eachPrice}
                onChange={(e) => setFormData({ ...formData, eachPrice: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            {/* Cost */}
            <div className="space-y-2">
              <label htmlFor="cost" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Cost
              </label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0.00"
              />
            </div>

            {/* Cooking Time */}
            <div className="space-y-2">
              <label htmlFor="cookingTime" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Cooking Time (minutes)
              </label>
              <Input
                id="cookingTime"
                type="number"
                value={formData.cookingTime}
                onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                placeholder="0"
              />
            </div>

            {/* Description */}
            <div className="col-span-2 space-y-2">
              <label htmlFor="description" className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>
                Description
              </label>
              <textarea
                id="description"
                value={formData.foodDescription}
                onChange={(e) => setFormData({ ...formData, foodDescription: e.target.value })}
                placeholder="Food description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-20"
                style={{ backgroundColor: isDark ? '#3f3f46' : '#fff', color: isDark ? '#fff' : '#000' }}
              />
            </div>

            {/* Other Topics */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>Additional Topics (Optional)</label>
              {otherTopics.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    placeholder="e.g., Spicy, Vegetarian"
                  />
                  {otherTopics.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveTopic(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTopic}
                className="w-full"
                style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
              >
                + Add Topic
              </Button>
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
              className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {food ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>{food ? 'Update Food' : 'Add Food'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditFoodDialog;
