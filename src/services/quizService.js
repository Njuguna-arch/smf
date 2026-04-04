import api from "./api";

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

export const submitQuiz = async ({ quizId, answers }) => {
  try {
    const res = await api.post(
      "/quizzes/submit",
      { quizId, answers },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Failed to submit quiz:", err.message);
    throw err;
  }
};

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

/**
 * Add a new quiz (MCQ or File-based).
 * If quizData is FormData, send as multipart/form-data.
 */
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

export const fetchCompletedQuizzes = async (studentId) => {
  try {
    const res = await api.get(`/students/${studentId}/completed-quizzes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch completed quizzes:", err.message);
    throw err;
  }
};