import React from "react";

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

const ExamTable = ({ results }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return <p style={{ color: "#555" }}>No exam results available.</p>;
  }

  // Collect all unique subjects across results
  const subjects = Array.from(
    new Set(results.flatMap((exam) => exam.subjectResults.map((s) => s.subjectName)))
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={thStyle}>Admission No</th>
            <th style={thStyle}>Student Name</th>
            {subjects.map((subj) => (
              <th key={subj} style={thStyle}>{subj}</th>
            ))}
            <th style={thStyle}>Overall Grade</th>
            <th style={thStyle}>Overall Comment</th>
          </tr>
        </thead>
        <tbody>
          {results.map((exam, idx) => (
            <tr key={exam._id} style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={tdStyle}>{exam.admissionNumber}</td>
              {/* ✅ Show student name from populated studentId */}
              <td style={tdStyle}>{exam.studentId?.name || "N/A"}</td>
              {subjects.map((subj) => {
                const subjectResult = exam.subjectResults.find((s) => s.subjectName === subj);
                return (
                  <td key={subj} style={{ ...tdStyle, color: gradeColor(subjectResult?.grade) }}>
                    {subjectResult ? subjectResult.marks : "-"}
                  </td>
                );
              })}
              <td style={tdStyle}>{exam.overallGrade || "N/A"}</td>
              <td style={tdStyle}>{exam.overallComment || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default ExamTable;