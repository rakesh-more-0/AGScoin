import bgRectangle from "../assets/background/Rectangle.png";
import coin from "../assets/coinAnimation.png";
import owl from "../assets/logo/blueowl1.png";
import treasure from "../assets/dashboard/treasure.png";
import user from "../assets/dashboard/usermacc.png";
import Footer from "../components/Footer";
import "../components/CoinAnimation.css";
import "../components/Dashboard.css";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useRef } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import usdtcoinglass from "../assets/images/usdtcoinglass.png";
import badge from "../assets/images/badge.png";
// import { RWebShare } from "react-web-share";
import Web3 from "web3";
import initWeb3 from "../web3";
import React, { useState, useEffect } from "react";
import lockcoin from "../assets/dashboard/lockcoin.png";
import usdt from "../assets/images/usdt.png";
import FlipNumbers from "react-flip-numbers";
import axios from "axios"; 


function Dashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  
  useEffect(() => {
    const address = localStorage.getItem("walletAddress");


    setWalletAddress(address);
  });
  // console.log(walletAddress);

  const audioRef = useRef(null);
  const history = useHistory(); // To navigate back to the login page
  const contractAddress = "0x2ca7ecC1Eb21B0B8427E5262273a05392F0Ed388"; // Your contract address
  const macToUSDTConversionRate = 0.0005; // 1 MAC = 0.00005 USDT (Adjust if needed)
  const macDecimals = 18; // Assuming MAC has 18 decimals
  const dailyReturnRate = 0.5 / 100; // 0.5% per day
  const hourlyReturnRate = dailyReturnRate / 24; // Hourly reward rate


  const contractABI = [
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "stakes",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dailyRewardPercentage",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "users",
      "outputs": [
        { "internalType": "uint256", "name": "totalReturn", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "referralCount",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "referrer",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  const handleCoinToss = () => {
    if (audioRef.current) {
      audioRef.current.play();

      // Navigate to the stake page after the audio ends
      audioRef.current.onended = () => {
        history.push("/stake"); // Use history.push for navigation
      };
    }
    console.log("Coin Tossed!");
  };
  const API_URL = process.env.REACT_APP_API_URL;
  
  console.log("app url ", API_URL);
  const handleCopy = () => {
    const urlToCopy = "https://maccoin.io/register?ref=" + walletAddress; // Replace with the URL you want to copy
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        toast.success("Copied to clipboard!", {}); // Show success toast
      })
      .catch(() => {
        toast.error("Failed to copy.", {}); // Show error toast
      });
  };
  const [stakeData, setStakeData] = useState({ stakeAmount: "0", stakeCount: "0" });
  const [LevelData, setLevelData] = useState({ levelearning: "0", LevelCount: "0" });
  
  const [stakeDetails, setStakeDetails] = useState({
    dailyReturn: "0",
    totalStake: "0",
    totalEarnings: "0",
    totalDirectReferrals: "0",
    totalReferralTeam: "0",
    totalTeamBusiness: "0",
    totalDirectBusiness: "0",
    stakeAmount: "0", 
    stakeCount: "0"
  });
  const [message, setMessage] = useState("");

    useEffect(() => {
      const fetchDetails = async () => {
        try {
          const web3 = await initWeb3();
          const accounts = await web3.eth.getAccounts();
          const userAddress = accounts[0];
    
          if (!userAddress) {
            setMessage("Wallet not connected!");
            return;
          }
    
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          console.log("🔍 Fetching data for:", userAddress);
    
          // **Declare Variables**
          let totalStakeUSDT = "0";
          let dailyReturn = "0";
          let totalReturnUSDT = "0";
          let totalDirectReferrals = "0";
          let totalDirectBusiness = "0";
          let totalTeamBusiness = "0";
          let stakeHistory = [];
          let totalStakeFromDB = 0;
          let totalEarningsFromDB = 0;
          let totalStakeCount = 0;
          let lastStakeDate = "";
          let lastStakeEarnings = 0;
          const DAILY_RETURN_PERCENT = 0.5 / 100; // 0.5% daily return
          // ✅ Fetch Total Staked from Smart Contract
          try {
            const totalStakeRaw = await contract.methods.stakes(userAddress).call();
            const stakedMAC = parseFloat(totalStakeRaw) / Math.pow(10, macDecimals);
            totalStakeUSDT = stakedMAC * macToUSDTConversionRate;
            console.log("✅ Total Staked (USDT):", totalStakeUSDT);
          } catch (error) {
            console.error("🚨 Error fetching total stake:", error.message);
          }
    
          // ✅ Fetch Daily Return
          try {
            const dailyReturnRaw = await contract.methods.dailyRewardPercentage().call();
            dailyReturn = (parseFloat(dailyReturnRaw) / 100).toString();
            console.log("✅ Daily Return Percentage:", dailyReturn);
          } catch (error) {
            console.error("🚨 Error fetching daily return:", error.message);
          }
    
          // ✅ Fetch Total Earnings from Smart Contract
          try {
            const userDetails = await contract.methods.users(userAddress).call();
            if (userDetails && userDetails.totalReturn) {
              totalReturnUSDT = Web3.utils.fromWei(userDetails.totalReturn, "mwei");
              console.log("✅ Total Earnings (USDT):", totalReturnUSDT);
            } else {
              console.warn("⚠️ No earnings found for this user.");
            }
          } catch (error) {
            console.error("🚨 Error fetching total earnings:", error.message);
          }
    
          // ✅ Fetch Total Direct Referrals
          try {
            const referrals = await contract.methods.referralCount(userAddress).call();
            totalDirectReferrals = referrals.toString();
            console.log("✅ Total Direct Referrals:", totalDirectReferrals);
          } catch (error) {
            console.error("🚨 Error fetching referral count:", error.message);
          }
    
          // ✅ Fetch Staking Data from Database
          try {
            const response = await axios.get(`${API_URL}/getStakingData/${userAddress}`);
            const data = response.data;
    
            console.log("📊 Staking data from DB:", data);
    
            if (Array.isArray(data) && data.length > 0) {
              stakeHistory = data;
              totalStakeFromDB = data.reduce((sum, stake) => sum + Number(stake.stake_amount || 0), 0);
              totalStakeCount = data.length;
              totalEarningsFromDB = data.reduce(
                (sum, stake) => sum + Number(stake.stake_amount || 0) * DAILY_RETURN_PERCENT * 200,
                0
              );
              lastStakeDate = new Date(data[data.length - 1].timestamp).toLocaleDateString();
              lastStakeEarnings = Number(data[data.length - 1].stake_amount || 0) * DAILY_RETURN_PERCENT;
            }
          } catch (error) {
            console.error("🚨 Error fetching staking data from database:", error);
          }

          try {
            const response = await axios.get(`${API_URL}/getStakingData/${userAddress}`);
            const data = response.data;
    
            console.log("📊 Staking data from DB:", data);
    
            if (Array.isArray(data) && data.length > 0) {
              stakeHistory = data;
              totalStakeFromDB = data.reduce((sum, stake) => sum + Number(stake.stake_amount || 0), 0);
              totalStakeCount = data.length;
              totalEarningsFromDB = data.reduce(
                (sum, stake) => sum + Number(stake.stake_amount || 0) * DAILY_RETURN_PERCENT * 200,
                0
              );
              lastStakeDate = new Date(data[data.length - 1].timestamp).toLocaleDateString();
              lastStakeEarnings = Number(data[data.length - 1].stake_amount || 0) * DAILY_RETURN_PERCENT;
            }
          } catch (error) {
            console.error("🚨 Error fetching staking data from database:", error);
          }

       
          try {
            const response = await axios.get(`${API_URL}/getReStakingData/${userAddress}`);
            const data = response.data;
    
            console.log("📊 gbStaking data from DB:", data);
            if (data.length > 0) {
              setStakeData({
                stakeAmount: data[0].stakeAmount,
                stakeCount: data[0].stakeCount,
              });
            }
        } catch (error) {
          console.error("🚨 Error fetching staking data from database:", error);
        }

        try {
          const response = await axios.get(`${API_URL}/getLevelEarningData/${userAddress}`);
          const data = response.data;
  
          console.log("📊 gblevelStaking data from DB:", data);
          if (data.length > 0) {
            setLevelData({
              levelearning: data[0].levelearning,
              levelCount: data[0].levelCount,
            });
          }
      } catch (error) {
        console.error("🚨 Error fetching staking data from database:", error);
      }
    
          // ✅ Calculate Total Team Business (Example)
          totalDirectBusiness = "0"; // Placeholder, adjust as needed
          totalTeamBusiness = (parseFloat(totalDirectReferrals) ).toString();
    
          // ✅ Update State with Combined Data
          setStakeDetails({
            dailyReturn,
            totalStake: totalStakeUSDT,
            totalEarnings: totalReturnUSDT,
            totalDirectReferrals,
            totalReferralTeam: totalDirectReferrals,
            totalTeamBusiness,
            totalDirectBusiness,
            stakeHistory, // Add history from DB
            totalStakeFromDB, // Add total stake from DB
            totalEarningsFromDB, // Add total earnings from DB
            totalStakeCount, // Add total stake count
            lastStakeDate, // Add last stake date
            lastStakeEarnings, // Add last stake earnings
          });
    
          console.log("✅ Data Updated Successfully!");
        } catch (error) {
          console.error("🚨 General Error fetching contract details:", error);
          setMessage("Failed to fetch details. Please try again.");
        }
      };
    
      fetchDetails();
    }, []);
    

  const timer = useRef(null);
  const [Earning, setEarning] = useState(
    (stakeDetails.totalStake * 0.5) / 100 / 24
  );

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setEarning((currentTime) => currentTime + Earning); // Add 0.021 every second
    }, 300000);

    return () => clearInterval(timer.current); // Cleanup interval on unmount
  }, []);

  const [liveEarnings, setLiveEarnings] = useState(0);

  useEffect(() => {
    if (!stakeDetails || !stakeDetails.lastStakeDate || !stakeDetails.totalStakeFromDB) return;

    const stakeAmount = stakeDetails.totalStakeFromDB * 2; // Total staking amount * 2
    const lastStakeTime = new Date(stakeDetails.lastStakeDate).getTime();
    const currentTime = new Date().getTime();
    const hoursPassed = (currentTime - lastStakeTime) / (1000 * 60 * 60); // Convert ms to hours

    const dailyRate = 0.5 / 100; // 0.5% per day
    const hourlyRate = dailyRate / 24; // Divide by 24 to get per hour rate
    const earnedAmount = stakeAmount * hourlyRate * hoursPassed; // Earnings till now

    setLiveEarnings(earnedAmount.toFixed(3));

    // Update earnings every hour
    const interval = setInterval(() => {
      setLiveEarnings((prev) => (parseFloat(prev) + stakeAmount * hourlyRate).toFixed(3));
    }, 3600000); // 1 hour in ms

    return () => clearInterval(interval);
  }, [stakeDetails]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-primary2 to-black text-white">
        {/* Header */}
        <Header />
        <div className="grid grid-col-2">
          <div className="grid grid-cols-2 px-1 ">
            <div className="relative px-2 pt-4">
              <img src={bgRectangle} className="w-full h-6" alt="" />
              <div className="w-full absolute top-0 h-7 bg-cover bg-center pt-4">
                <div className="grid grid-cols-2 justify-between ">
                  <div className="flex gap-1 p-1 items-center">
                    <img src={coin} className="w-4" alt="" srcSet="" />
                    <span className="text-[10px]">1 AGS</span>
                  </div>
                  <div className="flex gap-1 p-1 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-3"
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
                    <span className="text-[10px]">0.00002478</span>
                  </div>
                </div>
              </div>
              {/* Total Staked and Earnings */}
              <div className="grid grid-cols-2 py-4 mt-3 w-full">
                <div className="">
                  <p className="text-[11px] text-white">Total Staked</p>
                  <p className="text-2xl  font-medium">
                  {Math.floor(stakeDetails.totalStakeFromDB) }{" "}

                  </p>
                </div>
                <div className="">
                  <p className="text-[11px] text-white">LIVE Staking</p>
                  <div className="text-2xl font-medium">
        
                    <div className="flex justify-center items-center">
                      <FlipNumbers
                        height={20}
                        width={20}
                        className="counterblock text-sm md:text-md lg:text-xl" // Responsive font size
                        color="white"
                        play
                        duration={1}
                        perspective={400}
                          numbers={String(liveEarnings)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img src={owl} alt="Owl" srcSet={owl} />
            </div>
          </div>
        </div>

        <div className=" pt-1.5 rounded-t-3xl -mt-3 z-10 relative after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:-z-10 after:mx-auto after:bg-primary after:rounded-[2.1rem] ">
          <div className="bg-[#1C1F24] pt-3 rounded-t-[1.4rem] pb-16">
            {/* Referral Link */}
            <div className="flex justify-between items-center px-3 py-1.5 bg-dashboard-box rounded-2xl mx-4 mb-4  relative ">
              <span className="flex items-center text-xs font-bold  me-3">
                <span className="flex w-2.5 h-2.5 border border-green-200 bg-green-500 rounded-full me-1.5 flex-shrink-0 capitalize"></span>
                My Referral Link
              </span>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    className="bg-[#1C1F24] text-[11px] px-4 py-1.5 rounded-xl text-white"
                    onClick={handleCopy}
                  >
                    Copy
                  </button>
       
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between items-center px-3 py-3 bg-dashboard-box rounded-3xl mx-4  gap-3">
              <div className="relative w-full">
                
                <div className="grid grid-cols-3 bg-footerMenu rounded-3xl px-4 pb-0 pt-2">
                  <div className="flex flex-col gap-1 justify-center">
                    <div className="flex gap-1   w-fit  ">
                      <img src={usdt} className="w-4" alt="" />
                      <span className="text-[11px] text-white/65 ">
                        Total Staking
                      </span>
                    </div>

                    <span className="text-2xl font-bold leading-8 text-blueNeon">
                    {Math.floor(stakeDetails.totalStakeFromDB) }{" "}
                    </span>

                    <span className="text-[6px] text-white/50 hidden">
                      Stake date: {stakeDetails.lastStakeDate}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center pl-5 gap-3">
  <div className="flex flex-col leading-none">
    <div className="flex gap-1 w-fit">
      <span className="text-[11px] text-white/65">You will get</span>
    </div>
    <span className="text-2xl font-bold leading-8 text-blueNeon">
    {Math.floor(stakeDetails.totalStakeFromDB) * 2 - Number(liveEarnings)}
    </span>
  </div>
</div>

<div className="flex flex-col justify-center pl-5 gap-3">
  <div className="flex flex-col leading-none">
    <div className="flex gap-1 w-fit">
      <span className="text-[11px] text-white/65">Current Earning</span>
    </div>
    <span className="text-2xl font-bold leading-8 text-blueNeon">
      {String(liveEarnings)}
    </span>
  </div>
</div>



                  
                </div>
              </div>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-3 gap-4 px-4 py-2">
              <Link
                to="/profile"
                className="bg-dashboard-box text-center p-2 rounded-2xl flex flex-col items-center justify-between"
              >
                <img src={user} className="w-10" alt="" />
                <p className="text-[12px] mt-1">My Team</p>
              </Link>
              <Link
                to="/stake"
                className="bg-primary-gradient text-center p-2 rounded-2xl flex flex-col items-center justify-between"
                onClick={handleCoinToss}
              >
                <div className="pl">
                  <div className="pl__coin">
                    <div className="pl__coin-flare"></div>
                    <div className="pl__coin-flare"></div>
                    <div className="pl__coin-flare"></div>
                    <div className="pl__coin-flare"></div>
                    <div className="pl__coin-layers">
                      <div className="pl__coin-layer">
                        {/* <div className="pl__coin-inscription"></div> */}
                      </div>
                      <div className="pl__coin-layer"></div>
               
                    </div>
                  </div>
                  <div className="pl__shadow"></div>
                </div>
                <p className="text-[12px] mt-1">Start Staking</p>
                {/* Hidden audio element */}
                <audio ref={audioRef} src="/coin-flip.mp3" />
              </Link>
              <Link
                to="/withdrawal"
                className="bg-dashboard-box text-center p-2 rounded-2xl flex flex-col items-center justify-between"
              >
                <img src={treasure} className="w-18" alt="" />
                <p className="text-[12px] mt-1">Withdraw</p>
              </Link>
            </div>

            <div className="flex gap-4 px-4 py-2">
              <div className="bg-dashboard-box  p-4 pb-3 flex flex-col  rounded-2xl w-3/5 relative">
                <p className="text-[9px]">Total USDT Staking </p>
                <p className="text-2xl font-medium text-[#00EAD6]">
                {Math.floor(stakeDetails.totalStakeFromDB) }{" "}
                </p>
                <div>
                  <img
                    src={usdtcoinglass}
                    className="w-16 absolute bottom-0 end-0"
                    alt=""
                  />
                </div>
              </div>
              <div className="bg-dashboard-box text-center p-2 flex flex-col justify-end w-2/5 rounded-2xl relative">
                <div className="flex justify-center">
                  <img src={badge} className="w-12 absolute -top-3 " alt="" />
                </div>
                <p className="text-xs">
                  <span className="font-bold">{stakeDetails.totalStakeCount}</span> Active Staking
                </p>
              </div>
            </div>
       
            {/* Trackers */}
            <div className="px-7 my-3 relative">
              <p className="font-semibold text-gray-300 text-sm">
                Affiliate Activity Tracker
              </p>
            </div>
            <div className="flex">
              <div className="grid grid-cols-2 gap-2 gap-x-4 px-4 py-4 pt-0 w-4/5 ">
                <div className="bg-dashboard-box text-center p-2 flex flex-col  rounded-2xl">
                  <p className="text-2xl font-medium">
                    {Math.floor(stakeDetails.totalReferralTeam)}
                  </p>
                  <p className="text-[9px]">Total Team</p>
                </div>
                <div className="bg-dashboard-box text-center p-2 flex flex-col  rounded-2xl">
                  <p className="text-2xl font-medium">
                  {Math.floor(LevelData.levelearning)}
                  </p>
                  <p className="text-[9px]">Team Business</p>
                </div>
                <div className="bg-dashboard-box text-center p-2 flex flex-col  rounded-2xl">
                  <p className="text-2xl font-medium">
                    {Math.floor(stakeDetails.totalDirectReferrals)}
                  </p>
                  <p className="text-[9px]">Total Directs</p>
                </div>
                <div className="bg-dashboard-box text-center p-2 flex flex-col  rounded-2xl">
                  <p className="text-2xl font-medium">
                  {Math.floor(LevelData.levelearning)}
                  </p>
                  <p className="text-[9px]">Direct Business</p>
                </div>
              </div>
              <div className=" w-full h-44 overflow-hidden w-100 absolute">
                <img
                  src={coin}
                  className="w-32 absolute top-0 -right-12"
                  alt=""
                />
              </div>
            </div>
            <div className="px-7 my-3 ">
              <p className="font-semibold text-gray-300 text-sm">
                Total Level Tracker
              </p>
            </div>
            <div className=" grid grid-cols-2 gap-4 px-4 py-4 pt-0 w-4/5">
              <div className="bg-dashboard-box text-center p-2 flex flex-col rounded-lg">
                <p className="text-2xl font-medium">{Math.floor(stakeData.stakeAmount)}</p>
                <p className="text-[10px]">50% Restake Amount</p>
              </div>
              <div className="bg-dashboard-box text-center p-2 flex flex-col rounded-lg">
                <p className="text-2xl font-medium">{Math.floor(LevelData.levelearning)}</p>
                <p className="text-[10px]">50% Level Earning</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <Toaster
        position="top-center " // Move toast to the bottom-center
        reverseOrder={false}
        gutter={5}
        containerClassName=""
        containerStyle={
          {
            // Add any styles for the container if needed
          }
        }
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff"
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black"
            }
          }
        }}
      />
    </>
  );
}

export default Dashboard;
