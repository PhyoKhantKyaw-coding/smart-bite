import axios from '@/configs/axios';
import type {
  AddUserDTO,
  UserDTO,
  GetUserDTO,
  AddCartDTO,
  GetCartDTO,
  GetFavoriteDTO,
  FoodWithTopicsDTO,
  ResponseDTO,
  GetFoodDTO,
  GetAllDto,
  CategoryDTO,
  ResponseFoodDTO,
} from './types';



// ============ User CRUD ============

export const addUser = async (data: AddUserDTO): Promise<ResponseDTO<boolean>> => {
  const formData = new FormData();
  if (data.roleName) formData.append('roleName', data.roleName);
  if (data.userName) formData.append('userName', data.userName);
  if (data.userPassword) formData.append('userPassword', data.userPassword);
  if (data.userEmail) formData.append('userEmail', data.userEmail);
  if (data.userProfileFile) formData.append('userProfileFile', data.userProfileFile);
  if (data.userPhNo) formData.append('userPhNo', data.userPhNo);
  if (data.googleTokenId) formData.append('googleTokenId', data.googleTokenId);
  if (data.latitude !== undefined) formData.append('latitude', data.latitude.toString());
  if (data.longitude !== undefined) formData.append('longitude', data.longitude.toString());
  if (data.deviceToken) formData.append('deviceToken', data.deviceToken);

  const response = await axios.post('/api/User/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateUser = async (data: UserDTO): Promise<ResponseDTO<boolean>> => {
  const response = await axios.put('/api/User/update', data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<ResponseDTO<boolean>> => {
  const response = await axios.delete(`/api/User/delete/${id}`);
  return response.data;
};

export const getAllUsers = async (): Promise<ResponseDTO<GetUserDTO[]>> => {
  const response = await axios.get('/api/User/all');
  return response.data;
};

export const getUserById = async (id: string): Promise<ResponseDTO<GetUserDTO>> => {
  const response = await axios.get(`/api/User/${id}`);
  return response.data;
};

export const getAllRoles = async (): Promise<ResponseDTO<{ roleId: string; roleName: string }[]>> => {
  const response = await axios.get('/api/User/allRole');
  return response.data;
};

// ============ Cart ============

export const addToCart = async (data: AddCartDTO): Promise<ResponseDTO<boolean>> => {
  const response = await axios.post('/cart', data);
  return response.data;
};

export const getCart = async (): Promise<ResponseDTO<GetCartDTO[]>> => {
  const response = await axios.get('/cart');
  return response.data;
};

// ============ Favorite ============

export const addToFavorite = async (foodId: string): Promise<ResponseDTO<boolean>> => {
  const response = await axios.post(`/favorite/${foodId}`);
  return response.data;
};

export const getFavorites = async (): Promise<ResponseDTO<GetFavoriteDTO[]>> => {
  const response = await axios.get('/favorite');
  return response.data;
};




// ============ Food API ============

export const getAllFoods = async (params?: GetAllDto): Promise<ResponseDTO<GetFoodDTO[]>> => {
  const response = await axios.get('/api/Food/GetAll', { params });
  
  // Transform the response to extract foodDTO from each item
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    const transformedData = response.data.data.map((item: FoodWithTopicsDTO) => item.foodDTO || {} as GetFoodDTO);
    return {
      ...response.data,
      data: transformedData
    };
  }
  
  return response.data;
};

export const getAllCategories = async (): Promise<ResponseDTO<CategoryDTO[]>> => {
  const response = await axios.get('/api/Food/GetAllCategory');
  return response.data;
};

export const getFoodById = async (dto: string): Promise<ResponseDTO<ResponseFoodDTO>> => {
  const response = await axios.get(`/api/Food/GetById?id=${dto}`);
  return response.data;
};
