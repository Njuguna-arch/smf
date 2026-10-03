import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Schools state
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");

  // New School Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submittingSchool, setSubmittingSchool] = useState(false);

  // Admin password reset modal state
  const [passwordModal, setPasswordModal] = useState({
    open: false,
    schoolCode: "",
    adminEmail: "",
    newPassword: "",
  });

  // Stats state
  const [stats, setStats] = useState(null);
  const [_loadingStats, setLoadingStats] = useState(false);

  // Logs state
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logLevel, setLogLevel] = useState("all");
  const [logSearch, setLogSearch] = useState("");
  const [logPage, setLogPage] = useState(1);
  const [logTotalPages, setLogTotalPages] = useState(1);

  // Settings state
  const [settings, setSettings] = useState({
    platformName: "EduSphere School Management System",
    supportEmail: "support@edusphere.com",
    maintenanceMode: false,
    allowRegistration: true,
    academicYear: 2026,
    currentTerm: "Term 1",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Notifications
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 5000);
  };

  // --- Fetchers ---
  const fetchSchools = useCallback(async () => {
    setLoadingSchools(true);
    try {
      const res = await api.get("/superadmin/schools");
      setSchools(res.data || []);
    } catch (err) {
      console.error("Failed to fetch schools:", err);
      showFeedback("Failed to fetch schools list", "error");
    } finally {
      setLoadingSchools(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await api.get("/superadmin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoadingLogs(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 20);
      if (logLevel !== "all") params.append("level", logLevel);
      if (logSearch) params.append("search", logSearch);

      const res = await api.get(`/superadmin/logs?${params.toString()}`);
      setLogs(res.data.logs || []);
      setLogPage(res.data.page || 1);
      setLogTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  }, [logLevel, logSearch]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get("/superadmin/settings");
      if (res.data) setSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
    fetchStats();
    fetchSettings();
  }, [fetchSchools, fetchStats, fetchSettings]);

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs(1);
    }
  }, [activeTab, fetchLogs]);

  // --- School Handlers ---
  const handleAddSchool = async (e) => {
    e.preventDefault();
    setSubmittingSchool(true);
    try {
      const res = await api.post("/superadmin/schools", formData);
      setSchools([res.data.school, ...schools]);
      setFormData({
        name: "",
        code: "",
        address: "",
        phone: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
      });
      setShowAddModal(false);
      showFeedback(`School "${res.data.school.name}" & Admin "${res.data.admin.name}" registered successfully!`);
      fetchStats();
    } catch (err) {
      console.error("Failed to add school:", err);
      showFeedback(err.response?.data?.message || err.message, "error");
    } finally {
      setSubmittingSchool(false);
    }
  };

  const handleToggleStatus = async (school) => {
    const actionName = school.status === "disabled" ? "enable" : "disable";
    if (
      !window.confirm(
        `Are you sure you want to ${actionName} "${school.name}" (${school.code})? ${
          actionName === "disable"
            ? "Users belonging to this school will be prevented from logging in."
            : "Users will regain access."
        }`
      )
    )
      return;

    try {
      const res = await api.patch(`/superadmin/schools/${school.code}/toggle-status`);
      setSchools(
        schools.map((s) => (s.code === school.code ? { ...s, status: res.data.school.status } : s))
      );
      showFeedback(res.data.message);
      fetchStats();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      showFeedback(err.response?.data?.message || err.message, "error");
    }
  };

  const handleRemoveSchool = async (schoolCode) => {
    if (
      !window.confirm(
        `⚠️ DANGER: Are you sure you want to remove school ${schoolCode}? This will PERMANENTLY DELETE all associated pupils, teachers, and school admin accounts.`
      )
    )
      return;

    try {
      const res = await api.delete(`/superadmin/schools/${schoolCode}`);
      setSchools(schools.filter((s) => s.code !== schoolCode));
      showFeedback(res.data.message);
      fetchStats();
    } catch (err) {
      console.error("Failed to remove school:", err);
      showFeedback(err.response?.data?.message || err.message, "error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(
        `/superadmin/schools/${passwordModal.schoolCode}/admin-password`,
        { newPassword: passwordModal.newPassword }
      );
      showFeedback(res.data.message);
      setPasswordModal({ open: false, schoolCode: "", adminEmail: "", newPassword: "" });
    } catch (err) {
      console.error("Failed to reset password:", err);
      showFeedback(err.response?.data?.message || err.message, "error");
    }
  };

  // --- Logs Handlers ---
  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all system audit logs?")) return;
    try {
      await api.delete("/superadmin/logs");
      setLogs([]);
      showFeedback("All system audit logs cleared successfully");
      fetchStats();
    } catch (err) {
      console.error("Failed to clear logs:", err);
      showFeedback("Failed to clear logs", "error");
    }
  };

  // --- Settings Handlers ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.put("/superadmin/settings", settings);
      showFeedback(res.data.message || "Settings saved successfully");
    } catch (err) {
      console.error("Failed to save settings:", err);
      showFeedback(err.response?.data?.message || err.message, "error");
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered Schools
  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(schoolSearch.toLowerCase())) ||
      (s.code && s.code.toLowerCase().includes(schoolSearch.toLowerCase())) ||
      (s.admin?.email && s.admin.email.toLowerCase().includes(schoolSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (schoolFilter === "active") return s.status !== "disabled";
    if (schoolFilter === "disabled") return s.status === "disabled";
    return true;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ color: "#1f2235", margin: "0 0 4px 0", fontSize: "28px" }}>
            Super Admin Control Center
          </h1>
          <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
            Multi-School Management, Access Control, Security Logs & System Settings
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(46,125,50,0.2)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>➕</span> Add School & Admin
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: "1.5rem",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            backgroundColor: feedback.type === "error" ? "#ffebee" : "#e8f5e9",
            color: feedback.type === "error" ? "#c62828" : "#2e7d32",
            border: `1px solid ${feedback.type === "error" ? "#ef9a9a" : "#a5d6a7"}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          borderBottom: "2px solid #e0e0e0",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { id: "overview", label: "📊 Overview & Stats" },
          { id: "schools", label: `🏫 Schools Management (${schools.length})` },
          { id: "logs", label: "📜 System Audit Logs" },
          { id: "settings", label: "⚙️ System Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "3px solid #2e7d32" : "3px solid transparent",
              color: activeTab === tab.id ? "#2e7d32" : "#666",
              fontWeight: activeTab === tab.id ? "bold" : "500",
              fontSize: "15px",
              cursor: "pointer",
              marginBottom: "-2px",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== TAB 1: OVERVIEW ==================== */}
      {activeTab === "overview" && (
        <div>
          {/* Metric Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
              marginBottom: "2rem",
            }}
          >
            <div style={statCardStyle("#2e7d32")}>
              <div style={{ fontSize: "13px", color: "#666", textTransform: "uppercase", fontWeight: "bold" }}>
                Total Schools
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2235", marginTop: "8px" }}>
                {stats?.schools?.total ?? schools.length}
              </div>
              <div style={{ fontSize: "12px", color: "#2e7d32", marginTop: "6px" }}>
                ● {stats?.schools?.active ?? schools.filter((s) => s.status !== "disabled").length} Active &nbsp;|&nbsp;
                <span style={{ color: "#d32f2f" }}>
                  {" "}
                  ● {stats?.schools?.disabled ?? schools.filter((s) => s.status === "disabled").length} Disabled
                </span>
              </div>
            </div>

            <div style={statCardStyle("#1976d2")}>
              <div style={{ fontSize: "13px", color: "#666", textTransform: "uppercase", fontWeight: "bold" }}>
                School Admins
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2235", marginTop: "8px" }}>
                {stats?.users?.admins ?? schools.length}
              </div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
                Dedicated admins managing institutions
              </div>
            </div>

            <div style={statCardStyle("#f57c00")}>
              <div style={{ fontSize: "13px", color: "#666", textTransform: "uppercase", fontWeight: "bold" }}>
                Teachers & Students
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2235", marginTop: "8px" }}>
                {(stats?.users?.teachers ?? 0) + (stats?.users?.students ?? 0)}
              </div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
                {stats?.users?.teachers ?? 0} Teachers &nbsp;|&nbsp; {stats?.users?.students ?? 0} Pupils
              </div>
            </div>

            <div style={statCardStyle("#7b1fa2")}>
              <div style={{ fontSize: "13px", color: "#666", textTransform: "uppercase", fontWeight: "bold" }}>
                System Activity
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2235", marginTop: "8px" }}>
                {stats?.system?.totalLogs ?? logs.length}
              </div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
                Recorded security & audit events
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Quick Actions */}
            <div style={sectionBoxStyle}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#1f2235", fontSize: "16px" }}>⚡ Quick Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={actionBtnStyle("#2e7d32")}
                >
                  ➕ Register New School with Admin
                </button>
                <button
                  onClick={() => setActiveTab("schools")}
                  style={actionBtnStyle("#1976d2")}
                >
                  🏫 View & Manage Schools List ({schools.length})
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  style={actionBtnStyle("#546e7a")}
                >
                  📜 Inspect Security & System Logs
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  style={actionBtnStyle("#37474f")}
                >
                  ⚙️ Platform Settings & Maintenance
                </button>
              </div>
            </div>

            {/* Recent Audit Events */}
            <div style={sectionBoxStyle}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#1f2235", fontSize: "16px" }}>
                🕒 Recent System Events
              </h3>
              {stats?.recentLogs && stats.recentLogs.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {stats.recentLogs.slice(0, 5).map((log, idx) => (
                    <div
                      key={log._id || idx}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#f9fbf9",
                        borderLeft: `4px solid ${
                          log.level === "error"
                            ? "#d32f2f"
                            : log.level === "warning"
                            ? "#f57c00"
                            : "#2e7d32"
                        }`,
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <strong style={{ color: "#333" }}>{log.action}</strong>
                        <span style={{ color: "#888" }}>
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div style={{ color: "#555" }}>{log.details}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#888", fontSize: "13px" }}>No recent events recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: SCHOOLS MANAGEMENT ==================== */}
      {activeTab === "schools" && (
        <div>
          {/* Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flex: 1, minWidth: "280px" }}>
              <input
                type="text"
                placeholder="Search by school name, code, or admin email..."
                value={schoolSearch}
                onChange={(e) => setSchoolSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                style={{
                  padding: "9px 14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
              >
                <option value="all">All Schools</option>
                <option value="active">Active Only</option>
                <option value="disabled">Disabled Only</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "9px 18px",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ➕ Add School & Admin
            </button>
          </div>

          {/* Schools Table */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#1f2235", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px" }}>School Name & Code</th>
                  <th style={{ padding: "12px 16px" }}>Assigned Admin</th>
                  <th style={{ padding: "12px 16px" }}>Pupils / Teachers</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((s, idx) => (
                  <tr
                    key={s.code || idx}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fcfcfc",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: "bold", color: "#1f2235" }}>{s.name}</div>
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                        Code: <span style={{ fontWeight: "bold", color: "#2e7d32" }}>{s.code}</span>
                        {s.address ? ` • ${s.address}` : ""}
                      </div>
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: "500", color: "#333" }}>
                        {s.admin?.name || s.adminName || "Not Assigned"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#555" }}>
                        {s.admin?.email || s.adminEmail || "-"}
                      </div>
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          backgroundColor: "#e8f5e9",
                          color: "#2e7d32",
                          padding: "3px 8px",
                          borderRadius: "10px",
                          fontWeight: "bold",
                          fontSize: "12px",
                          marginRight: "6px",
                        }}
                      >
                        {s.studentCount ?? 0} Students
                      </span>
                      <span
                        style={{
                          backgroundColor: "#e3f2fd",
                          color: "#1565c0",
                          padding: "3px 8px",
                          borderRadius: "10px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {s.teacherCount ?? 0} Teachers
                      </span>
                    </td>

                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor: s.status === "disabled" ? "#ffebee" : "#e8f5e9",
                          color: s.status === "disabled" ? "#c62828" : "#2e7d32",
                        }}
                      >
                        {s.status === "disabled" ? "⛔ Disabled" : "✅ Active"}
                      </span>
                    </td>

                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(s)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: s.status === "disabled" ? "#2e7d32" : "#f57c00",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          {s.status === "disabled" ? "Activate" : "Disable"}
                        </button>

                        {/* Reset Admin Password */}
                        <button
                          onClick={() =>
                            setPasswordModal({
                              open: true,
                              schoolCode: s.code,
                              adminEmail: s.admin?.email || s.adminEmail || "",
                              newPassword: "",
                            })
                          }
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title="Reset School Admin Password"
                        >
                          🔑 Key
                        </button>

                        {/* Delete School */}
                        <button
                          onClick={() => handleRemoveSchool(s.code)}
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#d32f2f",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title="Delete School & Associated Users"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSchools.length === 0 && !loadingSchools && (
                  <tr>
                    <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
                      No schools found matching your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: SYSTEM AUDIT LOGS ==================== */}
      {activeTab === "logs" && (
        <div>
          {/* Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flex: 1, minWidth: "280px" }}>
              <input
                type="text"
                placeholder="Search audit logs (details, user, school)..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchLogs(1)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <button
                onClick={() => fetchLogs(1)}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                🔍 Search
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => fetchLogs(logPage)}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleClearLogs}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                🗑️ Clear Logs
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#1f2235", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px" }}>Timestamp</th>
                  <th style={{ padding: "10px 14px" }}>Action</th>
                  <th style={{ padding: "10px 14px" }}>Level</th>
                  <th style={{ padding: "10px 14px" }}>Performed By</th>
                  <th style={{ padding: "10px 14px" }}>School</th>
                  <th style={{ padding: "10px 14px" }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr
                    key={log._id || idx}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fcfcfc",
                    }}
                  >
                    <td style={{ padding: "10px 14px", color: "#666", whiteSpace: "nowrap" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: "bold", color: "#1f2235" }}>
                      {log.action}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          backgroundColor:
                            log.level === "error"
                              ? "#ffebee"
                              : log.level === "warning"
                              ? "#fff3e0"
                              : "#e8f5e9",
                          color:
                            log.level === "error"
                              ? "#c62828"
                              : log.level === "warning"
                              ? "#e65100"
                              : "#2e7d32",
                        }}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", color: "#333" }}>{log.performedBy || "System"}</td>
                    <td style={{ padding: "10px 14px", fontWeight: "bold", color: "#2e7d32" }}>
                      {log.schoolCode || "-"}
                    </td>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{log.details}</td>
                  </tr>
                ))}

                {logs.length === 0 && !loadingLogs && (
                  <tr>
                    <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
                      No system logs found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {logTotalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "1rem" }}>
              <button
                disabled={logPage <= 1}
                onClick={() => fetchLogs(logPage - 1)}
                style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer" }}
              >
                ◀ Previous
              </button>
              <span style={{ alignSelf: "center", fontSize: "13px", color: "#555" }}>
                Page {logPage} of {logTotalPages}
              </span>
              <button
                disabled={logPage >= logTotalPages}
                onClick={() => fetchLogs(logPage + 1)}
                style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer" }}
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: SYSTEM SETTINGS ==================== */}
      {activeTab === "settings" && (
        <div style={{ maxWidth: "700px" }}>
          <div style={sectionBoxStyle}>
            <h3 style={{ margin: "0 0 1.2rem 0", color: "#1f2235", fontSize: "18px" }}>
              ⚙️ System Platform Configuration
            </h3>
            <form onSubmit={handleSaveSettings}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Platform Title</label>
                <input
                  type="text"
                  value={settings.platformName || ""}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Super Admin / Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail || ""}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "1rem" }}>
                <div>
                  <label style={labelStyle}>Current Academic Year</label>
                  <input
                    type="number"
                    value={settings.academicYear || 2026}
                    onChange={(e) => setSettings({ ...settings, academicYear: Number(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Current Term</label>
                  <select
                    value={settings.currentTerm || "Term 1"}
                    onChange={(e) => setSettings({ ...settings, currentTerm: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
              </div>

              {/* Maintenance Mode Toggle */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: "6px",
                  backgroundColor: settings.maintenanceMode ? "#ffebee" : "#f5f5f5",
                  marginBottom: "1.2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold", color: settings.maintenanceMode ? "#c62828" : "#333" }}>
                    Maintenance Mode
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    When enabled, non-superadmin users are shown a maintenance screen.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!!settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#2e7d32",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {savingSettings ? "Saving Settings..." : "Save Settings"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD SCHOOL & ADMIN MODAL ==================== */}
      {showAddModal && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, color: "#1f2235", fontSize: "20px" }}>
                🏫 Register New School & Provision Admin
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#666", marginBottom: "1.2rem" }}>
              Provisioning a school automatically creates a dedicated School Administrator account. That admin will log in to add pupils and teachers for this school.
            </p>

            <form onSubmit={handleAddSchool}>
              <div style={{ backgroundColor: "#f9fbf9", padding: "12px", borderRadius: "6px", marginBottom: "1rem", border: "1px solid #e0e0e0" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>School Information</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <div>
                    <label style={labelStyle}>School Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Grather Academy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>School Code (Unique) *</label>
                    <input
                      type="text"
                      placeholder="e.g. GA01 or SCH001"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={labelStyle}>Address / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Nairobi, Kenya"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Contact Phone (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. +254 712 345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#f0f7ff", padding: "12px", borderRadius: "6px", marginBottom: "1.2rem", border: "1px solid #bbdefb" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#1565c0" }}>Primary School Administrator</h4>
                <div style={{ marginBottom: "10px" }}>
                  <label style={labelStyle}>Admin Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe (Principal)"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={labelStyle}>Admin Email (Login ID) *</label>
                    <input
                      type="email"
                      placeholder="admin@school.com"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Initial Password *</label>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Secret password"
                        value={formData.adminPassword}
                        onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                        required
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          padding: "6px 10px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "9px 16px",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSchool}
                  style={{
                    padding: "9px 20px",
                    backgroundColor: "#2e7d32",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {submittingSchool ? "Provisioning..." : "Create School & Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== RESET PASSWORD MODAL ==================== */}
      {passwordModal.open && (
        <div style={modalBackdropStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: "420px" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2235" }}>🔑 Reset School Admin Password</h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "1rem" }}>
              Reset password for <strong>{passwordModal.adminEmail}</strong> (School Code: {passwordModal.schoolCode})
            </p>
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password"
                  value={passwordModal.newPassword}
                  onChange={(e) => setPasswordModal({ ...passwordModal, newPassword: e.target.value })}
                  placeholder="Enter at least 4 characters"
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setPasswordModal({ open: false, schoolCode: "", adminEmail: "", newPassword: "" })}
                  style={{ padding: "8px 14px", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const statCardStyle = (borderColor) => ({
  backgroundColor: "#fff",
  padding: "1.2rem",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  borderTop: `4px solid ${borderColor}`,
});

const sectionBoxStyle = {
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
};

const actionBtnStyle = (bgColor) => ({
  padding: "10px 16px",
  backgroundColor: bgColor,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "13px",
  cursor: "pointer",
  textAlign: "left",
  transition: "opacity 0.2s ease",
});

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#444",
  marginBottom: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
};

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalBoxStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "24px",
  maxWidth: "600px",
  width: "100%",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  maxHeight: "90vh",
  overflowY: "auto",
};

export default SuperAdminDashboard;
