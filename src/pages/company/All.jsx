import React, { useState,useEffect } from 'react';
import Navigation from '../../components/navigation';
import Footer from '../../components/footers';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axiosConfig';
import { motion } from "framer-motion";

const tabs = [
  'All',
];

export default function CompanyAll() {
  const [activeTab, setActiveTab] = useState(0);
  const [bfmPrice, setBfmPrice] = useState('$0.00');
  const [loading, setLoading] = useState(false);
  const [boxData, setBoxData] = useState({ min_stake: 0, apy: 0, totalStaked: 0});
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get('/cryptobox/page-values', { headers: { "apikey": import.meta.env.VITE_API_KEY } })
      .then(res => {
        if (res.data && res.data.success) {
          setBoxData(res.data.data);
        }
      });
      
  }, []);
  // Fetch BFM price from API
  const fetchBfmPrice = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/financials/bfm-price', { headers: { "apikey": import.meta.env.VITE_API_KEY } });
      
      if (response.data.success) {
        // Format the price with dollar sign and proper formatting
        const price = response.data.data?.bfmPrice || response.data.bfmPrice || 0;
        const formattedPrice = `$${parseFloat(price).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
        setBfmPrice(formattedPrice);
      } else {
        console.error('Failed to fetch BFM price:', response.data.message);
        setBfmPrice('$0.00');
      }
    } catch (error) {
      console.error('Error fetching BFM price:', error);
      setBfmPrice('$0.00');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBfmPrice();
  }, []);


  return (
    <div className="min-h-screen w-full bg-[#010510] flex flex-col font-['Octa Brain','Avalont-Regular','sans-serif']">
      <Navigation/>
      {/* Banner/Hero Section */}
      <div className="w-full relative flex flex-col items-center justify-center py-12 px-4" style={{background:'url(/assets/images/staking-boxes.png) center/cover no-repeat', minHeight:'220px'}}>
        <div className="absolute inset-0 z-0" />
        <div className="relative z-10 flex flex-col items-center gap-2">
        </div>
      </div>
      {/* Filter/Search Section */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-0 flex flex-col gap-4 mt-10 md:mt-5">
      <div className=" p-1 md:p-4 flex items-center gap-2 md:gap-4 w-full mb-2">
          <button className="hidden md:flex px-6 py-3 rounded-full text-[#fff] font-body1 border border-[#232A3E] font-semibold text-sm items-center gap-2" style={{background:'rgba(255, 255, 255, 0.05)'}}><img className="w-4 h-4" src="/assets/images/filters-icon.png"/> Show Filters</button>
          <div className="flex-1 flex items-center rounded-full px-4 py-2 border border-[#232A3E]" style={{background:'rgba(255, 255, 255, 0.05)'}}>
            <svg className="w-4 h-4 text-[#fff] mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input className="md:py-1 flex-1 bg-transparent outline-none text-white placeholder:text-[#fff] text-sm font-body1" placeholder="Search" />
          </div>
          <button className="md:px-6 px-2 py-2 md:py-3 rounded-md md:rounded-full text-[#fff] border border-[#232A3E] font-semibold text-sm flex items-center gap-2" style={{background:'rgba(255, 255, 255, 0.05)'}}>
            <img className="w-4 h-4" src="/assets/images/trending-icon.png"/>
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
        {/* Main Dashboard Card */}
        {activeTab === 0 ? (
          <>
          {/* Mobile Card */}
          <div className="w-full max-w-[350px] border border-[#FFFFFF29] mx-auto bg-gradient-to-br from-[#101624] to-[#0B101B] rounded-2xl shadow-2xl p-4 flex flex-col gap-4 md:hidden">
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/assets/images/bfm-logo.png" alt="icon" className="w-8 h-8 rounded-full shadow-lg" />
                <span className="text-white text-[10px] font-bold font-body1"><Link className='text-white text-[18px] font-bold font-body1' to={'/crypto-box'}>BFM CRYPTO BOX</Link></span>
              </div>
              <Link to={'/crypto-box'} className="px-3 py-1 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-xs font-body1">Stake Now</Link>
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
                stroke={'#0fae96'}
                strokeWidth="10"
              />
            </svg>
            </div>
            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col items-center border-r border-white/30 pr-2">
                <span className="text-[#82DDB5] mb-3 text-xl font-body1 opacity-80">Price</span>
                <span className="text-white text-xl font-body1">{bfmPrice}</span>
              </div>
              <div className="flex flex-col items-center pl-2">
                <span className="text-[#82DDB5] mb-3 text-xl font-body1 opacity-80">APY</span>
                <span className="text-white text-xl font-body1">- {boxData?.apy} %</span>
              </div>
              <div className="flex flex-col items-center border-r border-white/30 pr-2 mt-2">
                <span className="text-[#82DDB5] mb-3 text-xl font-body1 opacity-80">MIN STAKE</span>
                <span className="text-white text-xl font-body1">{boxData.min_stake} BFM</span>
              </div>
              <div className="flex flex-col items-center pl-2 mt-2">
                <span className="text-[#82DDB5] mb-3 text-xl font-body1 opacity-80">MAX STAKE</span>
                <span className="text-white text-xl font-body1">{boxData.max_stake} BFM</span>
              </div>
            </div>
          </div>
          {/* Desktop Card (unchanged) */}
          <div className="w-full max-w-xl bg-gradient-to-br from-[#101624] to-[#0B101B] border border-[#232A3E] rounded-2xl p-4 md:p-8 flex flex-col gap-4 md:gap-6 relative overflow-hidden hidden md:block">
            <div className="flex flex-col md:flex-row flow-nowrap items-start md:items-center justify-between mb-2 md:mb-4 gap-2 md:gap-0">
              <div className="flex items-center gap-1 md:gap-2">
                <img src="/assets/images/bfm-logo.png" alt="BFM Logo" className="w-6 h-6 md:w-8 md:h-8" />
                <span className="text-white text-[10px] md:text-md font-heading2 tracking-widest"><Link className='text-white text-[10px] md:text-[22px] font-body1 tracking-widest' to='/crypto-box'>BFM CRYPTO BOX</Link></span>
              </div>
              <Link to={'/crypto-box'} className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-xs md:text-sm shadow-md font-body1">Stake Now</Link>
            </div>
            <hr className="w-full border-t border-[#E0E0E0] my-1 md:my-2 mx-auto"/>
            <div className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4">
                <div className="flex flex-col items-center" style={{borderRight:'1px solid'}}>
                  <span className="text-[#82DDB5] text-[10px] md:text-[18px] font-body1">Price</span>
                  <span className="text-[#fff] mt-2 md:mt-4 text-base md:text-lg font-bold font-body1">{bfmPrice}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#82DDB5] text-[10px] md:text-[18px] font-body1">APY</span>
                  <span className="text-[#fff] mt-2 md:mt-4 text-base md:text-lg font-bold font-body1">- {boxData.apy} %</span>
                </div>
                <div className="flex flex-col items-center" style={{borderRight:'1px solid'}}>
                  <span className="text-[#82DDB5] text-[10px] md:text-[18px] font-body1">MIN STAKE</span>
                  <span className="text-[#fff] mt-2 md:mt-4 text-base md:text-lg font-bold font-body1">{boxData.min_stake} BFM</span>
                </div>
                <div className="flex flex-col items-center ">
                  <span className="text-[#82DDB5] text-[10px] md:text-[18px] font-body1">MAX STAKE</span>
                  <span className="text-[#fff] mt-2 md:mt-4 text-base md:text-lg font-bold font-body1">{boxData.max_stake} BFM</span>
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
                stroke={'#0fae96'}
                strokeWidth="10"
              />
            </svg>
              </div>
            </div>
          </div>
        </>
        ) : (
          <div className="w-full flex items-center justify-center min-h-[200px]">
            <span className="text-[#B6B6B6] text-lg font-heading">No product available</span>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
} 