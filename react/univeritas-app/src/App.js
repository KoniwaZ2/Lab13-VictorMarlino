import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import DashboardMahasiswa from "./components/dashboard_mahasiswa";
import DashboardDosen from "./components/dashboard_dosen";
import { login } from "./services/login";
import { register } from "./services/register";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginSubmit = async (formData) => {
    try {
      const data = await login(formData.email, formData.password);
      // Simpan token ke localStorage
      if (data.token) {
        localStorage.setItem("access_token", data.token.access);
        localStorage.setItem("refresh_token", data.token.refresh);
      }
      // Simpan user data
      setUser({
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        major: data.major,
      });
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegisterSubmit = async (formData) => {
    try {
      const data = await register(
        formData.email,
        formData.username,
        formData.full_name,
        formData.major,
        formData.role,
        formData.password,
        formData.password_confirmation
      );
      setUser(data.user);
      setShowLogin(true);
      alert("Registration successful! You can now log in.");
    } catch (error) {
      alert("Registration failed. Please check your details.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setShowLogin(true);
  };

  // Render dashboard berdasarkan role
  const renderDashboard = () => {
    if (!user) return null;

    if (user.role === "student") {
      return <DashboardMahasiswa user={user} onLogout={handleLogout} />;
    } else if (user.role === "instructor") {
      // Placeholder untuk dashboard instructor
      return <DashboardDosen user={user} onLogout={handleLogout} />;
    } else {
      // Role tidak dikenali
      return (
        <div className="dashboard-container">
          <div className="error-container">
            <p className="error-message">Role tidak dikenali: {user.role}</p>
            <button className="btn-retry" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App">
      {user ? (
        renderDashboard()
      ) : showLogin ? (
        <Login
          onSubmit={handleLoginSubmit}
          onCancel={() => setShowLogin(false)}
        />
      ) : (
        <Register
          onSubmit={handleRegisterSubmit}
          onCancel={() => setShowLogin(true)}
        />
      )}
    </div>
  );
}

export default App;
