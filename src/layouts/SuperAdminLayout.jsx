import React, { useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const SuperAdminLayout = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    transition: "background-color 0.2s ease",
    fontSize: "14px",
  };

  const activeStyle = {
    backgroundColor: "#2e7d32",
    fontWeight: "bold",
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <aside
        style={{
          width: "240px",
          backgroundColor: "#1f2235",
          color: "#fff",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid #333a56", paddingBottom: "1rem" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>⚡</span> EduSphere
          </div>
          <div style={{ fontSize: "11px", color: "#4caf50", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
            Super Admin Portal
          </div>
          {user && (
            <div style={{ fontSize: "12px", color: "#bbb", marginTop: "8px", wordBreak: "break-all" }}>
              👤 {user.email || user.name || "Administrator"}
            </div>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <NavLink
                to="/superadmin/dashboard"
                style={({ isActive }) => ({
                  ...linkStyle,
                  ...(isActive ? activeStyle : {}),
                })}
              >
                📊 Control Center
              </NavLink>
            </li>
          </ul>
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            backgroundColor: "#d32f2f",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: "2rem", backgroundColor: "#f4f6f8" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
