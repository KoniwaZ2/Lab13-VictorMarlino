import React, { useState, useEffect, useRef } from "react";

function Login({ onSubmit, onCancel, loginToEdit }) {
  const emailInputRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (loginToEdit) {
      setFormData({
        email: loginToEdit.email || "",
        password: loginToEdit.password || "",
      });
    } else {
      setFormData({
        email: "",
        password: "",
      });
    }
    if (emailInputRef.current) {
      emailInputRef.current.value = "";
    }
  }, [loginToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
        <div className="form-actions">
          <button type="submit">Login</button>
          {onCancel && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
        <div className="form-group">
          Don't have an account?
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onCancel) onCancel();
            }}
          >
            Register here.
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
