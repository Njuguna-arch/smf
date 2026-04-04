import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const TeacherLayout = () => {
  const linkStyle = {
    display: "block",
    padding: "10px 15px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    borderRadius: "4px",
    marginBottom: "8px",
  };

  const activeStyle = {
    backgroundColor: "#1976d2",
    color: "#fff",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "220px",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Teacher Panel</h2>
        <nav>
          <NavLink
            to="/teacher"
            end
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/teacher/exams"
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Exams
          </NavLink>
          <NavLink
            to="/teacher/discipline"
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Discipline
          </NavLink>
          <NavLink
            to="/teacher/videos/upload"
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Upload Video
          </NavLink>

          <NavLink
            to="/teacher/quizzes/add"
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Add Quiz
          </NavLink>

          <NavLink
            to="/teacher/quizzes"
            end  
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            Completed Quizzes
          </NavLink>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;