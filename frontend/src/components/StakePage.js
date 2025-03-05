// src/components/StakePage.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import initWeb3 from "../web3";
import { useHistory } from "react-router-dom";
import { getContract } from "../utils/contract"; // Import the getContract function
import "./StakePage.css"; // Import the CSS for the page
import Footer from "./Footer";
import whitelogo from "../assets/logo/logo-white.png";
import lock from "../assets/lock.png";
import shield from "../assets/shield.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import coin from "../assets/coinAnimation.png";
import Header from "./Header";
import lockcoin from "../assets/dashboard/lockcoin.png";
import usdt from "../assets/images/usdt.png";
import axios from "axios"; 

const StakePage = () => {
  const [amount, setAmount] = useState("");
  const [stakingStatus, setStakingStatus] = useState("");

  const history = useHistory(); // For navigation
  const [activeTab, setActiveTab] = useState(1);

  const handleClick = (tabId) => {
    setActiveTab(tabId);
  };

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

      await contract.methods
        .stake(web3.utils.toWei(amount, "ether"))
        .send({ from: userAddress });

      setStakingStatus(`Successfully staked ${amount} tokens!`);
      alert(`Successfully staked ${amount} tokens!`);
    } catch (error) {
      console.error("Error staking:", error);
      setStakingStatus("Staking failed.");
      alert("Staking failed.");
    }
  };
  const API_URL = process.env.REACT_APP_API_URL;
  
  console.log("app url ", API_URL);
  
  const Staking = () => {
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [stakeHistory, setStakeHistory] = useState([]);
    const [totalStake, setTotalStake] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dailyEarnings, setDailyEarnings] = useState(0);
    const [result, setResult] = useState(0);
  
    const handleInputChange = (event) => {
      const value = event.target.value;
  
      if (value === "") {
        // If the input is cleared, reset state
        setAmount("");
        setResult(0);
      } else {
        const numericValue = parseFloat(value);
        setAmount(numericValue);
        setResult((numericValue * 0.5) / 100); // Calculate 0.5%
      }
    };


    const MIN_STAKE_AMOUNT = 100; // Minimum stake is 100 USDT
    const DAILY_RETURN_PERCENT = 0.5 / 100; // 0.5% daily return

    const checkBalance = async (web3, account, tokenAddress) => {
      const tokenContract = new web3.eth.Contract(
        [
          {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function"
          }
        ],
        tokenAddress
      );

      const balance = await tokenContract.methods.balanceOf(account).call();
      return balance;
    };

    const fetchStakeHistory = async (web3, account) => {
      // Ideally, fetch the user's stake history from the contract or a database.
      // Here we're hardcoding for illustration purposes.
      setStakeHistory([
        { amount: "150", date: "2025-01-20", walletAddress: account },
        { amount: "200", date: "2025-01-18", walletAddress: account }
      ]);

      // Calculate total stake
      const total = stakeHistory.reduce(
        (acc, entry) => acc + parseFloat(entry.amount),
        0
      );
      setTotalStake(total);

      // Calculate total earnings (assuming 0.5% daily for the past 200 days for simplicity)
      const earnings = stakeHistory.reduce(
        (acc, entry) =>
          acc + parseFloat(entry.amount) * DAILY_RETURN_PERCENT * 200,
        0
      );
      setTotalEarnings(earnings);

      // Calculate daily earnings (this is based on the last stake)
      const lastStake = stakeHistory[stakeHistory.length - 1]?.amount || 0;
      const dailyEarning = lastStake * DAILY_RETURN_PERCENT;
      setDailyEarnings(dailyEarning);
    };

    const stake = async () => {
      const web3 = await initWeb3();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
    
      const contractAddress = "0x2ca7ecC1Eb21B0B8427E5262273a05392F0Ed388"; // Your staking contract
      const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT on BSC
    
      const contractABI = [
        {
          constant: false,
          inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
          name: "stake",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
    
      const usdtABI = [
        {
          constant: false,
          inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "", type: "bool" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
    
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
    
      try {
        setLoading(true);
        setMessage("Checking balance...");
    
        const balance = await checkBalance(web3, account, usdtAddress);
        const balanceInEther = Web3.utils.fromWei(balance, "ether");
    
        if (parseFloat(amount) < MIN_STAKE_AMOUNT) {
          setMessage(`Minimum stake is ${MIN_STAKE_AMOUNT} USDT.`);
          setLoading(false);
          return;
        }
    
        if (parseFloat(balanceInEther) < parseFloat(amount)) {
          setMessage("Insufficient balance for staking");
          setLoading(false);
          return;
        }
    
        setMessage("Approving...");
        const amountInWei = Web3.utils.toWei(amount, "ether");
    
        const approveTx = await usdtContract.methods
          .approve(contractAddress, amountInWei)
          .send({ from: account });
    
        setMessage("Staking...");
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods
          .stake(amountInWei)
          .estimateGas({ from: account });
    
        const stakeTx = await contract.methods.stake(amountInWei).send({
          from: account,
          gas: gasEstimate,
          gasPrice: gasPrice,
        });
    
        setMessage("Staking successful!");
    
        // Send staking data to backend API
        await fetch("${API_URL}/api/stake", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_address: account,
            stake_amount: amount,
            transaction_hash: stakeTx.transactionHash,
          }),
    

        })
        
        .then((response) => response.json())
        .then((data) => console.log("✅ API Response:", data))
        .catch((error) => console.error("❌ API Error:", error));
        
    
        fetchStakeHistory(web3, account); // Refresh stake history
      } catch (error) {
        setMessage("Staking failed: " + error.message);
      }
      setLoading(false);
    };
    
    useEffect(() => {
      document.title = "Stake USDT - Aegis AI Coin"; // Page title

      const fetchData = async () => {
        const web3 = await initWeb3();
        const accounts = await web3.eth.getAccounts();
        fetchStakeHistory(web3, accounts[0]);
      };

      fetchData();
    }, []);
    return (
      <>
        {/* Staking Input */}
        <div className="flex flex-col gap-8 py-8 bg-gradient-to-br from-blueLight from-30% to-blueDark overflow-auto rounded-3xl border border-gray-600">
          <div className="relative">
            <div className=" w-full h-44 overflow-hidden w-100 absolute">
              <img
                src={coin}
                className="w-32 absolute top-0 -right-12"
                alt=""
              />
            </div>
            <div className="px-7 relative ">
              <span className="text-2xl font-semibold mb-4">STAKE AND GET</span>
              <br></br>
              <span className="font-bold text-7xl">
                0.5<span className="font-thin">%</span>
              </span>{" "}
              <br></br>
              <span className="text-2xl font-normal mb-4">USDT EVERYDAY</span>
            </div>
          </div>

          <div className="px-3">
            <div className="flex justify-end items-center">
              <div className="flex items-center text-gray-400 gap-1">
                <span className="text-xs px-3 pb-1">Balance: {totalStake}  USDT</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                  viewBox="0 0 32 32"
                >
                  <g fill="none" fillRule="evenodd">
                    <circle cx={16} cy={16} r={16} fill="#26a17b"></circle>
                    <path
                      fill="#fff"
                      d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042c-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658s2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061c1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658c0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118s3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116s-3.301-1.914-7.694-2.117"
                    ></path>
                  </g>
                </svg>
              </div>
              <input
                type="number"
                id=""
                className="block w-full p-4 px-12 text-2xl leading-none font-bold bg-input text-white border border-[#00EAD6] rounded-2xl  "
                placeholder="0"
                value={amount}
                onChange={handleInputChange}
                required
              />

              <span className="absolute end-2.5 bottom-4 text-white/60">
                MAX
              </span>
            </div>
            <p>{message}</p>
          </div>
          <div className="px-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs">
                  Daily Stake (0.5%) :{" "}
                  <span className="font-extrabold"> {result}</span>
                </span>
              </div>
              <div className="flex gap-1 border w-fit px-2 rounded-xl py-0.5">
                <img src={lock} className="w-5" alt="" />
                <span className="text-sm">200 Days</span>
              </div>
            </div>
            <div>
              <span className="text-sm">
                After 200 days you will earn
                <span className="font-semibold"> 0 USDT</span>
              </span>
            </div>
          </div>
          {/* Convert Button */}
          <div className="px-3">
            <button
              className="w-full text-white bg-buttonBlue shadow-lg shadow-blue-500/50   font-medium rounded-xl text-lg px-5 py-3.5 text-center me-2 mb-2"
              onClick={stake}
              disabled={loading}
            >
              {loading ? "Staking..." : "Start Stake"}
            </button>
          </div>
        </div>
      </>
    );
  };


  const UnStake = () => {
    const [totalStake, setTotalStake] = useState(0);
    const [stakeHistory, setStakeHistory] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalStakeCount, setTotalStakeCount] = useState(0);
    const [lastStakeDate, setLastStakeDate] = useState("N/A");
    const [dailyEarnings, setDailyEarnings] = useState(0);
  
    const DAILY_RETURN_PERCENT = 0.5 / 100; // 0.5% daily return
  
    const fetchStakingData = async (userWallet) => {
      try {
        const response = await axios.get(`${API_URL}/getStakingData/${userWallet}`);
        const data = response.data;
  
        console.log("Staking data:", data);
  
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No valid staking data found.");
          return;
        }
  
        setStakeHistory(data);
  
        // ✅ Total staking amount (Ensure stake_amount is a number)
        const total = data.reduce((sum, stake) => sum + Number(stake.stake_amount || 0), 0);
        setTotalStake(total);
  
        // ✅ Total stake count
        setTotalStakeCount(data.length);
  
        // ✅ Total earnings (0.5% per day for 200 days)
        const earnings = data.reduce((sum, stake) => sum + Number(stake.stake_amount || 0) * DAILY_RETURN_PERCENT * 200, 0);
        setTotalEarnings(earnings);
  
        // ✅ Last stake date
        const lastStakeDateFormatted = new Date(data[data.length - 1].timestamp).toLocaleDateString();
        setLastStakeDate(lastStakeDateFormatted);
  
        // ✅ Last stake's daily earnings
        const lastStake = Number(data[data.length - 1].stake_amount || 0);
        setDailyEarnings(lastStake * DAILY_RETURN_PERCENT);
      } catch (error) {
        console.error("Error fetching staking data:", error);
      }
    };
  
    useEffect(() => {
      document.title = "Stake USDT - Aegis AI Coin";
  
      const fetchData = async () => {
        try {
          const web3 = await initWeb3();
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            await fetchStakingData(accounts[0]);
          }
        } catch (error) {
          console.error("Error initializing web3:", error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <>
        {/* Staking Info Box */}
        <div className="flex flex-col justify-between items-center px-3 py-3 bg-dashboard-box rounded-3xl border border-gray-600 gap-3">
          <div className="flex w-full justify-between items-center mb-3">
            <span className="text-sm">Your Active Stakings</span>
            <div className="flex gap-2 bg-footerMenu w-fit p-1.5 px-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3" viewBox="0 0 32 32">
                <g fill="none" fillRule="evenodd">
                  <circle cx={16} cy={16} r={16} fill="#26a17b"></circle>
                  <path
                    fill="#fff"
                    d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042c-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658s2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061c1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658c0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118s3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116s-3.301-1.914-7.694-2.117"
                  ></path>
                </g>
              </svg>
              <span className="text-xs">{totalStakeCount} Staking</span>
            </div>
          </div>
  
          {stakeHistory.length === 0 ? (
            <p>No Staking History available</p>
          ) : (
            stakeHistory.map((entry, index) => (
              <div className="relative" key={index}>
                <div className="absolute -top-2 end-6">
                  <div className="flex gap-2">
                    <span className="bg-[#0E896A] text-white/85 text-[8px] font-medium px-2.5 rounded-full flex items-center">
                      Active
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 bg-footerMenu rounded-3xl pl-4 pb-0 pt-2">
                  <div className="flex flex-col gap-1 justify-center">
                    <div className="flex gap-1 w-fit">
                      <span className="text-[11px] text-white/65">Total Staking</span>
                    </div>
                    <span className="text-2xl font-bold leading-8 text-blueNeon">
                      {Number(entry.stake_amount).toFixed(2)}
                    </span>
                    <span className="text-[6px] text-white/50">
  Stake date: {new Date(entry.timestamp).toLocaleString()}
</span>

                  </div>
  
                  <div className="flex flex-col justify-center pl-5 gap-3">
                    <div className="flex flex-col leading-none">
                      <span className="text-[10px] text-white/50">You will get</span>
                      <span className="text-xs font-bold text-white/90">
                        {(Number(entry.stake_amount) * 2).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="py-2 pr-2 pb-0">
                    <img src="/lockcoin.png" alt="" className="w-20" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );
  };
  
  const tabs = [
    { id: 1, label: "Stake", content: <Staking /> },
    { id: 2, label: "Stack History", content: <UnStake /> }
  ];

  return (
    <>
      <div className=" min-h-screen text-white">
        <Header />

        {/* Stake/Unstake Tabs */}
        <div className="flex flex-wrap justify-center  rounded-[20px]   p-1.5 px-3 mx-3 mt-2   bg-box">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex-1 flex gap-1 items-center justify-center text-sm font-medium h-8 px-3 text-center rounded-2xl whitespace-nowrap focus-visible:outline-none focus-visible:ring ring-indigo-300 transition-colors duration-150 ease-in-out    ${
                activeTab === tab.id
                  ? "bg-blueLight text-slate-50"
                  : "text-slate-200 hover:text-slate-50"
              }`}
            >
              {tab.label}
              {tab.button}
            </motion.button>
          ))}
        </div>
        <div className="pb-16">
          <div className=" w-[90%] h-auto overflow-visible   max-w-md    rounded-3xl shadow-lg mx-auto my-6 mb-8  whitespace-nowrap ">
            {/* Animated Tab Content */}
            <div className="">
              {tabs.map(
                (tab) =>
                  activeTab === tab.id && (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                    >
                      {tab.content}
                    </motion.div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StakePage;
