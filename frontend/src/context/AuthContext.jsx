import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/api/auth/current_user");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };

  const updateProfile = async ({ displayName, bio }) => {
    const res = await api.patch("/api/auth/profile", { displayName, bio });
    setUser(res.data.user);
    return res.data.user;
  };

  const value = { user, loading, logout, updateProfile, refetchUser: fetchCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}