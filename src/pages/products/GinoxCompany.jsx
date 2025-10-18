import React, { useState } from 'react';
import ProductNavbar from '../../components/ProductNavbar';
import ProductFooter from '../../components/ProductFooter';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import Navigation from "../../components/navigation";
import Footer from "../../components/footers";
import {Link} from 'react-router-dom'
import { motion } from "framer-motion";

const chartData = [
  { name: '1', value: 475 },
  { name: '2', value: 520 },
  { name: '3', value: 600 },
  { name: '4', value: 480 },
  { name: '5', value: 700 },
  { name: '6', value: 650 },
  { name: '7', value: 800 },
  { name: '8', value: 750 },
  { name: '9', value: 680 },
  { name: '10', value: 720 },
];

const tabs = [
  'All',
  'Crypto Box',
  'Signal Channels',
  'Lottery',
  'Games',
];

export default function GinoxCompany() {
  const [activeTab, setActiveTab] = useState(0); // Default to Crypto Box

  return (
    <div className="min-h-screen w-screen bg-[#010510] font-['Octa Brain','Avalont-Regular','sans-serif'] flex flex-col">
      <Navigation />
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-[#0B101B] via-[#232323] to-[#FF6A00]/60 py-6 md:py-8 px-2 md:px-4 flex flex-col items-center justify-center relative overflow-hidden" style={{minHeight:'240px'}}>
        <div className="absolute bg-[url('/assets/images/ginox-company-mobile.png')] md:bg-[url('/assets/images/ginox-company.png')] inset-0 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center gap-1 md:gap-2">
          {/* <img src="/assets/images/ginox-company.png" alt="BFM Logo" className="w-60 h-16 md:w-[350px] md:h-20 mb-1 md:mb-2" /> */}
          {/* <h1 className="text-xl md:text-4xl font-bold text-white tracking-widest font-heading">
            <span className="text-[#FFB800] font-heading2">BENEFIT</span> <span className="text-white">MINE</span>
          </h1> */}
          {/* <p className="text-[#fff] text-xs md:text-base mt-1 md:mt-2">Lorem Ipsum is simply dummy text of the printing</p> */}
        </div>
      </div>
      {/* Main Section */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-4 mt-4 md:mt-8 flex flex-col gap-4 md:gap-6">
        {/* Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-6 md:gap-4">
            <h2 className="text-sm md:text-3xl font-bold text-white tracking-widest font-heading"><Link className="text-white font-heading" to={'/signal-channel'}>Ginox</Link></h2>
            <div className="flex ml-[120px] md:ml-0 gap-1 md:gap-2">
              <button className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#A3AED0] hover:bg-[#232A3E] transition"><span className="text-lg md:text-xl"><img src="/assets/images/dots-icon.png" alt="" /></span></button>
              <button className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#A3AED0] hover:bg-[#232A3E] transition"><span className="text-lg md:text-xl"><img src="/assets/images/twitter-icon.png" alt="" /></span></button>
              <button className="px-3 py-1 md:px-5 md:py-2 rounded-full bg-gradient-to-r from-[#0AC488] to-[#33A0EA] text-white font-semibold text-xs md:text-sm ml-1 md:ml-2">+ Follow</button>
            </div>
          </div>
        </div>
        {/* Description Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mt-1 md:mt-2">
          <div className=" items-center gap-2 md:gap-3 flex-wrap">
            <span className="px-2 py-0.5 md:px-3 md:py-1 rounded bg-[#181F2F] text-[#A3AED0] text-xs font-semibold border border-[#232A3E]">DeFi</span>
            <span className="mt-4 text-[#fff] text-xs md:text-base block">Lorem Ipsum is simply dummy text of the printing <span className="text-gradient text-xs md:text-sm font-semibold cursor-pointer ml-1 md:ml-2">View More</span></span>
            
            <div className="flex gap-2 md:gap-3 ml-0 md:ml-0">
              <a href="#" className="text-[#A3AED0] hover:text-[#00F0FF] text-base md:text-lg"><img src="/assets/images/Linkedin.png" alt="" /></a>
              <a href="#" className="text-[#A3AED0] hover:text-[#00F0FF] text-base md:text-lg"><img src="/assets/images/Facebook.png" alt="" /></a>
              <a href="#" className="text-[#A3AED0] hover:text-[#00F0FF] text-base md:text-lg"><img src="/assets/images/Instagram.png" alt="" /></a>
              <a href="#" className="text-[#A3AED0] hover:text-[#00F0FF] text-base md:text-lg"><img src="/assets/images/Twitter.png" alt="" /></a>
            </div>
          </div>
        </div>
        {/* Tabs */}
          <h2 className='font-body text-[#82DDB5]'>Home</h2>
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
                    ? ' text-[#0AC488] md:bg-gradient-to-r md:from-[#33A0EA]/15 md:to-[#0AC488]/15 md:text-white'
                    : ' text-[#fff] md:bg-[#101823]/60 md:text-[#fff]')
                }
                style={{letterSpacing:'0.1em'}}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
                {/* Underline for active tab on mobile only */}
                <span className={`absolute left-0 right-0 -bottom-1 h-[2px] rounded bg-[#0AC488] transition-all duration-200 ${isActive ? 'block' : 'hidden'} md:hidden`}></span>
              </button>
            );
          })}
        </div>
        {/* Tab Content */}
        <div className="min-h-[220px] md:min-h-[320px] w-full flex items-center">
          {activeTab === 0 && (
            <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-stretch">
              {/* Left Box: Daily Signals */}
              <div className="flex-1  border border-[#232A3E] rounded-2xl p-6 flex flex-col gap-4 relative shadow-xl" style={{minWidth:'340px', maxWidth:'480px'}}>
                {/* Tabs and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2">
                    <button className="px-2 md:px-4 text-[10px] py-1 rounded-full bg-[#232A3E] text-white md:text-xs font-semibold ring-1 ring-[#FFFFFF33]">BTC/ETH</button>
                    <button className="px-2 md:px-4 text-[10px] py-1 rounded-full bg-[#232A3E] text-white md:text-xs font-semibold ring-1 ring-[#FFFFFF33]">Daily Signals</button>
                    <button className="px-2 md:px-4 text-[10px] py-1 rounded-full bg-[#232A3E] text-white md:text-xs font-semibold ring-1 ring-[#FFFFFF33]">Spot</button>
                  </div>
                  <div className="flex items-center gap-1 text-white text-lg font-heading">
                    <span className="font-heading">4.8</span>
                    <img src="/assets/images/rating-icon.png" alt="star" className="w-4 h-4" />
                  </div>
                </div>
                <div className="w-full h-px bg-white/20 mb-2" />
                {/* Info and Chart */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* Chart first on mobile, second on desktop */}
                  <div className="flex-1 flex items-center justify-center order-1 md:order-2 mb-2 md:mb-0">
                    <img src="/assets/images/ginox-signal.png" alt="chart" className="rounded-lg border border-[#fff3] w-[307px] h-[134px] md:w-40 md:h-24 object-cover" />
                  </div>
                  {/* Text info second on mobile, first on desktop */}
                  <div className="flex-1 flex flex-col gap-2 justify-start items-start text-left order-2 md:order-1">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <img src="/assets/images/accuracy.png" alt="accuracy" className="w-5 h-5" />
                      <span className="font-bold text-xs">Accuracy :</span>
                      <span className="font-normal text-[#8c8c91] text-xs">Up to 80% Claimed</span>
                    </div>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <img src="/assets/images/signal-icon.png" alt="signal" className="w-5 h-5" />
                      <span className="font-bold text-xs">Signal :</span>
                      <span className="font-normal text-[#8c8c91] text-xs">3 - 5 day</span>
                    </div>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <img src="/assets/images/platform-icon.png" alt="platform" className="w-5 h-5" />
                      <span className="font-bold text-xs">Platform :</span>
                      <span className="font-normal text-[#8c8c91] text-xs">Telegram</span>
                    </div>
                  </div>
                </div>
                {/* Subscribe Button */}
                <div className="flex justify-center mt-4">
                  <button className="w-2/3 py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-base shadow-lg mt-10">Subscribe</button>
                </div>
              </div>
              {/* Right Box: Daily Free Rewards Lottery */}
              <div className="flex-1 border border-[#232A3E] rounded-2xl p-6 flex flex-col gap-4 relative shadow-xl items-center justify-center text-center" style={{minWidth:'340px', maxWidth:'480px', position:'relative'}}>
                <div className="relative z-10 flex flex-col items-center">
                  <img src="/assets/images/free-lottery-1.png" alt="treasure" className="w-60 h-40 object-contain mx-auto mb-2" />
                  <h2 className="text-xs font-heading text-white tracking-widest mb-2"><span className="text-[#fff] font-heading2">DAILY FREE</span> <span className="text-[#82DDB5] font-heading2">REWARDS LOTTERY</span></h2>
                  <p className="text-white text-base mb-2">Join the free lottery and <span className="text-[#0ABA43]">win $5 every day</span></p>
                  <div className="flex justify-center mt-4">
                    <button className="py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-base shadow-lg" style={{minWidth:'320px'}}>Enter Now</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="w-full text-center text-[#A3AED0] text-base md:text-lg font-heading tracking-widest">
                NO PRODUCT AVAILABLE
            </div>
          )}
          {activeTab === 2 && (
            <div className="w-full flex flex-col md:flex-row gap-6 items-stretch">
              {/* Left Box: Daily Signals */}
              <div className="flex-1  border border-[#232A3E] rounded-2xl p-6 flex flex-col gap-4 relative shadow-xl" style={{minWidth:'340px', maxWidth:'480px'}}>
                {/* Tabs and Rating */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2">
                    <button className="px-2 md:px-4 text-[10px] py-1 rounded-full bg-[#232A3E] text-white md:text-xs font-semibold ring-1 ring-[#FFFFFF33]">BTC/ETH</button>
                    <button className="px-2 md:px-4 text-[10px] py-1 rounded-full bg-[#232A3E] text-white md:text-xs font-semibold ring-1 ring-[#FFFFFF33]">Daily Signals</button>
                    <button className="px-2 md:px-4 text-[10px] py-1 rounded-full bg-[#232A3E] text-white md:text-xs font-semibold ring-1 ring-[#FFFFFF33]">Spot</button>
                  </div>
                  <div className="flex items-center gap-1 text-white text-lg font-heading">
                    <span className="font-heading">4.8</span>
                    <img src="/assets/images/rating-icon.png" alt="star" className="w-4 h-4" />
                  </div>
                </div>
                <div className="w-full h-px bg-white/20 mb-2" />
                {/* Info and Chart */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* Chart first on mobile, second on desktop */}
                  <div className="flex-1 flex items-center justify-center order-1 md:order-2 mb-2 md:mb-0">
                    <img src="/assets/images/ginox-signal.png" alt="chart" className="rounded-lg border border-[#fff3] w-[307px] h-[134px] md:w-40 md:h-24 object-cover" />
                  </div>
                  {/* Text info second on mobile, first on desktop */}
                  <div className="flex-1 flex flex-col gap-2 justify-start items-start text-left order-2 md:order-1">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <img src="/assets/images/accuracy.png" alt="accuracy" className="w-5 h-5" />
                      <span className="font-bold text-xs">Accuracy :</span>
                      <span className="font-normal text-[#8c8c91] text-xs">Up to 80% Claimed</span>
                    </div>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <img src="/assets/images/signal-icon.png" alt="signal" className="w-5 h-5" />
                      <span className="font-bold text-xs">Signal :</span>
                      <span className="font-normal text-[#8c8c91] text-xs">3 - 5 day</span>
                    </div>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <img src="/assets/images/platform-icon.png" alt="platform" className="w-5 h-5" />
                      <span className="font-bold text-xs">Platform :</span>
                      <span className="font-normal text-[#8c8c91] text-xs">Telegram</span>
                    </div>
                  </div>
                </div>
                {/* Subscribe Button */}
                <div className="flex justify-center mt-4">
                  <button className="w-2/3 py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-base shadow-lg mt-10">Subscribe</button>
                </div>
              </div>
              
            </div>
          )}
          {activeTab === 3 && (
            <div className="w-full flex flex-col md:flex-row gap-6 items-stretch">
              
              {/* Right Box: Daily Free Rewards Lottery */}
              <div className="flex-1 border border-[#232A3E] rounded-2xl p-6 flex flex-col gap-4 relative shadow-xl items-center justify-center text-center" style={{minWidth:'340px', maxWidth:'480px', position:'relative'}}>
                <div className="relative z-10 flex flex-col items-center">
                  <img src="/assets/images/free-lottery.png" alt="treasure" className="w-60 h-40 object-contain mx-auto mb-2" />
                  <h2 className="text-xs font-heading text-white tracking-widest mb-2"><span className="text-[#fff] font-heading2">DAILY FREE</span> <span className="text-[#82DDB5] font-heading2">REWARDS LOTTERY</span></h2>
                  <p className="text-white text-base mb-2">Join the free lottery and <span className="text-[#0ABA43]">win $5 every day</span></p>
                  <div className="flex justify-center mt-4">
                    <button className="py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-base shadow-lg" style={{minWidth:'320px'}}>Enter Now</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 4 && (
            <div className="w-full text-center text-[#A3AED0] text-base md:text-lg font-heading tracking-widest">
                NO PRODUCT AVAILABLE
            </div>
          )}
          {(activeTab < 0 || activeTab > 4) && (
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