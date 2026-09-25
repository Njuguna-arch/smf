import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { UserContext } from "../context/UserContext";
import "./LoginPage.css"; // Reuse existing styles

const SuperAdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password, "superadmin", "");

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
        photoUrl: normalizedUser.photoUrl,
      };

      loginUser(userToStore, data.token);
      localStorage.setItem("user", JSON.stringify(userToStore));

      if (userToStore.role === "superadmin") {
        navigate("/superadmin");
      } else {
        setError("User is not a superadmin");
      }
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
          Liskan Academy <br /> Super Admin Login
        </h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Logging in..." : "Login as Super Admin"}
          </button>
        </form>
        {loading && <p className="login-loading">Please wait...</p>}
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
