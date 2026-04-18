import api from "./api";

// Fetch school performance with filters
export const fetchSchoolPerformance = async (examType, term, year) => {
  const res = await api.get(
    `/admin/performance?examType=${examType}&term=${term}&year=${year}`
  );
  return res.data;
};

// User management
export const fetchUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const addUser = async (userData) => {
  const res = await api.post("/admin/users", userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

// Assign photo to a user
export const assignPhoto = async (id, photoFileName) => {
  const res = await api.put(`/users/assign-photo/${id}`, { photoFileName });
  return res.data;
};

// Announcements
export const fetchAnnouncements = async () => {
  const res = await api.get("/admin/announcements");
  return res.data;
};

// Post text announcement (JSON only)
export const postTextAnnouncement = async (message) => {
  const res = await api.post("/admin/announcements/text", { message });
  return res.data;
};

// Post file announcement (multipart/form-data)
export const postFileAnnouncement = async (formData) => {
  const res = await api.post("/admin/announcements/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
