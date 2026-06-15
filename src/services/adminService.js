import api from "./api";

// 🔹 Helper to normalize values
const normalize = (val) => (val ? val.trim().toLowerCase() : "");

// Fetch school performance with filters
export const fetchSchoolPerformance = async (examType, term, year) => {
  const normalizedExamType = normalize(examType);
  const normalizedTerm = normalize(term);
  const normalizedYear = Number(year);

  const res = await api.get(
    `/admin/performance?examType=${normalizedExamType}&term=${normalizedTerm}&year=${normalizedYear}`
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

// Post text announcement
export const postTextAnnouncement = async (message) => {
  const res = await api.post("/admin/announcements/text", { message });
  return res.data;
};

// Post file announcement
export const postFileAnnouncement = async (formData) => {
  const res = await api.post("/admin/announcements/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
