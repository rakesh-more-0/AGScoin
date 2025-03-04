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
    <>
      <iframe
            src="/frontasset/index-1.html"
            title="HTML Page"
            style={{
                width: '100%',
                height: '100vh',
                border: 'none'
            }}
        />
    </>
  );
};

export default IndexPage;
