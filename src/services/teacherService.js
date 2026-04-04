import api from "./api";

export const uploadExamCSV = async (formData) => {
  const res = await api.post("/teacher/exam/csv", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const addDisciplineComment = async (data) => {
  const res = await api.post("/teacher/discipline", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const fetchClassPerformance = async (examType, term, year) => {
  let query = "";
  if (examType) query += `examType=${encodeURIComponent(examType)}`;
  if (term) query += `${query ? "&" : ""}term=${encodeURIComponent(term)}`;
  if (year) query += `${query ? "&" : ""}year=${encodeURIComponent(year)}`;

  const res = await api.get(`/teacher/performance?${query}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const fetchStudentCompletedQuizzes = async (studentId) => {
  const res = await api.get(`/teacher/${studentId}/completed-quizzes`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};