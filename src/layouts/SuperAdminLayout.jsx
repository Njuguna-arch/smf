import React, { useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const SuperAdminLayout = () => {
  const { logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    display: "block",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  };

  const activeStyle = {
    backgroundColor: "#000",
    fontWeight: "bold",
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <aside
        style={{
          width: "220px",
          backgroundColor: "#1f2235",
          color: "#fff",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ marginBottom: "1.5rem" }}>Super Admin</h3>
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
                Schools Dashboard
              </NavLink>
            </li>
          </ul>
        </nav>
        <button 
          onClick={handleLogout}
          style={{ padding: "8px 16px", backgroundColor: "#e53935", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%" }}
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
