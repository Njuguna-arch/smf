import React, { useEffect, useState } from "react";
import { getStudentProfile } from "../services/studentService";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { getPhotoUrl, DEFAULT_AVATAR } from "../config";

const Profile = () => {
  const currentUser = getCurrentUser();
  const [student, setStudent] = useState(currentUser || null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user && (user._id || user.id)) {
      const userId = user._id || user.id;
      getStudentProfile(userId)
        .then((data) => {
          if (
            data &&
            typeof data === "object" &&
            !Array.isArray(data) &&
            (data.name || data.admissionNumber)
          ) {
            setStudent((prev) => ({ ...(prev || {}), ...data }));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch student profile", err);
          if (!currentUser) {
            setError("Unable to load profile. Please try again later.");
          }
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (error && !student) {
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

  const displayName = student.name || currentUser?.name || "Student";
  const displayAdmission = student.admissionNumber || currentUser?.admissionNumber || "N/A";
  const displayGrade = student.grade || currentUser?.grade || "N/A";
  const displayEmail = student.email || currentUser?.email || "N/A";
  const displayGender = student.gender || currentUser?.gender || "N/A";
  const displayDob = student.dateOfBirth || currentUser?.dateOfBirth;
  const displayTeacher = student.classTeacher || currentUser?.classTeacher || "N/A";

  const photoSrc = getPhotoUrl(student.photoUrl || currentUser?.photoUrl);

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <marquee behavior="" direction="left" scrollamount="8">
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              color: "#0a0a0b",
              backgroundColor: "#e8e113",
            }}
          >
            Liskan Academy Primary and Junior School, MOTTO: Hard Work Pays
          </h1>
        </marquee>
        <h2 style={{ margin: "0.5rem 0", color: "#34495e" }}>
          Welcome, {displayName}
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
            alt={displayName}
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
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
          <p>
            <strong>{displayAdmission}</strong>
          </p>
          <p>Grade: {displayGrade}</p>
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
          <p>
            <strong>Name:</strong> {displayName}
          </p>
          <p>
            <strong>Admission No:</strong> {displayAdmission}
          </p>
          <p>
            <strong>Email:</strong> {displayEmail}
          </p>
          <p>
            <strong>Grade:</strong> {displayGrade}
          </p>
          <p>
            <strong>Gender:</strong> {displayGender}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {displayDob ? new Date(displayDob).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Class Teacher:</strong> {displayTeacher}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
