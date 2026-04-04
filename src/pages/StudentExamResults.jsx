import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchStudentResults } from "../services/examService";
import { getCurrentUser } from "../services/authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const gradeColor = (grade) => {
  switch (grade) {
    case "EE1": return "#4caf50";
    case "EE2": return "#66bb6a";
    case "ME1": return "#2196f3";
    case "ME2": return "#64b5f6";
    case "AE1": return "#ff9800";
    case "AE2": return "#ffb74d";
    case "BE1": return "#f44336";
    case "BE2": return "#e57373";
    default: return "#757575";
  }
};

const getPointsFromGrade = (grade) => {
  switch (grade) {
    case "EE1": return 8;
    case "EE2": return 7;
    case "ME1": return 6;
    case "ME2": return 5;
    case "AE1": return 4;
    case "AE2": return 3;
    case "BE1": return 2;
    case "BE2": return 1;
    default: return 0;
  }
};

const StudentExamResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedExamType, setSelectedExamType] = useState("Mid-Term");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedYear, setSelectedYear] = useState(2026);

  const [appliedExamType, setAppliedExamType] = useState(selectedExamType);
  const [appliedTerm, setAppliedTerm] = useState(selectedTerm);
  const [appliedYear, setAppliedYear] = useState(selectedYear);

  const user = getCurrentUser();

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      setError("");

      if (!user?.admissionNumber) {
        setError("Student ID is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchStudentResults(user.admissionNumber);
        const normalizedData = Array.isArray(data) ? data : data?.exams || [];
        setResults(normalizedData);
      } catch (err) {
        console.error("Error fetching student results:", err.message);
        setError("Failed to load exam results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [user?.admissionNumber]);

    const handleSearch = () => {
    setAppliedExamType(selectedExamType);
    setAppliedTerm(selectedTerm);
    setAppliedYear(selectedYear);
  };

  const filteredResults = results.filter(
    (exam) =>
      exam.examType === appliedExamType &&
      exam.term === appliedTerm &&
      exam.year === appliedYear
  );

  if (loading) return <p style={{ color: "#555" }}>Loading exam results...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (filteredResults.length === 0) return <p>No exam results found.</p>;

  const exam = filteredResults[0];

      const handleDownloadPDF = async () => {
        try {
          const token = localStorage.getItem("token");
          const url = `${API_URL}/api/exams/${exam.admissionNumber}/${exam.examType}/${exam.term}/${exam.year}/pdf`;

          const response = await axios.get(url, {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `${exam.examType}-${exam.term}-${exam.year}.pdf`;
          link.click();
        } catch (err) {
          console.error("Failed to download PDF:", err);
          alert("Could not download PDF. Please try again.");
        }
      };

    return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "1rem" }}>
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>Exam Type:</label>
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="Opener">Opener</option>
            <option value="Mid-Term">Mid-Term</option>
            <option value="End-Term">End-Term</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>Term:</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>

        <div>
          <button
            onClick={handleSearch}
            style={{
              padding: "6px 16px",
              backgroundColor: "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Search
          </button>
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#2e7d32" }}>
        {exam.studentId?.name || "Student"}
      </h2>
      <p style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
        Admission Number: {exam.admissionNumber}
      </p>
      <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem" }}>
        Overall Grade:{" "}
        <span style={{ color: gradeColor(exam.overallGrade) }}>
          {exam.overallGrade || "N/A"}
        </span>
      </p>
      <p style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1rem" }}>
        {exam.examType} — {exam.term} {exam.year}
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Marks</th>
            <th style={thStyle}>Grade</th>
            <th style={thStyle}>Points</th>
          </tr>
        </thead>
        <tbody>
          {exam.subjectResults.map((subj, idx) => {
            const points = getPointsFromGrade(subj.grade);
            return (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={tdStyle}>{subj.subjectName}</td>
                <td style={tdStyle}>{subj.marks}</td>
                <td style={{ ...tdStyle, color: gradeColor(subj.grade), fontWeight: "bold" }}>
                  {subj.grade}
                </td>
                <td style={pointsStyle}>{points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Teacher Comment */}
      <div style={{ marginTop: "1rem", fontWeight: "bold", color: "#333", textAlign: "center" }}>
        Class Teacher's Comment: {exam.overallComment || "N/A"}
      </div>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
const tdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
const pointsStyle = {
  ...tdStyle,
  fontWeight: "bold",
  color: "#2e7d32",
  padding: "8px 16px",
  borderLeft: "3px solid #ccc",
};

export default StudentExamResults;