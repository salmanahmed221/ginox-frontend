import React, { useMemo, useState, useEffect } from "react";
import Stepper from "../../../components/Stepper";
import { ChevronRight } from "lucide-react";
import axiosInstance from "../../../api/axiosConfig";

const Withdraw = () => {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [withdrawData, setWithdrawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [ePin, setEPin] = useState("");
  const [twoFA, setTwoFA] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const isAddressValid = useMemo(() => {
    const trimmed = address.trim();
    return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
  }, [address]);

  // Function to handle MAX button click
  const handleMaxClick = () => {
    if (withdrawData?.balance) {
      setAmount(withdrawData.balance.toString());
    }
  };

  // Function to show toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Function to reset form
  const resetForm = () => {
    setAddress("");
    setAmount("");
    setEPin("");
    setTwoFA("");
    setStep(0);
    setShowSecurityModal(false);
    setError(null);
  };

  // Function to handle withdraw submission
  const handleWithdraw = async () => {
    if (!ePin || !twoFA) {
      showToast("error", "Please enter both E-PIN and 2FA code");
      return;
    }

    try {
      setWithdrawLoading(true);
      setError(null);

      const payload = {
        amount: parseFloat(amount),
        method: "USDT BEP20",
        chain: "BEP",
        e_pin: ePin,
        address: address,
        twoFA: parseInt(twoFA),
      };

      const response = await axiosInstance.post(
        "/financials/gusd/withdraw",
        payload
      );

      if (response.data.success) {
        showToast(
          "success",
          "Withdrawal request submitted successfully! It will be processed within 72 hours."
        );
        resetForm();
      } else {
        showToast("error", response.data.message || "Withdrawal failed");
      }
    } catch (err) {
      console.error("Error processing withdrawal:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to process withdrawal";
      showToast("error", errorMessage);
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Function to handle withdraw button click
  const handleWithdrawClick = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast("error", "Please enter a valid amount");
      return;
    }
    setShowSecurityModal(true);
  };

  // Fetch withdraw page data
  useEffect(() => {
    const fetchWithdrawData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/financials/gusd/withdraw/page_data"
        );
        setWithdrawData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching withdraw data:", err);
        setError("Failed to load withdraw data");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className=" w-full px-2">
          <h2 className="font-header text-sm  text-white">Withdraw</h2>
        </div>
        <div className="w-full max-w-xl mt-2 bg-[#FFFFFF1A] rounded-2xl p-8 mb-8 border border-[#FFFFFF1A] flex items-center justify-center font-body1">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className=" w-full px-2">
          <h2 className="font-header text-sm  text-white">Withdraw</h2>
        </div>
        <div className="w-full max-w-xl bg-[#FFFFFF1A] rounded-2xl p-8 mb-8 border border-[#FFFFFF1A]">
          <div className="text-red-400 text-center font-body1">{error}</div>
        </div>
      </div>
    );
  }

  // Show security setup required message
  if (withdrawData && (!withdrawData.epin_set || !withdrawData.twoFA_set)) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className=" w-full px-2">
          <h2 className="font-header text-sm  text-white">Withdraw</h2>
        </div>
        <div className="w-full max-w-xl mt-2 bg-[#FFFFFF1A] rounded-2xl p-2 border border-[#FFFFFF1A]">
          <div className="text-center">
            <h3 className="text-[10px]  font-header text-white mb-2">
              Security Setup Required
            </h3>
            <div className="text-[10px] font-body1 text-white/70 mb-1">
              To withdraw funds, you need to enable the following security
              features:
            </div>
            <div className="space-y-1 text-xs font-body1 text-white/60">
              {!withdrawData.epin_set && (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span className="text-[9px]">E-PIN is not enabled</span>
                </div>
              )}
              {!withdrawData.twoFA_set && (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span className="md:text-[9px] text-[10px]">
                    Two-Factor Authentication is not enabled
                  </span>
                </div>
              )}
            </div>
            <div className="mt-1 md:text-[8px] text-[9px] font-body1 text-white/50">
              Please enable these security features in your account settings
              before proceeding with withdrawals.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="  w-full px-2">
        <h2 className="font-header w-full    text-start md:text-xs text-lg  text-white">
          Withdraw
        </h2>
      </div>
      <div className="w-full  justify-center flex">
        <Stepper
          steps={["Withdraw to", "Withdraw Amount"]}
          currentStep={step}
        />
      </div>

      <div className="flex w-full">
        <div className="w-full max-w-xl p-1 bg-[#FFFFFF1A] rounded-2xl border border-[#FFFFFF1A]">
          {step === 0 && (
            <>
              <div className=" flex items-center gap-3">
                <input
                  className={`w-full bg-black text-white rounded-lg px-2 text-[10px]  py-1 font-body1 outline-none  placeholder:text-[8px] border ${
                    address.length === 0
                      ? "border-[#ffffff29]"
                      : isAddressValid
                      ? "border-[#22c55e]/60"
                      : "border-red-500/70"
                  }`}
                  placeholder="Enter BEP20 (BSC) Address "
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <button
                  className={` rounded-full  px-3   text-xs  font-body1" ${
                    step === 1
                      ? "bg-gradient-to-r from-btn_gradient_start  font-body to-btn_gradient_end"
                      : "bg-gradient-to-r from-btn_gradient_start  font-body to-btn_gradient_end"
                  } text-white  font-body `}
                  onClick={
                    step === 1
                      ? handleWithdrawClick
                      : () => setStep((s) => Math.min(s + 1, 1))
                  }
                  disabled={
                    step === 1
                      ? !amount || parseFloat(amount) <= 0
                      : step === 0 && !isAddressValid
                  }
                >
                  {step === 1 ? "Withdraw" : "Next"}
                </button>
              </div>
              <div className="flex justify-between items-center ml-1.5 ">
                {address.length === 0 ? (
                  <p className="text-[8px] text-white/50 font-body1">
                    Only BEP20 (BSC) addresses are supported.
                  </p>
                ) : !isAddressValid ? (
                  <p className="text-[8px] text-red-400 font-body1">
                    Enter a valid BEP20 address
                  </p>
                ) : (
                  <p className="text-[8px] text-[#22c55e] font-body1">
                    Valid Address BEP20
                  </p>
                )}
              </div>
            </>
          )}
          {step === 1 && (
            <div className="flex justify-between gap-3 ">
            <div className="flex  flex-col w-[50%]  ">
              {/* <div className=" text-lg  font-header ">WITHDRAW AMOUNT</div> */}
              
              <div className="flex justify-between text-[9px] gap-3  text-text_secondary ">
                <span className="font-body1">Available Withdraw</span>
                <span className="font-body1">
                  {withdrawData?.balance || "0"}{" "}
                  {withdrawData?.wallet || "GUSD"}
                </span>
              </div>
              <div className="flex justify-between text-[9px] gap-3 font-body1 text-text_secondary">
                <span className="font-body1">Withdrawal Fee</span>
                <span className="font-body1">$1</span>
              </div>
              <div className="flex justify-between text-[9px] gap-3 font-body1 text-text_secondary ">
                <span className="font-body1">Withdrawal Processing Time</span>
                <span className="text-[#82DDB5] font-body1">
                  Withdraw will be processed in 72h
                </span>
              </div>
            </div>

            <div className=" flex  px-1 bg-black h-fit items-center gap-2  rounded-lg   ">
                <input
                  className="  bg-black text-white rounded-lg text-xs  -2   h-8 placeholder:text-[10px]   font-body1 outline-none"
                  placeholder={`Minimal ${
                    withdrawData?.min_withdraw || "0.0002"
                  }`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  className="px-3 h-fit rounded-full   text-xs bg-[#82DDB5] text-black transition-colors font-body1"
                  onClick={handleMaxClick}
                >
                  MAX
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Modal */}
        {showSecurityModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#FFFFFF1A] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#FFFFFF1A] backdrop-blur-md">
              <h3 className="text-lg  font-header text-white mb-6 text-center">
                Security Verification
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body1 text-white/70 mb-2">
                    E-PIN
                  </label>
                  <input
                    type="password"
                    className="w-full bg-black text-white rounded-lg px-4 py-3 font-body1 outline-none border border-[#ffffff29]"
                    placeholder="Enter your E-PIN"
                    value={ePin}
                    onChange={(e) => setEPin(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-body1 text-white/70 mb-2">
                    2FA Code
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black text-white rounded-lg px-4 py-3 font-body1 outline-none border border-[#ffffff29]"
                    placeholder="Enter 2FA code"
                    value={twoFA}
                    onChange={(e) => setTwoFA(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  className="flex-1 py-2 rounded-full bg-gray-600 text-white font-body1"
                  onClick={() => {
                    setShowSecurityModal(false);
                    setEPin("");
                    setTwoFA("");
                  }}
                  disabled={withdrawLoading}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white font-body1"
                  onClick={handleWithdraw}
                  disabled={withdrawLoading}
                >
                  {withdrawLoading ? "Processing..." : "Confirm Withdraw"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top">
            <div
              className={`px-6 py-4 rounded-lg shadow-lg border-l-4 max-w-md ${
                toast.type === "success"
                  ? "bg-[#0AC48830] border-[#0AC488] text-[#0AC488]"
                  : "bg-[#FF6B6B30] border-[#FF6B6B] text-[#FF6B6B]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {toast.type === "success" ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  )}
                  <p className="text-sm font-body1 text-white">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => setToast(null)}
                  className="ml-4 text-gray-400 hover:text-white font-body1"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
