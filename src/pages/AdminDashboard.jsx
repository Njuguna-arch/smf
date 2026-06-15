import React, { useEffect, useState } from "react";
import { fetchSchoolPerformance } from "../services/adminService";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

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
const PerformanceSection = ({ title, performance, totalScore, meanScore }) => {
  const colors = ["#1565c0", "#2e7d32", "#f57c00", "#6a1b9a", "#d32f2f"];
  const meanGrade = getCBEGrade(meanScore);
  const meanPoints = getPointsFromGrade(meanGrade);

  return (
    <section style={{ marginTop: "2rem" }}>
      <h3 style={{ color: "#2e7d32" }}>{title}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Average Score</th>
            <th style={thStyle}>Grade</th>
            <th style={thStyle}>Lubrics</th>
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

      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <BarChart width={500} height={300} data={performance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="average" fill="#1565c0" />
        </BarChart>

        <PieChart width={400} height={300}>
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
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </div>
    </section>
  );
};
const AdminDashboard = () => {
  const [primaryPerformance, setPrimaryPerformance] = useState([]);
  const [primaryTotalScore, setPrimaryTotalScore] = useState(0);
  const [primaryMeanScore, setPrimaryMeanScore] = useState(0);

  const [juniorPerformance, setJuniorPerformance] = useState([]);
  const [juniorTotalScore, setJuniorTotalScore] = useState(0);
  const [juniorMeanScore, setJuniorMeanScore] = useState(0);

  const [examTypes, setExamTypes] = useState([]);
  const [terms, setTerms] = useState([]);
  const [years, setYears] = useState([]);

  const [examType, setExamType] = useState("");
  const [term, setTerm] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/exam-types").then(res => res.json()),
      fetch("/api/admin/terms").then(res => res.json()),
      fetch("/api/admin/years").then(res => res.json())
    ]).then(([types, terms, years]) => {
      setExamTypes(types);
      setTerms(terms);
      setYears(years);
      setExamType(types[0] || "");
      setTerm(terms[0] || "");
      setYear(years[0] || new Date().getFullYear());
    });
  }, []);

useEffect(() => {
  if (!examType || !term || !year) return;

  // Normalize values before sending to backend
  const normalizedExamType = examType.trim().toLowerCase();
  const normalizedTerm = term.trim().toLowerCase();
  const normalizedYear = Number(year);

  fetchSchoolPerformance(normalizedExamType, normalizedTerm, normalizedYear)
    .then((data) => {
      setPrimaryPerformance(data.primary?.performance || []);
      setPrimaryTotalScore(data.primary?.totalScore || 0);
      setPrimaryMeanScore(data.primary?.meanScore || 0);

      setJuniorPerformance(data.juniorSecondary?.performance || []);
      setJuniorTotalScore(data.juniorSecondary?.totalScore || 0);
      setJuniorMeanScore(data.juniorSecondary?.meanScore || 0);
    })
    .catch((err) => console.error("Failed to fetch performance", err));
}, [examType, term, year]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#1565c0", marginBottom: "1rem" }}>Admin Dashboard</h2>

      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "20px" }}>
        <label>
          Exam Type:
          <select value={examType} onChange={(e) => setExamType(e.target.value)} style={selectStyle}>
            {examTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>
          Term:
          <select value={term} onChange={(e) => setTerm(e.target.value)} style={selectStyle}>
            {terms.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>
          Year:
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={selectStyle}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
      </div>

      <PerformanceSection
        title="Primary School Performance (Grades 1–6)"
        performance={primaryPerformance}
        totalScore={primaryTotalScore}
        meanScore={primaryMeanScore}
      />

      <PerformanceSection
        title="Junior Secondary Performance (Grades 7–9)"
        performance={juniorPerformance}
        totalScore={juniorTotalScore}
        meanScore={juniorMeanScore}
      />
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
