import React, { useEffect, useState } from "react";
import { getContract } from "../utils/contract";

const Earnings = () => {
    const [earnings, setEarnings] = useState({ direct: 0, level: 0, total: 0 });

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const { contract, web3 } = await getContract();
                const accounts = await web3.eth.getAccounts();
                const user = await contract.methods.users(accounts[0]).call();
                setEarnings({
                    direct: web3.utils.fromWei(user.directEarnings, "ether"),
                    level: web3.utils.fromWei(user.levelEarnings, "ether"),
                    total: web3.utils.fromWei(user.totalEarnings, "ether"),
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchEarnings();
    }, []);

    return (
        <div>
            <h3>Earnings</h3>
            <p>Direct: {earnings.direct} ETH</p>
            <p>Level: {earnings.level} ETH</p>
            <p>Total: {earnings.total} ETH</p>
        </div>
    );
};

export default Earnings;
