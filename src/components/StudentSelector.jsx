import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Chip,
} from "@mui/material";

const ALL_GRADES = [
  "All Grades",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
];

const DEFAULT_SUBJECTS = [
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

const StudentSelector = ({
  selectedGrade = "All Grades",
  onGradeChange,
  selectedStudentId = "",
  onSelect,
  selectedSubject = "All Subjects",
  onSubjectChange,
  subjects = DEFAULT_SUBJECTS,
}) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/users");
        // /users returns students when called by authenticated user
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Filter students based on selected grade
  const filteredStudents = students.filter((s) => {
    if (!selectedGrade || selectedGrade === "All Grades") return true;
    const cleanFilter = selectedGrade.replace(/^Grade\s*/i, "").trim().toLowerCase();
    const studentGrade = (s.grade || "").replace(/^Grade\s*/i, "").trim().toLowerCase();
    return studentGrade === cleanFilter;
  });

  const handleStudentChange = (e) => {
    const id = e.target.value;
    const studentObj = students.find((s) => s._id === id);
    if (onSelect) {
      onSelect(id, studentObj);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
      {/* 1. Grade Selector */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="grade-select-label">Select Grade</InputLabel>
        <Select
          labelId="grade-select-label"
          id="grade-select"
          value={selectedGrade}
          label="Select Grade"
          onChange={(e) => {
            if (onGradeChange) onGradeChange(e.target.value);
          }}
        >
          {ALL_GRADES.map((g) => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 2. Student Selector */}
      <FormControl size="small" sx={{ minWidth: 260, flexGrow: 1 }}>
        <InputLabel id="student-select-label">Select Student</InputLabel>
        <Select
          labelId="student-select-label"
          id="student-select"
          value={selectedStudentId}
          label="Select Student"
          onChange={handleStudentChange}
          disabled={loading}
        >
          <MenuItem value="">
            <em>-- Choose a student ({filteredStudents.length} available) --</em>
          </MenuItem>
          {filteredStudents.map((s) => (
            <MenuItem key={s._id} value={s._id}>
              {s.name} {s.admissionNumber ? `(${s.admissionNumber})` : ""} — {s.grade || "No Grade"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 3. Subject Selector */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="subject-select-label">Filter Subject</InputLabel>
        <Select
          labelId="subject-select-label"
          id="subject-select"
          value={selectedSubject}
          label="Filter Subject"
          onChange={(e) => {
            if (onSubjectChange) onSubjectChange(e.target.value);
          }}
        >
          {subjects.map((subj) => (
            <MenuItem key={subj} value={subj}>
              {subj}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <CircularProgress size={24} />}

      {!loading && (
        <Chip
          label={`${filteredStudents.length} student${filteredStudents.length === 1 ? "" : "s"} found`}
          size="small"
          variant="outlined"
          color="info"
        />
      )}
    </Box>
  );
};

export default StudentSelector;