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

  useEffect(() => {
    refreshUser();

    const refresher = async () => {
      if (user) {
        api.getUser(user.data.id).then((r) => {
          console.log(r);
        });
      }
    };

    // Set the interval (in milliseconds)
    const intervalMilliseconds = 600000; // 1 second

    // Call the function at regular intervals
    const intervalId = setInterval(refresher, intervalMilliseconds);

    // To stop the periodic function after a certain time (e.g., after 5 seconds), you can use setTimeout:
    const runTime = 6000000; // 5 seconds
    setTimeout(() => {
      clearInterval(intervalId); // Stop the periodic function
      console.log("Periodic function stopped after 5 seconds.");
    }, runTime);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, loading, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
