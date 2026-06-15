import api from "./api";

// 🔹 Normalize helper
const normalize = (val) => (val ? val.trim().toLowerCase() : "");

export const fetchStudentResults = async (admissionNumber) => {
  try {
    if (!admissionNumber) {
      throw new Error("Admission number is required to fetch exam results");
    }

    // Normalize admission number (strip ADM prefix, uppercase)
    const normalizedAdmission = admissionNumber.trim().toUpperCase().replace(/^ADM/, "");

    const res = await api.get(`/exams/${normalizedAdmission}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching student results:", err.message);
    throw err;
  }
};

export const fetchExamPDF = async (admissionNumber, examType, term, year) => {
  try {
    if (!admissionNumber || !examType || !term || !year) {
      throw new Error("Admission number, exam type, term, and year are required for PDF fetch");
    }

    const normalizedAdmission = admissionNumber.trim().toUpperCase().replace(/^ADM/, "");
    const normalizedExamType = normalize(examType);
    const normalizedTerm = normalize(term);
    const normalizedYear = Number(year);

    const res = await api.get(
      `/exams/${normalizedAdmission}/${normalizedExamType}/${normalizedTerm}/${normalizedYear}/pdf`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      }
    );

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

export const fetchUploadedExams = async (examType, term, year) => {
  try {
    const normalizedExamType = normalize(examType);
    const normalizedTerm = normalize(term);
    const normalizedYear = Number(year);

    const res = await api.get(
      `/exams?examType=${normalizedExamType}&term=${normalizedTerm}&year=${normalizedYear}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res.data.exams;
  } catch (err) {
    console.error("Error fetching uploaded exams:", err.message);
    throw err;
  }
};
