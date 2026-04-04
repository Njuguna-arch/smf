import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Profile", path: "profile" },
    { label: "Quizzes", path: "quizzes" },
    { label: "Exam Results", path: "exam-results" },
    { label: "Videos", path: "videos" },
    { label: "Discipline", path: "discipline" },
    { label: "Announcements", path: "announcements" },
  ];

  const styles = {
    sidebar: {
      width: collapsed ? "60px" : "240px",
      backgroundColor: "#2e7d32",
      color: "#fff",
      transition: "width 0.3s",
      padding: "1rem",
      minHeight: "100vh",
    },
    toggle: {
      cursor: "pointer",
      marginBottom: "1rem",
      textAlign: "center",
      fontWeight: "bold",
    },
    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      objectFit: "cover",
      margin: "0 auto 1rem",
      display: collapsed ? "none" : "block",
      border: "2px solid #fff",
    },
    name: {
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "1rem",
      display: collapsed ? "none" : "block",
    },
    navLink: {
      padding: "0.5rem",
      borderRadius: "4px",
      marginBottom: "0.5rem",
      textDecoration: "none",
      color: "#fff",
      display: "block",
    },
    activeNavLink: {
      backgroundColor: "#1b5e20",
      fontWeight: "bold",
    },
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const photoSrc = user?.photoUrl
    ? user.photoUrl.startsWith("/uploads")
      ? `${API_URL}${user.photoUrl}`
      : `${API_URL}/uploads/${user.photoUrl}`
    : "https://via.placeholder.com/100?text=Student";

  return (
    <div style={styles.sidebar}>
      <div style={styles.toggle} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? ">>" : "<<"}
      </div>

      {user && (
        <>
          <img
            src={photoSrc}
            alt={user.name || "Student"}
            crossOrigin="anonymous"
            style={styles.avatar}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/100?text=Student";
            }}
          />
          <div style={styles.name}>{user.name}</div>
        </>
      )}

      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={`/student/${item.path}`}
          style={({ isActive }) =>
            isActive
              ? { ...styles.navLink, ...styles.activeNavLink }
              : styles.navLink
          }
        >
          {collapsed ? item.label[0] : item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;