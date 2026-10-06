import React, { useEffect, useState } from "react";
import {
  fetchSchoolPerformance,
  fetchExamTypes,
  fetchTerms,
  fetchYears,
} from "../services/adminService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
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
  const num = Number(marks) || 0;
  if (num >= 90) return "EE1";
  if (num >= 75) return "EE2";
  if (num >= 58) return "ME1";
  if (num >= 41) return "ME2";
  if (num >= 31) return "AE1";
  if (num >= 21) return "AE2";
  if (num >= 11) return "BE1";
  return "BE2";
};

const PerformanceSection = ({ title, performance = [], totalScore = 0, meanScore = 0 }) => {
  const colors = [
    "#1565c0", "#2e7d32", "#f57c00", "#6a1b9a", "#d32f2f",
    "#00838f", "#c2185b", "#ef6c00", "#00897b", "#3949ab"
  ];
  const meanGrade = getCBEGrade(meanScore);
  const meanPoints = getPointsFromGrade(meanGrade);
  const hasData = Array.isArray(performance) && performance.length > 0;

  return (
    <section
      style={{
        marginTop: "2rem",
        backgroundColor: "#ffffff",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #e0e0e0",
      }}
    >
      <h3 style={{ color: "#2e7d32", margin: "0 0 1rem 0" }}>{title}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Average Score</th>
            <th style={thStyle}>Grade</th>
            <th style={thStyle}>Rubrics / Points</th>
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            performance.map((p) => {
              const avg = Number(p.average || 0);
              const grade = getCBEGrade(avg);
              const points = getPointsFromGrade(grade);
              return (
                <tr key={p.subject}>
                  <td style={tdStyle}>{p.subject}</td>
                  <td style={tdStyle}>{avg.toFixed(2)}</td>
                  <td style={{ ...tdStyle, fontWeight: "bold", color: "#1565c0" }}>{grade}</td>
                  <td style={{ ...tdStyle, fontWeight: "bold", color: "#2e7d32" }}>{points}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} style={{ ...tdStyle, padding: "20px", color: "#666" }}>
                No performance data available
              </td>
            </tr>
          )}
        </tbody>
        <tfoot style={{ backgroundColor: "#fafafa" }}>
          <tr>
            <td style={tdStyle}><strong>Total Score</strong></td>
            <td style={tdStyle}>{Number(totalScore || 0).toFixed(2)}</td>
            <td colSpan={2}></td>
          </tr>
          <tr>
            <td style={tdStyle}><strong>Mean Score</strong></td>
            <td style={tdStyle}>{Number(meanScore || 0).toFixed(2)}</td>
            <td style={{ ...tdStyle, fontWeight: "bold", color: "#1565c0" }}>{meanGrade}</td>
            <td style={{ ...tdStyle, fontWeight: "bold", color: "#2e7d32" }}>{meanPoints}</td>
          </tr>
        </tfoot>
      </table>

      {hasData ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            marginTop: "2rem",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              flex: "1 1 500px",
              minWidth: "320px",
              backgroundColor: "#fafafa",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >
            <h4 style={{ margin: "0 0 1rem 0", color: "#333", textAlign: "center" }}>
              Subject Average Performance
            </h4>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performance}
                  margin={{ top: 10, right: 20, left: 0, bottom: 45 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="subject"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    height={50}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, "Average Score"]} />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
                  <Bar
                    dataKey="average"
                    name="Average Score"
                    fill="#1565c0"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 420px",
              minWidth: "320px",
              backgroundColor: "#fafafa",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >
            <h4 style={{ margin: "0 0 1rem 0", color: "#333", textAlign: "center" }}>
              Subject Distribution
            </h4>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performance}
                    dataKey="average"
                    nameKey="subject"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {performance.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.subject || index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}`, "Average Score"]} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#888",
            marginTop: "1.5rem",
            backgroundColor: "#fafafa",
            borderRadius: "6px",
            border: "1px dashed #ccc",
          }}
        >
          No chart data available for this selection
        </div>
      )}
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

  // Defaults ensure filters are never blank and load instantly
  const [examTypes, setExamTypes] = useState(["Mid-Term", "End-Term", "Opener"]);
  const [terms, setTerms] = useState(["Term 1", "Term 2", "Term 3"]);
  const [years, setYears] = useState([2026, 2027, 2028]);

  const [examType, setExamType] = useState("Mid-Term");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(2026);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load available filter options from backend
  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchExamTypes(), fetchTerms(), fetchYears()])
      .then(([types, termList, yearList]) => {
        if (!isMounted) return;
        if (Array.isArray(types) && types.length > 0) {
          setExamTypes(types);
          if (!types.includes(examType)) setExamType(types[0]);
        }
        if (Array.isArray(termList) && termList.length > 0) {
          setTerms(termList);
          if (!termList.includes(term)) setTerm(termList[0]);
        }
        if (Array.isArray(yearList) && yearList.length > 0) {
          setYears(yearList);
          if (!yearList.includes(year)) setYear(Number(yearList[0]));
        }
      })
      .catch((err) => {
        console.warn("Using default filters due to load error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch performance data when filter changes
  useEffect(() => {
    if (!examType || !term || !year) return;

    let isMounted = true;
    setLoading(true);
    setError("");

    fetchSchoolPerformance(examType, term, year)
      .then((data) => {
        if (!isMounted) return;

        // Structured primary data support
        if (data && data.primary) {
          setPrimaryPerformance(data.primary.performance || []);
          setPrimaryTotalScore(data.primary.totalScore || 0);
          setPrimaryMeanScore(data.primary.meanScore || 0);
        } else if (data && Array.isArray(data.performance)) {
          // Fallback if backend returned flat structure
          setPrimaryPerformance(data.performance);
          setPrimaryTotalScore(data.totalScore || 0);
          setPrimaryMeanScore(data.meanScore || 0);
        } else {
          setPrimaryPerformance([]);
          setPrimaryTotalScore(0);
          setPrimaryMeanScore(0);
        }

        // Structured junior secondary data support
        if (data && data.juniorSecondary) {
          setJuniorPerformance(data.juniorSecondary.performance || []);
          setJuniorTotalScore(data.juniorSecondary.totalScore || 0);
          setJuniorMeanScore(data.juniorSecondary.meanScore || 0);
        } else {
          setJuniorPerformance([]);
          setJuniorTotalScore(0);
          setJuniorMeanScore(0);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch performance", err);
        setError("Failed to load performance data from server.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [examType, term, year]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#1565c0", marginBottom: "1.2rem" }}>Admin Dashboard</h2>

      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
          backgroundColor: "#ffffff",
          padding: "1rem 1.25rem",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <label style={{ fontWeight: 600, color: "#333", display: "inline-flex", alignItems: "center" }}>
          Exam Type:
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            style={selectStyle}
          >
            {examTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label style={{ fontWeight: 600, color: "#333", display: "inline-flex", alignItems: "center" }}>
          Term:
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            style={selectStyle}
          >
            {terms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label style={{ fontWeight: 600, color: "#333", display: "inline-flex", alignItems: "center" }}>
          Year:
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={selectStyle}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        {loading && (
          <span style={{ color: "#1565c0", fontSize: "0.9rem", fontStyle: "italic" }}>
            Updating dashboard data...
          </span>
        )}
        {error && (
          <span style={{ color: "#d32f2f", fontSize: "0.9rem" }}>
            {error}
          </span>
        )}
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
  fontSize: "0.95rem",
};

export default AdminDashboard;
