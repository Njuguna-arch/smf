import React from "react";
import DisciplineView from "../components/DisciplineView";
import { getCurrentUser } from "../services/authService";

const StudentDiscipline = () => {
  const user = getCurrentUser();

  if (!user || !user.admissionNumber) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <h2>Error</h2>
        <p>Unable to load discipline records. Please log in again.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Discipline Records</h1>
      <DisciplineView admissionNumber={user.admissionNumber} />
    </div>
  );
};

export default StudentDiscipline;