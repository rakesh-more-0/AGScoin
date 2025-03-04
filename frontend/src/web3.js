import Web3 from 'web3';

const initWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    // Check if it's Trust Wallet or MetaMask
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("trust") && userAgent.includes("wallet")) {
      console.log("Using Trust Wallet");
    } else if (userAgent.includes("metamask")) {
      console.log("Using MetaMask");
    } else {
      console.log("Using another Ethereum wallet");
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });  // Request user accounts
      return web3;
    } catch (error) {
      console.error('User denied account access');
      throw new Error('User denied account access');
    }
  } else {
    console.log('Please install Trust Wallet or MetaMask to use this dApp');
    throw new Error('No Ethereum browser detected');
  }
};

export default initWeb3;
