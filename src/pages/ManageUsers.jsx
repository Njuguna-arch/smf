import React, { useEffect, useState } from "react";
import { addUser, deleteUser, fetchUsers } from "../services/adminService";
import "./ManageUsers.css";   // ✅ Import the CSS file

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    admissionNumber: "",
    grade: "",
    photoUrl: "",
    gender: "",
    dateOfBirth: "",
    classTeacher: ""
  });
  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const handleAddUser = async () => {
    try {
      const payload = {
        ...newUser,
        role: newUser.role.toLowerCase(),
        email: newUser.email.trim().toLowerCase(),
        admissionNumber:
          newUser.role === "student"
            ? newUser.admissionNumber.trim().toUpperCase()
            : undefined,
        gender: newUser.gender.trim().toLowerCase(),
        classTeacher: newUser.classTeacher.trim(),
        dateOfBirth: newUser.dateOfBirth ? new Date(newUser.dateOfBirth) : undefined,
      };

      if (!payload.name || !payload.password || !payload.role || !payload.email) {
        alert("Name, email, password, and role are required.");
        return;
      }
      if (payload.role === "student" && !payload.admissionNumber) {
        alert("Admission number is required for students.");
        return;
      }

      const created = await addUser(payload);
      setUsers([...users, created]);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "student",
        admissionNumber: "",
        grade: "",
        photoUrl: "",
        gender: "",
        dateOfBirth: "",
        classTeacher: ""
      });
    } catch (err) {
      console.error("Failed to add user", err);
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || err.message;
      alert("Failed to add user: " + errorMessage);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this user?")) {
        if (window.confirm("⚠️ This action cannot be undone. Confirm delete?")) {
          await deleteUser(id);
          setUsers(users.filter((u) => u._id !== id));
        }
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <div className="manage-container">
      <h2>Manage Users</h2>

      {/* Add User Form */}
      <div className="form-row">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </div>

      <div className="form-row">
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) =>
            setNewUser({ ...newUser, role: e.target.value.toLowerCase() })
          }
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {newUser.role === "student" && (
        <div className="form-row">
          <input
            type="text"
            placeholder="Admission Number"
            value={newUser.admissionNumber}
            onChange={(e) =>
              setNewUser({ ...newUser, admissionNumber: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Grade"
            value={newUser.grade}
            onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
          />
        </div>
      )}

      <div className="form-row">
        <input
          type="text"
          placeholder="Photo URL"
          value={newUser.photoUrl}
          onChange={(e) => setNewUser({ ...newUser, photoUrl: e.target.value })}
        />
        <select
          value={newUser.gender}
          onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-row">
        <input
          type="date"
          placeholder="Date of Birth"
          value={newUser.dateOfBirth}
          onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
        />
        <input
          type="text"
          placeholder="Class Teacher"
          value={newUser.classTeacher}
          onChange={(e) => setNewUser({ ...newUser, classTeacher: e.target.value })}
        />
      </div>

      <div className="form-row">
        <button onClick={handleAddUser} className="add-user-button">
          Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-container">
        <button
          onClick={() => setActiveTab("students")}
          className={`tab-button ${activeTab === "students" ? "active" : "inactive"}`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`tab-button ${activeTab === "staff" ? "active" : "inactive"}`}
        >
          Teachers & Admins
        </button>
      </div>

      {/* Students Table */}
      {activeTab === "students" && (
        <table className="manage-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admission #</th>
              <th>Grade</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Class Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter((u) => u.role === "student").map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email || "-"}</td>
                <td>{u.admissionNumber || "-"}</td>
                <td>{u.grade || "-"}</td>
                <td>{u.gender || "-"}</td>
                <td>{u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : "-"}</td>
                <td>{u.classTeacher || "-"}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Staff Table */}
      {activeTab === "staff" && (
        <table className="manage-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter((u) => u.role !== "student").map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email || "-"}</td>
                <td>{u.role}</td>
                <td>{u.gender || "-"}</td>
                <td>{u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : "-"}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;