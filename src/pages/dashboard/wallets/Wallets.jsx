import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import DepositHistory from "./DepositHistory";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import BuyBfm from "./BuyBfm";
import { SparklesCore } from "../../../components/ui/sparkles";
import WithdrawHistory from "./WithdrawHistory";
import {
  FaWallet,
  FaShoppingCart,
  FaArrowDown,
  FaArrowUp,
  FaHistory,
} from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { BiSupport, BiTransfer } from "react-icons/bi";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const Wallets = () => {
  const [activeSection, setActiveSection] = useState("item-1");
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("wallets");
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyTab, setHistoryTab] = useState("withdrawal"); // History tabs state
  const [depositData, setDepositData] = useState([]);
  const [depositLoading, setDepositLoading] = useState(false);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };
  // Dummy data for the wallet chart
  const walletChartData = [
    { name: "A", value: 0.000002 },
    { name: "B", value: 0.0000021 },
    { name: "C", value: 0.0000023 },
    { name: "D", value: 0.000002 },
    { name: "E", value: 0.00000206 },
    { name: "F", value: 0.000002 },
    { name: "G", value: 0.00000204 },
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get("/financials/assets", { headers: { token } })
      .then((res) => {
        if (res.data && res.data.success && res.data.data) {
          setAssets(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Fetch deposit data when deposit tab is active
  useEffect(() => {
    if (historyTab === "deposit") {
      setDepositLoading(true);
      const params = { page: 1, pageSize: 50, status: null };
      axios
        .get(
          "/financials/gusd/deposit/history?" +
            new URLSearchParams(params).toString(),
          {
            headers: { token },
          }
        )
        .then((res) => {
          setDepositData(res.data?.data?.data || []);
        })
        .finally(() => setDepositLoading(false));
    }
  }, [historyTab, token]);

  return (
    <div className="bg-[#010510] flex flex-col items-center justify-center  h-screen w-full z-50      relative ">
      <div
        className=" w-[1200px] h-screen       blur-3xl opacity-30 rounded-full absolute top-12 "
        style={{
          background:
            "linear-gradient(180deg, #0E7BF8 0%, rgba(14, 123, 248, 0) 86.35%)",
        }}
      />
      <div
        className=" w-[1200px] h-screen  blur-3xl opacity-20     rotate-180 rounded-full absolute  "
        style={{
          background:
            "linear-gradient(180deg, #0E7BF8 0%, rgba(14, 123, 248, 0) 86.35%)",
        }}
      />
      <div className="w-full absolute  h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="06101A"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="w-full  max-w-[1100px] items-center justify-center px-4  ">
        <div className="relative z-50 w-full ">
          <div className=" h-[90vh] md:h-[80vh]    px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header title={activeTab} />

            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />
            <div className="relative overflow-y-auto  pt-3  md:h-full  w-full element ">
              {activeTab === "wallets" && (
                <div className="   w-full   items-center h-full">
                  {/* Mobile Circle Icons */}

                  <div className="flex flex-col w-full">
                    <div className="w-full md:hidden flex justify-between items-center py-2 px-1">
                      <div
                        className={`    flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-1"
                            ? "border-[#0AC488]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-1")}
                      >
                        <div className="text-lg ">
                          <FaWallet />
                        </div>
                        {/* <div className="text-[6px] text-white mt-1">Wallet</div> */}
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-2"
                            ? "border-[#0AC488]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-2")}
                      >
                        <div className="text-lg ">
                          <FaShoppingCart />
                        </div>
                        {/* <div className="text-[6px] text-white mt-1">Buy</div> */}
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-3"
                            ? "border-[#0AC488]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-3")}
                      >
                        <div className="text-lg ">
                          <FaArrowDown />
                        </div>
                        {/* <div className="text-[6px] text-white mt-1">Deposit</div> */}
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-4"
                            ? "border-[#0AC488]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-4")}
                      >
                        <div className="text-lg ">
                          <FaArrowUp />
                        </div>
                        {/* <div className="text-[6px] text-white mt-1">Withdraw</div> */}
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-5"
                            ? "border-[#0AC488]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-5")}
                      >
                        <div className="text-lg ">
                          <FaHistory />
                        </div>
                        {/* <div className="text-[6px] text-white mt-1">Deposit History</div> */}
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-6"
                            ? "border-[#0AC488]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-6")}
                      >
                        <div className="text-lg ">
                          <BiTransfer />
                        </div>
                        {/* <div className="text-[6px] text-white mt-1">Withdraw History</div> */}
                      </div>
                    </div>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full md:hidden block mt-2"
                      value={activeSection}
                      onValueChange={(value) => {
                        setActiveSection(value);
                        // Add smooth scrolling to the selected section
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }, 100);
                      }}
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger
                          id="mobile-section-1"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Profile
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className=" group relative bg-gradient-to-br  overflow-y-auto   from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                            <>
                              <div
                                className="w-full rounded-2xl  p-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between  shadow-xl border border-[#22304a] relative"
                                style={{
                                  background:
                                    "linear-gradient(180deg, #05172C 0%, #000000 100%)",
                                }}
                              >
                                {loading && (
                                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05172C]/80 backdrop-blur-sm rounded-2xl">
                                    <div className="flex flex-col items-center justify-center">
                                      {/* Spinner */}
                                    </div>
                                  </div>
                                )}

                                <div className="flex-1">
                                  <div className="text-base text-white mb-1 font-body1">
                                    Estimated Balance
                                  </div>
                                  <div className="text-xl  font-heading2 text-gradient ">
                                    {assets?.gusd?.balance || "0.00"}{" "}
                                    <span className="text-base sm:text-[20px] text-white font-body1">
                                      GUSD
                                    </span>
                                  </div>
                                  <div className="font-body1 text-[10px] mt-1 text-white ">
                                    Today's PNL{" "}
                                    <span
                                      className={`font-bold font-body1 ${
                                        assets?.gusd?.data?.dollarPnl < 0
                                          ? "text-[#C40A0A]"
                                          : "text-help_link_green"
                                      }`}
                                    >
                                      {assets?.gusd?.data?.dollarPnl >= 0
                                        ? "+"
                                        : ""}
                                      ${assets?.gusd?.data?.dollarPnl || "0.00"}{" "}
                                      (
                                      {assets?.gusd?.data?.percentagePnl >= 0
                                        ? "+"
                                        : ""}
                                      {assets?.gusd?.data?.percentagePnl ||
                                        "0.00"}
                                      %)
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* My Assets */}
                              <div className="mt-4">
                                <div className="mb-3 text-base font-header tracking-widest">
                                  MY ASSETS
                                </div>
                                <div className="w-full bg-[#11161f] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a] relative">
                                  {loading && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#11161f]/80 backdrop-blur-sm">
                                      {/* Spinner */}
                                    </div>
                                  )}

                                  <div className="grid grid-cols-3 text-center md:text-left text-xs sm:text-sm md:text-base bg-black text-white font-body1 px-4 py-3">
                                    <div>Coin</div>
                                    <div>Amount</div>
                                    <div>Today's PNL (%)</div>
                                  </div>

                                  <div className="divide-y divide-[#222b3a] max-h-[30vh] overflow-y-auto">
                                    {assets && (
                                      <>
                                        {/* GUSD */}
                                        <div className="grid grid-cols-3 items-center px-4 py-3 text-center md:text-left bg-[#FFFFFF1A]">
                                          <div className="flex items-center space-x-2">
                                            <img
                                              src="/assets/images/eth.png"
                                              alt="GUSD"
                                              className="w-4 h-4 sm:w-8 sm:h-8 rounded-full"
                                            />
                                            <span className="text-gradient sm:text-lg font-header">
                                              GUSD
                                            </span>
                                          </div>
                                          <div className="text-text_primary font-body1">
                                            {assets.gusd.balance}
                                          </div>
                                          <div
                                            className={`font-body1 ${
                                              assets.gusd.data.percentagePnl < 0
                                                ? "text-[#C40A0A]"
                                                : "text-help_link_green"
                                            }`}
                                          >
                                            {assets.gusd.data.percentagePnl >= 0
                                              ? "+"
                                              : ""}
                                            {assets.gusd.data.percentagePnl}%
                                          </div>
                                        </div>

                                        {/* BFM */}
                                        <div className="grid grid-cols-3 items-center px-4 py-3 text-center md:text-left bg-[#11161f]">
                                          <div className="flex items-center space-x-2">
                                            <img
                                              src="/assets/images/bfm-logo.png"
                                              alt="BFM"
                                              className="w-4 h-4 sm:w-8 sm:h-8 rounded-full"
                                            />
                                            <span className="text-gradient sm:text-lg font-header">
                                              BFM
                                            </span>
                                          </div>
                                          <div className="text-text_primary font-body1">
                                            {assets.bfm.balance}
                                          </div>
                                          <div
                                            className={`font-body1 ${
                                              assets.bfm.data.percentagePnl < 0
                                                ? "text-[#C40A0A]"
                                                : "text-help_link_green"
                                            }`}
                                          >
                                            {assets.bfm.data.percentagePnl >= 0
                                              ? "+"
                                              : ""}
                                            {assets.bfm.data.percentagePnl}%
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full md:hidden block"
                      value={activeSection}
                      onValueChange={(value) => {
                        setActiveSection(value);
                        // Add smooth scrolling to the selected section
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }, 100);
                      }}
                    >
                      <AccordionItem value="item-2">
                        <AccordionTrigger
                          id="mobile-section-2"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Recent Login
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className=" group relative bg-gradient-to-br  overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3   overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20 ">
                            <BuyBfm />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full md:hidden block"
                      value={activeSection}
                      onValueChange={(value) => {
                        setActiveSection(value);
                        // Add smooth scrolling to the selected section
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }, 100);
                      }}
                    >
                      <AccordionItem value="item-3">
                        <AccordionTrigger
                          id="mobile-section-3"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Security Pin
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className=" group relative overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3  overflow-hidden transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                            <Deposit />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full md:hidden block"
                      value={activeSection}
                      onValueChange={(value) => {
                        setActiveSection(value);
                        // Add smooth scrolling to the selected section
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }, 100);
                      }}
                    >
                      <AccordionItem value="item-4">
                        <AccordionTrigger
                          id="mobile-section-4"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Support Pin
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className=" group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4   overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20 ">
                            <Withdraw />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full md:hidden block"
                      value={activeSection}
                      onValueChange={(value) => {
                        setActiveSection(value);
                        // Add smooth scrolling to the selected section
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }, 100);
                      }}
                    >
                      <AccordionItem value="item-5">
                        <AccordionTrigger
                          id="mobile-section-5"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          2FA Authentication
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className=" group relative overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4   overflow-hidden transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                            <DepositHistory />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full md:hidden block"
                      value={activeSection}
                      onValueChange={(value) => {
                        setActiveSection(value);
                        // Add smooth scrolling to the selected section
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }, 100);
                      }}
                    >
                      <AccordionItem value="item-6">
                        <AccordionTrigger
                          id="mobile-section-6"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Telegram
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className=" group relative bg-gradient-to-br overflow-y-auto  from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4  overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20 ">
                            <WithdrawHistory />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="flex w-full  ">
                    <div className="hidden md:flex flex-col  gap-3 md:max-w-[40%] w-full h-full  ">
                      {/* Wallet Card */}
                      <div className="md:flex items-center hidden group relative bg-gradient-to-br       from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-2 overflow-hidden transition-all duration-700  ">
                        <div
                          className="w-full rounded-2xl  p-2 flex flex-col  gap-1 md:items-end md:justify-between  shadow-xl border border-[#22304a] relative"
                          style={{
                            background:
                              "linear-gradient(180deg, #05172C 0%, #000000 100%)",
                          }}
                        >
                          {loading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05172C]/80 backdrop-blur-sm rounded-2xl">
                              <div className="flex flex-col items-center justify-center">
                                {/* Spinner */}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center w-full justify-between ">
                            <div className="text-md    text-white  font-body1">
                              Estimated Balance
                            </div>
                            <div className="text-base sm:text-[10px] font-heading2 text-gradient ">
                              {assets?.gusd?.balance || "0.00"}{" "}
                              <span className="text-base sm:text-[14px] text-white font-body1">
                                GUSD
                              </span>
                            </div>
                          </div>
                          <div className="font-body1 text-[10px]  text-white ">
                            Today's PNL{" "}
                            <span
                              className={`font-bold font-body1 ${
                                assets?.gusd?.data?.dollarPnl < 0
                                  ? "text-[#C40A0A]"
                                  : "text-help_link_green"
                              }`}
                            >
                              {assets?.gusd?.data?.dollarPnl >= 0 ? "+" : ""}$
                              {assets?.gusd?.data?.dollarPnl || "0.00"} (
                              {assets?.gusd?.data?.percentagePnl >= 0
                                ? "+"
                                : ""}
                              {assets?.gusd?.data?.percentagePnl || "0.00"}%)
                            </span>
                          </div>

                          <div className="w-full">
                            <div className="w-full bg-[#11161f] rounded-2xl  overflow-hidden shadow-lg border border-[#222b3a] relative">
                              {loading && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#11161f]/80 backdrop-blur-sm">
                                  {/* Spinner */}
                                </div>
                              )}

                              <div className="grid grid-cols-3  py-1   w-full text-xs   bg-black text-white font-body1 px-4 ">
                                <div>Coin</div>
                                <div>Amount</div>
                                <div>Today's PNL (%)</div>
                              </div>

                              <div className="divide-y divide-[#222b3a] max-h-[30vh] overflow-y-auto">
                                {assets && (
                                  <>
                                    {/* GUSD */}
                                    <div className="grid grid-cols-3 items-center px-4 py-1 text-center md:text-left bg-[#FFFFFF1A]">
                                      <div className="flex items-center space-x-2">
                                        <img
                                          src="/assets/images/eth.png"
                                          alt="GUSD"
                                          className="w-4 h-4  rounded-full"
                                        />
                                        <span className="text-gradient sm:text-[9px] font-header">
                                          GUSD
                                        </span>
                                      </div>
                                      <div className="text-text_primary   sm:text-[9px] font-body1">
                                        {assets.gusd.balance}
                                      </div>
                                      <div
                                        className={`font-body1  sm:text-[9px] ${
                                          assets.gusd.data.percentagePnl < 0
                                            ? "text-[#C40A0A]"
                                            : "text-help_link_green"
                                        }`}
                                      >
                                        {assets.gusd.data.percentagePnl >= 0
                                          ? "+"
                                          : ""}
                                        {assets.gusd.data.percentagePnl}%
                                      </div>
                                    </div>

                                    {/* BFM */}
                                    <div className="grid grid-cols-3 items-center px-4 py-1  text-center md:text-left bg-[#11161f]">
                                      <div className="flex items-center space-x-2">
                                        <img
                                          src="/assets/images/bfm-logo.png"
                                          alt="BFM"
                                          className="w-4 h-4  rounded-full"
                                        />
                                        <span className="text-gradient sm:text-[9px] font-header">
                                          BFM
                                        </span>
                                      </div>
                                      <div className="text-text_primary sm:text-[9px]  font-body1">
                                        {assets.bfm.balance}
                                      </div>
                                      <div
                                        className={`font-body1 sm:text-[9px]   ${
                                          assets.bfm.data.percentagePnl < 0
                                            ? "text-[#C40A0A]"
                                            : "text-help_link_green"
                                        }`}
                                      >
                                        {assets.bfm.data.percentagePnl >= 0
                                          ? "+"
                                          : ""}
                                        {assets.bfm.data.percentagePnl}%
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:flex items-center hidden group relative bg-gradient-to-br       from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700  ">
                        <Deposit />
                      </div>

                      <div className="md:flex items-center hidden group relative bg-gradient-to-br         from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700  ">
                        <Withdraw />
                      </div>
                    </div>

                    <div className=" hidden md:flex flex-col  gap-4 w-full md:max-w-[60%] md:h-full  ">
                      <div className="md:block hidden group relative bg-gradient-to-br   from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3  overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20 ">
                        <BuyBfm />
                      </div>

                      <div className="md:block hidden group relative bg-gradient-to-br  from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3  overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20 ">
                        <div>
                          {/* History Tabs Section */}
                          {/* Tab Navigation */}
                          <div className="flex items-end justify-end  ">
                            <button
                              onClick={() => setHistoryTab("withdrawal")}
                              className={`px-2 rounded-full py-1 text-[10px] font-medium transition-colors ${
                                historyTab === "withdrawal"
                                  ? "bg-[linear-gradient(140.4deg,_rgba(51,_160,_234,_0.4)_9.17%,_rgba(10,_196,_136,_0.4)_83.83%)]"
                                  : "text-gray-400 hover:text-white"
                              }`}
                            >
                              Withdrawal History
                            </button>
                            <button
                              onClick={() => setHistoryTab("deposit")}
                              className={`px-2 rounded-full py-1 text-[10px] font-medium transition-colors ${
                                historyTab === "deposit"
                                  ? "bg-[linear-gradient(140.4deg,_rgba(51,_160,_234,_0.4)_9.17%,_rgba(10,_196,_136,_0.4)_83.83%)]"
                                  : "text-gray-400 hover:text-white"
                              }`}
                            >
                              Deposit History
                            </button>
                            <button
                              onClick={() => setHistoryTab("statement")}
                              className={`px-2 rounded-full py-1 text-[10px] font-medium transition-colors ${
                                historyTab === "statement"
                                  ? "bg-[linear-gradient(140.4deg,_rgba(51,_160,_234,_0.4)_9.17%,_rgba(10,_196,_136,_0.4)_83.83%)]"
                                  : "text-gray-400 hover:text-white"
                              }`}
                            >
                              Wallets Statement
                            </button>
                          </div>

                          {/* Tab Content */}
                          <div className="">
                            {historyTab === "withdrawal" && <WithdrawHistory />}

                            {historyTab === "statement" && (
                              <div>
                                <div className="w-full bg-[#11161f] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a] overflow-x-auto mt-2">
                                  <div className="min-w-[800px]">
                                    <div
                                      className="grid text-center font-body1"
                                      style={{
                                        gridTemplateColumns:
                                          "0.5fr 2fr 2fr 1.5fr 1.5fr 1.5fr ",
                                      }}
                                    >
                                      <div className="p-2 bg-black text-white text-[10px] tracking-widest border-b border-[#232b36] first:rounded-tl-2xl">
                                        #
                                      </div>
                                      <div className="p-2 bg-black text-white text-[10px] tracking-widest border-b border-[#232b36]">
                                        Date & Time
                                      </div>
                                      <div className="p-2 bg-black text-white text-[10px] tracking-widest border-b border-[#232b36]">
                                        Description
                                      </div>
                                      <div className="p-2 bg-black text-white text-[10px] tracking-widest border-b border-[#232b36]">
                                        Amount
                                      </div>
                                      <div className="p-2 bg-black text-white text-[10px] tracking-widest border-b border-[#232b36]">
                                        Currency
                                      </div>
                                      <div className="p-2 bg-black text-white text-[10px] tracking-widest border-b border-[#232b36] last:rounded-tr-2xl">
                                        Status
                                      </div>
                                    </div>
                                    <div className="divide-y divide-[#222b3a] md:h-[70px] h-[200px] overflow-y-auto">
                                      {depositLoading ? (
                                        <div className="text-center py-4 font-body1 text-white text-[10px]">
                                          Loading...
                                        </div>
                                      ) : depositData.length === 0 ? (
                                        <div className="text-center py-4 text-white font-body1 text-[10px]">
                                          No deposit data available
                                        </div>
                                      ) : (
                                        depositData.map((row, idx) => (
                                          <div
                                            key={row._id || idx}
                                            className={`grid text-center font-body1 p-2 ${
                                              idx % 2 === 0
                                                ? "bg-[#FFFFFF1A]"
                                                : "bg-[#11161f]"
                                            }`}
                                            style={{
                                              gridTemplateColumns:
                                                "0.5fr 2fr 2fr 1.5fr 1.5fr 1.5fr",
                                            }}
                                          >
                                            <div className="text-white text-[10px] border-b border-[#232b36] tracking-widest truncate">
                                              {idx + 1}
                                            </div>
                                            <div className="text-white text-[10px] border-b border-[#232b36] tracking-widest truncate">
                                              {new Date(
                                                row.createdAt
                                              ).toLocaleString()}
                                            </div>
                                            <div className="text-white text-[10px] border-b border-[#232b36] tracking-widest truncate">
                                              {row.deposit_type || "-"}
                                            </div>
                                            <div className="text-white text-[10px] border-b border-[#232b36] tracking-widest truncate">
                                              {row.amount}
                                            </div>
                                            <div className="text-white text-[10px] border-b border-[#232b36] tracking-widest truncate">
                                              {row.currency_code || "-"}
                                            </div>
                                            <div className="text-white text-[10px] border-b border-[#232b36] tracking-widest flex items-center justify-center">
                                              <span
                                                className={`font-body1 truncate text-[10px] ${
                                                  row.status === true
                                                    ? "text-help_link_green"
                                                    : "text-[#FF6B6B]"
                                                }`}
                                              >
                                                {row.status === true
                                                  ? "Completed"
                                                  : "Pending"}
                                              </span>
                                            </div>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className=" text-center text-text_secondary text-[10px] font-body1 mt-2">
                                  Showing 0 of 0 withdraws
                                </div>
                              </div>
                            )}

                            {historyTab === "deposit" && <DepositHistory />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full hidden md:flex">
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallets;
