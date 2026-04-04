import React, { useEffect, useState } from "react";
import { fetchAllDisciplineRecords, resolveDisciplineRecord } from "../services/disciplineService";
import DisciplineForm from "../components/DisciplineForm";

const TeacherDiscipline = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await fetchAllDisciplineRecords();
        setRecords(data);
      } catch (err) {
        setError("Failed to load discipline records");
      } finally {
        setLoading(false);
      }
    };
    loadRecords();
  }, []);

  const handleResolveToggle = async (recordId, currentStatus) => {
    try {
      const updatedRecord = await resolveDisciplineRecord(recordId, !currentStatus);
      setRecords((prev) =>
        prev.map((rec) => (rec._id === recordId ? updatedRecord : rec))
      );
    } catch (err) {
      console.error("Failed to update record:", err.message);
    }
  };

  const handleRecordAdded = (newRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  if (loading) return <p>Loading discipline records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <h2>Discipline Management </h2>

      <DisciplineForm onRecordAdded={handleRecordAdded} />

      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1" }}>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Admission No</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Comment</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Type</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Severity</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Term</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Year</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Resolved</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Teacher</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.admissionNumber}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.comment}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.type}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.severity}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.term}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.year}</td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "0.5rem",
                    color: rec.resolved ? "green" : "red",
                  }}
                >
                  {rec.resolved ? "Yes" : "No"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {rec.teacherName || "Unknown"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  <button
                    onClick={() => handleResolveToggle(rec._id, rec.resolved)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: rec.resolved ?  "#28a745" : "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {rec.resolved ? "Mark as Unresolved" : "Mark as Resolved"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherDiscipline;