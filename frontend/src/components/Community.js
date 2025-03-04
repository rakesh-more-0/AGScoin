// src/components/StakePage.js
import React, { useState } from "react";
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

const Community = () => {
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

  const Withdraw = () => {
    return (
      <>
        {/* Staking Input */}
        <div className="flex flex-col gap-8 py-3 bg-gradient-to-br from-blueLight from-30% to-blueDark overflow-auto rounded-3xl border border-gray-600">
          <div className="relative">
            <div className="px-7 relative ">
              <span className="text-2xl font-semibold mb-4">Earn AGS Coin</span>
            </div>
          </div>

          <div className="px-3">
            <div className="flex justify-end items-center">
              <div className="flex items-center text-white/90 gap-1">
                <span className="text-xs px-3 pb-1">Balance: 0 USDT</span>
              </div>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                class="block w-full p-4 px-12 text-2xl leading-none font-bold bg-input text-white border border-[#00EAD6] rounded-2xl  "
                placeholder="0"
                required
              />

              <span className="absolute end-2.5 bottom-4 text-white/60">
                MAX
              </span>
            </div>
          </div>
          <div className="px-3">
            <div className="flex justify-end items-center">
              <div className="flex items-center text-white/90 gap-1">
                <span className="text-xs px-3 pb-1">Balance: 0 AGS</span>
              </div>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <img src={coin} className="w-7" alt="coin" />
              </div>
              <input
                type="number"
                id=""
                class="block w-full p-4 px-12 text-2xl leading-none font-bold bg-input text-white border border-[#00EAD6] rounded-2xl  "
                placeholder="0"
                required
              />

              <span className="absolute end-2.5 bottom-4 text-white/60">
                MAX
              </span>
            </div>
          </div>
          {/* Convert Button */}
          <div className="px-3 mx-4">
            <div className="px-4 mb-5 flex justify-center">
              <span className="text-xs">
                You will receive
                <span className="text-[#00EAD6] font-semibold">
                  {" "}
                  2564 AGS Coins{" "}
                </span>
                in Wallet
              </span>
            </div>
            <button className="w-full text-white bg-buttonBlue shadow-md shadow-buttonBlue   font-medium rounded-xl text-lg px-5 py-3.5 text-center me-2 mb-2">
              Claim AGS Coins
            </button>
          </div>
        </div>
      </>
    );
  };

  const WithdrawHistory = () => {
    return (
      <>
        {/* Staking Input */}
        <div>
          <div className="flex flex-col justify-between items-center px-3 py-3 bg-dashboard-box rounded-3xl border border-gray-600 gap-3">
            <div className="flex w-full justify-between items-center mb-3">
              <span className="text-sm">Your Active Stakings</span>
              <div class="flex gap-2 bg-footerMenu  w-fit p-1.5 px-3 rounded-full ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3"
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
                <span class="text-xs ">10,000 Staking</span>
              </div>
            </div>
            {/* Staking history box */}
            <div className="relative">
              <div className="absolute -top-2 end-6">
                <div className="flex gap-2">
                  <span class="bg-[#0E896A] text-white/85 text-[8px] font-medium  px-2.5  rounded-full flex items-center">
                    Active
                  </span>
                  <div class="bg-[#00223A] text-white text-[10px] font-medium  px-2.5 py-0.5  rounded-full flex gap-1">
                    <img src={coin} className="w-3 h-3" alt="" />
                    <span className="leading-3 text-white/85 text-[8px] font-medium ">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 bg-footerMenu rounded-3xl pl-4 pb-0 pt-1.5">
                <div className="flex flex-col gap-1 justify-center">
                  <div class="flex gap-1   w-fit  ">
                    <img src={usdt} className="w-4" alt="" />
                    <span class="text-xs text-white/65 ">Total Staking</span>
                  </div>

                  <span className="text-4xl font-bold leading-8 text-blueNeon">
                    5,000
                  </span>

                  <span className="text-[6px] text-white/50 ">
                    Stake date: June 6, 2502 | 05:00 PM
                  </span>
                </div>

                <div className="flex flex-col justify-center pl-5 gap-3">
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-white/50">
                      Maturity Date
                    </span>
                    <span className="text-xs font-bold text-white/90">
                      5 Mar 2025
                    </span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-white/50">
                      You will get
                    </span>
                    <span className="text-xs font-bold text-white/90">
                      10,000
                    </span>
                  </div>
                </div>
                <div className="py-2 pr-2 pb-0">
                  <img src={lockcoin} alt="" className="w-24" />
                </div>
              </div>
            </div>
            {/* Staking history box */}
            <div className="relative">
              <div className="absolute -top-2 end-6">
                <div className="flex gap-2">
                  <span class="bg-[#0E896A] text-white/85 text-[8px] font-medium  px-2.5  rounded-full flex items-center">
                    Active
                  </span>
                  <div class="bg-[#00223A] text-white text-[10px] font-medium  px-2.5 py-0.5  rounded-full flex gap-1">
                    <img src={coin} className="w-3 h-3" alt="" />
                    <span className="leading-3 text-white/85 text-[8px] font-medium ">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 bg-footerMenu rounded-3xl pl-4 pb-0 pt-1.5">
                <div className="flex flex-col gap-1 justify-center">
                  <div class="flex gap-1   w-fit  ">
                    <img src={usdt} className="w-4" alt="" />
                    <span class="text-xs text-white/65 ">Total Staking</span>
                  </div>

                  <span className="text-4xl font-bold leading-8 text-blueNeon">
                    5,000
                  </span>

                  <span className="text-[6px] text-white/50 ">
                    Stake date: June 6, 2502 | 05:00 PM
                  </span>
                </div>

                <div className="flex flex-col justify-center pl-5 gap-3">
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-white/50">
                      Maturity Date
                    </span>
                    <span className="text-xs font-bold text-white/90">
                      5 Mar 2025
                    </span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-white/50">
                      You will get
                    </span>
                    <span className="text-xs font-bold text-white/90">
                      10,000
                    </span>
                  </div>
                </div>
                <div className="py-2 pr-2 pb-0">
                  <img src={lockcoin} alt="" className="w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const tabs = [
    { id: 1, label: "Withdraw", content: <Withdraw /> },
    { id: 2, label: "Withdraw History", content: <WithdrawHistory /> }
  ];

  return (
    <>
      <div className=" min-h-screen text-white">
        <Header />
        <div>
          <div className="flex flex-col justify-between py-4 bg-box rounded-3xl  p-1.5 px-3 mx-3 mt-2 ">
            <div className="flex items-center gap-3 mb-2">
              <img src={lock} alt="" className="w-14" />
              <div className="flex flex-col leading-2">
                <span className="text-md font-bold">Community</span>
                <span className="text-white/50">Total users referred</span>
              </div>
            </div>
            <div className="mb-1">
              <div className="grid grid-cols-2 divide-x divide-gray-400/50 border border-gray-400/50 rounded-2xl overflow-auto">
                <div className="flex flex-col items-center p-2 bg-[#121D2F] ">
                  <span className="font-semibold text-2xl">54</span>
                  <span className="text-white/40">New</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-[#121D2F] ">
                  <span className="font-semibold text-2xl">54</span>
                  <span className="text-white/40">Total</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 my-1 mx-3">
              <div className="flex justify-center items-center">
                <div class="flex items-center gap-2 bg-[#272C37] w-full p-1.5 px-3 rounded-xl ">
                  <img src={usdt} className="w-5 h-5" alt="" />
                  <span class="text-lg font-semibold ">554.03</span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div class="flex items-center gap-2 bg-[#272C37] w-full p-1.5 px-3 rounded-xl ">
                  <img src={usdt} className="w-5 h-5" alt="" />
                  <span class="text-lg font-semibold ">554.03</span>
                </div>
              </div>
              
            </div>
          </div>
            
        </div>

        {/* Stake/Unstake Tabs */}
        {/* <div className="flex flex-wrap justify-center  rounded-3xl   p-1.5 px-3 mx-3 mt-2   bg-box">
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
        </div> */}
        {/* <div className="pb-16">
          <div className=" w-[90%] h-auto overflow-visible   max-w-md    rounded-3xl shadow-lg mx-auto my-6 mb-8  whitespace-nowrap ">
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
        </div> */}
      </div>
      <Footer />
    </>
  );
};

export default Community;
