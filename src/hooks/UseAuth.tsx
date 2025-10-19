
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

interface AuthUser {
  userId: string;
  email: string;
  userName: string;
  role: "user" | "admin" | "delivery";
  token: string;
  userProfile?: string;
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

  const setAuthUser = (token: string, userName?: string, roleName?: string, userProfile?: string) => {
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

    dispatch(setUser(userData));
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect based on role
    if (userData.role === "admin") navigate("/admin");
    else if (userData.role === "delivery") navigate("/delivery");
    else navigate("/user");

    return true;
  };

  const logout = (): void => {
    dispatch(setUser(null));
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
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
    const stored = localStorage.getItem("user");
    
    if (token && stored) {
      const decoded = decodeToken(token);
      if (decoded) {
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          dispatch(setUser(JSON.parse(stored)));
        } else {
          // Token expired, clear everything
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
    }
  }, [dispatch]);

  return { user, setAuthUser, logout, isTokenValid };
}
