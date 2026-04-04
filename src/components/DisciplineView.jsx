import React, { useEffect, useState } from "react";
import { fetchStudentDiscipline } from "../services/disciplineService";

const DisciplineView = ({ admissionNumber }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await fetchStudentDiscipline(admissionNumber);
        setRecords(data);
      } catch (err) {
        setError("Failed to load discipline records");
      } finally {
        setLoading(false);
      }
    };
    if (admissionNumber) {
      loadRecords();
    }
  }, [admissionNumber]);

  if (loading) return <p>Loading discipline records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <h2>My Discipline Records</h2>
      {records.length === 0 ? (
        <p>No discipline records found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1" }}>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Comment</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Type</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Severity</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Term</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Year</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Resolved</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.comment}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.type}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.severity}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.term}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{rec.year}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem", color: rec.resolved ? "green" : "red" }}>
                  {rec.resolved ? "Yes" : "No"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {rec.teacherName || "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DisciplineView;