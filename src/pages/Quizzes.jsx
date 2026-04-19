import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  fetchQuizzes,
  submitQuiz,
  fetchSubjects,
  fetchCompletedQuizzes,
} from "../services/quizService";
import QuizCard from "../components/QuizCard";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  // Load subjects on mount
  useEffect(() => {
    fetchSubjects()
      .then((data) => {
        setSubjects(data);
        if (data.length > 0) setSubject(data[0]);
      })
      .catch((err) => {
        console.error("Failed to fetch subjects", err);
        setError("Unable to load subjects. Please try again later.");
      });
  }, []);

  // Load quizzes and completed quizzes when subject changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && subject) {
      const normalizedGrade = user.grade.replace("Grade ", "");
      loadQuizzes(normalizedGrade, subject);
      loadCompletedQuizzes(user._id);
    }
  }, [subject]);

  const loadQuizzes = async (grade, subject) => {
    setLoading(true);
    try {
      const data = await fetchQuizzes(grade, subject);
      setQuizzes(data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
      setError("Unable to load quizzes. Please try again later.");
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedQuizzes = async (studentId) => {
    if (!studentId) return;
    try {
      const data = await fetchCompletedQuizzes(studentId);
      setCompletedQuizzes(data);
    } catch (err) {
      console.error("Failed to fetch completed quizzes", err);
    }
  };

  const handleSelect = (quizId, optionText) => {
    setAnswers((prev) => ({ ...prev, [quizId]: optionText }));
  };

  const handleSubmit = async (quizId) => {
    try {
      const selectedOption = answers[quizId];
      if (!selectedOption) {
        alert("Please select an option before submitting.");
        return;
      }

      // Use quizService submitQuiz (calls backend via api.js)
      const res = await submitQuiz(quizId, selectedOption);

      // Update result state with immediate feedback
      setResult((prev) => ({
        ...prev,
        answers: [...(prev?.answers || []), ...res.answers],
      }));

      // Remove quiz from active list
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));

      // Push to completed list
      setCompletedQuizzes((prev) => [...prev, res]);
    } catch (err) {
      console.error("Quiz submission failed:", err.message);
      alert("Failed to submit quiz. Please try again.");
    }
  };

const handleDownload = (quiz) => {
  try {
    if (!quiz.fileUrl) {
      alert("No file available for this quiz.");
      return;
    }

    const extension = quiz.fileUrl.split(".").pop().toLowerCase();
    const filename = `${quiz.subject}-Grade${quiz.grade}-Quiz.${extension}`;

    const link = document.createElement("a");
    link.href = quiz.fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Download error:", err);
    alert("Download failed. Please try again.");
  }
};

  return (
    <Paper sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Quizzes
      </Typography>

      {/* Subject selector */}
      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label="Choose Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
        >
          {subjects.map((subj, idx) => (
            <MenuItem key={idx} value={subj}>
              {subj}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Tabs */}
      <ToggleButtonGroup
        value={activeTab}
        exclusive
        onChange={(e, val) => {
          if (val !== null) setActiveTab(val);
        }}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="active">Active Quizzes</ToggleButton>
        <ToggleButton value="completed">Completed Quizzes</ToggleButton>
      </ToggleButtonGroup>

      {error && <Typography color="error">{error}</Typography>}
      {loading && <Typography>Loading quizzes...</Typography>}

      {activeTab === "active" && (
        <>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) =>
              quiz.type === "file" ? (
                <Paper
                  key={quiz._id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="h6">
                    {quiz.subject} — Grade {quiz.grade}
                  </Typography>
                  <Typography>
                    📄 This quiz is file-based. Download and complete it:
                  </Typography>
                    <Button
                      onClick={() => handleDownload(quiz)}
                      sx={{ mt: 1 }}
                    >
                      Download Quiz File
                    </Button>
                </Paper>
              ) : (
                <div key={quiz._id} style={{ marginBottom: "1rem" }}>
                  <QuizCard
                    quiz={quiz}
                    answers={answers}
                    onSelect={handleSelect}
                    result={result}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => handleSubmit(quiz._id)}
                  >
                    Submit
                  </Button>
                </div>
              )
            )
          ) : (
            !loading && (
              <Paper sx={{ mt: 2, p: 2, backgroundColor: "#e6f7ff" }}>
                <Typography variant="h6" color="primary">
                  Great job!
                </Typography>
                <Typography>
                  You’ve completed all the quizzes for <strong>{subject}</strong>.
                </Typography>
              </Paper>
            )
          )}
        </>
      )}

      {activeTab === "completed" && (
        <Box>
          {completedQuizzes.length > 0 ? (
            completedQuizzes.map((quiz, idx) => {
              const percentage =
                quiz.total > 0
                  ? Math.round((quiz.score / quiz.total) * 100)
                  : 0;
              return (
                <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">
                    {quiz.subject} — Grade {quiz.grade}
                  </Typography>
                  {quiz.answers?.map((ans, i) => (
                    <Box
                      key={i}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: ans.isCorrect ? "#d4edda" : "#f8d7da",
                      }}
                    >
                      <Typography>
                        <strong>Question:</strong> {ans.question}
                      </Typography>
                      <Typography>
                        <strong>Your Answer:</strong> {ans.selectedOption}
                      </Typography>
                      {ans.isCorrect ? (
                        <Typography color="success.main">✅ Correct</Typography>
                      ) : (
                        <>
                          <Typography color="error.main">❌ Incorrect</Typography>
                          <Typography color="primary">
                            <strong>Correct Answer:</strong> {ans.correctAnswer}
                          </Typography>
                        </>
                      )}
                    </Box>
                  ))}
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography sx={{ mr: 2 }}>
                      <strong>Score:</strong> {quiz.score}/{quiz.total}
                    </Typography>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: "12px",
                        backgroundColor:
                          percentage === 100
                            ? "#28a745"
                            : percentage >= 50
                            ? "#ffc107"
                            : "#dc3545",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {percentage}%
                    </Box>
                  </Box>
                </Paper>
              );
            })
          ) : (
            <Paper sx={{ mt: 2, p: 2, backgroundColor: "#fff3cd" }}>
              <Typography variant="h6" color="warning.main">
                Keep going!
              </Typography>
              <Typography>
                You haven’t completed any quizzes yet. Try an active quiz to get
                started!
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default Quizzes;
