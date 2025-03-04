// src/components/StakePage.js
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { getContract } from "../utils/contract"; // Import the getContract function
import "./StakePage.css"; // Import the CSS for the page

const StakePage = () => {
  const [amount, setAmount] = useState("");
  const [stakingStatus, setStakingStatus] = useState("");
  const history = useHistory(); // For navigation

  const handleStake = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      // Get Web3 and contract instance from getContract
      const { web3, contract } = await getContract();
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];

      // Call the stake function of the contract
      setStakingStatus("Staking in progress...");
      
      await contract.methods.stake(web3.utils.toWei(amount, "ether")).send({ from: userAddress });

      setStakingStatus(`Successfully staked ${amount} tokens!`);
      alert(`Successfully staked ${amount} tokens!`);
    } catch (error) {
      console.error("Error staking:", error);
      setStakingStatus("Staking failed.");
      alert("Staking failed.");
    }
  };

  return (
    <div className="stake-page-container">
      <h1>Stake Your Tokens</h1>
      <div className="stake-form">
        <label htmlFor="amount">Enter Amount to Stake (in ETH)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <button className="stake-btn" onClick={handleStake}>
          Stake
        </button>
        {stakingStatus && <p>{stakingStatus}</p>}
      </div>

      <button className="back-btn" onClick={() => history.push("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default StakePage;
