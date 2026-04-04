import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser, getToken, logout } from "../services/authService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    const storedToken = getToken();

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      const normalizedUser = {
        ...storedUser,
        role: storedUser.role?.toLowerCase(),
      };
      setUser(normalizedUser);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      } else if (!user && !token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [user, token, loading]);

  const loginUser = (userData, tokenData) => {
    const normalizedUser = {
      ...userData,
      role: userData.role?.toLowerCase(),
    };
    setUser(normalizedUser);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", tokenData);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    logout(); 
  };

  return (
    <UserContext.Provider
      value={{ user, token, loginUser, logoutUser, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};