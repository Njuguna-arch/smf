import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://school-management-backend-w500.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.message);
    return Promise.reject(error);
  }
);

export default api;
