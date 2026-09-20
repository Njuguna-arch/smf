import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const SuperAdminDashboard = () => {
  const [schools, setSchools] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(${API_URL}/api/superadmin/schools, {
        headers: { Authorization: \Bearer \\ }
      });
      setSchools(res.data);
    } catch (err) {
      console.error("Failed to fetch schools", err);
    }
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(${API_URL}/api/superadmin/schools, 
        { name, code, address },
        { headers: { Authorization: \Bearer \\ } }
      );
      setSchools([...schools, res.data]);
      setName("");
      setCode("");
      setAddress("");
      alert("School added successfully");
    } catch (err) {
      console.error("Failed to add school", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoveSchool = async (schoolCode) => {
    if (!window.confirm(\Are you sure you want to remove school \? This deletes associated users too.\)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(${API_URL}/api/superadmin/schools/\, {
        headers: { Authorization: \Bearer \\ }
      });
      setSchools(schools.filter(s => s.code !== schoolCode));
      alert("School removed");
    } catch (err) {
      console.error("Failed to remove school", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "#2b2fb7" }}>Super Admin Dashboard</h1>
      <p>Manage all registered schools in EduSphere.</p>

      <div style={{ margin: "2rem 0", padding: "1.5rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h3>Add New School</h3>
        <form onSubmit={handleAddSchool} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="School Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input
            type="text"
            placeholder="School Code (e.g. SCH001)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input
            type="text"
            placeholder="Address (Optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#2e7d32", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Add School
          </button>
        </form>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <thead style={{ backgroundColor: "#2b2fb7", color: "#fff" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>School Name</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Code</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Address</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map(s => (
            <tr key={s.code} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px" }}>{s.name}</td>
              <td style={{ padding: "12px", fontWeight: "bold" }}>{s.code}</td>
              <td style={{ padding: "12px" }}>{s.address || "N/A"}</td>
              <td style={{ padding: "12px", textAlign: "center" }}>
                <button 
                  onClick={() => handleRemoveSchool(s.code)}
                  style={{ padding: "6px 12px", backgroundColor: "#e53935", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {schools.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: "12px", textAlign: "center", color: "#666" }}>No schools registered yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SuperAdminDashboard;
