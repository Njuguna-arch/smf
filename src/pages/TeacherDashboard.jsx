import React, { useEffect, useState } from "react";
import { fetchClassPerformance } from "../services/teacherService";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";

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

const TeacherDashboard = () => {
  const [performance, setPerformance] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [meanScore, setMeanScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Filters
  const [examType, setExamType] = useState("Mid-Term");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(2026);

  const loadPerformance = async (type, termValue, yearValue) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchClassPerformance(type, termValue, yearValue);
      console.log("📊 Raw backend response:", data);
      setPerformance(Array.isArray(data.performance) ? data.performance : []);
      setTotalScore(data.totalScore || 0);
      setMeanScore(data.meanScore || 0);
    } catch (err) {
      console.error("Failed to fetch class performance", err);
      setError("Failed to load class performance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformance(examType, term, year);
  }, [examType, term, year]);

  // 🔹 Compute grade + points for class mean
  const meanGrade = getCBEGrade(meanScore);
  const meanPoints = getPointsFromGrade(meanGrade);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Grather Academy — Teacher Dashboard
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Class Performance
        </Typography>

        {/* 🔹 Filters */}
        <Box sx={{ mb: 2, display: "flex", gap: 3 }}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Exam Type:
            </Typography>
            <Select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="Opener">Opener</MenuItem>
              <MenuItem value="Mid-Term">Mid-Term</MenuItem>
              <MenuItem value="End-Term">End-Term</MenuItem>
            </Select>
          </Box>

          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Term:
            </Typography>
            <Select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="Term 1">Term 1</MenuItem>
              <MenuItem value="Term 2">Term 2</MenuItem>
              <MenuItem value="Term 3">Term 3</MenuItem>
            </Select>
          </Box>

          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Year:
            </Typography>
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2026}>2026</MenuItem>
              <MenuItem value={2027}>2027</MenuItem>
            </Select>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Average Score</strong></TableCell>
                <TableCell><strong>Grade</strong></TableCell>
                <TableCell><strong>Points</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performance.length > 0 ? (
                performance.map((p) => {
                  const grade = getCBEGrade(Number(p.average));
                  const points = getPointsFromGrade(grade);
                  return (
                    <TableRow key={p.subject}>
                      <TableCell>{p.subject}</TableCell>
                      <TableCell>{Number(p.average).toFixed(2)}</TableCell>
                      <TableCell>{grade}</TableCell>
                      <TableCell>{points}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No exam results available</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell><strong>Class Total Marks</strong></TableCell>
                <TableCell>{totalScore.toFixed(2)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Class Mean</strong></TableCell>
                <TableCell>{meanScore.toFixed(2)}</TableCell>
                <TableCell>{meanGrade}</TableCell>
                <TableCell>{meanPoints}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default TeacherDashboard;