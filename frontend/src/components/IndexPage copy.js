// src/components/IndexPage.js
import React from "react";
import { useHistory } from "react-router-dom";
import "./IndexPage.css"; // Add custom styles if needed

const IndexPage = () => {
  const history = useHistory();

  const goToLogin = () => {
    history.push("/login"); // Navigate to Login Page
  };

  const goToRegister = () => {
    history.push("/register"); // Navigate to Register Page
  };

  return (
    <div className="index-container">
      <h1>Welcome to Our DApp</h1>
      <div className="index-buttons">
        <button className="index-btn" onClick={goToLogin}>
          Login
        </button>
        <button className="index-btn" onClick={goToRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
