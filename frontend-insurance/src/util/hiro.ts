import axios from "axios";
import { userSession } from "./stacksInit";
import { Cl, cvToHex, stringAsciiCV, uintCV } from "@stacks/transactions";

const baseURL = 'https://api.testnet.hiro.so';
const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const fetchPrice = async () => {
  const contractAddress = import.meta.env.VITE_AMM_CONTRACT;
  const contractName = "amm";
  const functionName = "get_price";
  const sender = userSession.loadUserData().profile.stxAddress.testnet;
  try {
    const resp = await axios.post(
      `${baseURL}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        sender,
        arguments: [],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return parseInt(Cl.deserialize(resp.data.result).value)
  } catch (error) {
    return -1;
  }
};

const fetchBalance = async (token: "STX" | "DIM" = "STX") => {
  const sender = userSession.loadUserData().profile.stxAddress.testnet;
  try {
    const resp = await client.get(`v1/address/${sender}/balances`);
    if (token === "STX") {
      return resp.data.stx.balance / 10000000;
    } else {
      return Object.values(resp.data.fungible_tokens)[0].balance / 10000000;
    }
  } catch (error) {
    return -1;
  }
};

const fetchCover = async (coverName: string) => {
  const contractAddress = import.meta.env.VITE_AMM_CONTRACT;
  const contractName = "cover";
  const functionName = "get-cover";
  const sender = userSession.loadUserData().profile.stxAddress.testnet;
  try {
    const resp = await axios.post(
      `${baseURL}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        sender,
        arguments: [
          cvToHex(stringAsciiCV(coverName))
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return Cl.deserialize(resp.data.result).value.value.data;
  } catch (error) {
    return -1;
  }
};

const fetchCoverBought = async (coverName: string) => {
  const contractAddress = import.meta.env.VITE_AMM_CONTRACT;
  const contractName = "cover";
  const functionName = "get-cover-bought";
  const sender = userSession.loadUserData().profile.stxAddress.testnet;
  try {
    const resp = await axios.post(
      `${baseURL}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        sender,
        arguments: [
          cvToHex(stringAsciiCV(coverName))
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return Cl.deserialize(resp.data.result).value.value.data;
  } catch (error) {
    return -1;
  }
};

const fetchCoverEstimate = async (coverName: string, amount: number) => {
  const contractAddress = import.meta.env.VITE_AMM_CONTRACT;
  const contractName = "cover";
  const functionName = "get-cover-estimate";
  const sender = userSession.loadUserData().profile.stxAddress.testnet;
  try {
    const resp = await axios.post(
      `${baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
      {
        sender,
        arguments: [
          cvToHex(stringAsciiCV(coverName)),
          cvToHex(uintCV(amount)),
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(Cl.deserialize(resp.data.result))
    return parseInt(Cl.deserialize(resp.data.result).value.value);
  } catch (error) {
    return -1;
  }
};

export { fetchPrice, fetchBalance, fetchCover, fetchCoverBought, fetchCoverEstimate, };
