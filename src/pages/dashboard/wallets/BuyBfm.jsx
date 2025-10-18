import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import copyIcon from "../../../assets/images/copy-icon.png";
import bfmLogo from "../../../assets/images/bfm-logo.png";
import ethIcon from "../../../assets/images/eth.png";
import axios from "../../../api/axiosConfig";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BuyBfm = () => {
  const { token } = useSelector((state) => state.auth);
  const [gusdBalance, setGusdBalance] = useState(0);
  const [bfmPrice, setBfmPrice] = useState(0);
  const [amount, setAmount] = useState("");
  const [receiveBfm, setReceiveBfm] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalBfmAmount, setModalBfmAmount] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  // Fetch GUSD balance
  useEffect(() => {
    axios.get("/financials/assets", { headers: { token } }).then((res) => {
      if (res.data.success && res.data.data && res.data.data.gusd) {
        setGusdBalance(Number(res.data.data.gusd.balance));
      }
    });
    axios
      .get("/financials/bfm-price", {
        headers: { apikey: import.meta.env.VITE_API_KEY },
      })
      .then((res) => {
        if (res.data.success) setBfmPrice(Number(res.data.data.bfmPrice));
      });
  }, [token]);

  // Calculate receive BFM
  useEffect(() => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0 && bfmPrice > 0) {
      setReceiveBfm((amt / bfmPrice).toFixed(6));
    } else {
      setReceiveBfm("0.00");
    }
  }, [amount, bfmPrice]);

  // Handle percent buttons
  const handlePercent = (percent) => {
    const val = ((gusdBalance * percent) / 100).toFixed(2);
    setAmount(val);
  };

  // Handle buy - now shows confirmation first
  const handleBuy = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setModalMsg("Please enter a valid amount.");
      setModalSuccess(false);
      setModalBfmAmount(null);
      setModalOpen(true);
      return;
    }
    // Show confirmation modal instead of directly calling API
    setConfirmationOpen(true);
  };

  // Handle confirmed purchase
  const handleConfirmedPurchase = async () => {
    setConfirmationOpen(false);
    setLoading(true);
    try {
      const response = await axios.post(
        "/financials/purchase-bfm",
        { amount: Number(amount) },
        { headers: { token } }
      );
      setModalMsg(
        response.data.message ||
          (response.data.success ? "Purchase successful" : "Purchase failed")
      );
      setModalSuccess(!!response.data.success);
      setModalBfmAmount(response.data.data?.bfmAmount || null);
      setModalOpen(true);
    } catch (err) {
      setModalMsg(err.response?.data?.message || "Purchase failed");
      setModalSuccess(false);
      setModalBfmAmount(null);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className=" w-full     
     mx-auto bg-[#101A24] rounded-2xl md:p-3 p-2 shadow-2xl border border-[#22304a] relative overflow-hidden"
    >
      <h2 className="text-center md:text-xs font-header text-[#0AC389]  tracking-wider">
        BUY BFM WITH GUSD
      </h2>
      <div className="flex flex-col md:flex-row gap-3 h-full ">
        <div className="md:w-[35%] flex flex-col gap-3">
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-[#232B36] rounded-lg md:p-1.5 p-3">
                <img
                  src="/assets/images/gusd.png"
                  alt="GUSD"
                  className=" md:w-4 md:h-4 h-5 w-5 rounded-full bg-[#181F29] "
                />
              </div>
              <span className="md:text-xs  text-white md:mt-0.5 mt-1 font-body1">
                GUSD
              </span>
            </div>
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 18l6-6-6-6"
                stroke="#0AC389"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <div className="bg-[#232B36] rounded-lg md:p-1.5 p-3">
                <img
                  src={bfmLogo}
                  alt="BFM"
                  className="md:w-4 md:h-4 h-5 w-5 rounded-full bg-[#181F29]"
                />
              </div>
              <span className="md:text-xs  text-white md:mt-0.5 mt-1 font-body1">
                BFM
              </span>
            </div>
          </div>
          <div className="bg-[#232B36] rounded-xl  mx-auto  py-2 w-full flex flex-col items-center ">
            <div className="text-center md:text-[10px] font-header text-white md:mb-1 mb-3">
              CURRENT RATE
            </div>
            <div className="text-center  md:text-[10px] font-header text-gradient ">
              1 GUSD = {(1 / bfmPrice).toFixed(2)} BFM
            </div>
            <div className="text-center md:mt-1 mt-2  md:text-[10px] font-header text-gradient">
              BFM PRICE : $
              {bfmPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </div>
          </div>
        </div>
        <div className="h-full w-px bg-white/20 " />

        <div className="md:w-[65%] flex flex-col">
          <div className=" flex gap-2 items-center">
            <div className="w-[70%]">
              <div className="mb-1 text-[10px] text-white font-header">
                PAY WITH GUSD
              </div>
              <div className="relative mb-1">
                <input
                  className="w-full bg-black text-[#FFFFFF80] placeholder:text-[10px]  rounded-lg px-4  font-body1 outline-none  "
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="0"
                />
                <span className="absolute right-4 top-4 -translate-y-1/2 text-[#FFFFFF80] text-[10px] font-body1">
                  GUSD
                </span>
              </div>
              <div className="flex justify-between  text-[8px]  text-text_secondary mb-1">
                <span className="font-body1">
                  Available :{" "}
                  {gusdBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  GUSD
                </span>
              </div>
              <div className="mb-1 text-[10px] text-white font-header">
                RECEIVE BFM
              </div>
              <div className="relative mb-0 md:mb-2">
                <input
                  className="w-full bg-black text-[#FFFFFF80]  py-1 text-[10px]  rounded-lg px-4  font-body1 outline-none  "
                  value={receiveBfm}
                  readOnly
                />
                <span className="absolute right-4 top-4 -translate-y-1/2 text-[#FFFFFF80] text-xs font-body1">
                  BFM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 h-[50%] gap-2 w-[30%] ">
              <button
                className="   text-[8px] rounded-lg font-body1 text-white bg-[#181F29] hover:bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab transition"
                onClick={() => handlePercent(25)}
              >
                25 %
              </button>
              <button
                className="   text-[8px] rounded-lg font-body1 text-white bg-[#181F29] hover:bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab transition"
                onClick={() => handlePercent(50)}
              >
                50 %
              </button>
              <button
                className="   text-[8px] rounded-lg font-body1 text-white bg-[#181F29] hover:bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab transition"
                onClick={() => handlePercent(75)}
              >
                75 %
              </button>
              <button
                className="   text-[8px] rounded-lg font-body1 text-white bg-[#181F29] hover:bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab transition"
                onClick={() => handlePercent(100)}
              >
                MAX
              </button>
            </div>
          </div>

            <div className="flex gap-4">
          <button
            className="flex-1 py-1 text-xs  rounded-full font-body1 text-white bg-[#181F29] hover:bg-[#232B36] transition"
            onClick={() => {
              setAmount("");
              setReceiveBfm("0.00");
            }}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-1 text-xs  rounded-full font-body1 text-white bg-gradient-to-r from-[#33A0EA] to-[#0AC488] hover:opacity-90 transition"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy"}
          </button>
        </div>
        </div>
      
      </div>

      {/* Confirmation Modal */}
      {confirmationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#06101A] border border-[#33A0EA] rounded-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-lg sm:text-2xl font-header text-white mb-4 whitespace-nowrap">
              CONFIRM PURCHASE
            </div>
            <div className="text-sm font-body1 text-white mb-2 text-center">
              Are you sure you want to buy BFM?
            </div>
            <div className="text-sm font-body1 text-gradient mb-2">
              Amount: {amount} GUSD
            </div>
            <div className="text-sm font-body1 text-gradient mb-6">
              You will receive: {receiveBfm} BFM
            </div>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 px-4 py-2 font-body1 rounded-full font-semibold text-white bg-[#181F29] hover:bg-[#232B36] transition"
                onClick={() => setConfirmationOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 font-body1 rounded-full font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                }}
                onClick={handleConfirmedPurchase}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#06101A] h-full  rounded-2xl p-8  w-full flex flex-col items-center">
            <div className="text-lg sm:text-2xl font-header text-white mb-4">
              Buy BFM Result
            </div>
            <div
              className={`text-base font-body1 mb-2 ${
                modalSuccess ? "text-green-400" : "text-red-400"
              }`}
            >
              {modalMsg}
            </div>
            {modalSuccess && modalBfmAmount && (
              <div className="text-sm font-body1 text-white mb-4">
                BFM Received:{" "}
                <span className="text-gradient sm:text-lg font-header">
                  {modalBfmAmount}
                </span>
              </div>
            )}
            <button
              className="px-8 py-2 rounded-full font-body1 font-semibold text-white mt-2"
              style={{
                background:
                  "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
              }}
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyBfm;
