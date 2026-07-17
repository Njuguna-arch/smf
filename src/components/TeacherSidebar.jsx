import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const TeacherSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "" },
    { label: "Exams", path: "exams" },
    { label: "Discipline", path: "discipline" },
    { label: "Upload Video", path: "videos/upload" },
    { label: "Add Quiz", path: "quizzes/add" },
    { label: "Completed Quizzes", path: "quizzes" },
  ];

  return (
    <div
      style={{
        width: collapsed ? "60px" : "240px",
        backgroundColor: "#9ec4e3",
        color: "#fff",
        transition: "width 0.3s",
        padding: "1rem",
        minHeight: "100vh",
      }}
    >
      {/* Collapse toggle */}
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

      {/* Nav items */}
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={`/teacher/${item.path}`}
          end={item.path === "" || item.path === "quizzes"}
          style={({ isActive }) => ({
            padding: "0.5rem",
            borderRadius: "4px",
            marginBottom: "0.5rem",
            textDecoration: "none",
            color: "#fff",
            display: "block",
            transition: "background-color 0.2s",
            backgroundColor: isActive ? "#42a5f5" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0c86eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              window.location.pathname.includes(item.path)
                ? "#1482db"
                : "transparent";
          }}
        >
          {collapsed ? item.label[0] : item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default TeacherSidebar;
