// src/components/LoginWithWallet.js
import React, { useState } from "react";
import Web3 from "web3";
import { useHistory } from "react-router-dom";
import coin from "../assets/coinAnimation.png";

import toast, { Toaster } from "react-hot-toast";

import "./LoginWithWallet.css"; // Import the CSS file for styling

const LoginWithWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access
        const accounts = await web3.eth.requestAccounts();
        setWalletAddress(accounts[0]); // Set wallet address in state
        localStorage.setItem("walletAddress", accounts[0]); // Store wallet address in localStorage
        // Redirect to dashboard page after successful login
        history.push("/dashboard");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Error connecting wallet", {
          duration: 5000,
          style: {
            background: "red",
            color: "#fff",
            fontSize: "15px"
          }
        });
      }
    } else {
      toast.error("Please Install MetaMask!", {
        duration: 5000,
        style: {
          background: "red",
          color: "#fff",
          fontSize: "15px"
        }
      });
    }
  };

  const history = useHistory();

  const goToRegister = () => {
    history.push("/register"); // Navigate to Register Page
  };

  return (
    <>
      <div className="login-container bg-cover bg-center min-h-screen w-full flex justify-center items-center">
        <div className="w-full bg-white m-3 rounded-xl bg-opacity-10 backdrop-filter backdrop-blur-xl relative p-6">
          <div className="flex justify-center items-center   rounded-full mx-auto mb-4">
            <img src={coin} className="w-20 h-20 absolute -top-12" alt="" />
          </div>

          <div className="     text-center">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Welcome to AGS! 
            </h1>

            <p className="text-md text-white opacity-70 mb-6">
              Connect with your wallet
            </p>
            <div>
              {walletAddress ? (
                <p>Connected Address: {walletAddress}</p>
              ) : (
                <div className="flex justify-between gap-4">
                  <div className="w-full">
                    <button
                      className="inline-flex w-full justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200  bg-gradient-to-tr from-buttonBlue to-blueLight   shadow focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]"
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </button>
                  </div>
                  <div className="dark w-full">
                    <button
                      className="inline-flex w-full justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200 dark:text-slate-800 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-200 dark:to-slate-100 dark:hover:bg-slate-100 shadow focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.2)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]"
                      onClick={goToRegister}
                    >
                      Register
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
};

export default LoginWithWallet;
