
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { getUserById } from "@/api/user";
import { toast } from "sonner";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
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

// Get or create device token


// Check if location tracking is already active or was denied
function isLocationTrackingActive(): boolean {
  return sessionStorage.getItem('locationWatchId') !== null;
}

function wasLocationDenied(): boolean {
  return sessionStorage.getItem('locationDenied') === 'true';
}

function setLocationDenied(): void {
  sessionStorage.setItem('locationDenied', 'true');
}

function hasShownLocationError(): boolean {
  return sessionStorage.getItem('locationErrorShown') === 'true';
}

function setLocationErrorShown(): void {
  sessionStorage.setItem('locationErrorShown', 'true');
}

// SignalR connection and initialization lock
let isInitializing = false;
let signalRConnection: signalR.HubConnection | null = null;

// Start location tracking with SignalR
async function startDeliveryLocationTracking(deliveryId: string, userName: string): Promise<void> {
  if (isInitializing) {
    console.log('⏳ Location tracking initialization already in progress, skipping...');
    return;
  }
  
  if (isLocationTrackingActive()) {
    console.log('✓ Location tracking already active, skipping...');
    return;
  }
  
  if (wasLocationDenied()) {
    console.log('Location permission was denied, skipping...');
    return;
  }

  if (!navigator.geolocation) {
    toast.error('Geolocation is not supported by your browser');
    return;
  }

  isInitializing = true;

  // Get device token
 

  // Initialize SignalR connection
  const apiUrl = axios.defaults.baseURL || '';
  const hubUrl = `${apiUrl.replace(/\/$/, '')}/deliveryTrackingHub`;
  
  console.log('🔌 Connecting to SignalR hub:', hubUrl);
  
  signalRConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => localStorage.getItem('authToken') || '',
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        if (retryContext.elapsedMilliseconds < 60000) {
          return Math.random() * 10000;
        } else {
          return null;
        }
      }
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  signalRConnection.onreconnecting((error) => {
    console.log('⚠️ SignalR reconnecting...', error);
  });

  signalRConnection.onreconnected((connectionId) => {
    console.log('✓ SignalR reconnected:', connectionId);
    toast.success('Location tracking reconnected');
  });

  signalRConnection.onclose((error) => {
    console.log('❌ SignalR connection closed:', error);
    sessionStorage.removeItem('locationWatchId');
    sessionStorage.removeItem('locationIntervalId');
    isInitializing = false;
  });

  // Listen for server acknowledgments
  signalRConnection.on('Connected', (data) => {
    console.log('✓ Server confirmed connection:', data);
  });

  signalRConnection.on('ReceiveDeliveryLocationUpdate', (data) => {
    console.log('📍 Location update acknowledged:', data);
  });

  let currentPosition: { lat: number; lng: number } | null = null;
  const UPDATE_INTERVAL = 5000;

  const updateLocation = async (latitude: number, longitude: number) => {
    if (!signalRConnection || signalRConnection.state !== signalR.HubConnectionState.Connected) {
      console.log('⚠️ SignalR not connected, skipping update');
      return;
    }

    try {
      console.log('📍 Sending location via SignalR:', {
        deliveryId,
        latitude,
        longitude
      });

      // Call the hub method: SendDeliveryLocationUpdate
      await signalRConnection.invoke('SendDeliveryLocationUpdate', 
        deliveryId, // Guid deliveryId
        userName, // string deliveryName
        latitude, // decimal latitude
        longitude, // decimal longitude
        true // bool isOnline
      );
      
      console.log('✓ Location sent via SignalR:', { 
        latitude, 
        longitude, 
        time: new Date().toLocaleTimeString() 
      });
    } catch (error) {
      console.error('✗ Failed to send location via SignalR:', error);
    }
  };

  // Start SignalR connection
  try {
    await signalRConnection.start();
    console.log('✓ SignalR connected successfully');
    toast.success('Real-time tracking connected');
  } catch (error) {
    console.error('❌ Failed to connect SignalR:', error);
    toast.error('Failed to connect real-time tracking');
    isInitializing = false;
    return;
  }

  // Request geolocation permission
  return new Promise((resolve, reject) => {
    console.log('🔍 Requesting geolocation permission for delivery:', deliveryId);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          console.log('✓ Got initial location:', {
            latitude,
            longitude,
            accuracy: `${accuracy}m`,
            timestamp: new Date(position.timestamp).toLocaleTimeString()
          });
          
          // Send initial location
          await updateLocation(latitude, longitude);

          // Watch position for GPS updates
          const watchId = navigator.geolocation.watchPosition(
            (pos) => {
              const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
              currentPosition = { lat, lng };
              
              console.log('🔄 Position update received:', {
                latitude: lat,
                longitude: lng,
                accuracy: `${acc}m`,
                timestamp: new Date(pos.timestamp).toLocaleTimeString()
              });
            },
            (error) => {
              // Suppress permission denied errors to avoid console spam
              if (error.code === 1) { // GeolocationPositionError.PERMISSION_DENIED
                setLocationDenied();
                if (!hasShownLocationError()) {
                  setLocationErrorShown();
                  toast.error('Location permission denied');
                }
              } else {
                console.error('❌ Location watch error:', {
                  code: error.code,
                  message: error.message
                });
              }
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 30000
            }
          );

          // Store watch ID
          sessionStorage.setItem('locationWatchId', watchId.toString());
          
          // Set up interval to send location every 5 seconds
          const intervalId = setInterval(() => {
            if (currentPosition) {
              console.log('⏰ 5-second interval triggered');
              updateLocation(currentPosition.lat, currentPosition.lng);
            }
          }, UPDATE_INTERVAL);
          
          sessionStorage.setItem('locationIntervalId', intervalId.toString());
          
          isInitializing = false;
          resolve();
        } catch (error) {
          console.error('Failed to update initial location:', error);
          toast.error('Failed to update location');
          isInitializing = false;
          reject(error);
        }
      },
      (error) => {
        isInitializing = false;
        if (error.code === 1) { // GeolocationPositionError.PERMISSION_DENIED
          setLocationDenied();
          if (!hasShownLocationError()) {
            setLocationErrorShown();
            toast.error('Location permission denied. Please enable location access in your browser settings.');
          }
          // Don't log permission denied errors
        } else if (error.code === 2) { // GeolocationPositionError.POSITION_UNAVAILABLE
          if (!hasShownLocationError()) {
            setLocationErrorShown();
            toast.error('Location information unavailable.');
          }
          console.error('Geolocation error:', error);
        } else if (error.code === 3) { // GeolocationPositionError.TIMEOUT
          if (!hasShownLocationError()) {
            setLocationErrorShown();
            toast.error('Location request timed out. Please check your GPS settings.');
          }
          console.error('Geolocation error:', error);
        } else {
          console.error('Geolocation error:', error);
        }
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 30000
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
    console.log('📍 GPS tracking stopped');
  }
  
  const intervalIdStr = sessionStorage.getItem('locationIntervalId');
  if (intervalIdStr) {
    const intervalId = parseInt(intervalIdStr, 10);
    clearInterval(intervalId);
    sessionStorage.removeItem('locationIntervalId');
    console.log('⏱️ Location update interval cleared');
  }
  
  if (signalRConnection) {
    signalRConnection.stop().then(() => {
      console.log('🔌 SignalR connection closed');
    }).catch((error) => {
      console.error('Error closing SignalR:', error);
    });
    signalRConnection = null;
  }
  
  isInitializing = false;
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

    // If delivery user, start location tracking with SignalR
    if (userData.role === "delivery") {
      console.log('🚚 Starting location tracking for delivery user:', {
        userId: userData.userId,
        userName: userData.userName
      });
      
      startDeliveryLocationTracking(userData.userId, userData.userName).catch(() => {
        // Errors already handled with toasts and flags, fail silently
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
    stopDeliveryLocationTracking();
    sessionStorage.removeItem('locationDenied');
    sessionStorage.removeItem('locationErrorShown');
    
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
            
            // Restart location tracking for delivery users
            if (userData.role === "delivery") {
              startDeliveryLocationTracking(userData.userId, userData.userName).catch(() => {
                // Silently fail
              });
            }
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
              
              // Start location tracking for delivery users
              if (userData.role === "delivery") {
                startDeliveryLocationTracking(userData.userId, userData.userName).catch(() => {
                  // Silently fail
                });
              }
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
