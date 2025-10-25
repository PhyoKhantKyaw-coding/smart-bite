import axios from '@/configs/axios';
import type { ResponseDTO } from '@/api/user/types';
import type { 
  CategoryDTO, 
  GetFoodDTO 
} from './types';

// Add new food
export const addFood = async (formData: FormData): Promise<ResponseDTO<GetFoodDTO>> => {
  const response = await axios.post('/api/Food/AddFood', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update existing food
export const updateFood = async (formData: FormData): Promise<ResponseDTO<GetFoodDTO>> => {
  const response = await axios.put('/api/Food/UpdateFood', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete food
export const deleteFood = async (foodId: string): Promise<ResponseDTO<boolean>> => {
  const response = await axios.delete('/api/Food/DeleteFood', {
    data: { id: foodId }
  });
  return response.data;
};

// Get all foods - use from user API
export { getAllFoods } from '@/api/user';

// Get food by ID
export const getFoodById = async (id: string): Promise<ResponseDTO<GetFoodDTO>> => {
  const response = await axios.get(`/api/Food/GetById?id=${id}`);
  return response.data;
};

// Get all categories - use from user API
export { getAllCategories } from '@/api/user';

// Add new category
export const addCategory = async (categoryName: string): Promise<ResponseDTO<CategoryDTO>> => {
  const response = await axios.post('/api/Food/AddCategory', {
    catName: categoryName
  });
  return response.data;
};
