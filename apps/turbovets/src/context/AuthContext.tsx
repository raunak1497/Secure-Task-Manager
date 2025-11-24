"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type UserType = {
  id: number;
  email: string;
  name: string;
  role: "OWNER" | "ADMIN" | "VIEWER";
  orgId: number;
} | null;

interface AuthContextType {
  token: string | null;
  user: UserType;
  login: (token: string, user: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);

    if (storedUser && storedUser !== "undefined") {
      const parsed = JSON.parse(storedUser);
      // ensure uppercase role + orgId exists
      parsed.role = parsed.role.toUpperCase();
      setUser(parsed);
    }

    setLoading(false);
  }, []);

  const login = (token: string, userData: any) => {
    userData.role = userData.role.toUpperCase();
    setToken(token);
    setUser(userData);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};