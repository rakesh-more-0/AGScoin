import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";
import Header from "../components/Header.js";
import usdt from "../assets/images/usdt.png";
import coin from "../assets/coinAnimation.png";
import Web3 from "web3";
import initWeb3 from "../web3";

import owl from "../assets/logo/blueowl1.png";

function Profile() {
  const [web3, setWeb3] = useState(null); // Store web3 instance
  const [referralData, setReferralData] = useState({
    walletAddress: "",
    totalReferrals: 0,
    totalStaking: "0",
    totalWithdrawal: "0",
    totalIncome: "0",
    levelDetails: [],
    referralLink: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralAndLevelData = async () => {
      try {
        const web3Instance = await initWeb3();
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        const userAddress = accounts[0];

        const contractAddress = "0xFe3d12CFD9590A17334247Eb410fcC7324Aa7d7d"; // Your contract address
        const contractABI = [
          {
            constant: true,
            inputs: [{ internalType: "address", name: "userAddress", type: "address" }],
            name: "referralCount",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function"
          },
          {
            constant: true,
            inputs: [{ internalType: "address", name: "userAddress", type: "address" }],
            name: "getReferralDetails",
            outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
            payable: false,
            stateMutability: "view",
            type: "function"
          }
        ];

        const contract = new web3Instance.eth.Contract(contractABI, contractAddress);

        let referralCount = 0;
        let referralDetails = Array(13).fill("0"); // Default array for referral details

        try {
          referralCount = await contract.methods.referralCount(userAddress).call();
          referralDetails = await contract.methods.getReferralDetails(userAddress).call();
        } catch (error) {
          console.warn("No referral data found for this wallet. Defaulting to 0.");
        }

        const totalIncome = web3Instance.utils.fromWei(referralDetails[0] || "0", "ether");
        const totalStaking = web3Instance.utils.fromWei(referralDetails[11] || "0", "ether");
        const totalWithdrawal = web3Instance.utils.fromWei(referralDetails[12] || "0", "ether");

        // Calculate Total Earnings from all referral levels
        const totalEarnings = web3Instance.utils.fromWei(
          (parseFloat(referralDetails[2] || "0") +
            parseFloat(referralDetails[4] || "0") +
            parseFloat(referralDetails[6] || "0") +
            parseFloat(referralDetails[8] || "0") +
            parseFloat(referralDetails[10] || "0")).toString(),
          "ether"
        );

        // Fetch level staking data from MySQL API
        let levelStakingData = [];
        try {
          const response = await fetch(`http://localhost:5000/getLevelStakingData/${userAddress}`);
          if (response.ok) {
            levelStakingData = await response.json();
          } else {
            console.warn("No level staking data found for this wallet.");
          }
        } catch (error) {
          console.error("Error fetching level staking data:", error);
        }

        const levelStakingMap = levelStakingData.reduce((acc, item) => {
          acc[item.level] = (acc[item.level] || 0) + parseFloat(item.amount);
          return acc;
        }, {});
console.log("Level Staking Map:", levelStakingData);

        // Updated level details with staking amounts
        const levelDetails = [
          {
            level: 1,
            referrals: levelStakingData?.[0]?.totalcount || "0",
            percentage: 10,
            earnings: levelStakingData?.[0]?.totalamount || "0",
            staking: levelStakingMap[1] || 0, // Add staking amount for level 1
            status: "Active"
          },
          {
            level: 2,
            referrals: levelStakingData?.[1]?.totalcount || "0",
            percentage: 5,
            earnings: levelStakingData?.[1]?.totalamount || "0",
            staking: levelStakingMap[2] || 0, // Add staking amount for level 2
            status: "Active"
          },
          {
            level: 3,
            referrals: levelStakingData?.[2]?.totalcount || "0",
            percentage: 3,
            earnings: levelStakingData?.[2]?.totalamount || "0",
            staking: levelStakingMap[3] || 0, // Add staking amount for level 3
            status: "Active"
          },
          {
            level: 4,
            referrals: levelStakingData?.[3]?.totalcount || "0",
            percentage: 2,
            earnings: levelStakingData?.[3]?.totalamount || "0",
            staking: levelStakingMap[4] || 0, // Add staking amount for level 4
            status: "Active"
          },
          {
            level: 5,
            referrals: levelStakingData?.[4]?.totalcount || "0",
            percentage: 1,
            earnings: levelStakingData?.[4]?.totalamount || "0",
            staking: levelStakingMap[5] || 0, // Add staking amount for level 5
            status: "Active"
          }
        ];
        
        console.log("Referral Data:", {
          walletAddress: userAddress,
          totalReferrals: referralCount,
          totalIncome,
          totalEarnings,
          totalStaking,
          totalWithdrawal,
          levelDetails, // Logging level-wise referral and earnings data
          levelStakingData
        });

        // Update the state with both referral and level staking data
        setReferralData({
          walletAddress: userAddress,
          totalReferrals: referralCount,
          totalIncome,
          totalEarnings, // Total earnings from all levels
          totalStaking,
          totalWithdrawal,
          levelDetails,
          levelStakingData // Store level staking data fetched from MySQL
        });

      } catch (error) {
        console.error("Error fetching referral and level staking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralAndLevelData();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className=" min-h-screen text-white">
        <Header />
        <div className="pb-20">
          <div className="flex flex-col justify-between py-4 bg-box rounded-3xl  p-1.5 px-3 mx-3 mt-2 ">
            <div class=" relative mb-3">
              <span class="text-xl font-semibold mb-4">Global Community</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* <div class="flex ">
                <div class="flex flex-col  bg-footerMenu w-full p-1.5 px-3 rounded-2xl ">
                  <div>
                    <span className="text-xs font-semibold">
                      Affiliate Earning
                    </span>
                  </div>
                  <div className="flex items-center  gap-2">
                    <img class="w-6 h-6" alt="" src={usdt} />
                    <span class="text-2xl font-semibold text-blueNeon">
                      ${referralData.totalIncome}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex ">
                <div class="flex flex-col  bg-gradient-to-tr from-blueLight from-30% to-blueDark w-full p-1.5 px-3 rounded-2xl ">
                  <div>
                    <span className="text-xs font-semibold">
                      50% to Staking Pool
                    </span>
                  </div>
                  <div className="flex items-center  gap-2">
                    <img class="w-6 h-6" alt="" src={coin} />
                    <span class="text-2xl font-semibold text-blueNeon">
                      ${referralData.totalStaking}
                    </span>
                  </div>
                </div>
              </div> */}
              <div class="flex ">
                <div class="flex flex-col  bg-footerMenu w-full p-1.5 px-3 rounded-2xl ">
                  <div>
                    <span className="text-xs font-semibold">
                      Total Referrals
                    </span>
                  </div>
                  <div className="flex items-center  gap-2">
                    <img class="w-6 h-6" alt="" src={usdt} />
                    <span class="text-2xl font-semibold text-blueNeon">
                      {referralData.totalReferrals}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex ">
                <div class="flex flex-col  bg-gradient-to-tr from-blueLight from-30% to-blueDark w-full p-1.5 px-3 rounded-2xl ">
                  <div>
                    <span className="text-xs font-semibold">
                      Total Withdrawals
                    </span>
                  </div>
                  <div className="flex items-center  gap-2">
                    <img class="w-6 h-6" alt="" src={coin} />
                    <span class="text-2xl font-semibold text-blueNeon">
                      {referralData.totalWithdrawal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class=" relative  mt-3 ">
              <span class="text-lg font-semibold mb-4">
                Affiliate Allocation
              </span>
            </div>
            {/* Tiers */}

            {referralData.levelDetails.map((level) => (
              <div
                class={`flex flex-col  bg-footerMenu w-full p-1.5 px-3 rounded-2xl mt-3 border ${level.status === "Active"
                    ? "border-green-600"
                    : "border-red-600"
                  } relative`}
                key={level.level}
              >
                <div className="absolute -top-1.5 end-3">
                  <div className="flex gap-2">
                    <span className="bg-[#0E896A] text-white/85 text-[8px] font-medium  px-2.5  rounded-full flex items-center">
                      Tier {level.level}
                    </span>
                  </div>
                </div>
                <span class=" w-5 h-5 rounded-full absolute -top-2 end-0"></span>
                <div className="grid grid-cols-3 items-center px-1">
                  <span class="text-5xl font-semibold text-blueNeon">
                    {level.percentage}%
                  </span>
                  <div class="flex flex-col  bg-footerMenu w-full p-1.5 px-1 rounded-xl ">
                    <span className="text-xs text-white/50 capitalize">
                      total earning
                    </span>

                    <div className="flex items-center  gap-1">
                      <img class="w-4 h-4" alt="" src={usdt} />
                      <span class="text-xl font-semibold text-blueNeon">
                        {(level.earnings || "0").toString()}
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col   bg-footerMenu w-full p-1.5 px-1 rounded-xl ">
                    <span className="text-xs capitalize text-white/50">
                      Referrals
                    </span>

                    <div className="flex  gap-2">
                      <span class="text-xl font-bold text-white">
                        {level.referrals}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div class="flex items-center">
                      <div class="grid grid-cols-2 items-center bg-[#003225] w-full p-1.5 px-3 rounded-xl ">
                        <span className="text-[10px] font-medium leading-none capitalize">
                          Required <br></br>Business
                        </span>
                        <span class="text-xs font-semibold text-white leading-none">
                          {level.level === 1 ? "0" :
                            level.level === 2 ? "5000" :
                              level.level === 3 ? "10000" :
                                level.level === 4 ? "50000" :
                                  level.level === 5 ? "100000" : "0"}
                          / {level.currentBusiness || "0"}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="grid grid-cols-2 items-center  bg-[#152347] w-full p-1.5 px-3 rounded-xl ">
                        <span className="text-[10px] font-medium leading-none capitalize">
                          Required <br></br>directs
                        </span>
                        <span class="text-xs font-semibold text-white leading-none">
                          {level.level === 1 ? "0" :
                            level.level === 2 ? "5" :
                              level.level === 3 ? "10" :
                                level.level === 4 ? "15" :
                                  level.level === 5 ? "20" : "0"}
                          / {level.currentDirects || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
