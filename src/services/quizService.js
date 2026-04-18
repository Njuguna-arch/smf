import api from "./api";

// Fetch active quizzes
export const fetchQuizzes = async (grade, subject) => {
  try {
    const match = grade.replace(/\+/g, " ").match(/\d+/);
    const normalizedGrade = match ? match[0] : grade;

    const res = await api.get("/quizzes", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: { grade: normalizedGrade, subject },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to fetch quizzes:", err.message);
    throw err;
  }
};

// Submit a single quiz (one question at a time)
export const submitQuiz = async (quizId, selectedOption) => {
  try {
    const res = await api.post(
      "/quizzes/submit",
      { quizId, selectedOption },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    return res.data; // { score, total, answers: [...] }
  } catch (err) {
    console.error("Failed to submit quiz:", err.message);
    throw err;
  }
};

// Fetch subjects
export const fetchSubjects = async () => {
  try {
    const res = await api.get("/quizzes/subjects", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch subjects:", err.message);
    throw err;
  }
};

// Add a new quiz (MCQ or File-based)
export const addQuiz = async (quizData) => {
  try {
    const isFormData = quizData instanceof FormData;

    const res = await api.post("/quizzes", quizData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
      },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to add quiz:", err.message);
    throw err;
  }
};

// Fetch completed quizzes for a student
export const fetchCompletedQuizzes = async (studentId) => {
  try {
    const res = await api.get(`/users/${studentId}/completed-quizzes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch completed quizzes:", err.message);
    throw err;
  }
};
