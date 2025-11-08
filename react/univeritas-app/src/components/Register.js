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
      });
    }
    if (emailInputRef.current) {
      emailInputRef.current.value = "";
    }
  }, [registerToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
            required
          >
            <option value="">Select your role</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
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
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Register;
