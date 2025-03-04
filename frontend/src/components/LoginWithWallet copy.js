// src/components/LoginWithWallet.js
import React, { useState } from "react";
import Web3 from "web3";
import { useHistory } from "react-router-dom";

import "./LoginWithWallet.css"; // Import the CSS file for styling

const LoginWithWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access
        const accounts = await web3.eth.requestAccounts();
        setWalletAddress(accounts[0]); // Set wallet address in state
        localStorage.setItem("walletAddress", accounts[0]); // Store wallet address in localStorage
        // Redirect to dashboard page after successful login
        history.push("/dashboard");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Error connecting wallet");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const history = useHistory();
  
  
    const goToRegister = () => {
      history.push("/register"); // Navigate to Register Page
    };

  return (
    <div className="login-container">
      <h1>Login with Wallet</h1>
      <button className="connect-wallet-btn" onClick={connectWallet}>
        Connect Wallet
      </button>
        <button className="index-btn" onClick={goToRegister}>
          Register
        </button>
      {walletAddress && <p>Connected Address: {walletAddress}</p>}
    </div>
  );
};

export default LoginWithWallet;
