import api from "./api";

export const uploadExamCSV = async (formData) => {
  try {
    console.log(" Uploading exam CSV...");
    const res = await api.post("/teacher/exam/csv", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(" CSV upload response:", res.data);
    return res.data;
  } catch (err) {
    console.error(" Error uploading exam CSV:", err);
    throw err;
  }
};

export const addDisciplineComment = async (data) => {
  try {
    console.log(" Adding discipline comment:", data);
    const res = await api.post("/teacher/discipline", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log("Discipline comment response:", res.data);
    return res.data;
  } catch (err) {
    console.error(" Error adding discipline comment:", err);
    throw err;
  }
};

export const fetchClassPerformance = async (examType, term, year, className) => {
  try {
    const params = new URLSearchParams();
    if (examType) params.append("examType", examType);
    if (term) params.append("term", term);
    if (year) params.append("year", year);
    if (className) params.append("className", className);

    const url = `/teacher/performance${params.toString() ? `?${params.toString()}` : ""}`;
    console.log(" Fetching class performance from URL:", url);

    const res = await api.get(url);
    console.log(" Backend response received:", res.data);
    return res.data;
  } catch (err) {
    console.error(" Error fetching class performance:", err);
    throw err;
  }
};

export const fetchStudentCompletedQuizzes = async (studentId, subject) => {
  try {
    console.log(" Fetching completed quizzes for student:", studentId, "subject:", subject);
    const params = new URLSearchParams();
    if (subject && subject.toLowerCase() !== "all") {
      params.append("subject", subject);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get(`/teacher/${studentId}/completed-quizzes${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log(" Completed quizzes response:", res.data);
    return res.data;
  } catch (err) {
    console.error(" Error fetching completed quizzes:", err);
    throw err;
  }
};
