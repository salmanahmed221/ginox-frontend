import React, { useState, useEffect, useRef } from "react";
  import { useSelector } from "react-redux";
  import Stepper from "../../../components/Stepper";
  import copyIcon from "../../../assets/images/copy-icon.png";
  import ethIcon from "/assets/images/gusd.png";
  import bfmLogo from "../../../assets/images/bfm-logo.png";
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
  import { QrCode } from "lucide-react";

  const coins = [{ name: "USDT bep20", icon: ethIcon }];

  const networks = [{ name: "BFM", icon: bfmLogo, contract: "JLJ6T" }];

  const Deposit = () => {
    const [step, setStep] = useState(0);
    const [selectedCoin, setSelectedCoin] = useState("GUSD");
    const [amount, setAmount] = useState("");
    const [tranxHash, setTranxHash] = useState("");
    const [apiMessage, setApiMessage] = useState("");
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    // Step 3 state
    const [payAddress, setPayAddress] = useState("");
    const [payAmount, setPayAmount] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [depositSuccess, setDepositSuccess] = useState(false);
    const [qrUrl, setQrUrl] = useState("");
    const pollingRef = useRef();

    // Copy to clipboard
    const handleCopy = () => {
      navigator.clipboard.writeText(payAddress);
    };

    // Step 2: handle deposit API
    const handleNext = async () => {
      if (step === 0) {
        setApiMessage("");
        setApiError("");
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
          setApiError("Please enter a valid amount.");
          return;
        }
        setLoading(true);
        try {
          const response = await axios.post(
            "/financials/gusd/deposit",
            { amount: Number(amount) },
            {
              headers: { token },
            }
          );
          if (response.data.success) {
            setPaymentId(response.data.data.payment_id);
            setPayAddress(response.data.data.pay_address);
            setPayAmount(response.data.data.pay_amount);
            setQrUrl(
              `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `ethereum:${response.data.data.pay_address}?amount=${response.data.data.pay_amount}`
              )}`
            );
            setStep(1);
          } else {
            setApiError(response.data.message || "Deposit failed");
          }
        } catch (err) {
          setApiError(err.response?.data?.message || "Deposit failed");
        } finally {
          setLoading(false);
        }
      }
    };

    // Step 3: Poll for deposit validation
    useEffect(() => {
      if (step === 1 && paymentId && !depositSuccess) {
        setApiMessage("");
        setApiError("");
        const poll = async () => {
          try {
            const res = await axios.get(
              `/financials/eusd/deposit/validate_tranx?nowPaymentsId=${paymentId}`,
              {
                headers: { token },
              }
            );
            if (res.data.success) {
              setDepositSuccess(true);
              setApiMessage("Deposit successful!");
              setApiError("");
              clearTimeout(pollingRef.current);
            } else {
              setApiMessage(
                res.data.message || "Waiting for deposit confirmation..."
              );
              pollingRef.current = setTimeout(poll, 10000);
            }
          } catch (err) {
            setApiError("Error validating deposit.");
            pollingRef.current = setTimeout(poll, 10000);
          }
        };
        pollingRef.current = setTimeout(poll, 10000);
        return () => clearTimeout(pollingRef.current);
      }
    }, [step, paymentId, depositSuccess, token]);

    return (
      <div className="w-full  h-full">
        <div className=" flex  ">
          <h2 className="font-header w-full  px-2  text-start md:text-xs text-lg  text-white">
            GUSD Deposit{" "}
            <span className="font-body1 md:text-xs text-sm">
              (USDT BEP20 will converted to GUSD)
            </span>
          </h2>
        </div>
        <div className=" flex flex-col items-center overflow-auto">
          {/* Step Content */}
          
          <div className="w-full justify-center flex mt-1 ">
            <Stepper
              steps={["Enter Amount", "Deposit"]}
              currentStep={step}
            />
          </div>

          <div className=" flex gap-3 w-full bg-[##FFFFFF1A] rounded-xl  p-0.5 items-center  border border-[#22304a] ">
            <div className="w-full flex items-center   ">
              {step === 0 && (
                <>
                  <input
                    className="w-full bg-black text-white text-[10px] rounded-lg py-1 pl-4  font-body1 outline-none"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    min="0"
                  />
                  {apiError && (
                    <div className="text-red-500 text-[8px] ">{apiError}</div>
                  )}
                </>
              )}
              {step === 1 && (
                <>
                  <div className="md:hidden">
                    <div className=" text-xs  font-header">
                      DEPOSIT ADDRESS - USDT BEP20 Only
                    </div>
                    <div className="bg-[#000000] p-2 rounded-xl flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        {qrUrl && (
                          <img
                            src={qrUrl}
                            alt="QR Code"
                            className="w-10 h-10 mb-2"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between bg-[#FFFFFF1A] rounded-lg px-4 py-2">
                          <input
                            className="bg-transparent text-white font-body1 text-xs w-full outline-none"
                            value={payAddress}
                            readOnly
                            style={{ border: "none", padding: 0 }}
                          />
                          <img
                            src={copyIcon}
                            alt="Copy"
                            className="w-5 h-5 ml-2 cursor-pointer"
                            onClick={handleCopy}
                          />
                        </div>
                        <div className="flex justify-between ">
                          <p className="text-xs font-body1 text-text_secondary mt-2">
                            Minimum Deposit
                          </p>
                          <p className="text-xs font-body1 text-white mt-2">
                            {payAmount ? `More than ${payAmount} USDT` : ""}
                          </p>
                        </div>
                        <div className="text-xs font-body1 text-yellow-400 mt-2">
                          Do not close this page.
                        </div>
                        {apiMessage && (
                          <div className="text-green-500 text-xs font-body1 mt-2">
                            {apiMessage}
                          </div>
                        )}
                        {apiError && (
                          <div className="text-red-500 text-xs font-body1 mt-2">
                            {apiError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:block w-full hidden">
                    <div className="bg-[#000000] p-0.5 px-2 rounded-xl flex items-center gap-4 ">
                      <div className="flex flex-col items-center">
                        {qrUrl && (
                          <img src={qrUrl} alt="QR Code" className="w-10 h-10 " />
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <div className="flex justify-between bg-[#FFFFFF1A] rounded-lg px-2 py-0.5">
                          <input
                            className="bg-transparent text-white font-body1 text-[9px] w-full outline-none"
                            value={payAddress}
                            readOnly
                            style={{ border: "none", padding: 0 }}
                          />
                          <img
                            src={copyIcon}
                            alt="Copy"
                            className="w-3 h-3 ml-2 cursor-pointer"
                            onClick={handleCopy}
                          />
                        </div>
                        <div className="flex justify-between ">
                          <p className="text-[9px] font-body1 text-text_secondary mt-px">
                            Minimum Deposit
                          </p>
                          <p className="text-[9px] font-body1 text-white mt-px">
                            {payAmount ? `More than ${payAmount} USDT` : ""}
                          </p>
                        </div>
                        <div className="text-[9px] font-body1 text-yellow-400 mt-px">
                          Do not close this page.
                        </div>

                        <div className="absolute bottom-0 right-0">
                          {apiMessage && (
                            <div className="text-green-500 text-[8px] font-body1 mt-px">
                              {apiMessage}
                            </div>
                          )}
                          {apiError && (
                            <div className="text-red-500 text-[8px] font-body1 mt-px">
                              {apiError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {step === 0 && (
              <button
                className=" rounded-full  px-3   text-xs  font-body1"
                style={{
                  background:
                    "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                }}
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Processing..." : "Next"}
              </button>
            )}
          </div>

          {/* Modal for BFM deposit result */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-[#06101A] border border-[#33A0EA] rounded-2xl p-8 max-w-sm w-full flex flex-col items-center">
                <div className="text-lg sm:text-2xl font-header text-white mb-4">
                  BFM Deposit Result
                </div>
                <div
                  className={`text-base font-body1 mb-6 ${
                    apiMessage.toLowerCase().includes("success")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {apiMessage}
                </div>
                <button
                  className="px-8 py-2 rounded-full font-body1 font-semibold text-white mt-2"
                  style={{
                    background:
                      "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                  onClick={() => {
                    setModalOpen(false);
                    setStep(0);
                    setAmount("");
                    setApiError("");
                    setApiMessage("");
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Deposit;
