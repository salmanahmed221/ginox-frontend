import React, { useMemo, useRef, useState } from "react";
import { SparklesCore } from "../ui/sparkles";
import { ChevronDown, Cross, Upload, X } from "lucide-react";
import Navigation from "../navigation";
import Footer from "../footers";
import { isAddress } from "viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const CryptoBlunder1 = () => {
  const [primaryAddress, setPrimaryAddress] = useState<string>("");
  const [singleEntryAddress, setSingleEntryAddress] = useState<string>("");
  const [singleEntryAmount, setSingleEntryAmount] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = window.setTimeout(
      () => setToastMessage(null),
      2500
    );
  };

  const isPrimaryValid = useMemo(
    () => isAddress(primaryAddress.trim()),
    [primaryAddress]
  );
  const isSingleEntryValid = useMemo(
    () => isAddress(singleEntryAddress.trim()),
    [singleEntryAddress]
  );
  const isSingleAmountValid = useMemo(() => {
    const n = Number(singleEntryAmount);
    return Number.isFinite(n) && n > 0;
  }, [singleEntryAmount]);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  return (
    <>
      <Navigation />
      {toastMessage && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-md text-sm"
          style={{
            background:
              "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
          }}
        >
          {toastMessage}
        </div>
      )}
      <div className="w-full h-full pt-10 sm:pt-20 relative flex flex-col items-center justify-center md:px-16">
        {/* hero */}
        <div className="w-full h-full  relative flex flex-col items-center justify-center">
          <div className="w-full absolute inset-0 h-full">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={20}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>
          <div
            className=" w-44 h-44 sm:h-[400px] sm:w-[400px]    blur-3xl opacity-50 rounded-full absolute z-10"
            style={{
              background:
                "linear-gradient(180deg, #0E7BF8 0%, rgba(14, 123, 248, 0) 86.35%)",
            }}
          />
          <div className="w-full flex pb-8 space-y-10 flex-col items-center justify-center max-w-[1440px] mx-auto relative z-20">
            <div className="border border-[#82DDB5]  rounded-full p-px max-w-[250px]  h-[34px] sm:max-w-[400px] w-full sm:h-[64px]">
              <button
                className="text-lg octa  space-x-1 flex cursor-pointer items-center justify-center rounded-full w-full h-full"
                style={{
                  background: `
  linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),
  radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 70.03%, #82ddb667 100%)
`,
                }}
              >
                <img src="./hero/buttonstar.svg" alt="/" className="w-7 h-7" />
                <p className="mt-1 text-xs sm:text-base">
                  Lightning Fast Bulk Transfers
                </p>
              </button>
            </div>

            <div className="flex flex-col space-y-4 items-center leading-[25px] md:leading-[60px] justify-center w-full avalont text-center md:px-28 px-4">
              <p className="md:px-12 px-1 text-xs font-heading2 sm:text-[32px] leading-[25px] md:leading-[60px] font-light ">
                Send Crypto to Multiple Recipients in{" "}
                <span className="text-[#82DDB5] font-heading2 leading-[25px] md:leading-[60px]">
                  One Transaction
                </span>{" "}
              </p>
              <p className="text-[#FFFFFF] text-xs sm:text-lg font-body"></p>
            </div>
          </div>
        </div>
        {/* boxes */}
        <div className=" flex w-full max-w-[93%]  md:flex-row flex-col gap-2 mt-3 ">
          <div className="grid sm:grid-cols-4 w-full  gap-2">
            <div
              className="   p-3   h-[118px] w-full  flex space-x-4 items-center justify-center "
              style={{
                backgroundImage: "url('./rightgreenbox.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="flex flex-col w-full justify-center items-center space-y-6 p-8 ">
                <p className="  text-sm sm:text-lg font-heading2">$2.4M</p>
                <div className="w-full h-px bg-white/10" />
                <p className="text-xs sm:text-base font-heading">Total Sent</p>
              </div>
            </div>

            <div
              className="   p-3  h-[118px] w-full  flex space-x-4 items-center justify-center "
              style={{
                backgroundImage: "url('./bottomgreenbox.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="flex flex-col w-full justify-center items-center space-y-6 p-8 ">
                <p className="text-sm sm:text-lg font-heading2">1,247</p>
                <div className="w-full h-px bg-white/10" />
                <p className="text-xs sm:text-base font-heading">
                  Transactions
                </p>
              </div>
            </div>

            <div
              className="   p-3   h-[118px] w-full  flex space-x-4 items-center justify-center "
              style={{
                backgroundImage: "url('./topgreenbox.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="flex flex-col w-full justify-center items-center space-y-6 p-8 ">
                <p className="text-sm sm:text-lg font-heading2">99.9%</p>
                <div className="w-full h-px bg-white/10" />
                <p className="text-xs sm:text-base font-heading">
                  Success Rate
                </p>
              </div>
            </div>

            <div
              className="   p-3  h-[118px] w-full  flex space-x-4 items-center justify-center "
              style={{
                backgroundImage: "url('./leftgreenbox.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="flex flex-col w-full justify-center items-center space-y-6 p-8 ">
                <p className="text-sm sm:text-lg font-heading2">2.3s</p>
                <div className="w-full h-px bg-white/10" />
                <p className="text-xs sm:text-base font-heading">Avg Speed</p>
              </div>
            </div>
          </div>
        </div>
        {/* connect banner */}
        <div
          className="flex w-full  p-px    max-w-[93%]  mt-10 rounded-md justify-between "
          style={{
            background:
              "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
          }}
        >
          <div className="flex w-full  p-4 md:p-10   bg-[#0c101a]  py-4 rounded-md justify-between gap-3 flex-col md:flex-row items-start md:items-center ">
            <div className=" flex space-x-4 md:space-x-8 items-center">
              <button
                className=" md:px-6 md:py-3  p-1 px-2 rounded-md font-body  text-sm md:text-xl"
                style={{
                  background:
                    "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                }}
              >
                Start Bulk Transfer
              </button>
            </div>
            <div className="w-full md:w-auto flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <button
                    className="md:px-6 md:py-3 p-1 px-2 h-[36px] md:h-auto flex items-center justify-center rounded-full font-body text-sm md:text-xl"
                    style={{
                      background:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                    }}
                  >
                    {`Connected: ${address?.slice(0, 6)}...${address?.slice(
                      -4
                    )}`}
                  </button>
                  <button
                    onClick={() => disconnect()}
                    className="md:px-6 md:py-3 p-1 px-2 h-[36px] md:h-auto flex items-center justify-center rounded-full font-body text-sm md:text-xl bg-black border border-white/20"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openConnectModal && openConnectModal()}
                  className="w-full md:w-auto md:px-6 md:py-3 p-1 px-2 h-[36px] md:h-auto flex items-center justify-center rounded-full font-body text-sm md:text-xl"
                  style={{
                    background:
                      "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                >
                  Connect Wallet
                  <ChevronDown size={32} />
                </button>
              )}
            </div>{" "}
          </div>
        </div>
        {/* content */}
        <div className="flex lg:flex-row flex-col  justify-between w-full px-4 sm:px-8 lg:px-16 mt-16 gap-6">
          <div className=" flex flex-col w-full  lg:w-[70%] gap-10">
            {/* first */}
            <div className="flex items-center w-full justify-between gap-8 ">
              <div className="flex flex-col w-full">
                <div className="w-full bg-[#060a15] rounded-lg  border border-[#FFFFFF1A] flex flex-col p-4 md:p-6">
                  <div>
                    <p className="font-body text-lg ">Enter a wallet address</p>
                    <p className="text-[#FFFFFF80] text-sm font-body">
                      Paste the wallet address below
                    </p>
                  </div>

                  <div
                    className="flex w-full  p-px  mt-6   rounded-md justify-between "
                    style={{
                      background:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                    }}
                  >
                    <div className="flex w-full p-4 md:p-6 bg-[#0c101a] rounded-md">
                      <input
                        value={primaryAddress}
                        onChange={(e) => setPrimaryAddress(e.target.value)}
                        onFocus={() => {
                          if (!isConnected)
                            showToast("Please connect wallet first");
                        }}
                        onClick={() => {
                          if (!isConnected)
                            showToast("Please connect wallet first");
                        }}
                        readOnly={!isConnected}
                        type="text"
                        placeholder="Enter wallet address (e.g., 0x...)"
                        className="w-full bg-transparent outline-none text-white placeholder-[#FFFFFF80] font-body text-sm"
                      />
                    </div>
                  </div>
                  {primaryAddress.length > 0 && (
                    <p
                      className={`text-xs font-body ${
                        isPrimaryValid ? "text-[#2BD48A]" : "text-[#F87171]"
                      }`}
                    >
                      {isPrimaryValid
                        ? "Valid Ethereum address"
                        : "Invalid address"}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* second */}
            <div className="flex w-full  items-center justify-between">
              <div className="flex flex-col w-full   ">
                <div className="w-full bg-[#060a15] rounded-lg  border border-[#FFFFFF1A] flex flex-col p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2">
                    <div className="w-full">
                      <p className="font-body text-lg ">Manage Recipients</p>
                      <p className="text-[#FFFFFF80] text-xs sm:text-sm font-body">
                        Add recipients via CSV upload, bulk text entry, or
                        manual input{" "}
                      </p>
                    </div>

                    <button
                      className=" w-[40%] sm:w-[30%] h-10 gap-1 flex items-center justify-center rounded-full font-body text-xs sm:text-sm md:text-lg"
                      style={{
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                      }}
                    >
                      2 Total
                      <div className="p-1 bg-white rounded-full" />2 Valid
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-8">
                    {/*  */}
                    <div
                      className="flex w-full  p-px  mt-6   rounded-md justify-between "
                      style={{
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                      }}
                    >
                      <div className="flex flex-col w-full  p-4 gap-5  bg-[#0c101a]  items-center py-4 rounded-md justify-between  ">
                        <div className="w-full  flex items-center  justify-between ">
                          <div>
                            <p className="text-base">CSV File Upload</p>
                            <p className="text-xs text-[#FFFFFF80]">
                              Upload bulk recipients from CSV
                            </p>
                          </div>
                          <div className="flex items-center gap-4 justify-between text-xs text-[#FFFFFF80]">
                            <div
                              className="flex p-px    rounded-lg justify-between "
                              style={{
                                background:
                                  "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                              }}
                            >
                              <button className="bg-black  flex items-center px-4 gap-1 py-2 rounded-lg">
                                <svg
                                  width="11"
                                  height="11"
                                  viewBox="0 0 11 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10.223 6.68164C10.1254 6.68164 10.0319 6.72115 9.96296 6.79148C9.89401 6.8618 9.85527 6.95718 9.85527 7.05664V8.33727C9.85527 8.63912 9.7377 8.9286 9.52842 9.14204C9.31914 9.35548 9.0353 9.47539 8.73934 9.47539H2.34155C2.04558 9.47539 1.76174 9.35548 1.55246 9.14204C1.34318 8.9286 1.22561 8.63912 1.22561 8.33727V7.05664C1.22561 6.95718 1.18687 6.8618 1.11792 6.79148C1.04896 6.72115 0.95544 6.68164 0.857923 6.68164C0.760406 6.68164 0.666883 6.72115 0.597928 6.79148C0.528973 6.8618 0.490234 6.95718 0.490234 7.05664V8.33727C0.490721 8.83788 0.685926 9.31784 1.03301 9.67182C1.38009 10.0258 1.8507 10.2249 2.34155 10.2254H8.73934C9.23018 10.2249 9.70079 10.0258 10.0479 9.67182C10.395 9.31784 10.5902 8.83788 10.5906 8.33727V7.05664C10.5906 6.95718 10.5519 6.8618 10.483 6.79148C10.414 6.72115 10.3205 6.68164 10.223 6.68164Z"
                                    fill="url(#paint0_linear_6609_9282)"
                                  />
                                  <path
                                    d="M5.27964 7.2368C5.31382 7.27195 5.35449 7.29984 5.39929 7.31888C5.4441 7.33792 5.49216 7.34772 5.5407 7.34772C5.58924 7.34772 5.63729 7.33792 5.6821 7.31888C5.72691 7.29984 5.76757 7.27195 5.80175 7.2368L7.8939 5.10305C7.95228 5.03141 7.98242 4.94018 7.97847 4.84712C7.97451 4.75406 7.93674 4.66583 7.8725 4.59962C7.80826 4.5334 7.72216 4.49394 7.63097 4.48891C7.53977 4.48389 7.45 4.51365 7.37914 4.57242L5.90839 6.07242V0.498047C5.90839 0.398591 5.86965 0.303208 5.80069 0.232882C5.73174 0.162556 5.63821 0.123047 5.5407 0.123047C5.44318 0.123047 5.34966 0.162556 5.2807 0.232882C5.21175 0.303208 5.17301 0.398591 5.17301 0.498047V6.0668L3.70225 4.5668C3.63326 4.49643 3.53968 4.4569 3.44211 4.4569C3.34454 4.4569 3.25097 4.49643 3.18197 4.5668C3.11298 4.63716 3.07422 4.7326 3.07422 4.83211C3.07422 4.93162 3.11298 5.02706 3.18197 5.09742L5.27964 7.2368Z"
                                    fill="url(#paint1_linear_6609_9282)"
                                  />
                                  <defs>
                                    <linearGradient
                                      id="paint0_linear_6609_9282"
                                      x1="1.80329"
                                      y1="6.89427"
                                      x2="3.09729"
                                      y2="11.3531"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop stop-color="#33A0EA" />
                                      <stop offset="1" stop-color="#0AC488" />
                                    </linearGradient>
                                    <linearGradient
                                      id="paint1_linear_6609_9282"
                                      x1="3.71182"
                                      y1="0.556527"
                                      x2="8.54512"
                                      y2="4.52331"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop stop-color="#33A0EA" />
                                      <stop offset="1" stop-color="#0AC488" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                Template
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          className="border h-full  justify-center items-center border-dashed

 border-[#484848B2] w-full text-center p-5 space-y-3 bg-[#101521] flex flex-col"
                        >
                          <svg
                            width="25"
                            height="28"
                            viewBox="0 0 25 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M24.0295 18.1699C23.7891 18.1699 23.5586 18.2753 23.3886 18.4628C23.2187 18.6504 23.1232 18.9047 23.1232 19.1699V22.5849C23.1232 23.3899 22.8334 24.1618 22.3176 24.731C21.8018 25.3002 21.1022 25.6199 20.3727 25.6199H4.60398C3.87452 25.6199 3.17492 25.3002 2.65911 24.731C2.1433 24.1618 1.85352 23.3899 1.85352 22.5849V19.1699C1.85352 18.9047 1.75804 18.6504 1.58808 18.4628C1.41813 18.2753 1.18762 18.1699 0.947266 18.1699C0.706913 18.1699 0.476405 18.2753 0.30645 18.4628C0.136495 18.6504 0.0410156 18.9047 0.0410156 19.1699V22.5849C0.0422152 23.9199 0.52334 25.1998 1.3788 26.1437C2.23427 27.0877 3.39418 27.6186 4.60398 27.6199H20.3727C21.5825 27.6186 22.7425 27.0877 23.5979 26.1437C24.4534 25.1998 24.9345 23.9199 24.9357 22.5849V19.1699C24.9357 18.9047 24.8402 18.6504 24.6703 18.4628C24.5003 18.2753 24.2698 18.1699 24.0295 18.1699Z"
                              fill="url(#paint0_linear_6614_9327)"
                            />
                            <path
                              d="M11.8459 0.975311C11.9301 0.881582 12.0304 0.807188 12.1408 0.75642C12.2512 0.70565 12.3697 0.679512 12.4893 0.679512C12.609 0.679512 12.7274 0.70565 12.8379 0.75642C12.9483 0.807188 13.0485 0.881582 13.1328 0.975311L18.2893 6.66531C18.4332 6.85634 18.5075 7.09963 18.4978 7.34779C18.488 7.59595 18.3949 7.83122 18.2366 8.00779C18.0783 8.18436 17.866 8.2896 17.6413 8.30301C17.4165 8.31641 17.1952 8.23703 17.0206 8.08031L13.3956 4.08031V18.9453C13.3956 19.2105 13.3001 19.4649 13.1301 19.6524C12.9602 19.84 12.7297 19.9453 12.4893 19.9453C12.249 19.9453 12.0185 19.84 11.8485 19.6524C11.6786 19.4649 11.5831 19.2105 11.5831 18.9453V4.09531L7.95808 8.09531C7.78803 8.28295 7.5574 8.38837 7.31691 8.38837C7.07642 8.38837 6.84579 8.28295 6.67574 8.09531C6.50569 7.90767 6.41016 7.65318 6.41016 7.38781C6.41016 7.12245 6.50569 6.86795 6.67574 6.68031L11.8459 0.975311Z"
                              fill="url(#paint1_linear_6614_9327)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_6614_9327"
                                x1="3.27733"
                                y1="18.7369"
                                x2="6.96191"
                                y2="30.4717"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stop-color="#33A0EA" />
                                <stop offset="1" stop-color="#0AC488" />
                              </linearGradient>
                              <linearGradient
                                id="paint1_linear_6614_9327"
                                x1="7.98165"
                                y1="18.7894"
                                x2="20.6366"
                                y2="9.18974"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stop-color="#33A0EA" />
                                <stop offset="1" stop-color="#0AC488" />
                              </linearGradient>
                            </defs>
                          </svg>

                          <p className="text-base font-body">
                            Drop CSV file here or click to browse
                          </p>
                          <p className="text-xs font-body text-[#FFFFFF80]">
                            Format: address,amount (one per line){" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/*  */}
                    <div
                      className="flex w-full  p-px  mt-6   rounded-md justify-between "
                      style={{
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                      }}
                    >
                      <div className="flex flex-col w-full  p-4    bg-[#0c101a]  items-center py-4 rounded-md justify-between gap-2 ">
                        <div className="w-full">
                          <p className="text-base">Single Address Entry</p>
                          <p className=" text-[#FFFFFF80] text-xs ">
                            Add one recipient at a time
                          </p>
                        </div>
                        <div className="w-full flex flex-col gap-3 mt-3">
                          <div className="flex flex-col w-full gap-2">
                            <p className="text-xs">Wallet Address</p>
                            <input
                              value={singleEntryAddress}
                              onChange={(e) =>
                                setSingleEntryAddress(e.target.value)
                              }
                              onFocus={() => {
                                if (!isConnected)
                                  showToast("Please connect wallet first");
                              }}
                              onClick={() => {
                                if (!isConnected)
                                  showToast("Please connect wallet first");
                              }}
                              readOnly={!isConnected}
                              className="bg-[#FFFFFF0F] rounded-full placeholder:text-[#FFFFFF80] placeholder:text-xs p-2 px-6"
                              type="text"
                              placeholder="0x742d35Cc454f2f883d456"
                            />
                            {singleEntryAddress.length > 0 && (
                              <p
                                className={`text-[10px] font-body ${
                                  isSingleEntryValid
                                    ? "text-[#2BD48A]"
                                    : "text-[#F87171]"
                                }`}
                              >
                                {isSingleEntryValid
                                  ? "Valid address"
                                  : "Invalid address"}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col w-full gap-2">
                            <p className="text-xs">Amount</p>

                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                              <input
                                value={singleEntryAmount}
                                onChange={(e) =>
                                  setSingleEntryAmount(e.target.value)
                                }
                                className="bg-[#FFFFFF0F] w-full rounded-full placeholder:text-[#FFFFFF80] placeholder:text-xs p-2 px-6"
                                type="text"
                                placeholder="0.00"
                              />

                              <button
                                onClick={() => {
                                  if (!isConnected)
                                    showToast("Please connect wallet first");
                                }}
                                disabled={
                                  !isConnected ||
                                  !isSingleEntryValid ||
                                  !isSingleAmountValid
                                }
                                className=" px-20 py-2 rounded-full opacity-80 disabled:opacity-50  "
                                style={{
                                  background:
                                    "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                                }}
                              >
                                Add
                              </button>
                            </div>
                            {singleEntryAmount.length > 0 &&
                              !isSingleAmountValid && (
                                <p className="text-[10px] font-body text-[#F87171]">
                                  Enter a valid amount greater than 0
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*  */}
                    <div
                      className="flex w-full  p-px  mt-6   rounded-md justify-between "
                      style={{
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                      }}
                    >
                      <div className="flex flex-col w-full  p-4    bg-[#0c101a]  items-center py-4 rounded-md justify-between gap-2 ">
                        <div className="w-full">
                          <p className="text-base">Bulk Text Entry</p>
                          <p className=" text-[#FFFFFF80] text-xs">
                            Paste multiple recipients at once
                          </p>
                        </div>
                        <div className="w-full">
                          <p className="text-xs">Recipients List </p>
                        </div>

                        <div className="flex w-full mt-4  flex-col border border-[#484848B2] p-4 gap-1">
                          <p className="text-[#FFFFFFB2] text-xs">
                            0x742d35Cc454f2.....,10.5
                          </p>
                          <p className="text-[#FFFFFFB2] text-xs">
                            0x742d35Cc454f2.....,10.5
                          </p>
                          <p className="text-[#FFFFFFB2] text-xs">
                            0x742d35Cc454f2.....,10.5
                          </p>
                        </div>

                        <button
                          className="w-fit  px-10 my-3 py-2 rounded-full opacity-80  "
                          style={{
                            background:
                              "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                          }}
                        >
                          Add Recipients
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* third */}
            <div className="flex  w-full  items-center justify-between">
              <div className="flex flex-col w-full">
                <div className="w-full bg-[#060a15] rounded-lg  border border-[#FFFFFF1A] flex flex-col p-4 md:p-6">
                  <div className="flex w-full justify-between">
                    <div>
                      <p className="font-body text-lg ">Recipients Overview</p>
                      <p className="text-[#FFFFFF80] text-sm font-body">
                        Review and manage your recipient list{" "}
                      </p>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-lg font-body text-gradient ">
                        35.00 ETH
                      </p>
                      <p className="text-sm font-body text-[#FFFFFF80] ">
                        Total Amount
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex p-px  mt-6   rounded-lg  "
                    style={{
                      background:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                    }}
                  >
                    <div className="bg-[#0c151d] w-full rounded-lg relative">
                      <div className="bg-[#1A2B2E0D] w-full rounded-lg flex justify-between   absolute" />

                      <div className="flex w-full items-center justify-between p-4 md:p-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className="flex p-px    rounded-full"
                            style={{
                              background:
                                "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                            }}
                          >
                            <div className="bg-black w-8 flex items-center justify-center h-8 rounded-full">
                              <p className="text-sm font-body">1</p>
                            </div>
                          </div>
                          <div className="flex items-center  md:gap-2">
                            <p className=" text-xs md:text-lg font-body break-all md:break-normal">
                              0x742d35Cc4545C9f2F8B3d4a95e47B89aB
                            </p>

                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.16947 15.8945C3.95361 15.8945 0.523438 12.4639 0.523438 8.24763C0.523438 4.03133 3.95361 0.601597 8.16947 0.601597C9.37851 0.597967 10.5708 0.884191 11.6465 1.43628C11.6976 1.46245 11.7431 1.49844 11.7804 1.54219C11.8176 1.58595 11.8459 1.63661 11.8636 1.69129C11.8812 1.74596 11.8879 1.80359 11.8834 1.86086C11.8788 1.91814 11.8629 1.97395 11.8367 2.02511C11.8106 2.07627 11.7746 2.12177 11.7308 2.15902C11.6871 2.19627 11.6364 2.22454 11.5817 2.24221C11.5271 2.25988 11.4694 2.26661 11.4122 2.26201C11.3549 2.25741 11.2991 2.24158 11.2479 2.21541C10.2956 1.72665 9.23992 1.47327 8.16947 1.47653C4.4357 1.47653 1.39837 4.51386 1.39837 8.24763C1.39837 11.9814 4.4357 15.0196 8.16947 15.0196C11.9032 15.0196 14.9406 11.9814 14.9406 8.24763C14.9409 7.66552 14.8663 7.0858 14.7188 6.5227C14.6919 6.41138 14.7097 6.29396 14.7685 6.19565C14.8272 6.09734 14.9221 6.02597 15.0329 5.99688C15.1436 5.96779 15.2614 5.98329 15.3609 6.04005C15.4603 6.09681 15.5335 6.19031 15.5648 6.30047C15.7314 6.93626 15.8155 7.59083 15.8151 8.24807C15.8155 12.4639 12.3858 15.8945 8.16947 15.8945Z"
                                fill="#82DDB5"
                              />
                              <path
                                d="M7.93366 10.0927C7.81765 10.0927 7.7064 10.0466 7.62437 9.96455L5.40861 7.74879C5.33399 7.66555 5.29406 7.55691 5.29703 7.44516C5.3 7.33341 5.34563 7.22703 5.42457 7.14787C5.5035 7.06872 5.60975 7.02278 5.72149 7.01949C5.83323 7.01621 5.94199 7.05583 6.02544 7.13021L7.93191 9.03669L14.8417 2.12866C14.9242 2.04897 15.0347 2.00488 15.1494 2.00588C15.2641 2.00687 15.3738 2.05288 15.4549 2.13399C15.536 2.2151 15.5821 2.32482 15.5831 2.43952C15.5841 2.55423 15.54 2.66473 15.4603 2.74724L8.24208 9.96543C8.16013 10.0469 8.04925 10.0927 7.93366 10.0927Z"
                                fill="#82DDB5"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-base text-end ">10 ETH</p>
                            <p className="text-base text-[#FFFFFF66] ">
                              $24000.00
                            </p>
                          </div>

                          <X size={32} className="text-[#FFFFFF66]" />
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div
                    className="flex p-px  mt-6   rounded-lg  "
                    style={{
                      background:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                    }}
                  >
                    <div className="bg-[#0c151d] w-full rounded-lg relative">
                      <div className="bg-[#1A2B2E0D] w-full rounded-lg flex justify-between   absolute" />

                      <div className="flex w-full items-center justify-between p-4 md:p-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className="flex p-px    rounded-full"
                            style={{
                              background:
                                "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                            }}
                          >
                            <div className="bg-black w-8 flex items-center justify-center h-8 rounded-full">
                              <p className="text-sm font-body">2</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 md:gap-2">
                            <p className="text-xs md:text-lg font-body break-all md:break-normal">
                              0x742d35Cc4545C9f2F8B3d4a95e47B89aB
                            </p>

                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.16947 15.8945C3.95361 15.8945 0.523438 12.4639 0.523438 8.24763C0.523438 4.03133 3.95361 0.601597 8.16947 0.601597C9.37851 0.597967 10.5708 0.884191 11.6465 1.43628C11.6976 1.46245 11.7431 1.49844 11.7804 1.54219C11.8176 1.58595 11.8459 1.63661 11.8636 1.69129C11.8812 1.74596 11.8879 1.80359 11.8834 1.86086C11.8788 1.91814 11.8629 1.97395 11.8367 2.02511C11.8106 2.07627 11.7746 2.12177 11.7308 2.15902C11.6871 2.19627 11.6364 2.22454 11.5817 2.24221C11.5271 2.25988 11.4694 2.26661 11.4122 2.26201C11.3549 2.25741 11.2991 2.24158 11.2479 2.21541C10.2956 1.72665 9.23992 1.47327 8.16947 1.47653C4.4357 1.47653 1.39837 4.51386 1.39837 8.24763C1.39837 11.9814 4.4357 15.0196 8.16947 15.0196C11.9032 15.0196 14.9406 11.9814 14.9406 8.24763C14.9409 7.66552 14.8663 7.0858 14.7188 6.5227C14.6919 6.41138 14.7097 6.29396 14.7685 6.19565C14.8272 6.09734 14.9221 6.02597 15.0329 5.99688C15.1436 5.96779 15.2614 5.98329 15.3609 6.04005C15.4603 6.09681 15.5335 6.19031 15.5648 6.30047C15.7314 6.93626 15.8155 7.59083 15.8151 8.24807C15.8155 12.4639 12.3858 15.8945 8.16947 15.8945Z"
                                fill="#82DDB5"
                              />
                              <path
                                d="M7.93366 10.0927C7.81765 10.0927 7.7064 10.0466 7.62437 9.96455L5.40861 7.74879C5.33399 7.66555 5.29406 7.55691 5.29703 7.44516C5.3 7.33341 5.34563 7.22703 5.42457 7.14787C5.5035 7.06872 5.60975 7.02278 5.72149 7.01949C5.83323 7.01621 5.94199 7.05583 6.02544 7.13021L7.93191 9.03669L14.8417 2.12866C14.9242 2.04897 15.0347 2.00488 15.1494 2.00588C15.2641 2.00687 15.3738 2.05288 15.4549 2.13399C15.536 2.2151 15.5821 2.32482 15.5831 2.43952C15.5841 2.55423 15.54 2.66473 15.4603 2.74724L8.24208 9.96543C8.16013 10.0469 8.04925 10.0927 7.93366 10.0927Z"
                                fill="#82DDB5"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-base text-end ">25 ETH</p>
                            <p className="text-base text-[#FFFFFF66] ">
                              $60000.00
                            </p>
                          </div>

                          <X size={32} className="text-[#FFFFFF66]" />
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-[45%] gap-10">
            <div className="flex flex-col border border-[#FFFFFF1A] bg-[#FFFFFF05] rounded-lg p-6">
              <div className="flex items-center gap-4 ">
                <svg
                  width="35"
                  height="34"
                  viewBox="0 0 35 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_6628_16837"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="35"
                    height="34"
                  >
                    <path
                      d="M34.5 33.5V0.5H0.5V33.5H34.5Z"
                      fill="white"
                      stroke="white"
                    />
                  </mask>
                  <g mask="url(#mask0_6628_16837)">
                    <path
                      d="M29.8309 21.2311V31.5098C29.8309 32.6101 28.9127 33.502 27.7801 33.502H7.22265C6.09008 33.502 5.17188 32.6101 5.17188 31.5098V2.49033C5.17188 1.39011 6.09008 0.498147 7.22265 0.498147H21.4068L29.8309 8.6815V18.9069"
                      stroke="url(#paint0_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.4074 3.48634H9.02344C8.64548 3.48634 8.33984 3.78384 8.33984 4.1504V6.57422C8.33984 6.94078 8.64548 7.23828 9.02344 7.23828H19.1171"
                      stroke="url(#paint1_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M29.8303 8.68164H23.457C22.3244 8.68164 21.4062 7.78967 21.4062 6.68946V0.498289"
                      stroke="url(#paint2_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5098 15.125H8.81836C8.69145 15.125 8.56974 15.076 8.48 14.9889C8.39026 14.9017 8.33984 14.7834 8.33984 14.6602V11.0742C8.33984 10.9509 8.39026 10.8327 8.48 10.7455C8.56974 10.6584 8.69145 10.6094 8.81836 10.6094H12.5098C12.6367 10.6094 12.7584 10.6584 12.8481 10.7455C12.9379 10.8327 12.9883 10.9509 12.9883 11.0742V14.6602C12.9883 14.7834 12.9379 14.9017 12.8481 14.9889C12.7584 15.076 12.6367 15.125 12.5098 15.125Z"
                      stroke="url(#paint3_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5098 22.6289H8.81836C8.69145 22.6289 8.56974 22.5799 8.48 22.4928C8.39026 22.4056 8.33984 22.2873 8.33984 22.1641V18.5781C8.33984 18.4549 8.39026 18.3366 8.48 18.2494C8.56974 18.1623 8.69145 18.1133 8.81836 18.1133H12.5098C12.6367 18.1133 12.7584 18.1623 12.8481 18.2494C12.9379 18.3366 12.9883 18.4549 12.9883 18.5781V22.1641C12.9883 22.2873 12.9379 22.4056 12.8481 22.4928C12.7584 22.5799 12.6367 22.6289 12.5098 22.6289Z"
                      stroke="url(#paint4_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5098 30.1328H8.81836C8.69145 30.1328 8.56974 30.0838 8.48 29.9967C8.39026 29.9095 8.33984 29.7913 8.33984 29.668V26.082C8.33984 25.9588 8.39026 25.8405 8.48 25.7533C8.56974 25.6662 8.69145 25.6172 8.81836 25.6172H12.5098C12.6367 25.6172 12.7584 25.6662 12.8481 25.7533C12.9379 25.8405 12.9883 25.9588 12.9883 26.082V29.668C12.9883 29.7913 12.9379 29.9095 12.8481 29.9967C12.7584 30.0838 12.6367 30.1328 12.5098 30.1328Z"
                      stroke="url(#paint5_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.0625 10.6094H26.392"
                      stroke="url(#paint6_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.0625 12.6016H26.392"
                      stroke="url(#paint7_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.0625 18.1133H26.392"
                      stroke="url(#paint8_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.0625 20.1055H26.392"
                      stroke="url(#paint9_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.0625 25.6172H26.392"
                      stroke="url(#paint10_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.0625 27.6094H26.392"
                      stroke="url(#paint11_linear_6628_16837)"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_6628_16837"
                      x1="8.37754"
                      y1="31.5217"
                      x2="30.7734"
                      y2="11.292"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_6628_16837"
                      x1="10.0386"
                      y1="7.01316"
                      x2="11.1893"
                      y2="2.16805"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_6628_16837"
                      x1="22.5014"
                      y1="8.19064"
                      x2="27.9523"
                      y2="1.4069"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_6628_16837"
                      x1="8.94414"
                      y1="14.8541"
                      x2="11.952"
                      y2="11.1108"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint4_linear_6628_16837"
                      x1="8.94414"
                      y1="22.358"
                      x2="11.952"
                      y2="18.6147"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint5_linear_6628_16837"
                      x1="8.94414"
                      y1="29.8619"
                      x2="11.952"
                      y2="26.1186"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint6_linear_6628_16837"
                      x1="17.4053"
                      y1="10.5494"
                      x2="17.5139"
                      y2="9.19387"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint7_linear_6628_16837"
                      x1="17.4053"
                      y1="12.5416"
                      x2="17.5139"
                      y2="11.1861"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint8_linear_6628_16837"
                      x1="17.4053"
                      y1="18.0533"
                      x2="17.5139"
                      y2="16.6978"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint9_linear_6628_16837"
                      x1="17.4053"
                      y1="20.0455"
                      x2="17.5139"
                      y2="18.69"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint10_linear_6628_16837"
                      x1="17.4053"
                      y1="25.5572"
                      x2="17.5139"
                      y2="24.2017"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                    <linearGradient
                      id="paint11_linear_6628_16837"
                      x1="17.4053"
                      y1="27.5494"
                      x2="17.5139"
                      y2="26.1939"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#33A0EA" />
                      <stop offset="1" stop-color="#0AC488" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="font-heading text-xl">Transaction Summary</p>
              </div>

              <div className="flex flex-col mt-4 gap-4 ">
                <div className="flex items-center justify-between ">
                  <p className="text-lg font-body text-[#FFFFFFB2]">
                    Recipients
                  </p>
                  <p className="text-lg font-body">5 addresses</p>
                </div>
                <div className="flex items-center justify-between ">
                  <p className="text-lg font-body text-[#FFFFFFB2]">
                    Total Amount
                  </p>
                  {/* <p className="text-lg font-body">5 addresses</p> */}
                </div>
                <div className="flex items-center justify-between ">
                  <p className="text-lg font-body text-[#FFFFFFB2]">
                    Estimated Gas
                  </p>
                  <p className="text-lg font-body text-[#FBA746]">0.0045 ETH</p>
                </div>
                <div className="flex items-center justify-between ">
                  <p className="text-lg font-body text-[#FFFFFFB2]">
                    Network Fee
                  </p>
                  <p className="text-lg font-body text-[#FBA746]">0.0012 ETH</p>
                </div>

                <div className="w-full h-px bg-[#FFFFFFCC]" />

                <div className="flex items-center justify-between ">
                  <p className="text-lg font-body ">Total Cost</p>
                  <p className="text-lg font-body text-[#0077FF]">
                    260.0057 ETH
                  </p>
                </div>
              </div>

              <div className="flex flex-col mt-6 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg p-4 gap-2 bg-[#4E675FB2] border border-[#278D3D]">
                    <svg
                      width="22"
                      height="20"
                      viewBox="0 0 22 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.6056 18.2161C13.4319 18.2574 13.2568 18.2935 13.0807 18.3245C12.6226 18.4056 12.3197 18.8252 12.4044 19.2619C12.4444 19.4684 12.5679 19.6517 12.7483 19.7725C12.8402 19.8343 12.9442 19.8779 13.0541 19.9008C13.164 19.9237 13.2776 19.9253 13.3882 19.9057C13.598 19.8686 13.8066 19.8255 14.0136 19.7764C14.466 19.6691 14.7416 19.2327 14.6287 18.8021C14.5161 18.3711 14.0583 18.1088 13.6056 18.2161ZM19.8486 7.43939C19.9052 7.60274 20.0155 7.7444 20.1632 7.84343C20.3746 7.98526 20.6513 8.03299 20.9154 7.94984C21.358 7.80986 21.5979 7.35526 21.4514 6.93389C21.3843 6.74101 21.3111 6.55012 21.2318 6.36149C21.0586 5.94919 20.5676 5.74846 20.1344 5.91338C19.7018 6.07821 19.4909 6.54601 19.6642 6.95844C19.7308 7.11693 19.7923 7.27732 19.8486 7.43939ZM16.3488 17.0682C16.1993 17.1623 16.0467 17.2521 15.8914 17.3374C15.4874 17.5593 15.349 18.0511 15.582 18.4357C15.643 18.5367 15.7264 18.6239 15.8265 18.6911C16.0869 18.8656 16.4406 18.8918 16.735 18.7302C16.9199 18.6287 17.1015 18.5218 17.2795 18.4098C17.6684 18.1651 17.7754 17.6663 17.5184 17.2958C17.2614 16.9252 16.7378 16.8234 16.3488 17.0682ZM21.9763 9.68496C21.958 9.2412 21.5655 8.8958 21.0994 8.91312C20.6339 8.93062 20.271 9.30452 20.2892 9.74812C20.2962 9.91772 20.298 10.0899 20.2939 10.2593C20.2874 10.5376 20.4303 10.7857 20.6524 10.9347C20.7893 11.0267 20.9519 11.0776 21.1194 11.081C21.5854 11.0908 21.9715 10.7388 21.9818 10.2949C21.9865 10.0924 21.9847 9.88729 21.9763 9.68496ZM19.7108 14.9531C19.3371 14.6861 18.8085 14.7586 18.5287 15.1138C18.4211 15.2503 18.3092 15.3836 18.1931 15.5136C17.8911 15.8515 17.9338 16.359 18.2886 16.6469C18.3088 16.6632 18.3293 16.6782 18.3505 16.6923C18.7032 16.9292 19.1935 16.8747 19.4787 16.556C19.6173 16.4008 19.7509 16.2416 19.8793 16.0787C20.1591 15.7235 20.0834 15.2197 19.7108 14.9531ZM20.9517 12.0467C20.5069 11.9139 20.0331 12.1497 19.8937 12.5734C19.84 12.7363 19.7812 12.8976 19.7174 13.0572C19.5772 13.4078 19.7115 13.7936 20.0194 14.0004C20.0771 14.0391 20.1396 14.0707 20.2056 14.0946C20.6412 14.2528 21.129 14.0447 21.295 13.6297C21.3708 13.4399 21.4408 13.2481 21.5047 13.0544C21.644 12.6306 21.3965 12.1795 20.9517 12.0467ZM9.9224 18.3317C9.17368 18.2041 8.44571 17.9838 7.75704 17.6763C7.74891 17.6723 7.74165 17.6677 7.73311 17.664C7.57083 17.5913 7.41081 17.5142 7.25326 17.4326C7.25271 17.432 7.25172 17.4316 7.25086 17.4313C6.96148 17.2794 6.68108 17.1125 6.41095 16.9314C2.43973 14.2671 1.48489 9.02258 4.28251 5.24051C4.89085 4.41841 5.62702 3.73256 6.44774 3.18896C6.45786 3.18225 6.46797 3.17559 6.47799 3.16884C9.37009 1.27099 13.2971 1.14309 16.3681 3.0933L15.7085 4.00091C15.5251 4.25354 15.638 4.43763 15.959 4.41011L18.824 4.16583C19.1454 4.13832 19.3376 3.87353 19.2512 3.57791L18.4818 0.937929C18.3957 0.641971 18.1752 0.606545 17.9916 0.859125L17.3305 1.76888C15.0768 0.328084 12.3738 -0.221314 9.69087 0.221764C9.42231 0.266144 9.15564 0.320355 8.89145 0.384275C8.88942 0.384619 8.8878 0.384834 8.88617 0.385178C8.87602 0.387542 8.86572 0.390681 8.85584 0.393303C6.54232 0.959125 4.5238 2.24421 3.08346 4.07774C3.07131 4.09145 3.05881 4.10487 3.04734 4.11979C2.99922 4.18162 2.95189 4.244 2.90537 4.30693C2.82896 4.41029 2.75464 4.51504 2.68246 4.62112C2.67348 4.63385 2.66662 4.64679 2.65876 4.65964C1.47017 6.41377 0.896873 8.44171 0.995192 10.5063C0.995418 10.5131 0.995011 10.5199 0.995192 10.5269C1.00495 10.7298 1.02133 10.9324 1.04431 11.1343C1.04553 11.1473 1.04855 11.1596 1.05085 11.1726C1.07432 11.3761 1.1044 11.5789 1.14105 11.7807C1.51771 13.8503 2.54279 15.7126 4.07883 17.1616C4.0824 17.165 4.0861 17.1687 4.08971 17.1722C4.09098 17.1736 4.09238 17.1743 4.09359 17.1755C4.51022 17.5669 4.96005 17.925 5.43851 18.2459C6.70338 19.0948 8.11185 19.6559 9.62447 19.9144C10.0834 19.9929 10.5218 19.7019 10.6042 19.2651C10.6865 18.8279 10.3812 18.41 9.9224 18.3317Z"
                        fill="#2BD48A"
                      />
                      <path
                        d="M10.9646 3.57617C10.587 3.57617 10.2812 3.86766 10.2812 4.22669V10.7076L16.505 13.7717C16.6017 13.8195 16.709 13.8444 16.8179 13.8444C17.0651 13.8444 17.3039 13.7162 17.4253 13.4925C17.5984 13.1732 17.4674 12.781 17.1322 12.6162L11.6471 9.91547V4.22669C11.6471 3.86766 11.3416 3.57617 10.9646 3.57617Z"
                        fill="#2BD48A"
                      />
                    </svg>

                    <p className="text-[#2BD48A] text-lg ">~2 mins</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg p-4 gap-2 bg-[#7BA7BA66] border border-[#3CA3DB]">
                    <svg
                      width="21"
                      height="24"
                      viewBox="0 0 21 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.24219 21.5859L7.24297 16.5538"
                        stroke="#1AADFF"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.027 10.1501L16.0313 1.0007H7.84237L3.29297 13.8099H10.572L8.75225 23.0508L17.8511 10.1501H11.027Z"
                        stroke="#1AADFF"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3.48708 5.09951L0.5625 13.334"
                        stroke="#1AADFF"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M19.1467 1.00147L16.6445 5.57617"
                        stroke="#1AADFF"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.3551 18.3846L12.1055 23.0508"
                        stroke="#1AADFF"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M19.6678 12.3103L18.043 14.5977"
                        stroke="#1AADFF"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p className="text-[#00A4FF] text-lg ">Fast</p>
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-lg p-4 gap-2 bg-[#644D694D] border border-[#862A9D]">
                    <svg
                      width="16"
                      height="19"
                      viewBox="0 0 16 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.7496 4.69043C15.7402 4.19882 15.7313 3.73439 15.7313 3.2851C15.7313 3.11606 15.6642 2.95394 15.5446 2.83442C15.4251 2.71489 15.263 2.64774 15.094 2.64774C12.3682 2.64774 10.2929 1.86438 8.56298 0.18243C8.44402 0.0667033 8.28461 0.00195313 8.11865 0.00195312C7.95269 0.00195312 7.79328 0.0667033 7.67433 0.18243C5.94462 1.86438 3.86963 2.64774 1.14403 2.64774C0.974988 2.64774 0.812873 2.71489 0.693345 2.83442C0.573817 2.95394 0.506667 3.11606 0.506667 3.2851C0.506667 3.73448 0.497828 4.19907 0.488396 4.69077C0.401035 9.26582 0.281382 15.5316 7.9099 18.1758C8.04509 18.2227 8.19213 18.2227 8.32732 18.1758C15.9564 15.5315 15.8369 9.26557 15.7496 4.69043ZM8.11869 16.8972C1.57624 14.5206 1.67516 9.31418 1.76294 4.71508C1.76821 4.43906 1.77331 4.17154 1.77688 3.90928C4.32972 3.80153 6.37114 3.02794 8.11869 1.50559C9.86642 3.02794 11.9082 3.80161 14.4612 3.90928C14.4648 4.17145 14.4699 4.4388 14.4751 4.71465C14.5628 9.31392 14.6617 14.5205 8.11869 16.8972Z"
                        fill="#CB47FF"
                      />
                    </svg>

                    <p className="text-[#CB47FF] text-lg ">Secure</p>
                  </div>
                </div>

                <button
                  className="px-12 py-3 rounded-full w-full sm:w-[70%] mx-auto font-body text-base"
                  style={{
                    background:
                      "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                >
                  Execute Bulk Transfer
                </button>
                <p className="text-xs text-[#FFFFFFB2] text-center">
                  Review all details before confirming. This action cannot be
                  undone.
                </p>
              </div>
            </div>

            <div className="w-full bg-[#060a15] rounded-lg  border border-[#FFFFFF1A] flex flex-col p-6">
              <div>
                <p className="font-body text-lg ">Recent Transfers</p>
                <p className="text-[#FFFFFF80] text-sm font-body">
                  Your latest bulk transfer history
                </p>
              </div>

              <div
                className="flex w-full  p-px  mt-6   rounded-md justify-between "
                style={{
                  background:
                    "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                }}
              >
                <div className="flex w-full  p-3   bg-[#0c101a]  items-center py-4 rounded-md justify-between gap-2 ">
                  <div className="flex flex-col gap-1">
                    <p className="text-base ">50 ETH</p>
                    <p className="text-[#FFFFFFB2] text-xs">
                      25 recipients - 2 hours ago
                    </p>
                    <p className="text-[#FFFFFFB2] text-xs">0x742d35123</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="px-8 py-2 rounded-full w-fit mx-auto font-body text-base"
                      style={{
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                      }}
                    >
                      Completed
                    </button>

                    <p className="text-xs text-[#FFFFFFB2] text-center">
                      View Details →
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex w-full  p-px  mt-6   rounded-md justify-between "
                style={{
                  background:
                    "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                }}
              >
                <div className="flex w-full  p-3   bg-[#0c101a]  items-center py-4 rounded-md justify-between gap-2 ">
                  <div className="flex flex-col gap-1">
                    <p className="text-base ">50 ETH</p>
                    <p className="text-[#FFFFFFB2] text-xs">
                      25 recipients - 2 hours ago
                    </p>
                    <p className="text-[#FFFFFFB2] text-xs">0x742d35123</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="px-8 py-2 rounded-full w-fit mx-auto font-body text-base"
                      style={{
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                      }}
                    >
                      Completed
                    </button>

                    <p className="text-xs text-[#FFFFFFB2] text-center">
                      View Details →
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex w-full  p-px  mt-6   rounded-md justify-between "
                style={{
                  background:
                    "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                }}
              >
                <div className="flex w-full  p-3   bg-[#0c101a]  items-center py-4 rounded-md justify-between gap-2 ">
                  <div className="flex flex-col gap-1">
                    <p className="text-base ">50 ETH</p>
                    <p className="text-[#FFFFFFB2] text-xs">
                      25 recipients - 2 hours ago
                    </p>
                    <p className="text-[#FFFFFFB2] text-xs">0x742d35123</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="px-8 py-2 rounded-full w-fit mx-auto font-body text-base"
                      style={{
                        background:
                          "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                      }}
                    >
                      Completed
                    </button>

                    <p className="text-xs text-[#FFFFFFB2] text-center">
                      View Details →
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CryptoBlunder1;
