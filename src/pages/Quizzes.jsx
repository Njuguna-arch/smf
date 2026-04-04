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

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.keys(answers).map((id) => ({
        questionId: id,
        selectedOption: answers[id],
      }));

      if (formattedAnswers.length === 0) {
        setError("Please select at least one answer before submitting.");
        return;
      }

      const quizId = quizzes[0]?._id;
      const res = await submitQuiz({ quizId, answers: formattedAnswers });

      setResult(res);
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const normalizedGrade = user.grade.replace("Grade ", "");
        await loadQuizzes(normalizedGrade, subject);
        await loadCompletedQuizzes(user._id);
      }
    } catch (err) {
      console.error("Quiz submission failed:", err);
      setError("Failed to submit quiz. Please try again.");
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
                    href={quiz.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1 }}
                  >
                    Download Quiz File
                  </Button>
                </Paper>
              ) : (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  selectedOption={answers[quiz._id]}
                  onSelect={handleSelect}
                />
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

          {quizzes.length > 0 && quizzes.some((q) => q.type !== "file") && (
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
              Submit Quiz
            </Button>
          )}
        </>
      )}

      {activeTab === "completed" && (
        <Box>
          {completedQuizzes.length > 0 ? (
            completedQuizzes.map((quiz) => (
              <Paper
                key={quiz._id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Typography variant="h6">
                  {quiz.subject} — Grade {quiz.grade}
                </Typography>
                {quiz.type === "file" ? (
                  <Typography>
                    📄 File-based quiz uploaded. You submitted your work.
                  </Typography>
                ) : (
                  <>
                    <Typography>
                      <strong>Question:</strong> {quiz.question}
                    </Typography>
                    <Typography color="success.main">Completed</Typography>
                  </>
                )}
              </Paper>
            ))
          ) : (
            <Paper sx={{ mt: 2, p: 2, backgroundColor: "#fff3cd" }}>
              <Typography variant="h6" color="warning.main">
                Keep going!
              </Typography>
              <Typography>
                You haven’t completed any quizzes yet. Try an active quiz to get started!
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {result && activeTab === "active" && (
        <Paper
          sx={{
            mt: 2,
            p: 2,
            borderRadius: "12px",
            backgroundColor:
              result.score === result.total
                ? "#d4edda"
                : result.score >= result.total / 2
                ? "#fff3cd"
                : "#f8d7da",
          }}
        >
          <Typography variant="h6">
            📝 Your Score: {result.score}/{result.total}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            {result.score === result.total
              ? "🌟 Excellent! You got everything right!"
              : result.score >= result.total / 2
              ? "😊 Good job! Keep practicing!"
              : "😅 Oops! Try again and you'll improve!"}
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default Quizzes;