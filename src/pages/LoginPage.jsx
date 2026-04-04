import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { UserContext } from "../context/UserContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(identifier, password, role);

      if (!data || !data.token || !data.user) {
        setError("Unexpected response from server");
        setLoading(false);
        return;
      }

      const normalizedUser = {
        ...data.user,
        role: data.user.role?.toLowerCase(),
      };

      const userToStore = {
        _id: normalizedUser._id || normalizedUser.id,
        name: normalizedUser.name,
        email: normalizedUser.email,
        role: normalizedUser.role,
        grade: normalizedUser.grade,
        photoUrl: normalizedUser.photoUrl,
        admissionNumber: normalizedUser.admissionNumber,
      };

      loginUser(userToStore, data.token);
      localStorage.setItem("user", JSON.stringify(userToStore));

      if (userToStore.role === "student") navigate("/student/profile");
      if (userToStore.role === "teacher") navigate("/teacher");
      if (userToStore.role === "admin") navigate("/admin");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">
          Grather Academy <br /> Login
        </h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="identifier" className="form-label">
              {role === "student" ? "Admission Number:" : "Email:"}
            </label>
            <input
              id="identifier"
              type={role === "student" ? "text" : "email"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {loading && <p className="login-loading">Please wait...</p>}
      </div>
    </div>
  );
};

export default LoginPage;