
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { getUserById } from "@/api/user";
import { updateDeliveryLocation } from "@/api/delivery";
import { toast } from "sonner";

interface AuthUser {
  userId: string;
  email: string;
  userName: string;
  role: "user" | "admin" | "delivery";
  token: string;
  userProfile?: string;
}

interface DecodedToken {
  userId: string;
  role: string;
  userName: string;
  exp: number;
}

// Generate a unique device token (in production, use FCM/APNs)
function generateDeviceToken(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Get or create device token
function getDeviceToken(): string {
  let deviceToken = localStorage.getItem('deviceToken');
  if (!deviceToken) {
    deviceToken = generateDeviceToken();
    localStorage.setItem('deviceToken', deviceToken);
  }
  return deviceToken;
}

// Request and start location tracking for delivery users
async function startDeliveryLocationTracking(deliveryId: string, deviceToken: string): Promise<void> {
  if (!navigator.geolocation) {
    toast.error('Geolocation is not supported by your browser');
    return;
  }

  // Request permission and get current location
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Update delivery location with device token
          await updateDeliveryLocation({
            deliveryId,
            currentLatitude: latitude,
            currentLongitude: longitude,
            deviceToken
          });

          toast.success('Location tracking enabled');

          // Start watching position for real-time updates
          const watchId = navigator.geolocation.watchPosition(
            async (pos) => {
              const { latitude: lat, longitude: lng } = pos.coords;
              try {
                await updateDeliveryLocation({
                  deliveryId,
                  currentLatitude: lat,
                  currentLongitude: lng,
                  deviceToken
                });
                console.log('Location updated:', lat, lng);
              } catch (error) {
                console.error('Failed to update location:', error);
              }
            },
            (error) => {
              console.error('Location watch error:', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 30000
            }
          );

          // Store watch ID to stop tracking on logout
          sessionStorage.setItem('locationWatchId', watchId.toString());
          resolve();
        } catch (error) {
          console.error('Failed to update initial location:', error);
          toast.error('Failed to update location');
          reject(error);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('Location permission denied. Please enable location access for delivery tracking.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error('Location information unavailable.');
        } else if (error.code === error.TIMEOUT) {
          toast.error('Location request timed out.');
        }
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

// Stop location tracking
function stopDeliveryLocationTracking(): void {
  const watchIdStr = sessionStorage.getItem('locationWatchId');
  if (watchIdStr) {
    const watchId = parseInt(watchIdStr, 10);
    navigator.geolocation.clearWatch(watchId);
    sessionStorage.removeItem('locationWatchId');
    console.log('Location tracking stopped');
  }
}

// Decode JWT token
function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decoded = JSON.parse(jsonPayload);
    return {
      userId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid || decoded.sub,
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role,
      userName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name,
      exp: decoded.exp
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const setAuthUser = async (token: string, userName?: string, roleName?: string, userProfile?: string) => {
    const decoded = decodeToken(token);
    if (!decoded) {
      console.error("Invalid token");
      return false;
    }

    const userData: AuthUser = {
      userId: decoded.userId,
      email: "",
      userName: userName || decoded.userName,
      role: (roleName || decoded.role).toLowerCase() as "user" | "admin" | "delivery",
      token: token,
      userProfile: userProfile
    };


    // Fetch user profile data from API
    try {
      const response = await getUserById(decoded.userId);
      // API returns status as number (0 = success), but type definition says string
      
        userData.userProfile = response.data.userProfile;
        userData.userName = response.data.userName || userData.userName;
        userData.email = response.data.userEmail || userData.email;
 
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }

    // Save to localStorage and sessionStorage
    localStorage.setItem("authToken", token);
    
    // Create session data object without token for security
    const sessionData = {
      userId: userData.userId,
      email: userData.email,
      userName: userData.userName,
      role: userData.role,
      userProfile: userData.userProfile
    };
    
    sessionStorage.setItem("userProfile", JSON.stringify(sessionData));
    

    // Dispatch to Redux store
    dispatch(setUser(userData));

    // If delivery user, start location tracking and get device token
    if (userData.role === "delivery") {
      const deviceToken = getDeviceToken();
      
      // Start location tracking in background
      startDeliveryLocationTracking(userData.userId, deviceToken).catch((error) => {
        console.error('Failed to start location tracking:', error);
      });
      
      navigate("/delivery");
    } else if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }

    return true;
  };

  const logout = (): void => {
    // Stop location tracking if active
    stopDeliveryLocationTracking();
    
    dispatch(setUser(null));
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("userProfile");
    navigate("/");
  };

  const isTokenValid = (): boolean => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  };

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    const stored = sessionStorage.getItem("userProfile");
    
    if (token && stored) {
      try {
        const decoded = decodeToken(token);
        if (decoded) {
          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            const sessionData = JSON.parse(stored);
            // Restore user with token included
            const userData = {
              ...sessionData,
              token: token
            };
            dispatch(setUser(userData));
          } else {
            // Token expired, clear everything
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("userProfile");
          }
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("userProfile");
      }
    } else if (token && !stored) {
      // Token exists but no session data - re-fetch user data
      const decoded = decodeToken(token);
      if (decoded) {
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          // Fetch user data from API
          getUserById(decoded.userId).then((response) => {
            if (response.status === 'Success' && response.data) {
              const userData = {
                userId: decoded.userId,
                email: response.data.userEmail || "",
                userName: response.data.userName || decoded.userName,
                role: decoded.role.toLowerCase() as "user" | "admin" | "delivery",
                token: token,
                userProfile: response.data.userProfile
              };
              
              const sessionData = {
                userId: userData.userId,
                email: userData.email,
                userName: userData.userName,
                role: userData.role,
                userProfile: userData.userProfile
              };
              
              sessionStorage.setItem("userProfile", JSON.stringify(sessionData));
              dispatch(setUser(userData));
            }
          }).catch((error) => {
            console.error("Failed to fetch user data:", error);
          });
        } else {
          localStorage.removeItem("authToken");
        }
      }
    }
  }, [dispatch]);

  return { user, setAuthUser, logout, isTokenValid };
}
