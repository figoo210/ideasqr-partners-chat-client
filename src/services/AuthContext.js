import React, { createContext, useState, useEffect } from "react";
import api from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    // call api
    const response = await api.login(email, password);
    if (response.data.access_token) {
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    }
  };

  const refreshUser = async () => {
    // check for token
    const token = localStorage.getItem("user");
    if (token) {
      setUser(JSON.parse(token));
    }
    setLoading(false);
  };

  const updateProfile = (updatedProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('user', JSON.stringify(updatedProfile));
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
