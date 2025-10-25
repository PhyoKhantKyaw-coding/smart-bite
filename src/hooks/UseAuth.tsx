
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { getUserById } from "@/api/user";

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


    // Redirect based on role
    if (userData.role === "admin") navigate("/admin");
    else if (userData.role === "delivery") navigate("/delivery");
    else navigate("/user");

    return true;
  };

  const logout = (): void => {
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
