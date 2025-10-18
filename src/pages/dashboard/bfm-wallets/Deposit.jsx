import React, { useState } from "react";
import { useSelector } from "react-redux";
import Stepper from "../../../components/Stepper";
import copyIcon from "../../../assets/images/copy-icon.png";
import btcIcon from "../../../assets/images/btc.png";
import usdtIcon from "../../../assets/images/usdt.png";
import ethIcon from "../../../assets/images/bfm-logo.png";
import usdcIcon from "../../../assets/images/usdc.png";
import wldIcon from "../../../assets/images/wld.png";
import bfmLogo from "../../../assets/images/bfm-logo.png";
import axios from "../../../api/axiosConfig";

const coins = [{ name: "Bfm", icon: ethIcon }];

const networks = [{ name: "BFM", icon: bfmLogo, contract: "JLJ6T" }];

const BfmDeposit = () => {
  const [step, setStep] = useState(0);
  const [selectedCoin] = useState("Bfm");
  const [tranxHash, setTranxHash] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Step 1: Select Coin (GUSD only)
  // Step 2: Enter TranxHash
  // Step 3: Show API response

  const handleNext = async () => {
    if (step === 1) {
      setApiMessage("");
      setApiError("");
      if (!tranxHash || tranxHash.length < 10) {
        setApiError("Please enter a valid transaction hash.");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(
          "/financials/bfm/deposit",
          { tranxHash },
          {
            headers: { token },
          }
        );
        if (response.data.success) {
          setApiMessage(response.data.message || "Deposit successful!");
          setStep(2);
        } else {
          setApiError(response.data.message || "Deposit failed");
        }
      } catch (err) {
        setApiError(err.response?.data?.message || "Deposit failed");
      } finally {
        setLoading(false);
      }
    } else {
      setStep((s) => Math.min(s + 1, 2));
    }
  };

  return (
    <div className="w-full">
      <div className="">
        <h2 className="font-heading2 text-sm text-white">Coming Soon</h2>
      </div>
      {/* <div className=" flex flex-col items-center">
        <Stepper
          steps={['Select Coin', 'Enter TranxHash', 'Result']}
          currentStep={step}
        />
        <div className="w-full max-w-xl bg-[#FFFFFF08] rounded-2xl p-8 mb-8 border border-[#22304a]">
          {step === 0 && (
            <>
              <div className=" text-xs font-heading2 mb-4">SELECT COIN</div>
              <div className="mb-4">
                <input
                  className="w-full bg-black text-white rounded-lg px-4 py-2 font-body outline-none"
                  value="Bfm"
                  readOnly
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  key={coins[0].name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[#222b3a] bg-black text-white ring-2 ring-btn_gradient_end`}
                  type="button"
                  disabled
                >
                  <img src={coins[0].icon} alt={coins[0].name} className="w-5 h-5" /> {coins[0].name}
                </button>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className=" text-lg mb-4">ENTER TRANSACTION HASH</div>
              <input
                className="w-full bg-black text-white rounded-lg px-4 py-2 font-body outline-none mb-2"
                placeholder="Enter transaction hash"
                value={tranxHash}
                onChange={e => setTranxHash(e.target.value)}
                type="text"
              />
              {apiError && <div className="text-red-500 text-xs mt-1">{apiError}</div>}
            </>
          )}
          {step === 2 && (
            <>
              <div className=" text-sm mb-4 font-heading2">RESULT</div>
              <div className="bg-[#000000] p-5 rounded-xl flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex justify-between bg-[#FFFFFF1A] rounded-lg px-4 py-2">
                    <span className={`truncate font-body text-xs ${apiMessage ? 'text-green-500' : 'text-red-500'}`}>{apiMessage || apiError}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <button
          className="w-48 py-2 rounded-full  text-lg "
          style={{background: 'linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)'}}
          onClick={handleNext}
          disabled={step === 2 || loading}
        >
          {loading ? 'Processing...' : 'Next'}
        </button>
      </div> */}
    </div>
  );
};

export default BfmDeposit;
