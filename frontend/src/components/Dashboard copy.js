// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Dashboard.css"; // Import CSS for Dashboard styling

const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const history = useHistory(); // To navigate back to the login page

  useEffect(() => {
    // Retrieve wallet address from localStorage
    const address = localStorage.getItem("walletAddress");
    if (address) {
      setWalletAddress(address);
    } else {
      history.push("/"); // Redirect to login page if no wallet is connected
    }
  }, [history]);

  const disconnectWallet = () => {
    // Clear wallet address from localStorage and reset state
    localStorage.removeItem("walletAddress");
    setWalletAddress("");
    alert("Wallet disconnected!");
    history.push("/"); // Redirect to login page after disconnect
  };

  const goToStakePage = () => {
    history.push("/stake"); // Redirect to the StakePage
  };

  const goToWithdrawalPage = () => {
    history.push("/withdrawal"); // Redirect to the WithdrawalPage
  };

  const goToMiningPage = () => {
    history.push("/mining"); // Redirect to the MiningPage
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <p className="wallet-address">
        Connected Wallet Address: {walletAddress}
      </p>

      {/* Buttons for Stake, Withdrawal, and Mining */}
      <div className="action-buttons">
        <button className="action-btn" onClick={goToStakePage}>
          Stake
        </button>
        <button className="action-btn" onClick={goToWithdrawalPage}>
          Withdrawal
        </button>
        <button className="action-btn" onClick={goToMiningPage}>
          Mining
        </button>
      </div>

      <button className="disconnect-wallet-btn" onClick={disconnectWallet}>
        Disconnect Wallet
      </button>
    </div>
  );
};

export default Dashboard;
