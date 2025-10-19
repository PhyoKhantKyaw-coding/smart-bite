// User DTOs based on C# backend
export interface UserDTO {
  userId: string;
  roleId?: string;
  userName?: string;
  userPassword?: string;
  userEmail?: string;
  userProfile?: string;
  userPhNo?: string;
  googleTokenId?: string;
  latitude?: number;
  longitude?: number;
  deviceToken?: string;
}

export interface GetUserDTO {
  userId?: string;
  roleName?: string;
  userName?: string;
  userPassword?: string;
  userEmail?: string;
  userProfile?: string;
  userPhNo?: string;
  googleTokenId?: string;
  latitude?: number;
  longitude?: number;
  deviceToken?: string;
}

export interface AddUserDTO {
  roleName?: string;
  userName?: string;
  userPassword?: string;
  userEmail?: string;
  userProfileFile?: File;
  userPhNo?: string;
  googleTokenId?: string;
  latitude?: number;
  longitude?: number;
  deviceToken?: string;
}

export interface AddRoleDTO {
  roleName?: string;
}

export interface TopicDTO {
  topicId?: string;
  topicName?: string;
}

export interface AddCartDTO {
  foodId?: string;
  quantity?: number;
  topics?: TopicDTO[];
}

export interface GetCartDTO {
  foodId?: string;
  name?: string;
  eachPrice?: number;
  cookingTime?: number;
  foodImage?: string;
  foodDescription?: string;
  catName?: string;
  quantity?: number;
  topics?: OtherTopicModel[];
}

export interface GetFavoriteDTO {
  foodId?: string;
  name?: string;
  eachPrice?: number;
  cookingTime?: number;
  foodImage?: string;
  foodDescription?: string;
  catName?: string;
}

export interface LoginDTO {
  userEmail?: string;
  password?: string;
}

export interface LoginResponseDTO {
  token?: string;
  userName?: string;
  roleName?: string;
}

export interface OtherTopicModel {
  topicId?: string;
  topicName?: string;
}

// Food DTOs
export interface FoodDTO {
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

export interface GetFoodDTO {
  foodId?: string;
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

export interface OtherTopicDTO {
  otherId?: string;
  foodId?: string;
  otherName?: string;
  activeFlag?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  createDate?: string | null;
  updateDate?: string | null;
}

export interface FoodWithTopicsDTO {
  foodDTO?: GetFoodDTO;
  otherTopics?: OtherTopicDTO[];
}

export interface ResponseFoodDTO {
  foodDTO?: GetFoodDTO;
  otherTopics?: OtherTopicModel[];
}

export interface GetAllDto {
  page?: number;
  pageSize?: number;
  query?: string;
  name?: string;
  catId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CategoryDTO {
  catName?: string;
}

export interface IDDTO {
  id?: string;
}

// API Response
export interface ResponseDTO<T = unknown> {
  status: string;
  message: string;
  data: T;
}
