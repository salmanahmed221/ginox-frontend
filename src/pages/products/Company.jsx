import React, { useState } from "react";
import ProductNavbar from "../../components/ProductNavbar";
import ProductFooter from "../../components/ProductFooter";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import Navigation from "../../components/navigation";
import Footer from "../../components/footers";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../../api/axiosConfig";
import { useSelector } from "react-redux";

const chartData = [
  { name: "1", value: 475 },
  { name: "2", value: 520 },
  { name: "3", value: 600 },
  { name: "4", value: 480 },
  { name: "5", value: 700 },
  { name: "6", value: 650 },
  { name: "7", value: 800 },
  { name: "8", value: 750 },
  { name: "9", value: 680 },
  { name: "10", value: 720 },
];

const tabs = ["All"];

export default function Company() {
  const [activeTab, setActiveTab] = useState(0); // Default to Crypto Box
  const [boxData, setBoxData] = useState({
    min_stake: 0,
    max_stake: 0,
    staked_amount: 0,
    available_to_stake: 0,
    apy: 0,
  });
  const [bfmPrice, setBfmPrice] = useState("$0.00");
  const [bfmLoading, setBfmLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
    axios.get("/cryptobox/page-values", { headers: { "apikey": import.meta.env.VITE_API_KEY } }).then((res) => {
      if (res.data && res.data.success) {
        setBoxData(res.data.data);
      }
    });
  }, []);

  // Fetch BFM price from API
  React.useEffect(() => {
    const fetchBfmPrice = async () => {
      try {
        setBfmLoading(true);
        const response = await axios.get("/financials/bfm-price", {
          headers: { apikey: import.meta.env.VITE_API_KEY },
        });

        if (response.data.success) {
          // Format the price with dollar sign and proper formatting
          const price =
            response.data.data?.bfmPrice || response.data.bfmPrice || 0;
          const formattedPrice = `$${parseFloat(price).toFixed(2)}`;
          setBfmPrice(formattedPrice);
        } else {
          console.error("Failed to fetch BFM price:", response.data.message);
          setBfmPrice("$0.00");
        }
      } catch (error) {
        console.error("Error fetching BFM price:", error);
        setBfmPrice("$0.00");
      } finally {
        setBfmLoading(false);
      }
    };

    fetchBfmPrice();
  }, []);

  return (
    <div className="min-h-screen w-screen bg-[#010510] font-['Octa Brain','Avalont-Regular','sans-serif'] flex flex-col">
      <Navigation />
      {/* Hero Banner */}
      <div
        className="w-full bg-gradient-to-r from-[#0B101B] via-[#232323] to-[#FF6A00]/60 py-6 md:py-8 px-2 md:px-4 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ minHeight: "140px" }}
      >
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: 'url("/assets/images/object.png")' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1 md:gap-2">
          <img
            src="/assets/images/logo-benefit.png"
            alt="BFM Logo"
            className="w-60 h-16 md:w-[350px] md:h-20 mb-1 md:mb-2"
          />
          {/* <h1 className="text-xl md:text-4xl font-bold text-white tracking-widest font-heading">
            <span className="text-[#FFB800] font-heading2">BENEFIT</span> <span className="text-white">MINE</span>
          </h1> */}
          <p className="text-[#fff] font-body1 text-xs md:text-base mt-1 md:mt-2">
            BFM Web3.0 Ecosystem
          </p>
        </div>
      </div>
      {/* Main Section */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-4 mt-4 md:mt-8 flex flex-col gap-4 md:gap-6">
        {/* Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-6 md:gap-4">
            <h2 className="text-xl md:text-3xl font-bold text-white tracking-widest font-heading">
              <Link className="text-white font-header" to={"/signal-channel"}>
                BENEFIT MINE
              </Link>
            </h2>
            {/* <div className="flex ml-7 md:ml-0 gap-1 md:gap-2">
              <button className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#A3AED0] hover:bg-transparent transition"><span className="text-lg md:text-xl"><img src="/assets/images/dots-icon.png" alt="" /></span></button>
              <button className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#A3AED0] hover:bg-transparent transition"><span className="text-lg md:text-xl"><img src="/assets/images/twitter-icon.png" alt="" /></span></button>
              
            </div> */}
          </div>
          <div className="hidden md:block mt-2 md:mt-0">
            <div className="grid grid-cols-2 bg-[#0B101B] border border-[#232A3E] rounded-2xl px-4 md:px-8 py-2 md:py-4 flex flex-col items-center min-w-[140px] md:min-w-[180px] shadow-xl">
              <div
                className="grid pr-2 md:pr-5"
                style={{ borderRight: "1px solid" }}
              >
                <span className="text-[#A3AED0] text-xs font-body1">Total Supply</span>
                <span className="text-white text-base md:text-xl font-bold tracking-widest mt-2 md:mt-5 font-body1">
                  300M
                </span>
              </div>
              <div className="grid ml-2 md:ml-5">
                <span className="text-[#A3AED0] text-xs font-body1 ">Token </span>
                <span className="text-white font-bold mt-2 md:mt-5 font-body1">BFM</span>
              </div>
            </div>
          </div>
        </div>
        {/* Description Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mt-1 md:mt-2">
          {/* Left: DeFi, Lorem, View More, Socials */}
          <div className="order-1 md:order-2 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 flex-wrap w-full">
            <span className="px-2 py-0.5 md:px-3 md:py-1 rounded bg-[#181F2F] text-[#fff] text-xs font-semibold border border-[#FFFFFF26] block md:inline font-body1">
              DeFi
            </span>
            <span className="mt-4 text-[#fff] text-xs md:text-base block font-body1">
              BenefitMine is a powerful and secure crypto ecosystem designed for
              speed, efficiency, and user rewards by offering a diverse suite of
              crypto products that generate real value for its community.
            </span>

            <div className="flex gap-2 md:gap-3 ml-0 md:ml-0">
              {/* <a href="#" className="text-[#A3AED0] hover:text-[#00F0FF] text-base md:text-lg"><img src="/assets/images/telegram.png" alt="" /></a> */}
              <a
                href="https://www.facebook.com/BenefitMine.OfficialPage/"
                className="text-[#A3AED0] hover:text-[#00F0FF] text-base md:text-lg"
              >
                <img src="/assets/images/Facebook.png" alt="" />
              </a>
              <a
                href="https://www.instagram.com/benefitmine_official/"
                className="text-[#A3AED0] hover:text-[#00F0FF] text-base md:text-lg"
              >
                <img src="/assets/images/Instagram.png" alt="" />
              </a>
              <a
                href="https://twitter.com/benefitmine"
                className="text-[#A3AED0] hover:text-[#00F0FF] text-base md:text-lg"
              >
                <img src="/assets/images/Twitter.png" alt="" />
              </a>
            </div>
          </div>
          {/* Right: TUL Box */}
          <div className="order-2 md:order-1 mt-2 md:mt-0 md:hidden w-full md:w-auto">
            <div className="grid grid-cols-2 bg-[#0B101B] border border-[#232A3E] rounded-2xl px-4 md:px-8 py-2 md:py-4 flex flex-col items-center min-w-[140px] md:min-w-[180px] shadow-xl">
              <div
                className="grid pr-2 md:pr-5"
                style={{ borderRight: "1px solid" }}
              >
                <span className="text-[#FFFFFFB2] text-xs font-body1">Total Supply</span>
                <span className="text-white text-xl font-body1 md:text-xl tracking-widest mt-2 md:mt-5">
                  300M
                </span>
              </div>
              <div className="grid text-center ml-2 md:ml-5">
                <span className="text-[#FFFFFFB2] text-xs font-body1">Token </span>
                <span className="text-white text-xl font-body1 mt-2 md:mt-5">
                  BFM
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        {/* <h2 className='font-body text-[#82DDB5]'>Home</h2> */}
        <div className="w-full h-px bg-white/5" />
        <div className="md:ml-4 w-full flex gap-4 mb-6 flex-wrap z-10 relative border-b border-[#FFFFFF29] md:border-b-0">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab}
                className={
                  `relative pb-1 md:text-[12px] text-xs sm:text-base font-semibold tracking-widest transition-all duration-150 font-body
                  md:px-8 md:py-2 md:rounded-full md:shadow-lg md:backdrop-blur-md md:border md:border-[#FFFFFF26]
                  bg-none shadow-none rounded-none px-0 py-0 md:bg-inherit md:shadow-inherit md:rounded-full md:px-8 md:py-2
                  ` +
                  (isActive
                    ? " text-[#0AC488] md:bg-gradient-to-r md:from-[#33A0EA]/15 md:to-[#0AC488]/15 md:text-white font-body1"
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
        {/* Tab Content */}
        <div className="min-h-[220px] md:min-h-[320px] w-full flex items-center">
          {activeTab === 0 ? (
            <>
              {/* Mobile Card */}
              <div className="w-full max-w-[350px] border border-[#FFFFFF29] mx-auto bg-gradient-to-br from-[#101624] to-[#0B101B] rounded-2xl shadow-2xl p-4 flex flex-col gap-4 md:hidden">
                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/images/bfm-logo.png"
                      alt="icon"
                      className="w-8 h-8 rounded-full shadow-lg"
                    />
                    <span className="text-white text-[10px] font-bold font-heading2">
                      <Link
                        className="text-white text-[18px] font-bold font-body1"
                        to={"/crypto-box"}
                      >
                        BFM CRYPTO BOX
                      </Link>
                    </span>
                  </div>
                  <Link
                    to={"/crypto-box"}
                    className="px-3 py-1 font-body1 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-xs"
                  >
                    Stake Now
                  </Link>
                </div>
                <div className="w-full h-px bg-white/30 my-2" />
                {/* Chart */}
                <div className="w-full flex items-center justify-center">
                  {/* Replace with your chart SVG or image */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[200px] h-[120px]"
                    viewBox="0 0 653 465"
                  >
                    <motion.path
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      d="M0 460.694c6.6-3.13 19.8-11.272 33-15.654s19.8-2.814 33-6.257 19.8.365 33-10.955 19.8-32.07 33-45.643c13.2-13.572 19.8-16.08 33-22.22s19.8-5.647 33-8.48c13.2-2.832 19.8 5.901 33-5.68 13.2-11.582 19.8-37.759 33-52.226 13.2-14.468 19.8-28.263 33-20.112 13.2 8.15 19.8 59.038 33 60.863 13.2 1.824 19.8-43.269 33-51.741s19.8 24.488 33 9.38c13.2-15.11 19.8-81.825 33-84.923s19.8 54.76 33 69.432 19.8 34.912 33 3.931 19.8-148.752 33-158.837c13.2-10.086 19.8 111.943 33 108.409 13.2-3.535 19.8-97.635 33-126.082s19.8-7.562 33-16.152 26.4-21.438 33-26.798"
                      fill="none"
                      stroke={"#0fae96"}
                      strokeWidth="10"
                    />
                  </svg>
                </div>
                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex flex-col items-center border-r border-white/30 pr-2">
                    <span className="text-[#82DDB5] mb-3 text-xl   font-body1 opacity-80">
                      Price
                    </span>
                    <span className="text-white text-xl font-body1 mt-1">
                      {bfmLoading ? "Loading..." : bfmPrice}
                    </span>
                  </div>
                  <div className="flex flex-col items-center pl-2">
                    <span className="text-[#82DDB5] mb-3 text-xl font-body1 opacity-80">
                      APY
                    </span>
                    <span className="text-white text-xl font-body1 mt-1">
                      - {boxData?.apy} %
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-r border-white/30 pr-2 mt-2">
                    <span className="text-[#82DDB5] mb-3 text-xl font-body1 opacity-80">
                      MIN STAKE
                    </span>
                    <span className="text-white text-xl font-body1 mt-1">
                      {boxData.min_stake} BFM
                    </span>
                  </div>
                  <div className="flex flex-col items-center pl-2 mt-2">
                    <span className="text-[#82DDB5] mb-3 text-xl font-body1 opacity-80">
                      MAX STAKE
                    </span>
                    <span className="text-white text-xl font-body1 mt-1">
                      {boxData.max_stake} BFM
                    </span>
                  </div>
                </div>
              </div>
              {/* Desktop Card (unchanged) */}
              <div className="w-full max-w-xl bg-gradient-to-br from-[#101624] to-[#0B101B] border border-[#232A3E] rounded-2xl p-4 md:p-8 flex flex-col gap-4 md:gap-6 relative overflow-hidden hidden md:block">
                <div className="flex flex-col md:flex-row flow-nowrap items-start md:items-center justify-between mb-2 md:mb-4 gap-2 md:gap-0">
                  <div className="flex items-center gap-1 md:gap-2">
                    <img
                      src="/assets/images/bfm-logo.png"
                      alt="BFM Logo"
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                    <span className="text-white text-[10px] md:text-md font-heading2 tracking-widest">
                      <Link
                        className="text-white text-[18px] md:text-[22px] font-body1 tracking-widest"
                        to="/crypto-box"
                      >
                        BFM CRYPTO BOX
                      </Link>
                    </span>
                  </div>
                  <Link
                    to={"/crypto-box"}
                    className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-xs md:text-sm shadow-md font-body1"
                  >
                    Stake Now
                  </Link>
                </div>
                <hr className="w-full border-t border-[#E0E0E0] my-1 md:my-2 mx-auto" />
                <div className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-2">
                  <div className="grid grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4">
                    <div
                      className="flex flex-col items-center"
                      style={{ borderRight: "1px solid" }}
                    >
                      <span className="text-[#82DDB5] text-[10px] md:text-[18px] font-body1">
                        Price
                      </span>
                      <span className="text-[#fff] mt-2 md:mt-4 text-base md:text-lg font-bold font-body1">
                        {bfmLoading ? "Loading..." : bfmPrice}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[#82DDB5] text-[10px] md:text-[18px] font-body1">
                        APY
                      </span>
                      <span className="text-[#fff] mt-2 md:mt-4 text-base md:text-lg font-bold font-body1">
                        ~ {boxData.apy} %
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center"
                      style={{ borderRight: "1px solid" }}
                    >
                      <span className="text-[#82DDB5] text-[10px] md:text-[18px] font-body1">
                        MIN STAKE
                      </span>
                      <span className="text-[#fff] mt-2 md:mt-4 text-base md:text-lg font-bold font-body1">
                        {boxData.min_stake} BFM
                      </span>
                    </div>
                    <div className="flex flex-col items-center ">
                      <span className="text-[#82DDB5] text-[10px] md:text-[18px] font-body1">
                        MAX STAKE
                      </span>
                      <span className="text-[#fff] mt-2 md:mt-4 text-base md:text-lg font-bold font-body1">
                        {boxData.max_stake} BFM
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-24 md:h-40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[200px] h-[120px]"
                      viewBox="0 0 653 465"
                    >
                      <motion.path
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        d="M0 460.694c6.6-3.13 19.8-11.272 33-15.654s19.8-2.814 33-6.257 19.8.365 33-10.955 19.8-32.07 33-45.643c13.2-13.572 19.8-16.08 33-22.22s19.8-5.647 33-8.48c13.2-2.832 19.8 5.901 33-5.68 13.2-11.582 19.8-37.759 33-52.226 13.2-14.468 19.8-28.263 33-20.112 13.2 8.15 19.8 59.038 33 60.863 13.2 1.824 19.8-43.269 33-51.741s19.8 24.488 33 9.38c13.2-15.11 19.8-81.825 33-84.923s19.8 54.76 33 69.432 19.8 34.912 33 3.931 19.8-148.752 33-158.837c13.2-10.086 19.8 111.943 33 108.409 13.2-3.535 19.8-97.635 33-126.082s19.8-7.562 33-16.152 26.4-21.438 33-26.798"
                        fill="none"
                        stroke={"#0fae96"}
                        strokeWidth="10"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full text-center text-[#A3AED0] text-base md:text-lg font-heading tracking-widest">
              NO PRODUCT AVAILABLE
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="">
        <Footer />
      </div>
    </div>
  );
}
