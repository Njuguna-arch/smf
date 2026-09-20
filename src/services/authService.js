import api from "./api";

export const login = async (identifier, password, role, schoolCode) => {
  const endpoint = "/auth/login";
  let payload = { password, role, schoolCode };

  if (role === "student") {
    payload.admissionNumber = identifier.trim();
  } else {
    payload.email = identifier.trim();
  }

  try {
    const res = await api.post(endpoint, payload);

    // Clear old data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Save new data
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }
    if (res.data?.user) {
      const normalizedUser = {
        ...res.data.user,
        role: res.data.user.role?.toLowerCase(),
      };
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    }

    return {
      ...res.data,
      user: res.data?.user
        ? { ...res.data.user, role: res.data.user.role?.toLowerCase() }
        : null,
    };
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err.message);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token") || null;
};

export const isAuthenticated = () => {
  return !!getToken() && !!getCurrentUser();
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
