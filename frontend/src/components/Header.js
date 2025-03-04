import React from "react";
import darklogo from "../assets/logo/logo-dark.png";
import whitelogo from "../assets/logo/logo-white.png";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const history = useHistory(); // To navigate back to the login page


  useEffect(() => {
    // Retrieve wallet address from localStorage
    const address = localStorage.getItem("walletAddress");
    if (address) {
      setWalletAddress(address);
    } else {
      history.push("/"); // Redirect to login page if no wallet is connected
    }
  }, [history]);


  const copyToClipboard = () => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      navigator.clipboard
        .writeText(walletAddress)
        .then(() => {
          toast.success("Copied to clipboard!", {
            duration: 3000,
            style: {
              background: "#28a745",
              color: "#fff",
              fontSize: "16px"
            }
          });
        })
        .catch((err) => {
          console.error("Clipboard API failed", err);
          fallbackCopyTextToClipboard(walletAddress);
        });
    } else {
      fallbackCopyTextToClipboard(walletAddress);
    }
  };
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Prevent scrolling to the bottom
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      toast.success("Copied to clipboard!", {
        duration: 3000,
        style: {
          background: "#28a745",
          color: "#fff",
          fontSize: "16px"
        }
      });
    } catch (err) {
      console.error("Fallback method failed", err);
      toast.error("Failed to copy!");
    }

    document.body.removeChild(textArea);
  };

  const disconnectWallet = () => {
    // Clear wallet address from localStorage and reset state
    localStorage.removeItem("walletAddress");
    setWalletAddress("");
    alert("Wallet disconnected!");
    history.push("/"); // Redirect to login page after disconnect
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const truncateAddress = (address) => {
    if (!address) return ""; // Handle cases where the address is undefined
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };
  return (
    <>
      <div className="flex items-center justify-between py-1 relative">
        <div className="flex gap-2 items-center pl-4">
          <div className="py-1.5 d-flex justify-content-center align-items-center">
            <div className="">
              <img
                src={whitelogo}
                alt="img"
                className="w-9 block dark:hidden"
              />
              <img
                src={darklogo}
                alt="img"
                className="w-9  hidden dark:block"
              />
            </div>
          </div>
          <div>
            <h1 className="text-xs font-bold">Aegis AI Coin</h1>
            <p className="text-[9px] text-gray-400">Let’s start staking</p>
          </div>
        </div>
        <div className="relative">
          {/* Trigger Button */}
          <div
            onClick={toggleDropdown}
            className="flex justify-between items-center gap-4 bg-[#121C43] px-2 pl-3 py-1.5 rounded-2xl rounded-r-none cursor-pointer"
          >
            <span className="text-xs">{truncateAddress(walletAddress)}</span>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#00EAD6"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="bg-footer  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-500 absolute top-full right-0  shadow-md rounded-lg mt-1 w-52 p-1 px-1 z-10">
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <div>
                      <img src={whitelogo} alt="" className="w-9" />
                    </div>
                    <div className="leading-none">
                      <div className="flex items-center gap-3">
                        <span className="text-xs">
                          {truncateAddress(walletAddress)}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                          viewBox="0 0 24 24"
                          onClick={copyToClipboard}
                        >
                          <path
                            fill="currentColor"
                            d="M9.116 17q-.691 0-1.153-.462T7.5 15.385V4.615q0-.69.463-1.153T9.116 3h7.769q.69 0 1.153.462t.462 1.153v10.77q0 .69-.462 1.152T16.884 17zm0-1h7.769q.23 0 .423-.192t.192-.423V4.615q0-.23-.192-.423T16.884 4H9.116q-.231 0-.424.192t-.192.423v10.77q0 .23.192.423t.423.192m-3 4q-.69 0-1.153-.462T4.5 18.385V6.615h1v11.77q0 .23.192.423t.423.192h8.77v1zM8.5 16V4z"
                          ></path>
                        </svg>
                      </div>
                      
                    </div>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      strokeWidth={1.5}
                      stroke="red"
                      onClick={disconnectWallet}
                      className="size-4"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h6.403v1H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h6.404v1zm10.846-4.461l-.702-.72l2.319-2.319H9.192v-1h8.887l-2.32-2.32l.702-.718L20 12z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
