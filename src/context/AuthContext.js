// src/context/AuthContext.js
"use client";
import { createContext, useState } from "react";
import api from "../lib/api";

export const AuthContext = createContext(); // <-- eksport kontekstu

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data.data;
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
