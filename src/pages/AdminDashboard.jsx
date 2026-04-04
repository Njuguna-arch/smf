import React, { useEffect, useState } from "react";
import { fetchSchoolPerformance } from "../services/adminService";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

// 🔹 Helper: map grade → points
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

// 🔹 Helper: compute grade from marks
const getCBEGrade = (marks) => {
  if (marks >= 90) return "EE1";
  if (marks >= 75) return "EE2";
  if (marks >= 58) return "ME1";
  if (marks >= 41) return "ME2";
  if (marks >= 31) return "AE1";
  if (marks >= 21) return "AE2";
  if (marks >= 11) return "BE1";
  return "BE2";
};

const AdminDashboard = () => {
  const [performance, setPerformance] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [meanScore, setMeanScore] = useState(0);

  const [examType, setExamType] = useState("Mid-Term");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSchoolPerformance(examType, term, year)
      .then((data) => {
        setPerformance(data.performance || []);
        setTotalScore(data.totalScore || 0);
        setMeanScore(data.meanScore || 0);
      })
      .catch((err) => console.error("Failed to fetch performance", err));
  }, [examType, term, year]);

  const colors = ["#1565c0", "#2e7d32", "#f57c00", "#6a1b9a", "#d32f2f"];

  // 🔹 Compute grade + points for class mean
  const meanGrade = getCBEGrade(meanScore);
  const meanPoints = getPointsFromGrade(meanGrade);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#1565c0", marginBottom: "1rem" }}>Admin Dashboard</h2>

      {/* Filters */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "20px" }}>
        <label>
          Exam Type:
          <select value={examType} onChange={(e) => setExamType(e.target.value)} style={selectStyle}>
            <option value="Opener">Opener</option>
            <option value="Mid-Term">Mid-Term</option>
            <option value="End-Term">End-Term</option>
          </select>
        </label>
        <label>
          Term:
          <select value={term} onChange={(e) => setTerm(e.target.value)} style={selectStyle}>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </label>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ ...selectStyle, width: "100px" }}
          />
        </label>
      </div>

      <section>
        <h3 style={{ color: "#2e7d32" }}>School Performance (Table)</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th style={thStyle}>Subject</th>
              <th style={thStyle}>Average Score</th>
              <th style={thStyle}>Grade</th>
              <th style={thStyle}>Points</th>
            </tr>
          </thead>
          <tbody>
            {performance.length > 0 ? (
              performance.map((p) => {
                const grade = getCBEGrade(Number(p.average));
                const points = getPointsFromGrade(grade);
                return (
                  <tr key={p.subject}>
                    <td style={tdStyle}>{p.subject}</td>
                    <td style={tdStyle}>{Number(p.average).toFixed(2)}</td>
                    <td style={{ ...tdStyle, fontWeight: "bold", color: "#1565c0" }}>{grade}</td>
                    <td style={{ ...tdStyle, fontWeight: "bold", color: "#2e7d32" }}>{points}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} style={tdStyle}>No performance data available</td>
              </tr>
            )}
          </tbody>
          <tfoot style={{ backgroundColor: "#fafafa" }}>
            <tr>
              <td style={tdStyle}><strong>Total Score</strong></td>
              <td style={tdStyle}>{totalScore}</td>
              <td colSpan={2}></td>
            </tr>
            <tr>
              <td style={tdStyle}><strong>Mean Score</strong></td>
              <td style={tdStyle}>{Number(meanScore).toFixed(2)}</td>
              <td style={{ ...tdStyle, fontWeight: "bold", color: "#1565c0" }}>{meanGrade}</td>
              <td style={{ ...tdStyle, fontWeight: "bold", color: "#2e7d32" }}>{meanPoints}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3 style={{ color: "#2e7d32" }}>Average Score per Subject (Bar Chart)</h3>
        <BarChart width={600} height={300} data={performance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="average" fill="#1565c0" />
        </BarChart>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3 style={{ color: "#d32f2f" }}>Subject Contribution to Total Score (Pie Chart)</h3>
        <PieChart width={500} height={350}>
          <Pie
            data={performance}
            dataKey="average"
            nameKey="subject"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {performance.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          {/* 🔹 Add Legend for clarity */}
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: "14px" }}
          />
        </PieChart>
      </section>
    </div>
  );
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
  backgroundColor: "#e0e0e0",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
};

const selectStyle = {
  padding: "6px 12px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginLeft: "0.5rem",
};

export default AdminDashboard;