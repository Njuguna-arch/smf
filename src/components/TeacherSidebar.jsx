import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const TeacherSidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "dashboard" },
    { label: "Exams", path: "exams" },
    { label: "Discipline", path: "discipline" },
    { label: "Upload Video", path: "upload-video" },
    { label: "Add Quiz", path: "add-quiz" },
    { label: "Completed Quizzes", path: "completed-quizzes" },
    { label: "Announcements", path: "announcements" },
  ];

  const styles = {
    sidebar: {
      width: collapsed ? "60px" : "240px",
      backgroundColor: "#1565c0", // teacher theme color (blue)
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
      backgroundColor: "#0d47a1",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.toggle} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? ">>" : "<<"}
      </div>

      {user && <div style={styles.name}>{user.name}</div>}

      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={`/teacher/${item.path}`}
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

export default TeacherSidebar;
