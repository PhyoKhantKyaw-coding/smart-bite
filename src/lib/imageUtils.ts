import axios from 'axios';

/**
 * Get the base URL from axios configuration
 */
export const getBaseUrl = (): string => {
  const baseURL = axios.defaults.baseURL || '';
  // Remove trailing slash if present
  return baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
};

/**
 * Get the full URL for a food image
 */
export const getFoodImageUrl = (imagePath?: string): string => {
  if (!imagePath) return '/placeholder-food.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const baseUrl = getBaseUrl();
  
  // If it starts with 'images/', use it directly
  if (imagePath.startsWith('images/')) {
    return `${baseUrl}/api/${imagePath}`;
  }
  
  // Otherwise, assume it's just a filename and prepend the images path
  return `${baseUrl}/api/images/${imagePath}`;
};

/**
 * Get the full URL for a user profile image
 */
export const getProfileImageUrl = (profilePath?: string): string | undefined => {
  if (!profilePath || profilePath === 'string') return undefined;
  
  // If it's already a full URL, return as is
  if (profilePath.startsWith('http://') || profilePath.startsWith('https://')) {
    return profilePath;
  }
  
  const baseUrl = getBaseUrl();
  
  // If it starts with 'images/', use it directly
  if (profilePath.startsWith('images/')) {
    return `${baseUrl}/api/${profilePath}`;
  }
  
  // Otherwise, assume it's just a filename and prepend the images path
  return `${baseUrl}/api/images/${profilePath}`;
};
