import React, { useState } from "react";
import { addVideo } from "../services/videoService";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";

const TeacherUploadVideo = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [type, setType] = useState("Educational");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const videoData = { title, subject, grade, description, videoUrl, featured, type }; // 👈 include type
      await addVideo(videoData);
      setMessage("Video uploaded successfully!");
      // Reset form
      setTitle("");
      setSubject("");
      setGrade("");
      setDescription("");
      setVideoUrl("");
      setFeatured(false);
      setType("Educational");
    } catch (err) {
      console.error("Error uploading video:", err.message);
      setMessage("Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, color: "green" }}>
        Upload New Video
      </Typography>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <TextField
          label="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          size="medium"
        />

        <FormControl fullWidth required>
          <InputLabel>Subject</InputLabel>
          <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Kiswahili">Kiswahili</MenuItem>
            <MenuItem value="Social Studies">Social Studies</MenuItem>
            <MenuItem value="Agriculture">Agriculture</MenuItem>
            <MenuItem value="CRE">CRE</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Pre-Tech">Pre-Tech</MenuItem>
            <MenuItem value="Creative Arts">Creative Arts</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Grade</InputLabel>
          <Select value={grade} onChange={(e) => setGrade(e.target.value)}>
            <MenuItem value="Grade 1">Grade 1</MenuItem>
            <MenuItem value="Grade 2">Grade 2</MenuItem>
            <MenuItem value="Grade 3">Grade 3</MenuItem>
            <MenuItem value="Grade 4">Grade 4</MenuItem>
            <MenuItem value="Grade 5">Grade 5</MenuItem>
            <MenuItem value="Grade 6">Grade 6</MenuItem>
            <MenuItem value="Grade 7">Grade 7</MenuItem>
            <MenuItem value="Grade 8">Grade 8</MenuItem>
            <MenuItem value="Grade 9">Grade 9</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={3}
        />

        <TextField
          label="Video URL (YouTube or MP4 link)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          fullWidth
          required
        />

        <FormControl fullWidth required>
          <InputLabel>Video Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="Educational">Educational</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
          }
          label="Mark as Featured"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </Button>
      </form>

      {message && (
        <Typography sx={{ mt: 2, fontSize: "1.1rem", color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default TeacherUploadVideo;