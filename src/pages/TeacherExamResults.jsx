import React, { useState, useEffect } from "react";
import ExamUploadForm from "../components/ExamUploadForm";
import ExamTable from "../components/ExamTable";
import { fetchUploadedExams } from "../services/examService";

const TeacherExamResults = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Filter states
  const [selectedExamType, setSelectedExamType] = useState("Opener");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [filteredExams, setFilteredExams] = useState([]);

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchUploadedExams();
        setExams(data || []);
        setFilteredExams(data || []); // initialize with all exams
      } catch (err) {
        console.error("Error fetching uploaded exams:", err.message);
        setError("Failed to load exam results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  // 🔹 Apply filters when Search button is clicked
  const handleSearch = () => {
    let results = exams;

    if (selectedExamType) {
      results = results.filter((exam) => exam.examType === selectedExamType);
    }
    if (selectedTerm) {
      results = results.filter((exam) => exam.term === selectedTerm);
    }
    if (selectedYear) {
      results = results.filter((exam) => exam.year === Number(selectedYear)); // ✅ FIX: convert string to number
    }

    setFilteredExams(results);
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        minHeight: "80vh",
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: "#2e7d32" }}>Exam Management</h2>
      <ExamUploadForm />

      {/* 🔹 Filters */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        {/* Exam type filter */}
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>
            Exam Type:
          </label>
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Opener">Opener</option>
            <option value="Mid-Term">Mid-Term</option>
            <option value="End-Term">End-Term</option>
          </select>
        </div>

        {/* Term filter */}
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>
            Term:
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        {/* Year filter */}
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>
            Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          style={{
            padding: "6px 16px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#2e7d32",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading && <p style={{ color: "#555" }}>Loading exam results...</p>}
      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        filteredExams.length === 0 ? (
          <p style={{ marginTop: "1rem", color: "#555" }}>
            No exam results uploaded yet.
          </p>
        ) : (
          <ExamTable results={filteredExams} />
        )
      )}
    </div>
  );
};

export default TeacherExamResults;