import React, { useState } from "react";
import Web3 from "web3";
import { useHistory } from "react-router-dom";
import { getContract } from "../utils/contract"; // Import the utility
import "./RegisterPage.css";

const RegisterPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [username, setUsername] = useState("");
  const [web3, setWeb3] = useState(null);
  const history = useHistory();

  const registerUser = async () => {
    if (!walletAddress || !username) {
      alert("Please provide a valid username and wallet address.");
      return;
    }

    try {
      if (!web3) {
        alert("Wallet not connected!");
        return;
      }

      // Get the contract instance
      const contract = await getContract(web3);

      // Send $10 registration fee (convert to Wei)
      const fee = web3.utils.toWei("10", "ether");

      const tx = await contract.methods.register(username).send({
        from: walletAddress,
        value: fee,
      });

      console.log("Transaction successful:", tx);

      // Save registration info to localStorage
      localStorage.setItem("walletAddress", walletAddress);
      localStorage.setItem("username", username);

      alert("Registration successful!");
      history.push("/dashboard"); // Redirect to dashboard after successful registration
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      try {
        const accounts = await web3Instance.eth.requestAccounts();
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {walletAddress && (
        <>
          <p>Connected: {walletAddress}</p>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={registerUser}>Register</button>
        </>
      )}
    </div>
  );
};

export default RegisterPage;
