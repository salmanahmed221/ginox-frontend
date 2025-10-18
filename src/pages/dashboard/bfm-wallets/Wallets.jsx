import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import BuyBfm from "./BuyBfm";
import { SparklesCore } from "../../../components/ui/sparkles";

const BfmWallets = () => {
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("wallets");
  const [bfmData, setBfmData] = useState(null);

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
    axios
      .get("/financials/bfm/statement?pageSize=20&order=asc&page=1", {
        headers: { token },
      })
      .then((res) => {
        if (
          res.data &&
          res.data.success &&
          Array.isArray(res.data.data) &&
          res.data.data.length > 0
        ) {
          setBfmData(res.data.data[0]);
        }
      });
  }, [token]);

  return (
    <div className="bg-[#010510] flex flex-col items-center justify-center  h-screen w-full      relative ">
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
          <div className=" h-[90vh] md:h-[80vh]  px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header title="Bfm Wallets" />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />
            <div className="w-full ">
              {/* Tabs */}
              <div
                className="flex border-b rounded-t-xl border-gray_line mb-2"
                style={{
                  background:
                    " linear-gradient(140.4deg, rgba(51, 160, 234, 0.1) 9.17%, rgba(10, 196, 136, 0.1) 83.83%)",
                }}
              >
                <button
                  className={`px-6 py-3 text-lg font-semibold rounded-t-xl focus:outline-none ${
                    activeTab === "wallets"
                      ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white"
                      : "text-text_secondary"
                  }`}
                  onClick={() => setActiveTab("wallets")}
                >
                  Wallets
                </button>
                <button
                  className={`px-6 py-3 text-lg font-semibold rounded-t-xl focus:outline-none ${
                    activeTab === "deposits"
                      ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white"
                      : "text-text_secondary"
                  }`}
                  onClick={() => setActiveTab("deposits")}
                >
                  Deposits
                </button>
                <button
                  className={`px-6 py-3 text-lg font-semibold rounded-t-xl focus:outline-none ${
                    activeTab === "buy"
                      ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white"
                      : "text-text_secondary"
                  }`}
                  onClick={() => setActiveTab("buy")}
                >
                  Buy
                </button>
                <button
                  className={`px-6 py-3 text-lg font-semibold rounded-t-xl focus:outline-none ${
                    activeTab === "withdrawals"
                      ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white border-b-gradient"
                      : "text-text_secondary"
                  }`}
                  onClick={() => setActiveTab("withdrawals")}
                >
                  Withdrawals
                </button>
              </div>
              <div className="relative overflow-y-auto pt-6 px-4 sm:px-6 md:p-10 w-full element">
                {activeTab === "wallets" && (
                  <>
                    {/* Balance Card */}
                    <div
                      className="w-full rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between mb-3 shadow-xl border border-[#22304a]"
                      style={{
                        background:
                          "linear-gradient(180deg, #05172C 0%, #000000 100%)",
                      }}
                    >
                      <div className="flex-1 mb-6 md:mb-0">
                        <div className="text-sm text-white mb-2">
                          Estimated Balance
                        </div>
                        <div className="text-3xl md:text-md font-heading2 text-gradient mb-1">
                          0.00000206{" "}
                          <span className="text-base text-white font-body">
                            BFM
                          </span>
                        </div>
                        <div className="text-xs text-white mb-1">~ 3.15 %</div>
                        <div className="font-body text-xs text-white">
                          Today's PNL{" "}
                          <span className="font-bold text-[#C40A0A]">
                            - $0.00 (-0.07%)
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-end justify-between h-full">
                        <div className="flex space-x-4 mb-4">
                          <button
                            className="px-8 py-2 rounded-full font-semibold text-white "
                            style={{
                              background:
                                "linear-gradient(140.4deg, rgba(51, 160, 234, 0.3) 9.17%, rgba(10, 196, 136, 0.3) 83.83%)",
                            }}
                          >
                            Deposit
                          </button>
                          <button
                            className="px-8 py-2 rounded-full font-semibold  text-white  "
                            style={{
                              background:
                                "linear-gradient(140.4deg, rgba(51, 160, 234, 0.3) 9.17%, rgba(10, 196, 136, 0.3) 83.83%)",
                            }}
                          >
                            Withdraw
                          </button>
                        </div>
                        {/* Chart Placeholder */}
                        <div className="w-full md:w-[340px] h-24 flex items-end justify-end">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={walletChartData}
                              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient
                                  id="walletChartColor"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#0AC488"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#0AC488"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <Tooltip
                                contentStyle={{
                                  background: "#151C2C",
                                  border: "none",
                                  color: "#fff",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#0AC488"
                                fillOpacity={1}
                                fill="url(#walletChartColor)"
                                dot={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* My Assets Table */}
                    <div className="my-6 text-sm font-heading2 tracking-widest">
                      MY ASSETS
                    </div>
                    <div className="w-full bg-[#11161f] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a]">
                      <div className="grid grid-cols-4 text-left bg-black text-white font-body px-6 py-4">
                        <div>Coin</div>
                        <div>Amount</div>
                        <div>Coin Price</div>
                        <div>Today's PNL</div>
                      </div>
                      <div className="divide-y divide-[#222b3a]">
                        {/* BFM Row from API */}
                        {bfmData && (
                          <div className="grid grid-cols-4 items-center px-6 py-4 bg-[#FFFFFF1A]">
                            <div className="flex items-center space-x-3">
                              <img
                                src="/assets/images/bfm-logo.png"
                                alt="BFM"
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-gradient font-heading">
                                BFM
                              </span>
                            </div>
                            <div className="text-text_primary font-body">
                              {bfmData.amount}
                            </div>
                            <div className="text-text_primary font-body">
                              {bfmData.total}
                            </div>
                            <div className="text-help_link_green font-body cursor-pointer">
                              Cash In
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "deposits" && <Deposit />}
                {activeTab === "withdrawals" && <Withdraw />}
                {activeTab === "buy" && <BuyBfm />}
              </div>
            </div>
          </div>
          <div className="w-full hidden md:flex">
            <Navbar />
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default BfmWallets;
