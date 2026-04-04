import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;