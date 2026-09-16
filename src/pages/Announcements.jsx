import React, { useEffect, useState } from "react";
import {
  fetchAnnouncements,
  postTextAnnouncement,
  postFileAnnouncement,
  postBulkMessage,
} from "../services/adminService";

const API_URL = import.meta.env.VITE_API_URL;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [file, setFile] = useState(null);

  // Bulk Message State
  const [bulkChannel, setBulkChannel] = useState("whatsapp");
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkContactsFile, setBulkContactsFile] = useState(null);
  const [bulkPastedContacts, setBulkPastedContacts] = useState("");
  const [isSendingBulk, setIsSendingBulk] = useState(false);

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

  const handleSendBulkMessage = async () => {
    if (!bulkMessage) {
      alert("Please compose a message.");
      return;
    }
    if (!bulkContactsFile && !bulkPastedContacts.trim()) {
      alert("Please provide contacts either by pasting them or uploading an xlsx file.");
      return;
    }

    setIsSendingBulk(true);
    try {
      const formData = new FormData();
      formData.append("channel", bulkChannel);
      formData.append("message", bulkMessage);
      if (bulkPastedContacts.trim()) {
        formData.append("pastedContacts", bulkPastedContacts);
      }
      if (bulkContactsFile) {
        formData.append("file", bulkContactsFile);
      }

      const response = await postBulkMessage(formData);
      if (response.announcement) {
        setAnnouncements([response.announcement, ...announcements]);
      }
      alert(`Successfully sent ${response.sentCount || 0} messages.`);
      setBulkMessage("");
      setBulkPastedContacts("");
      setBulkContactsFile(null);
    } catch (err) {
      console.error("Failed to send bulk message", err);
      alert("Failed to send bulk message. See console for details.");
    } finally {
      setIsSendingBulk(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* BULK MESSAGING SECTION */}
      <div style={{ marginBottom: "3rem", padding: "1.5rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#ff5c5c", marginBottom: "2rem" }}>Send bulk Messages</h2>
        
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
          {/* Left Column */}
          <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button
                onClick={() => setBulkChannel("whatsapp")}
                style={{
                  padding: "8px 24px",
                  borderRadius: "20px",
                  border: "1px solid #333",
                  backgroundColor: bulkChannel === "whatsapp" ? "#f0f0f0" : "#fff",
                  cursor: "pointer",
                  fontWeight: bulkChannel === "whatsapp" ? "bold" : "normal"
                }}
              >
                Whatsapp
              </button>
              <button
                onClick={() => setBulkChannel("sms")}
                style={{
                  padding: "8px 24px",
                  borderRadius: "20px",
                  border: "1px solid #333",
                  backgroundColor: bulkChannel === "sms" ? "#f0f0f0" : "#fff",
                  cursor: "pointer",
                  fontWeight: bulkChannel === "sms" ? "bold" : "normal"
                }}
              >
                SMS
              </button>
            </div>
            
            <textarea
              placeholder="compose a message..."
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              style={{
                width: "100%",
                height: "150px",
                padding: "12px",
                border: "2px solid #333",
                borderRadius: "4px",
                resize: "none",
                fontSize: "1rem"
              }}
            />

            <button
              onClick={handleSendBulkMessage}
              disabled={isSendingBulk}
              style={{
                marginTop: "1.5rem",
                padding: "10px 32px",
                backgroundColor: "#1db954",
                color: "#fff",
                border: "none",
                borderRadius: "24px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: isSendingBulk ? "not-allowed" : "pointer"
              }}
            >
              {isSendingBulk ? "sending..." : "send"}
            </button>
          </div>

          {/* Right Column */}
          <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", justifyContent: "flex-end" }}>
              <label
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "1px solid #333",
                  backgroundColor: "#fff",
                  cursor: "pointer"
                }}
              >
                upload xlsx
                <input
                  type="file"
                  accept=".xlsx"
                  style={{ display: "none" }}
                  onChange={(e) => setBulkContactsFile(e.target.files[0])}
                />
              </label>
              <span style={{ fontSize: "0.9rem", color: "#666", textAlign: "right" }}>
                upload bulk<br/>contacts
              </span>
            </div>
            {bulkContactsFile && (
              <div style={{ textAlign: "right", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#2e7d32" }}>
                Selected: {bulkContactsFile.name}
              </div>
            )}

            <textarea
              placeholder="paste contacts"
              value={bulkPastedContacts}
              onChange={(e) => setBulkPastedContacts(e.target.value)}
              style={{
                width: "100%",
                height: "150px",
                padding: "12px",
                border: "2px solid #333",
                borderRadius: "4px",
                resize: "none",
                fontSize: "1rem"
              }}
            />
          </div>
        </div>
      </div>

      {/* ORIGINAL ANNOUNCEMENT SECTION */}
      <h2 style={{ marginBottom: "1rem", color: "#2e7d32" }}>Announcements Board</h2>

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