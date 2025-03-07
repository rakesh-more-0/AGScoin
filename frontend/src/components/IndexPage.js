// src/components/IndexPage.js
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./IndexPage.css";

const IndexPage = () => {
  const history = useHistory();

  useEffect(() => {
    // Create a message listener to handle iframe communications
    const handleMessage = (event) => {
      // Make sure the message is from your iframe
      if (event.data === "navigateToRegister") {
        history.push("/register");
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [history]);

  return (
    <iframe
      src="/frontasset/index-1.html"
      title="HTML Page"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none'
      }}
    />
  );
};

export default IndexPage;