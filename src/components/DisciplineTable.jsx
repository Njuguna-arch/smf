import React from "react";

const severityColor = (severity) => {
  switch (severity) {
    case 5:
      return "#f44336";
    case 4:
      return "#ff9800";
    case 3:
      return "#ffeb3b";
    case 2:
      return "#64b5f6";
    case 1:
    default:
      return "#4caf50";
  }
};

const DisciplineTable = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p style={{ color: "#4caf50", fontWeight: "bold", fontSize: "1.1rem" }}>
           No discipline records yet — keep up the good work!
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Type</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Comment</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Teacher</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Severity</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Resolved</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, idx) => (
            <tr
              key={rec._id || idx}
              style={{
                backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
              }}
            >
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {rec.type}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {rec.comment}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {rec.teacherId?.name || "Unknown"}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  color: severityColor(rec.severity),
                  fontWeight: "bold",
                }}
              >
                {rec.severity}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {new Date(rec.date).toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {rec.resolved ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisciplineTable;