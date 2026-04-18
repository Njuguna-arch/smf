import React, { useEffect, useState } from "react";
import { getStudentProfile } from "../services/studentService";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = getCurrentUser();
    if (user && (user._id || user.id)) {
      const userId = user._id || user.id;
      getStudentProfile(userId)
        .then((data) => setStudent(data))
        .catch((err) => {
          console.error("Failed to fetch student profile", err);
          setError("Unable to load profile. Please try again later.");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Student Profile</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!student) {
    return <p style={{ padding: "2rem" }}>Loading profile...</p>;
  }

  // Always resolve to backend /uploads
  const photoSrc = student.photoUrl
    ? `${API_URL}/uploads/${student.photoUrl.replace(/^\/uploads\//, "")}`
    : `${API_URL}/uploads/default-avatar.png`;

  return (
    <div style={{ padding: "2rem" }}>
      {/* Welcoming Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <marquee behavior="" direction="left" scrollamount="9">
          <h1 style={{ margin: 0, fontSize: "2rem", color: "#0a0a0b", backgroundColor: "#e8e113" }}>
            Grather Academy Primary and Junior School, MOTTO: Hard Work Pays
          </h1>
        </marquee>
        <h2 style={{ margin: "0.5rem 0", color: "#34495e" }}>
          Welcome, {student.name || "Student"}
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            flex: "1 1 250px",
            padding: "1.5rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fdfdfd",
            textAlign: "center",
          }}
        >
          <h3>User Profile</h3>
          <img
            src={photoSrc}
            alt={student.name || "Student Photo"}
            crossOrigin="anonymous"
            style={{
              width: "220px",
              height: "220px",
              objectFit: "cover",
              border: "2px solid #ccc",
              borderRadius: "12px",
              marginBottom: "1rem",
            }}
            onError={(e) => {
              e.currentTarget.src = `${API_URL}/uploads/default-avatar.png`;
            }}
          />
          <p>
            <strong>{student.admissionNumber || "N/A"}</strong>
          </p>
          <p>Grade: {student.grade || "N/A"}</p>
        </div>

        <div
          style={{
            flex: "1 1 350px",
            padding: "1.5rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fdfdfd",
          }}
        >
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {student.name || "N/A"}</p>
          <p><strong>Admission No:</strong> {student.admissionNumber || "N/A"}</p>
          <p><strong>Email:</strong> {student.email || "N/A"}</p>
          <p><strong>Grade:</strong> {student.grade || "N/A"}</p>
          <p><strong>Gender:</strong> {student.gender || "N/A"}</p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {student.dateOfBirth
              ? new Date(student.dateOfBirth).toLocaleDateString()
              : "N/A"}
          </p>
          <p><strong>Class Teacher:</strong> {student.classTeacher || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
