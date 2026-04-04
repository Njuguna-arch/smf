import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  };

  const activeStyle = {
    backgroundColor: "#0d3d07",
    fontWeight: "bold",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <aside
        style={{
          width: "220px",
          backgroundColor: "#155809",
          color: "#fff",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ marginBottom: "1.5rem" }}>Admin Panel</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <NavLink
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  ...linkStyle,
                  ...(isActive ? activeStyle : {}),
                })}
              >
                Dashboard
              </NavLink>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <NavLink
                to="/admin/users"
                style={({ isActive }) => ({
                  ...linkStyle,
                  ...(isActive ? activeStyle : {}),
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <NavLink
                to="/admin/announcements"
                style={({ isActive }) => ({
                  ...linkStyle,
                  ...(isActive ? activeStyle : {}),
                })}
              >
                Announcements
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "2rem", backgroundColor: "#f9f9f9" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;