import React, { useEffect, useState } from "react";
import { fetchAnnouncements } from "../services/adminService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements()
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error("Failed to fetch announcements", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem", color: "#2e7d32" }}>Announcements</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ backgroundColor: "#1b1b94", color: "#fff" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>Message</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Attachment</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {announcements.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                style={{ padding: "12px", textAlign: "center", color: "#555" }}
              >
                No announcements available.
              </td>
            </tr>
          ) : (
            announcements.map((a) => (
              <tr key={a._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>
                  {a.message ? a.message : <em>No message</em>}
                </td>
                <td style={{ padding: "12px" }}>
                  {a.fileUrl ? (
                    <a
                      href={`${API_URL}${a.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "none" }}
                    >
                      View Attachment
                    </a>
                  ) : (
                    <em>None</em>
                  )}
                </td>
                <td style={{ padding: "12px", color: "#555" }}>
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleString()
                    : "No date"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentAnnouncements;