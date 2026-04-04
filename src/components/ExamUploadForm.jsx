import React, { useState, useRef } from "react";
import { uploadExamCSV } from "../services/examService";

const ExamUploadForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a CSV file before uploading.");
      setIsError(true);
      return;
    }

    if (!file.name.endsWith(".csv")) {
      setMessage("Only CSV files are allowed.");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      const res = await uploadExamCSV(file);
      setMessage(`Exam results uploaded successfully. (${res.count} records)`);
      setIsError(false);

      // Reset file input
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Auto-clear success message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Error uploading exam results:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Failed to upload exam results. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginRight: "1rem" }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#2e7d32",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.5rem 1rem",
            backgroundColor: isError ? "#ffebee" : "#e8f5e9",
            color: isError ? "#c62828" : "#2e7d32",
            borderRadius: "4px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            style={{
              background: "transparent",
              border: "none",
              color: isError ? "#c62828" : "#2e7d32",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✖
          </button>
        </div>
      )}
    </form>
  );
};

export default ExamUploadForm;