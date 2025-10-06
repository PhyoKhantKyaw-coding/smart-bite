// Get user's geolocation
export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        // Return default location if permission denied
        resolve({ latitude: 0, longitude: 0 });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// Generate a unique device token
export const getDeviceToken = (): string => {
  // Check if device token already exists
  let deviceToken = localStorage.getItem('deviceToken');
  
  if (!deviceToken) {
    // Generate a unique device token using browser fingerprint
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const timestamp = Date.now();
    
    // Create a simple hash-like token
    deviceToken = btoa(`${userAgent}-${platform}-${language}-${timestamp}`)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 32);
    
    localStorage.setItem('deviceToken', deviceToken);
  }
  
  return deviceToken;
};
