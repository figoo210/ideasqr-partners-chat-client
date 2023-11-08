import React, { createContext, useState, useEffect } from "react";
import api from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password, user_ip) => {
    // call api
    const response = await api.login(email, password, user_ip);
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
    localStorage.setItem("user", JSON.stringify(updatedProfile));
  };

  const updateUserShortcuts = async (objId, reply) => {
    const user_obj = JSON.parse(localStorage.getItem("user"));
    const shortcutIndex = user_obj.data.reply_shortcuts.findIndex((obj => obj.id == objId));
    user_obj.data.reply_shortcuts[shortcutIndex].reply = reply;
    api.addShortcutReply(objId, reply);
    localStorage.setItem("user", JSON.stringify(user_obj));
    setUser(user_obj);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, loading, updateProfile, updateUserShortcuts }}
    >
      {children}
    </AuthContext.Provider>
  );
};
