import api from "../../utils/api";
import { ethers } from "ethers";

var userAuthToken;
export const getUserAuthToken = () => {
  if (userAuthToken) {
    return userAuthToken;
  }
};

export const setAuthToken = (_userAuthToken) => {
  userAuthToken = _userAuthToken;
};

const generateAuthTokenForLoggedInUser = (userAccountAddress) => {
  return new Promise((resolve, reject) => {
    api
      .post("/auth/generate-auth-token", { userAccountAddress })
      .then((response) => {
        resolve(response.authToken);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export const connectWallet = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install an ethereum wallet");
      throw new Error("Please install an ethereum wallet");
    }

    let userChainID = await ethereum.request({ method: "eth_chainId" });
    console.log("userChainID", userChainID);

    // Check if connected to Polygon Amoy Testnet
    const polygonTestNetChainID = "0x13882";
    if (userChainID != polygonTestNetChainID) {
      alert("Please connect to the Polygon Amoy Testnet");
      throw new Error("Please connect to the Polygon Amoy Testnet");
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    // Send request to generate auth token for the user
    const authToken = await generateAuthTokenForLoggedInUser(account);
    userAuthToken = authToken;
    localStorage.setItem("userAuthToken", authToken);
    return userAuthToken;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
