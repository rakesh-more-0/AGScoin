// src/components/WithdrawalPage.js
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { getContract } from "../utils/contract"; // Import getContract function
import "./Withdrawal.css"; // Import the CSS for the page

const WithdrawalPage = () => {
  const [amount, setAmount] = useState("");
  const [withdrawalStatus, setWithdrawalStatus] = useState("");
  const history = useHistory();

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const { web3, contract } = await getContract();
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];

      // Call the withdraw function on the staking contract
      await contract.methods.withdraw(web3.utils.toWei(amount, "mwei")).send({ from: userAddress });

      setWithdrawalStatus(`Successfully withdrew ${amount} USDT!`);
      alert(`Successfully withdrew ${amount} USDT!`);
    } catch (error) {
      console.error("Error withdrawing:", error);
      setWithdrawalStatus("Withdrawal failed.");
      alert("Withdrawal failed.");
    }
  };

  return (
    <div className="withdrawal-page-container">
      <h1>Withdraw USDT</h1>
      <div className="withdrawal-form">
        <label htmlFor="amount">Enter Amount to Withdraw (in USDT)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <button className="withdraw-btn" onClick={handleWithdraw}>
          Withdraw
        </button>
        {withdrawalStatus && <p>{withdrawalStatus}</p>}
      </div>

      <button className="back-btn" onClick={() => history.push("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default WithdrawalPage;
