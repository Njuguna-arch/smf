import api from "./api";

export const fetchStudentResults = async (admissionNumber) => {
  try {
    if (!admissionNumber) {
      throw new Error("Admission number is required to fetch exam results");
    }

    const res = await api.get(`/exams/${admissionNumber}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching student results:", err.message);
    throw err;
  }
};

export const fetchExamPDF = async (admissionNumber, examType) => {
  try {
    if (!admissionNumber || !examType) {
      throw new Error("Admission number and exam type are required for PDF fetch");
    }

    const res = await api.get(`/exams/${admissionNumber}/${examType}/pdf`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      responseType: "blob",
    });

    const fileURL = window.URL.createObjectURL(new Blob([res.data]));
    window.open(fileURL);
  } catch (err) {
    console.error("Error fetching exam PDF:", err.message);
    throw err;
  }
};

export const uploadExamCSV = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/exams/upload", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error uploading exam CSV:", err.message);
    throw err;
  }
};

export const fetchUploadedExams = async () => {
  try {
    const res = await api.get("/exams", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data.exams;
  } catch (err) {
    console.error("Error fetching uploaded exams:", err.message);
    throw err;
  }
};