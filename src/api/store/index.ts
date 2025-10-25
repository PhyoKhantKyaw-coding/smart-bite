import axios from '@/configs/axios';
import type { ResponseDTO } from '@/api/user/types';
import type { 
  StoreDTO, 
  AddStoreDTO, 
  GetStoreDTO,
  TownDTO,
  AddTownDTO
} from './types';

// Add new store
export const addStore = async (data: AddStoreDTO): Promise<ResponseDTO<boolean>> => {
  const response = await axios.post('/api/Store/add', data);
  return response.data;
};

// Update existing store
export const updateStore = async (storeId: string, data: StoreDTO): Promise<ResponseDTO<boolean>> => {
  const response = await axios.put(`/api/Store/update/${storeId}`, data);
  return response.data;
};

// Delete store
export const deleteStore = async (storeId: string): Promise<ResponseDTO<boolean>> => {
  const response = await axios.delete(`/api/Store/delete/${storeId}`);
  return response.data;
};

// Get store by ID
export const getStoreById = async (storeId: string): Promise<ResponseDTO<GetStoreDTO>> => {
  const response = await axios.get(`/api/Store/${storeId}`);
  return response.data;
};

// Get all stores
export const getAllStores = async (): Promise<ResponseDTO<GetStoreDTO[]>> => {
  const response = await axios.get('/api/Store/all');
  return response.data;
};

// Get stores by town ID
export const getStoresByTownId = async (townId: string): Promise<ResponseDTO<GetStoreDTO[]>> => {
  const response = await axios.get(`/api/Store/town/${townId}`);
  return response.data;
};

// ============ Town Management ============

// Add new town
export const addTown = async (data: AddTownDTO): Promise<ResponseDTO<boolean>> => {
  const response = await axios.post('/api/Store/town/add', data);
  return response.data;
};

// Get all towns
export const getAllTowns = async (): Promise<ResponseDTO<TownDTO[]>> => {
  const response = await axios.get('/api/Store/towns');
  return response.data;
};
