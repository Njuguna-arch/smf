import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { UserContext } from "../context/UserContext";
import StudentSelector from "../components/StudentSelector.jsx";
import { getQuizDownloadUrl } from "../services/quizService";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const ALL_SUBJECTS = [
  "All Subjects",
  "Mathematics",
  "English",
  "Kiswahili",
  "Science",
  "Social Studies",
  "CRE",
  "Pre-Tech",
  "Agriculture",
  "Creative Arts",
];

const getCBEGrade = (marks) => {
  if (marks >= 90) return { label: "EE1", color: "success" };
  if (marks >= 75) return { label: "EE2", color: "success" };
  if (marks >= 58) return { label: "ME1", color: "primary" };
  if (marks >= 41) return { label: "ME2", color: "primary" };
  if (marks >= 31) return { label: "AE1", color: "warning" };
  if (marks >= 21) return { label: "AE2", color: "warning" };
  if (marks >= 11) return { label: "BE1", color: "error" };
  return { label: "BE2", color: "error" };
};

const StudentQuizzesPage = () => {
  const { user } = useContext(UserContext);

  // Initialize grade from teacher's class assignment
  const initialGrade =
    user?.classTeacher && user.classTeacher !== "null"
      ? user.classTeacher.startsWith("Grade")
        ? user.classTeacher
        : `Grade ${user.classTeacher}`
      : "All Grades";

  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  const fetchQuizzes = async (studentId, subjectFilter) => {
    if (!studentId) {
      setQuizzes([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (subjectFilter && subjectFilter !== "All Subjects") {
        params.append("subject", subjectFilter);
      }
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get(`/teacher/${studentId}/completed-quizzes${query}`);
      setQuizzes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching completed quizzes:", err);
      setError("Failed to load completed quizzes for this student.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId, studentObj) => {
    setSelectedStudentId(studentId);
    setSelectedStudent(studentObj || null);
    fetchQuizzes(studentId, selectedSubject);
  };

  const handleGradeChange = (newGrade) => {
    setSelectedGrade(newGrade);
    // Reset student selection when grade changes
    setSelectedStudentId("");
    setSelectedStudent(null);
    setQuizzes([]);
  };

  const handleSubjectChange = (newSubject) => {
    setSelectedSubject(newSubject);
    if (selectedStudentId) {
      fetchQuizzes(selectedStudentId, newSubject);
    }
  };

  const handleDownloadFile = async (quiz) => {
    try {
      const quizId = quiz.quiz?._id || quiz._id;
      if (!quizId) {
        alert("File information not available");
        return;
      }
      const data = await getQuizDownloadUrl(quizId);
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Download URL not found");
      }
    } catch (err) {
      console.error("Error downloading quiz:", err);
      alert("Failed to download quiz file");
    }
  };

  // Filter quizzes locally as well for immediate responsiveness
  const filteredQuizzes = quizzes.filter((q) => {
    if (!selectedSubject || selectedSubject === "All Subjects") return true;
    const qSubject = q.quiz?.subject || q.answers?.[0]?.subject || q.subject || "";
    return qSubject.trim().toLowerCase() === selectedSubject.trim().toLowerCase();
  });

  // Calculate statistics for selected student
  const totalAttempted = filteredQuizzes.length;
  const totalScore = filteredQuizzes.reduce((acc, q) => acc + (q.score || 0), 0);
  const maxPossible = filteredQuizzes.reduce((acc, q) => acc + (q.total || 0), 0);
  const avgPercentage =
    maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
  const cbeGrade = getCBEGrade(avgPercentage);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
          Student Completed Quizzes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select students by Grade and filter submissions by Subject to review performance.
        </Typography>
      </Box>

      {/* Filter Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
          Filter Student Submissions
        </Typography>
        <StudentSelector
          selectedGrade={selectedGrade}
          onGradeChange={handleGradeChange}
          selectedStudentId={selectedStudentId}
          onSelect={handleStudentSelect}
          selectedSubject={selectedSubject}
          onSubjectChange={handleSubjectChange}
          subjects={ALL_SUBJECTS}
        />
      </Paper>

      {/* Selected Student Banner & Stats */}
      {selectedStudent && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#f8fafd",
            border: "1px solid #e1e9f4",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Student Info */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "primary.main",
                    fontSize: 22,
                    fontWeight: "bold",
                  }}
                  src={selectedStudent.photoUrl || undefined}
                >
                  {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : <PersonIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {selectedStudent.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip
                      size="small"
                      label={`Adm: ${selectedStudent.admissionNumber || "N/A"}`}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={selectedStudent.grade || "No Grade"}
                      color="primary"
                    />
                    {selectedStudent.schoolCode && (
                      <Chip
                        size="small"
                        label={`School: ${selectedStudent.schoolCode}`}
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Performance Stats */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "white",
                      textAlign: "center",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Quizzes Completed
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                      {totalAttempted}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "white",
                      textAlign: "center",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Total Score
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {totalScore}/{maxPossible}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "white",
                      textAlign: "center",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Average / Rating
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {avgPercentage}%
                      </Typography>
                      {totalAttempted > 0 && (
                        <Chip
                          size="small"
                          label={cbeGrade.label}
                          color={cbeGrade.color}
                          sx={{ fontWeight: "bold" }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Main Content Area */}
      {!selectedStudentId ? (
        <Paper sx={{ p: 5, textAlign: "center", borderRadius: 2, bgcolor: "#fafafa" }}>
          <AssignmentTurnedInIcon sx={{ fontSize: 60, color: "#90caf9", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Select a Student to View Completed Quizzes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the filters above to select a Grade, then choose a student from the dropdown list.
          </Typography>
        </Paper>
      ) : loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredQuizzes.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2, bgcolor: "#fff9e6" }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            No Completed Quizzes Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedStudent?.name || "This student"} has not completed any quizzes
            {selectedSubject !== "All Subjects" ? ` in ${selectedSubject}` : ""}.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {/* Controls: View toggle and Subject Chips */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {ALL_SUBJECTS.map((subj) => (
                <Chip
                  key={subj}
                  label={subj}
                  clickable
                  color={selectedSubject === subj ? "primary" : "default"}
                  variant={selectedSubject === subj ? "filled" : "outlined"}
                  onClick={() => handleSubjectChange(subj)}
                  size="small"
                />
              ))}
            </Stack>

            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={(e, next) => next && setViewMode(next)}
            >
              <ToggleButton value="cards" aria-label="cards view">
                <ViewModuleIcon fontSize="small" sx={{ mr: 0.5 }} /> Cards
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} /> Table
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Cards View */}
          {viewMode === "cards" ? (
            <Grid container spacing={2}>
              {filteredQuizzes.map((q, idx) => {
                const subject = q.quiz?.subject || q.answers?.[0]?.subject || q.subject || "General";
                const grade = q.quiz?.grade || q.answers?.[0]?.grade || q.grade || "-";
                const pct = q.total > 0 ? Math.round((q.score / q.total) * 100) : 0;
                const isPassed = pct >= 50;

                return (
                  <Grid item xs={12} key={q._id || idx}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                      <CardContent>
                        {/* Header */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 1.5,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                              {subject}
                            </Typography>
                            <Chip size="small" label={`Grade ${grade}`} color="info" variant="outlined" />
                            {q.quiz?.type === "file" && (
                              <Chip size="small" label="File Quiz" color="secondary" />
                            )}
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {q.attemptedAt ? new Date(q.attemptedAt).toLocaleString() : ""}
                            </Typography>
                            <Chip
                              label={`Score: ${q.score}/${q.total} (${pct}%)`}
                              color={pct === 100 ? "success" : isPassed ? "primary" : "error"}
                              sx={{ fontWeight: "bold" }}
                            />
                          </Box>
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        {/* File Quiz Download */}
                        {(q.quiz?.type === "file" || q.quiz?.fileUrl) && (
                          <Box sx={{ my: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              📄 File-based quiz submission.
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownloadFile(q)}
                            >
                              Download Quiz File
                            </Button>
                          </Box>
                        )}

                        {/* Answers breakdown */}
                        {Array.isArray(q.answers) && q.answers.length > 0 ? (
                          q.answers.map((ans, aIdx) => (
                            <Box
                              key={aIdx}
                              sx={{
                                p: 1.5,
                                mt: 1,
                                borderRadius: 1.5,
                                backgroundColor: ans.isCorrect ? "#f0fdf4" : "#fef2f2",
                                border: `1px solid ${ans.isCorrect ? "#bbf7d0" : "#fecaca"}`,
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Q{aIdx + 1}: {ans.question || q.quiz?.question || "Question"}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  {ans.isCorrect ? (
                                    <CheckCircleIcon color="success" fontSize="small" />
                                  ) : (
                                    <CancelIcon color="error" fontSize="small" />
                                  )}
                                  <Typography variant="body2">
                                    <strong>Selected:</strong> {ans.selectedOption || "None"}
                                  </Typography>
                                </Box>

                                {!ans.isCorrect && ans.correctAnswer && (
                                  <Typography variant="body2" color="primary" sx={{ ml: { sm: 2 } }}>
                                    <strong>Correct Answer:</strong> {ans.correctAnswer}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))
                        ) : q.quiz?.question ? (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              <strong>Question:</strong> {q.quiz.question}
                            </Typography>
                            {q.quiz.correctAnswer && (
                              <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                                <strong>Answer Key:</strong> {q.quiz.correctAnswer}
                              </Typography>
                            )}
                          </Box>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            /* Table View */
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell><strong>#</strong></TableCell>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell><strong>Grade</strong></TableCell>
                    <TableCell><strong>Question / Detail</strong></TableCell>
                    <TableCell align="center"><strong>Score</strong></TableCell>
                    <TableCell align="center"><strong>Percentage</strong></TableCell>
                    <TableCell><strong>Attempted At</strong></TableCell>
                    <TableCell align="center"><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredQuizzes.map((q, idx) => {
                    const subject = q.quiz?.subject || q.answers?.[0]?.subject || q.subject || "General";
                    const grade = q.quiz?.grade || q.answers?.[0]?.grade || q.grade || "-";
                    const question =
                      q.quiz?.question ||
                      q.answers?.[0]?.question ||
                      (q.quiz?.type === "file" ? "File-based Quiz" : "Standard Quiz");
                    const pct = q.total > 0 ? Math.round((q.score / q.total) * 100) : 0;

                    return (
                      <TableRow key={q._id || idx} hover>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{subject}</TableCell>
                        <TableCell>Grade {grade}</TableCell>
                        <TableCell sx={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {question}
                        </TableCell>
                        <TableCell align="center">
                          {q.score}/{q.total}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={`${pct}%`}
                            color={pct === 100 ? "success" : pct >= 50 ? "primary" : "error"}
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell>
                          {q.attemptedAt ? new Date(q.attemptedAt).toLocaleString() : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {q.quiz?.type === "file" || q.quiz?.fileUrl ? (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownloadFile(q)}
                            >
                              Download
                            </Button>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StudentQuizzesPage;
