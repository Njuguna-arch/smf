import React, { useState } from "react";
import { addDisciplineRecord } from "../services/disciplineService";

const DisciplineForm = ({ onRecordAdded }) => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [comment, setComment] = useState("");
  const [type, setType] = useState("Minor");
  const [severity, setSeverity] = useState(1);
  const [term, setTerm] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await addDisciplineRecord({
        admissionNumber,
        comment,
        type,
        severity,
        term,
        year,
      });

      setMessage("Discipline record added successfully");

      if (onRecordAdded && result.discipline) {
        onRecordAdded(result.discipline);
      }

      // Reset form
      setAdmissionNumber("");
      setComment("");
      setType("Minor");
      setSeverity(1);
      setTerm("");
      setYear(new Date().getFullYear());
    } catch (err) {
      setMessage("Failed to add discipline record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        backgroundColor: "#f9f9f9",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "2rem",
      }}
    >
      <input
        type="text"
        placeholder="Admission Number"
        value={admissionNumber}
        onChange={(e) => setAdmissionNumber(e.target.value)}
        required
        style={{
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <textarea
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        rows={4}
        style={{
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      >
        <option value="Minor">Minor</option>
        <option value="Major">Major</option>
        <option value="Warning">Warning</option>
        <option value="Suspension">Suspension</option>
      </select>

      <input
        type="number"
        min="1"
        max="5"
        value={severity}
        onChange={(e) => setSeverity(Number(e.target.value))}
        style={{
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="text"
        placeholder="Term (e.g. Term 1)"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        style={{
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        style={{
          padding: "1rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "1rem",
          fontSize: "1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Submitting..." : "Add Discipline"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "1rem",
            fontWeight: "bold",
            color: message.includes("successfully") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default DisciplineForm;