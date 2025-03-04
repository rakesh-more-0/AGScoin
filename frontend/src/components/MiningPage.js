// src/components/MiningPage.js
import React, { useState, useEffect } from "react";

import { getContract } from "../utils/contract"; // Import getContract function
import "./MiningPage.css"; // Import the CSS for the page

const MiningPage = () => {
  const [miningReward, setMiningReward] = useState(null);

  useEffect(() => {
    const fetchMiningReward = async () => {
      try {
        const { web3, contract } = await getContract();
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Fetch mining reward from the contract
        const reward = await contract.methods.getMiningReward(userAddress).call();
        setMiningReward(web3.utils.fromWei(reward, "mwei"));
      } catch (error) {
        console.error("Error fetching mining reward:", error);
      }
    };

    fetchMiningReward();
  }, []);

  return (
    <div className="mining-page-container">
      <h1>Your Mining Rewards</h1>
      {miningReward !== null ? (
        <p>Your current mining reward is: {miningReward} USDT</p>
      ) : (
        <p>Loading mining rewards...</p>
      )}
    </div>
  );
};

export default MiningPage;
