// src/components/StakePage.js
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getContract } from "../utils/contract"; // Import the getContract function
import "./StakePage.css"; // Import the CSS for the page
import Footer from "./Footer";
// import whitelogo from "../assets/logo/logo-white.png";
// import lock from "../assets/lock.png";
// import shield from "../assets/shield.png";
// import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import coin from "../assets/coinAnimation.png";
import Header from "./Header";
import lockcoin from "../assets/dashboard/lockcoin.png";
import usdt from "../assets/images/usdt.png";
import Web3 from "web3";
import initWeb3 from "../web3";

const Withdrawal = () => {
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
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [usdtBalance, setUsdtBalance] = useState(0);
    const [macBalance, setMacBalance] = useState(0);
    const [macToUsdtRate, setMacToUsdtRate] = useState(0);
    const [account, setAccount] = useState(null);

    const contractAddress = "0x2ca7ecC1Eb21B0B8427E5262273a05392F0Ed388"; // Your staking contract address
    const macAddress = "0x480776744296c7A78bd85Dc48E071554e5B35C74"; // MAC Coin contract address on BSC
    const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT on BSC

    const checkBalance = async (web3, tokenAddress, userAddress) => {
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

      const balance = await tokenContract.methods.balanceOf(userAddress).call();
      return balance;
    };

    const fetchUserData = async (web3, account) => {
      try {
        setLoading(true);
        setMessage("Fetching data...");

        // Fetch USDT and MAC Coin balances
        const usdtBalance = await checkBalance(web3, usdtAddress, account);
        const macBalance = await checkBalance(web3, macAddress, account);

        setUsdtBalance(Web3.utils.fromWei(usdtBalance, "ether"));
        setMacBalance(Web3.utils.fromWei(macBalance, "ether"));

        // Fetch user's earnings from the staking contract (customize this based on your contract's methods)
        const stakingContract = new web3.eth.Contract(
          [
            // Add the ABI of your staking contract here
            {
              constant: true,
              inputs: [{ name: "_user", type: "address" }],
              name: "getUserEarnings",
              outputs: [{ name: "", type: "uint256" }],
              payable: false,
              stateMutability: "view",
              type: "function"
            }
          ],
          contractAddress
        );

        const earnings = await stakingContract.methods
          .getUserEarnings(account)
          .call();
        setTotalEarnings(Web3.utils.fromWei(earnings, "ether"));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to fetch user data.");
      }
      setLoading(false);
    };

    const getMacToUsdtRate = async () => {
      const web3 = await initWeb3();
      const pancakeSwapRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // PancakeSwap Router Contract Address

      const routerABI = [
        {
          constant: true,
          inputs: [
            { name: "amountIn", type: "uint256" },
            { name: "path", type: "address[]" }
          ],
          name: "getAmountsOut",
          outputs: [{ name: "", type: "uint256[]" }],
          payable: false,
          stateMutability: "view",
          type: "function"
        }
      ];

      const routerContract = new web3.eth.Contract(
        routerABI,
        pancakeSwapRouter
      );
      const path = [usdtAddress, macAddress]; // Path from USDT to MAC Coin

      try {
        const amountInWei = Web3.utils.toWei("1", "ether");
        const amountsOut = await routerContract.methods
          .getAmountsOut(amountInWei, path)
          .call();
        const rate = Web3.utils.fromWei(amountsOut[1], "ether");
        setMacToUsdtRate(rate); // Store the MAC to USDT rate
      } catch (error) {
        console.error("Error fetching rate from PancakeSwap:", error);
        setMessage("Failed to fetch exchange rate.");
      }
    };

    const connectWallet = async () => {
      const web3 = await initWeb3();
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      // Fetch the data for the connected wallet
      fetchUserData(web3, accounts[0]);
    };

    const withdraw = async () => {
      const web3 = await initWeb3();

      try {
        setLoading(true);
        setMessage("Checking balance...");

        // Validate withdraw amount
        if (parseFloat(withdrawAmount) > totalEarnings) {
          setMessage(
            `You do not have enough earnings to withdraw ${withdrawAmount} USDT.`
          );
          setLoading(false);
          return;
        }

        const withdrawAmountInUsdt = Web3.utils.toWei(withdrawAmount, "ether");
        const amountInMac = withdrawAmountInUsdt * macToUsdtRate;

        const withdrawAmountInMacWei = Web3.utils.toWei(
          amountInMac.toString(),
          "ether"
        );

        const contractABI = [
          {
            constant: false,
            inputs: [
              { internalType: "uint256", name: "amount", type: "uint256" }
            ],
            name: "withdraw",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function"
          }
        ];

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        setMessage("Processing withdrawal...");
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods
          .withdraw(withdrawAmountInMacWei)
          .estimateGas({ from: account });

        await contract.methods.withdraw(withdrawAmountInMacWei).send({
          from: account,
          gas: gasEstimate,
          gasPrice: gasPrice
        });

        setMessage("Withdrawal successful!");
        fetchUserData(web3, account); // Refresh earnings after withdrawal
      } catch (error) {
        setMessage("Withdrawal failed: " + error.message);
      }
      setLoading(false);
    };

    useEffect(() => {
      if (window.ethereum) {
        connectWallet(); // Automatically connect wallet if it's available
      }
    }, []);

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
                <span className="text-xs px-3 pb-1">Balance: {totalEarnings} USDT</span>
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
                class="block w-full p-4 px-12 text-md leading-none font-bold bg-input text-white border border-[#00EAD6] rounded-2xl  "
                placeholder="Enter amount to withdraw"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
              />

              <span className="absolute end-2.5 bottom-4 text-white/60">
                MAX
              </span>
            </div>
              <p>{message}</p>
              <p className="hidden">Your USDT Balance: {usdtBalance} USDT</p>
          <p className="hidden">Your AGS Balance: {macBalance} AGS</p>
          <h4 className="hidden">Live AGS to USDT rate: 1 USDT = {macToUsdtRate} AGS</h4>
          </div>

          {/* Convert Button */}
          <div className="px-3 mx-4">
            <div className="px-4 mb-5 flex justify-center hidden">
              <span className="text-xs">
                You will receive
                <span className="text-[#00EAD6] font-semibold">
                  {" "}
                  2564 AGS Coins{" "}
                </span>
                in Wallet
              </span>
            </div>
            <button
              className="w-full text-white bg-buttonBlue shadow-md shadow-buttonBlue   font-medium rounded-xl text-lg px-5 py-3.5 text-center me-2 mb-2"
              onClick={withdraw}
              disabled={loading}
            >
              {loading ? "Processing..." : " Claim AGS Coins"}
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
              <span className="text-sm">Your Active Withdrawal</span>
              <div class="flex gap-2 bg-footerMenu  w-fit p-1.5 px-3 rounded-full ">
                <img src={usdt} className="w-4" alt="" />
                <span class="text-xs ">0</span>
              </div>
            </div>
            {/* Staking history box */}
            <div className="relative hidden">
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

export default Withdrawal;
