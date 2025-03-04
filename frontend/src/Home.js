import React from "react";
import Register from "./components/Register"; // Import Register component
import Withdrawal from "./components/Withdrawal"; // Import Withdrawal component
import Earnings from "./components/Earnings"; // Import Earnings component
import Staking from "./components/Staking";  // Staking component

const Home = () => {
    return (
        <div>
            <h1>Welcome to the MLM Platform</h1>
            <Register />        {/* Display Register component */}
            <Withdrawal />      {/* Display Withdrawal component */}
            <Earnings />        {/* Display Earnings component */}
            <Staking />  {/* Add the Staking component */}
        </div>
    );
};

export default Home;
