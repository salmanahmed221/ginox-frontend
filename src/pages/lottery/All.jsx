import React, { useState } from "react";
import Navigation from "../../components/navigation";
import Footer from "../../components/footers";
import { Link } from "react-router-dom";

const tabs = ["All"];

export default function LotteryAll() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="min-h-screen w-full bg-[#010510] flex flex-col font-['Octa Brain','Avalont-Regular','sans-serif']">
      {/* Banner/Hero Section */}
      <Navigation />
      <div
        className="w-full relative flex flex-col items-center justify-center py-12 px-4"
        style={{
          background:
            "url(/assets/images/lottery-all.png) center/cover no-repeat",
          minHeight: "220px",
        }}
      >
        <div className="absolute inset-0 z-0" />
        <div className="relative z-10 flex flex-col items-center gap-2"></div>
      </div>
      {/* Filter/Search Section */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-0 flex flex-col gap-4 mt-10 md:mt-5">
        <div className=" p-1 md:p-4 flex items-center gap-2 md:gap-4 w-full mb-2">
          <button
            className="hidden md:flex px-6 py-3 rounded-full text-[#fff] border border-[#232A3E] font-body1 font-semibold text-sm items-center gap-2"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <img className="w-4 h-4" src="/assets/images/filters-icon.png" />{" "}
            Show Filters
          </button>
          <div
            className="flex-1 flex items-center rounded-full px-4 py-2 border border-[#232A3E]"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <svg
              className="w-4 h-4 text-[#fff] mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="md:py-1 flex-1 bg-transparent outline-none text-white placeholder:text-[#fff] text-sm font-body1"
              placeholder="Search"
            />
          </div>
          <button
            className="md:px-6 px-2 py-2 md:py-3 rounded-md md:rounded-full text-[#fff] border border-[#232A3E] font-semibold text-sm flex items-center gap-2"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <img className="w-4 h-4" src="/assets/images/trending-icon.png" />
            <span className="hidden md:inline font-body1">Trending</span>
          </button>
        </div>
        {/* Filter Chips (Tabs) */}
        <div className="md:ml-4 w-full flex gap-4 mb-6 flex-wrap z-10 relative border-b border-[#FFFFFF29] md:border-b-0">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab}
                className={
                  `relative pb-1 md:text-[12px] text-xs sm:text-base font-semibold tracking-widest transition-all duration-150 font-body1
                  md:px-8 md:py-2 md:rounded-full md:shadow-lg md:backdrop-blur-md md:border md:border-[#FFFFFF26]
                  bg-none shadow-none rounded-none px-0 py-0 md:bg-inherit md:shadow-inherit md:rounded-full md:px-8 md:py-2
                  ` +
                  (isActive
                    ? " text-[#0AC488] md:bg-gradient-to-r md:from-[#33A0EA]/15 md:to-[#0AC488]/15 md:text-white"
                    : " text-[#fff] md:bg-[#101823]/60 md:text-[#fff]")
                }
                style={{ letterSpacing: "0.1em" }}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
                {/* Underline for active tab on mobile only */}
                <span
                  className={`absolute left-0 right-0 -bottom-1 h-[2px] rounded bg-[#0AC488] transition-all duration-200 ${
                    isActive ? "block" : "hidden"
                  } md:hidden`}
                ></span>
              </button>
            );
          })}
        </div>
        {/* Main Dashboard Card */}
        {activeTab === 0 ? (
          <div className=" grid  grid-cols-1 gap-5  sm:grid-cols-2 w-full  lg:max-w-[80%] ">
            <div
              className="relative max-w-[422px] w-full border border-[#232A3E] rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 mx-auto md:ml-4 md:mx-0"
              style={{
                backgroundImage: 'url("/assets/images/free-lottery.svg")',
              }}
            >
              {/* Glowing effect behind card on mobile */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[340px] h-[140px] rounded-full blur-2xl opacity-40 md:hidden z-0"></div>
              <div className="flex flex-col items-center md:grid md:grid-cols-2 md:items-start w-full z-10">
                {/* Image on top (mobile), right (desktop) */}
                <div className="flex justify-center mb-4 md:mb-0 md:order-2">
                  <img
                    className="w-[300px] md:w-[350px]"
                    src="/assets/images/free-lottery-1.png"
                    alt=""
                  />
                </div>
                {/* Text and button */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h2 className="text-3xl md:text-md font-body1 text-[#fff]">
                    FREE LOTTERY
                  </h2>
                  <p className="text-sm mt-4 md:mt-8 text-[#fff] font-body1">
                    Join for free and stand a chance to win exciting prizes!
                  </p>
                  <Link
                    to={"/lottery"}
                    className="px-6 w-full py-2 rounded-full text-[#fff] border border-[#232A3E] font-semibold text-sm flex items-center gap-2 justify-center mt-8 font-body1"
                    style={{
                      background:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                    }}
                  >
                    Enter Now
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="relative max-w-[422px] w-full border border-[#232A3E] rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 mx-auto md:ml-4 md:mx-0"
              style={{
                backgroundImage: 'url("/assets/images/free-lottery.svg")',
              }}
            >
              {/* Glowing effect behind card on mobile */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[340px] h-[140px] rounded-full blur-2xl opacity-40 md:hidden z-0"></div>
              <div className="flex flex-col items-center md:grid md:grid-cols-2 md:items-start w-full z-10">
                {/* Image on top (mobile), right (desktop) */}
                <div className="flex justify-center mb-4 md:mb-0 md:order-2">
                  <img
                    className="w-[180px] md:w-[125px] relative -right-3"
                    src="./lottery/cryptobox.svg"
                    alt=""
                  />
                </div>
                {/* Text and button */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h2 className="text-3xl md:text-md font-body1 text-[#fff] truncate">
                    BFM CRYPTO BOX
                  </h2>
                  <p className="text-sm mt-4 md:mt-8 text-[#fff] font-body1">
                    Join for free and stand a chance to win exciting prizes!
                  </p>
                  <Link
                    to={"/crypto-box-lottery"}
                    className="px-6 w-full py-2 rounded-full text-[#fff] font-body1 border border-[#232A3E] font-semibold text-sm flex items-center gap-2 justify-center mt-8"
                    style={{
                      background:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                    }}
                  >
                    Enter Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center min-h-[200px]">
            <span className="text-[#B6B6B6] text-lg font-heading">
              No product available
            </span>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
