import React, { useState, useEffect, useContext } from "react";
import { fetchClassPerformance } from "../services/teacherService";
import { UserContext } from "../context/UserContext";
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
  Button,
  Chip,
  Alert,
} from "@mui/material";

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

const TeacherDashboard = () => {
  const { user } = useContext(UserContext);

  const [performance, setPerformance] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [meanScore, setMeanScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [examType, setExamType] = useState("Mid-Term");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(2026);
  const defaultClass =
    user?.classTeacher && user.classTeacher !== "null"
      ? user.classTeacher
      : user?.grade
      ? `Grade ${user.grade.replace(/^Grade\s*/i, "")}`
      : "Grade 4";
  const [selectedClass, setSelectedClass] = useState(defaultClass);

  const loadPerformance = async (type, termValue, yearValue, classValue) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchClassPerformance(type, termValue, yearValue, classValue);
      setPerformance(Array.isArray(data.performance) ? data.performance : []);
      setTotalScore(data.totalScore || 0);
      setMeanScore(data.meanScore || 0);
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load class performance";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformance(examType, term, year, selectedClass);
  }, []);

  // Compute grade + points for class mean
  const meanGrade = getCBEGrade(meanScore);
  const meanPoints = getPointsFromGrade(meanGrade);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: "bold" }}>
        Liskan Academy — Teacher Dashboard
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Class Performance — {selectedClass}
          </Typography>
          {user?.classTeacher && user.classTeacher !== "null" && (
            <Chip
              label={`Assigned Class: ${user.classTeacher}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Class / Grade:
            </Typography>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                <MenuItem key={g} value={`Grade ${g}`}>
                  Grade {g}
                </MenuItem>
              ))}
              <MenuItem value="Grade 4k">Grade 4k</MenuItem>
              <MenuItem value="Grade 4G">Grade 4G</MenuItem>
            </Select>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Exam Type:
            </Typography>
            <Select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="Opener">Opener</MenuItem>
              <MenuItem value="Mid-Term">Mid-Term</MenuItem>
              <MenuItem value="End-Term">End-Term</MenuItem>
            </Select>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Term:
            </Typography>
            <Select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="Term 1">Term 1</MenuItem>
              <MenuItem value="Term 2">Term 2</MenuItem>
              <MenuItem value="Term 3">Term 3</MenuItem>
            </Select>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Year:
            </Typography>
            <Select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value={2025}>2025</MenuItem>
              <MenuItem value={2026}>2026</MenuItem>
              <MenuItem value={2027}>2027</MenuItem>
              <MenuItem value={2028}>2028</MenuItem>
            </Select>
          </Box>

          <Box sx={{ alignSelf: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => loadPerformance(examType, term, year, selectedClass)}
              sx={{ height: 40 }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : (
          <Table sx={{ border: "1px solid #e0e0e0" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Average Score</strong></TableCell>
                <TableCell><strong>Grade</strong></TableCell>
                <TableCell><strong>Rubrics / Points</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performance.length > 0 ? (
                performance.map((p) => {
                  const grade = getCBEGrade(Number(p.average));
                  const points = getPointsFromGrade(grade);
                  return (
                    <TableRow key={p.subject} hover>
                      <TableCell>{p.subject}</TableCell>
                      <TableCell>{Number(p.average || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={grade}
                          size="small"
                          color={points >= 6 ? "success" : points >= 4 ? "primary" : "warning"}
                        />
                      </TableCell>
                      <TableCell>{points}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No exam results found for {selectedClass} ({examType}, {term} {year})
                  </TableCell>
                </TableRow>
              )}
              <TableRow sx={{ backgroundColor: "#fafafa" }}>
                <TableCell><strong>Class Total Marks</strong></TableCell>
                <TableCell><strong>{(totalScore || 0).toFixed(2)}</strong></TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "#fafafa" }}>
                <TableCell><strong>Class Mean</strong></TableCell>
                <TableCell><strong>{(meanScore || 0).toFixed(2)}</strong></TableCell>
                <TableCell>
                  <Chip
                    label={meanGrade}
                    size="small"
                    color={meanPoints >= 6 ? "success" : meanPoints >= 4 ? "primary" : "warning"}
                  />
                </TableCell>
                <TableCell><strong>{meanPoints}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default TeacherDashboard;
