// Store API Types based on C# backend DTOs

export interface StoreInventoryDTO {
  foodId?: string;
  availableQty?: number;
}

export interface UpdateStoreInventoryDTO {
  inventoryId?: string;
  foodId?: string;
  availableQty?: number;
}

export interface AddStoreDTO {
  townId?: string;
  storePlace?: string;
  storeName?: string;
  storePhNo?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  inventory?: StoreInventoryDTO[];
}

export interface StoreDTO {
  storeId: string;
  townId?: string;
  storePlace?: string;
  storeName?: string;
  storePhNo?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  inventory?: UpdateStoreInventoryDTO[];
}

export interface GetStoreDTO {
  storeId: string;
  townId?: string;
  townName?: string;
  storePlace?: string;
  storeName?: string;
  storePhNo?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  inventory?: StoreInventoryModel[];
}

export interface AddStoreInventoryDTO {
  inventory?: StoreInventoryDTO[];
}

export interface StoreInventoryModel {
  inventoryId?: string;
  storeId?: string;
  foodId?: string;
  availableQty?: number;
  foodName?: string;
  foodImage?: string;
}

export interface GetStoreInventoryDTO {
  townName?: string;
  storePlace?: string;
  storeName?: string;
  storePhNo?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  inventory?: StoreInventoryModel[];
}

export interface TownDTO {
  townId?: string;
  townName?: string;
  centerLatitude?: number;
  centerLongitude?: number;
  radiusKm?: number;
}

export interface AddTownDTO {
  townName?: string;
  centerLatitude?: number;
  centerLongitude?: number;
  radiusKm?: number;
}
