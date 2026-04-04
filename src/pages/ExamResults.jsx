import React, { useEffect, useState } from "react";
import { fetchStudentResults, fetchExamPDF } from "../services/examService";
import ExamTable from "../components/ExamTable";

const ExamResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.admissionNumber) {
      fetchStudentResults(user.admissionNumber)
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch exam results", err);
          setError("Unable to load exam results. Please try again later.");
          setLoading(false);
        });
    } else {
      console.warn("Missing admissionNumber in user object:", user);
      setError("Student ID is missing. Please log in again.");
      setLoading(false);
    }
  }, []);

  const handleViewPDF = (examType) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.admissionNumber) {
      fetchExamPDF(user.admissionNumber, examType);
    } else {
      console.warn("Missing admissionNumber for PDF fetch");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "#2e7d32" }}>Exam Results</h2>

      {loading && <p>Loading exam results...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && results.length > 0 ? (
        <>
          <ExamTable results={results} />

          <div style={{ marginTop: "1.5rem" }}>
            <h3>Download Exam PDFs</h3>
            {["Opener", "Mid-Term", "End-Term"].map((examType) => (
              <button
                key={examType}
                onClick={() => handleViewPDF(examType)}
                style={{
                  marginRight: "1rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {examType} Results PDF
              </button>
            ))}
          </div>
        </>
      ) : (
        !loading && <p>No exam results found.</p>
      )}
    </div>
  );
};

export default ExamResults;