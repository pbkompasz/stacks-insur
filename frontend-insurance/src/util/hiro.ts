import axios from "axios";
import { userSession } from "./stacksInit";

const client = axios.create({
  baseURL: "https://api.testnet.hiro.so/v2",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const fetchPrice = async () => {
  const contractAddress = import.meta.env.VITE_AMM_CONTRACT;
  const contractName = 'amm';
  const functionName = 'get_price';
  const sender = userSession.loadUserData().profile.stxAddress.testnet;
  try {
    await client.post(`contracts/call-read/${contractAddress}/${contractName}/${functionName}`, {
      sender, 
    })
  } catch (error) {
    return -1;
  }
};

export { fetchPrice };
