import api from "./api";

// Fetch school performance with filters
export const fetchSchoolPerformance = async (examType, term, year) => {
  const params = new URLSearchParams();
  if (examType) params.append("examType", String(examType).trim());
  if (term) params.append("term", String(term).trim());
  if (year) params.append("year", String(year));

  const res = await api.get(`/admin/performance?${params.toString()}`);
  return res.data;
};

// Fetch filter options with safe fallbacks
export const fetchExamTypes = async () => {
  try {
    const res = await api.get("/admin/exam-types");
    if (Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn("Using default exam types:", err.message);
  }
  return ["Mid-Term", "End-Term", "Opener"];
};

export const fetchTerms = async () => {
  try {
    const res = await api.get("/admin/terms");
    if (Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn("Using default terms:", err.message);
  }
  return ["Term 1", "Term 2", "Term 3"];
};

export const fetchYears = async () => {
  try {
    const res = await api.get("/admin/years");
    if (Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn("Using default years:", err.message);
  }
  return [2026, 2027, 2028];
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

// Post bulk message (SMS/WhatsApp)
export const postBulkMessage = async (formData) => {
  const res = await api.post("/admin/announcements/bulk", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
