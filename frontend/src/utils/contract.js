import Web3 from "web3";
import abi from "../build/contracts/MLMStorage.json";

const contractAddress = "0xFe3d12CFD9590A17334247Eb410fcC7324Aa7d7d";

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
