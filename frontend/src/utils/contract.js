import Web3 from "web3";
import abi from "../build/contracts/MLMStorage.json";

const contractAddress = "0x2ca7ecC1Eb21B0B8427E5262273a05392F0Ed388";

export const getContract = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const contract = new web3.eth.Contract(abi, contractAddress);
        return { contract, web3 };
    } else {
        alert("Please install MetaMask!");
    }
};
