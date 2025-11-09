import React, { useState, useEffect } from "react";
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkExistingAuth = () => {
      const accessToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user_data");

      if (accessToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_data");
        }
      }
      setIsCheckingAuth(false);
    };

    checkExistingAuth();
  }, []);

  const handleLoginSubmit = async (formData) => {
    try {
      const data = await login(formData.email, formData.password);
      console.log("Login response:", data);
      if (data.token) {
        localStorage.setItem("access_token", data.token.access);
        localStorage.setItem("refresh_token", data.token.refresh);
      }
      const userData = {
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        major: data.major,
        matkul_diajar: data.matkul_diajar || [],
      };
      localStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);
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
        formData.password_confirmation,
        formData.matkul_diajar
      );
      setUser(data.user);
      setShowLogin(true);
      alert("Registration successful! You can now log in.");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. ";

      if (error.response && error.response.data) {
        const errors = error.response.data;

        if (typeof errors === "object") {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => {
              const fieldName =
                field.charAt(0).toUpperCase() +
                field.slice(1).replace("_", " ");
              const message = Array.isArray(messages)
                ? messages.join(", ")
                : messages;
              return `${fieldName}: ${message}`;
            })
            .join("\n");
          errorMessage += "\n" + errorMessages;
        } else {
          errorMessage += errors.detail || errors.toString();
        }
      } else {
        errorMessage += "Please check your details.";
      }

      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setShowLogin(true);
  };

  // Render dashboard berdasarkan role
  const renderDashboard = () => {
    if (!user) return null;

    if (user.role === "student") {
      return <DashboardMahasiswa user={user} onLogout={handleLogout} />;
    } else if (user.role === "instructor") {
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

  // Tampilkan loading sementara cek auth
  if (isCheckingAuth) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

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
