import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const TeacherSidebar = () => {
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

  return (
    <div
      style={{
        width: collapsed ? "60px" : "240px",
        backgroundColor: "#1565c0",
        color: "#fff",
        transition: "width 0.3s",
        padding: "1rem",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          cursor: "pointer",
          marginBottom: "1rem",
          textAlign: "center",
          fontWeight: "bold",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? ">>" : "<<"}
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={`/teacher/${item.path}`}
          style={({ isActive }) => ({
            padding: "0.5rem",
            borderRadius: "4px",
            marginBottom: "0.5rem",
            textDecoration: "none",
            color: "#fff",
            display: "block",
            backgroundColor: isActive ? "#0d47a1" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          {collapsed ? item.label[0] : item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default TeacherSidebar;
