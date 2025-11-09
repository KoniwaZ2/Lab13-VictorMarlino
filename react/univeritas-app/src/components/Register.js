import React, { useState, useEffect, useRef } from "react";

function Register({ onSubmit, onCancel, registerToEdit }) {
  const emailInputRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    full_name: "",
    major: "",
    role: "",
    password: "",
    password_confirmation: "",
    matkul_diajar: "",
  });
  useEffect(() => {
    if (registerToEdit) {
      setFormData({
        email: registerToEdit.email || "",
        username: registerToEdit.username || "",
        full_name: registerToEdit.full_name || "",
        major: registerToEdit.major || "",
        role: registerToEdit.role || "",
        password: registerToEdit.password || "",
        password_confirmation: registerToEdit.password_confirmation || "",
        matkul_diajar: registerToEdit.matkul_diajar || "",
      });
    } else {
      setFormData({
        email: "",
        username: "",
        full_name: "",
        major: "",
        role: "",
        password: "",
        password_confirmation: "",
        matkul_diajar: "",
      });
    }
    if (emailInputRef.current) {
      emailInputRef.current.value = "";
    }
  }, [registerToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-detect role berdasarkan email domain
    if (name === "email") {
      const email = value.toLowerCase();
      let autoRole = "";

      if (email.includes("@student.prasetiyamulya.ac.id")) {
        autoRole = "student";
      } else if (email.includes("@prasetiyamulya.ac.id")) {
        autoRole = "instructor";
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        role: autoRole, // Auto-set role
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            ref={emailInputRef}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="full_name">Full Name:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="major">Major:</label>
          <select
            id="major"
            name="major"
            value={formData.major}
            onChange={handleChange}
            required
          >
            <option value="">Select your major</option>
            <option value="artificial_intelligence_and_robotics">AIR</option>
            <option value="business_mathematics">BM</option>
            <option value="digital_business_technology">DBT</option>
            <option value="product_design_engineering">PDE</option>
            <option value="energy_business_technology">EBT</option>
            <option value="food_business_technology">FBT</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={formData.email !== ""}
            required
            style={{
              backgroundColor: formData.email !== "" ? "#f0f0f0" : "white",
              cursor: formData.email !== "" ? "not-allowed" : "pointer",
            }}
          >
            <option value="">
              {formData.email === ""
                ? "Masukkan email terlebih dahulu"
                : "Select your role"}
            </option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
          {formData.role && (
            <small style={{ color: "#667eea", fontSize: "0.85rem" }}>
              Role otomatis terdeteksi dari domain email Anda
            </small>
          )}
        </div>

        {formData.role === "instructor" && (
          <div className="form-group">
            <label htmlFor="matkul_diajar">Mata Kuliah yang Diajar:</label>
            <textarea
              id="matkul_diajar"
              name="matkul_diajar"
              value={formData.matkul_diajar}
              onChange={handleChange}
              placeholder="Pisahkan dengan koma. Contoh: Database Systems, Web Programming, Data Structures"
              rows="3"
              style={{ resize: "vertical" }}
            />
            <small style={{ color: "#666", fontSize: "0.85rem" }}>
              Masukkan nama mata kuliah yang Anda ajar, pisahkan dengan koma
            </small>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password_confirmation">Confirm Password:</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
        <button type="button" onClick={onCancel}>
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default Register;
