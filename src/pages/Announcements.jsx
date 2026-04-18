import React, { useEffect, useState } from "react";
import {
  fetchAnnouncements,
  postTextAnnouncement,
  postFileAnnouncement,
} from "../services/adminService";

const API_URL = import.meta.env.VITE_API_URL;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAnnouncements()
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error("Failed to fetch announcements", err));
  }, []);

  const handlePostText = async () => {
    try {
      const created = await postTextAnnouncement(newAnnouncement);
      setAnnouncements([created, ...announcements]);
      setNewAnnouncement("");
    } catch (err) {
      console.error("Failed to post text announcement", err);
    }
  };

  const handlePostFile = async () => {
    try {
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);

      const created = await postFileAnnouncement(formData);
      setAnnouncements([created, ...announcements]);
      setFile(null);
    } catch (err) {
      console.error("Failed to post file announcement", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem", color: "#2e7d32" }}>Announcements</h2>

      {/* Text announcement */}
      <div style={{ marginBottom: "1rem" }}>
        <textarea
          placeholder="Write announcement..."
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            marginBottom: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            padding: "8px",
          }}
        />
        <button
          onClick={handlePostText}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#2e7d32",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Post Text Announcement
        </button>
      </div>

      {/* File announcement */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "0.5rem" }}
        />
        <button
          onClick={handlePostFile}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#2e7d59",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Upload File Announcement
        </button>
      </div>

      {/* Table of announcements */}
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
        <thead style={{ backgroundColor: "#2b2fb7", color: "#fff" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>Message</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Attachment</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((a) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Announcements;