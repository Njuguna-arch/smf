import React, { useState, useEffect } from "react";
import api from "../services/api";

const StudentSelector = ({ onSelect }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/users");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <p>Loading students...</p>;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="student-select" style={{ marginRight: "8px" }}>
        Select Student:
      </label>
      <select
        id="student-select"
        onChange={(e) => onSelect(e.target.value)}
        style={{ padding: "8px" }}
      >
        <option value="">-- Choose a student --</option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name} ({s.grade})
          </option>
        ))}
      </select>
    </div>
  );
};

export default StudentSelector;