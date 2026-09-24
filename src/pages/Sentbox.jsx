import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Sentbox = () => {
  const [messages, setMessages] = useState([]);
  const [bulkChannel, setBulkChannel] = useState("whatsapp");
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkContactsFile, setBulkContactsFile] = useState(null);
  const [bulkPastedContacts, setBulkPastedContacts] = useState("");
  const [isSendingBulk, setIsSendingBulk] = useState(false);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

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

      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/admin/messages/bulk`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.sentMessage) {
        setMessages([res.data.sentMessage, ...messages]);
      }
      alert(`Successfully sent ${res.data.sentCount || 0} messages.`);
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
      <div style={{ marginBottom: "3rem", padding: "1.5rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#ff5c5c", marginBottom: "2rem" }}>Send bulk Messages</h2>
        
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
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
                  fontWeight: bulkChannel === "whatsapp" ? "bold" : "normal",
                  color: "#000"
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
                  fontWeight: bulkChannel === "sms" ? "bold" : "normal",
                  color: "#000"
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

          <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", justifyContent: "flex-end" }}>
              <label
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "1px solid #333",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  color: "#000"
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

      <h2 style={{ marginBottom: "1rem", color: "#2e7d32" }}>Sentbox</h2>
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
            <th style={{ padding: "12px", textAlign: "left" }}>Channel</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Recipients</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px" }}>{m.message}</td>
              <td style={{ padding: "12px", textTransform: "capitalize" }}>{m.channel}</td>
              <td style={{ padding: "12px" }}>{m.recipientCount}</td>
              <td style={{ padding: "12px", color: "#555" }}>
                {m.createdAt ? new Date(m.createdAt).toLocaleString() : "No date"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sentbox;
