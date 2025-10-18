import React, { useState } from "react";
import Stepper from "../../../components/Stepper";
import btcIcon from "../../../assets/images/btc.png";
import usdtIcon from "../../../assets/images/usdt.png";
import ethIcon from "../../../assets/images/eth.png";
import usdcIcon from "../../../assets/images/usdc.png";
import wldIcon from "../../../assets/images/wld.png";
import bfmLogo from "../../../assets/images/bfm-logo.png";

const coins = [
  { name: "BTC", icon: btcIcon },
  { name: "ETH", icon: ethIcon },
];

const networks = [{ name: "BFM", icon: bfmLogo, contract: "JLJ6T" }];

const BfmWithdraw = () => {
  const [step, setStep] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div className="w-full">
      <div className="">
        <h2 className="font-heading2 text-sm text-white">Coming Soon</h2>
      </div>
      {/* <div className=" flex flex-col items-center">
        
        <Stepper
          steps={['Select Coin', 'Withdraw to', 'Withdraw Amount']}
          currentStep={step}
        />
        <div className="w-full max-w-xl bg-[#151c26] rounded-2xl p-8 mb-8 border border-[#22304a]">
          {step === 0 && (
            <>
              <div className=" text-lg mb-4">SELECT COIN</div>
              <div className="mb-4">
                <input
                  className="w-full bg-black text-white rounded-lg px-4 py-2 font-body outline-none"
                  placeholder="Search.."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {coins.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(coin => (
                  <button
                    key={coin.name}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border border-[#222b3a] bg-black text-white  transition-all duration-200 ${selectedCoin === coin.name ? 'ring-2 ring-btn_gradient_end' : ''}`}
                    onClick={() => setSelectedCoin(coin.name)}
                    type="button"
                  >
                    <img src={coin.icon} alt={coin.name} className="w-5 h-5" /> {coin.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className=" text-lg mb-4">WITHDRAW TO</div>
              <div className="mb-4">
                <input
                  className="w-full bg-black text-white rounded-lg px-4 py-3 font-body outline-none mb-3"
                  placeholder="Enter Address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
                <button className="flex items-center gap-3 w-full bg-black text-white rounded-lg px-4 py-3 border border-[#222b3a]">
                  <img src={networks[0].icon} alt="BFM" className="w-6 h-6" />
                  <span className="">{networks[0].name}</span>
                  <span className="ml-auto text-xs text-text_secondary">Contract Address Ending In</span>
                  <span className="ml-2 ">{networks[0].contract}</span>
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className=" text-lg mb-4">WITHDRAW AMOUNT</div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  className="flex-1 bg-black text-white rounded-lg px-4 py-3 font-body outline-none"
                  placeholder="Minimal 0.0002"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <span className="text-text_secondary ">BTC</span>
                <button className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white ">MAX</button>
              </div>
              <div className="flex justify-between text-xs text-text_secondary mb-1">
                <span>Available Withdraw</span>
                <span>0.02 BTC</span>
              </div>
              <div className="flex justify-between text-xs text-text_secondary mb-4">
                <span>24h Remaining Limit</span>
                <span>0.018674345 BTC / <span className="text-red-500">0.02995635 BTC</span></span>
              </div>
              <div className="bg-black rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <div className=" text-base text-white">RECEIVE AMOUNT</div>
                  <div className="text-xs text-text_secondary">Network Fee 0.00004 BTC</div>
                </div>
                <div className=" text-2xl text-btn_gradient_end">0.00 BTC</div>
              </div>
            </>
          )}
        </div>
        <button
          className={`w-48 py-2 rounded-full  text-lg ${step === 2 ? 'bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end' : 'bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end'} text-white shadow-md`}
          onClick={() => setStep(s => Math.min(s + 1, 2))}
          disabled={step === 2}
        >
          {step === 2 ? 'Withdraw' : 'Next'}
        </button>
      </div> */}
    </div>
  );
};

export default BfmWithdraw;
