// Food API Types based on C# backend DTOs

export interface AddFoodDTO {
  catId?: string;
  name?: string;
  eachPrice?: number;
  cost?: number;
  cookingTime?: number;
  foodDescription?: string;
  othertopicName?: string[];
  foodImageFile?: File;
}

export interface UpdateFoodDTO {
  foodId?: string;
  catId?: string;
  name?: string;
  eachPrice?: number;
  cost?: number;
  profit?: number;
  cookingTime?: number;
  foodImage?: string;
  foodDescription?: string;
  othertopicName?: string[];
}

export interface CategoryDTO {
  catId?: string;
  catName?: string;
}

export interface AddCategoryDTO {
  catName?: string;
}

export interface DeleteFoodDTO {
  id?: string;
}

export interface GetFoodDTO {
  foodId?: string;
  catId?: string;
  catName?: string;
  name?: string;
  eachPrice?: number;
  cost?: number;
  profit?: number;
  cookingTime?: number;
  foodImage?: string;
  foodDescription?: string;
  othertopicName?: string[];
}
