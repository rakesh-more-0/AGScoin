import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import coin from "../assets/coinAnimation.png";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [referrer, setReferrer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const contractAddress = "0xFe3d12CFD9590A17334247Eb410fcC7324Aa7d7d"; // Your contract address
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955"; // USDT contract address (BSC)

  const contractABI = [
    {
      constant: false,
      inputs: [{ internalType: "address", name: "_referrer", type: "address" }],
      name: "register",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const approveTokens = async (web3, account, amount) => {
    try {
      const tokenContract = new web3.eth.Contract(
        [
          { 
            constant: false,
            inputs: [
              { name: "_spender", type: "address" },
              { name: "_value", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        usdtAddress
      );

      const amountInWei = web3.utils.toWei(amount.toString(), "ether");
      await tokenContract.methods.approve(contractAddress, amountInWei).send({
        from: account,
      });
      console.log("Approval successful");
    } catch (error) {
      console.error("Approval failed:", error);
      throw new Error("Approval failed: " + error.message);
    }
  };

  const registerUser = async () => {
    setLoading(true);
    setMessage("Processing registration...");

    try {
        if (!window.ethereum) {
            setMessage("MetaMask is not installed. Please install it.");
            setLoading(false);
            return;
        }

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            setMessage("No wallet connected. Please connect your MetaMask wallet.");
            setLoading(false);
            return;
        }

        const account = accounts[0];

        // Ensure approval of USDT before registering
        await approveTokens(web3, account, 50);

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        await contract.methods.register(referrer).send({ from: account });

        // Send data to backend
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet_address: account, referrer }),
            
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to register in database");

        toast.success("Registration successful!");
        history.push("/dashboard");
    } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Registration failed. Please try again.");
    }
    setLoading(false);
};


  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        const accounts = await web3Instance.eth.requestAccounts();
        setWalletAddress(accounts[0]);

        // Store the wallet address in local storage for persistence
        localStorage.setItem("walletAddress", accounts[0]);

        // Navigate to the dashboard after a successful wallet connection
        toast.success("Wallet connected successfully!", {
          duration: 3000,
          style: {
            background: "#28a745",
            color: "#fff",
            fontSize: "15px",
          },
        });

        history.push("/dashboard");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet. Please try again.", {
          duration: 3000,
          style: {
            background: "red",
            color: "#fff",
            fontSize: "15px",
          },
        });
      }
    } else {
      toast.error("Please install MetaMask!", {
        duration: 5000,
        style: {
          background: "red",
          color: "#fff",
          fontSize: "15px",
        },
      });
    }
  };

  useEffect(() => {
    // Check if wallet address exists in local storage
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress); // Set wallet address
      history.push("/dashboard"); // Redirect to the dashboard if already connected
    }

    // Get the 'ref' query parameter from the URL if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const referrerAddress = urlParams.get("ref");
    if (referrerAddress) {
      setReferrer(referrerAddress); // Set the referrer state if the 'ref' parameter exists
    }
  }, [walletAddress, history]);

  return (
    <>
      <div className="login-container bg-cover bg-center min-h-screen w-full flex justify-center items-center">
        <div className="w-full bg-white m-3 rounded-xl bg-opacity-10 backdrop-filter backdrop-blur-lg relative p-6">
          <div className="flex justify-center items-center rounded-full mx-auto mb-4">
            <img src={coin} className="w-20 h-20 absolute -top-12" alt="" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Welcome to AGS Coin!
            </h1>
            {walletAddress ? (
              <div>
                <p className="mb-4 text-md font-medium text-white">
                  You're already linked to this address.
                </p>
                <span className="font-bold text-white">{walletAddress}</span>
                <div>
                  <button
                    className="inline-flex w-full justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200 bg-gradient-to-r from-slate-800 to-slate-700 shadow focus:outline-none"
                    onClick={() => history.push("/dashboard")}
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-md text-white opacity-70 mb-6">Register with your wallet</p>
                <div className="flex mb-3">
                  <input
                    type="text"
                    placeholder="Enter referrer address"
                    value={referrer}
                    onChange={(e) => setReferrer(e.target.value)}
                    className="rounded-lg bg-white/20 text-white placeholder-white/70 border block flex-1 min-w-0 w-full text-sm border-gray-300/60 p-2.5 py-2"
                  />
                </div>

                <div>
                  <button
                    className="inline-flex w-full justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200 bg-gradient-to-tr from-buttonBlue to-blueLight shadow focus:outline-none"
                    onClick={registerUser}
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-white"></div>
                  <span className="flex-shrink mx-4 text-white">OR</span>
                  <div className="flex-grow border-t border-white"></div>
                </div>

                <div>
                  <button
                    className="inline-flex w-full justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200 bg-gradient-to-r from-slate-800 to-slate-700 shadow focus:outline-none"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </button>
                </div>
              </>
            )}
            <p>{message}</p>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} gutter={5} />
    </>
  );
};

export default RegisterPage;
