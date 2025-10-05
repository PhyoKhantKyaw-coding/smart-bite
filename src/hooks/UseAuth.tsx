
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

interface AuthUser {
  email: string;
  role: "user" | "admin" | "delivery";
}

interface AccountData {
  password: string;
  role: AuthUser["role"];
}

const accounts: Record<string, AccountData> = {
  "pkk1@gmail.com": { password: "P@ssw0rd", role: "user" },
  "pkk2@gmail.com": { password: "P@ssw0rd", role: "admin" },
  "pkk3@gmail.com": { password: "P@ssw0rd", role: "delivery" },
};

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const login = (email: string, password: string): boolean => {
    const account = accounts[email];
    if (account && account.password === password) {
      const userData: AuthUser = { email, role: account.role };
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      // Redirect based on role
      if (userData.role === "admin") navigate("/admin");
      else if (userData.role === "delivery") navigate("/delivery");
      else navigate("/user");
      return true;
    }
    return false;
  };

  const logout = (): void => {
    dispatch(setUser(null));
    localStorage.removeItem("user");
    navigate("/");
  };

  React.useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) dispatch(setUser(JSON.parse(stored)));
  }, [dispatch]);

  return { user, login, logout };
}
