import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ Correct for MUI v7
import { addQuiz, fetchSubjects } from "../services/quizService";

const AddQuizForm = () => {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [quizFile, setQuizFile] = useState(null);
  const [quizType, setQuizType] = useState("mcq");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        await fetchSubjects();
      } catch (err) {
        console.error("Failed to load subjects:", err.message);
      }
    };
    loadSubjects();
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("grade", grade);

      if (quizType === "file") {
        if (!quizFile) {
          setMessage("Please upload a Word/PDF file for this quiz");
          setOpen(true);
          return;
        }
        formData.append("quizFile", quizFile);
        formData.append("type", "file");
      } else {
        if (!options.includes(correctAnswer)) {
          setMessage("Correct answer must match one of the provided options");
          setOpen(true);
          return;
        }
        formData.append("question", question);
        formData.append("options", JSON.stringify(options));
        formData.append("correctAnswer", correctAnswer);
        formData.append("type", "mcq");
      }

      const res = await addQuiz(formData);
      setMessage(res.message);
      setOpen(true);

      setSubject("");
      setGrade("");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setQuizFile(null);
      setQuizType("mcq");
    } catch (err) {
      setMessage("Failed to add quiz");
      setOpen(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Add New Quiz
      </Typography>

      <ToggleButtonGroup
        value={quizType}
        exclusive
        onChange={(e, val) => val && setQuizType(val)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="mcq">Multiple Choice Quiz</ToggleButton>
        <ToggleButton value="file">Upload Word/PDF Quiz</ToggleButton>
      </ToggleButtonGroup>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3} columns={12}>
          <Grid size={2}>
            <TextField
              select
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="Mathematics">Mathematics</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Kiswahili">Kiswahili</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="Social Studies">Social Studies</MenuItem>
              <MenuItem value="CRE">CRE</MenuItem>
              <MenuItem value="Pre-Tech">Pre-Tech</MenuItem>
              <MenuItem value="Agriculture">Agriculture</MenuItem>
              <MenuItem value="Creative Arts">Creative Arts</MenuItem>
            </TextField>
          </Grid>
          <Grid size={2}>
            <TextField
              select
              label="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              fullWidth
              required
            >
              {[...Array(9)].map((_, i) => (
                <MenuItem key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {quizType === "mcq" && (
            <Grid size={6}>
              <TextField
                label="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                fullWidth
                multiline
                rows={6}
                required
              />
            </Grid>
          )}

          {quizType === "mcq" && (
            <>
              {options.map((opt, idx) => (
                <Grid size={6} key={idx}>
                  <TextField
                    label={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              ))}
              <Grid size={12}>
                <TextField
                  label="Correct Answer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  fullWidth
                  required
                  helperText="Must match one of the options above"
                />
              </Grid>
            </>
          )}

          {quizType === "file" && (
            <Grid size={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Word/PDF Quiz
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setQuizFile(e.target.files[0])}
                />
              </Button>
              {quizFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {quizFile.name}
                </Typography>
              )}
            </Grid>
          )}

          <Grid size={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add Quiz
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={message.includes("Failed") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddQuizForm;