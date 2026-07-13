import api from "./api";

export const uploadExamCSV = async (formData) => {
  try {
    console.log("📤 Uploading exam CSV...");
    const res = await api.post("/api/teacher/exam/csv", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("✅ CSV upload response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error uploading exam CSV:", err);
    throw err;
  }
};

export const addDisciplineComment = async (data) => {
  try {
    console.log("📝 Adding discipline comment:", data);
    const res = await api.post("/api/teacher/discipline", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log("✅ Discipline comment response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error adding discipline comment:", err);
    throw err;
  }
};

export const fetchClassPerformance = async (examType, term, year) => {
  try {
    let query = "";
    if (examType) query += `examType=${encodeURIComponent(examType)}`;
    if (term) query += `${query ? "&" : ""}term=${encodeURIComponent(term)}`;
    if (year) query += `${query ? "&" : ""}year=${encodeURIComponent(year)}`;

    const url = `/api/teacher/performance?${query}`;
    console.log("🌐 Fetching class performance from URL:", url);

    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    console.log("📊 Backend response received:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching class performance:", err);
    throw err;
  }
};

export const fetchStudentCompletedQuizzes = async (studentId) => {
  try {
    console.log("📚 Fetching completed quizzes for student:", studentId);
    const res = await api.get(`/api/teacher/${studentId}/completed-quizzes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log("✅ Completed quizzes response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching completed quizzes:", err);
    throw err;
  }
};
