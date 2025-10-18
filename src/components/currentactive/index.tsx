import axios from "../../api/axiosConfig";
import axiosBase from "axios"; // For third-party APIs

// Create a separate axios instance for third-party APIs (without token header)
const externalAxios = axiosBase.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const cardData = [
  {
    id: 1,
    link: "/crypto-box",
    logo: "./current/bfm.svg",
    name: "BENIFIT MINE",
    shortCode: "BFM",
    amount: "", // will be set dynamically
    apy: "83%",
    strokeColor: "#0fae96",
    fetchPrice: async (token) => {
      const res = await axios.get("/financials/bfm-price", {
        headers: { apikey: (import.meta as any).env.VITE_API_KEY },
      });
      return res.data.data.bfmPrice;
    },
  },
  {
    id: 2,
    link: "",
    logo: "./current/btc.svg",
    name: "BITCOIN",
    shortCode: "BTC",
    amount: "", // will be set dynamically
    strokeColor: "#0fae96",
    fetchPrice: async () => {
      const res = await externalAxios.get(
        "https://api.diadata.org/v1/assetQuotation/Bitcoin/0x0000000000000000000000000000000000000000"
      );
      return res.data.Price;
    },
  },
  {
    id: 3,
    link: "",
    logo: "./current/eth.svg",
    name: "ETHEREUM",
    shortCode: "ETH",
    amount: "", // will be set dynamically
    strokeColor: "#0fae96",
    fetchPrice: async () => {
      const res = await externalAxios.get(
        "https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000"
      );
      return res.data.Price;
    },
  },
];
