import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TeacherSidebar from "../components/TeacherSidebar.jsx";

const TeacherLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ✅ Only the new TeacherSidebar */}
      <Box sx={{ flexShrink: 0 }}>
        <TeacherSidebar />
      </Box>

      {/* Main content area */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default TeacherLayout;
