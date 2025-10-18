import React, { useState } from "react";
import { IoIosArrowRoundUp } from "react-icons/io";
import { Link } from 'react-router-dom'

const Footer = () => {
  const [showListingModal, setShowListingModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="w-full pt-20 sm:pb-10 relative ">
      <div className="w-full max-w-[1300px]  relative md:h-[379px] border-t border-[#82DDB5] rounded-3xl flex mx-auto overflow-hidden ">
        <div className="bg-[#82DDB51A] z-20 h-full w-full justify-between items-center flex  flex-col ">
          <div className="  w-full justify-between space-y-8 md:space-y-0  flex-col md:flex-row flex p-5 sm:p-10 h-fit ">
            <div className="flex flex-col md:w-[30%] space-y-6 ">
              <img src="./logo.svg" alt="/" className="w-[131px] h-[38px]" />
              <p className="text-xs sm:text-sm font-body1 font-medium ">
                A hybrid Web3.0  marketplace offering a variety of crypto products and services.
              </p>
            </div>
            <div className="flex  justify-between  md:w-[30%] ">
              <div className="flex flex-col space-y-6 ">
                <p className=" text-[10px] sm:text-2xl font-header text-[#82DDB5]">
                  About
                </p>
                <ul className="list-disc pl-5 space-y-3 text-xs sm:text-sm octa-brain text-white">
                  <li><Link className="text-white hover:text-[#82DDB5] font-body1" to={'/product-all'}>Products</Link></li>
                  <li><Link className="text-white hover:text-[#82DDB5] font-body1" to={'/company-all'}>Crypto Box</Link></li>
                  <li><Link className="text-white hover:text-[#82DDB5] font-body1" to={'/lottery-all'}>Lottery</Link></li>
                  <li><Link className="text-white hover:text-[#82DDB5] font-body1" to={'/games'}>Games</Link></li>
                </ul>
              </div>
              <div className="flex flex-col  space-y-6">
                <p className="text-[10px] sm:text-2xl font-header text-[#82DDB5]">
                  Support
                </p>
                <ul className="list-disc pl-5 space-y-3 text-xs sm:text-sm octa-brain text-white">
                  {/* <li>FAQs</li> */}
                  <li 
                    className="cursor-pointer hover:text-[#82DDB5] transition-colors font-body1"
                    onClick={() => {
                      if (window.Tawk_API) {
                        window.Tawk_API.maximize();
                      }
                    }}
                  >
                    Help Center
                  </li>
                  <li 
                    className="cursor-pointer hover:text-[#82DDB5] transition-colors font-body1"
                    onClick={() => setShowListingModal(true)}
                  >
                    Listing Request
                  </li>
                  {/* <li>Ginox Update</li> */}
                </ul>
              </div>
            </div>
            <div className="flex flex-col space-y-6 ">
              <p className="text-[10px] sm:text-2xl font-header text-[#82DDB5]">
                Social Media
              </p>

              <div className="flex items-center space-x-4">
      
                <div className="h-12 w-12 rounded-full flex items-center justify-center border-3 border-[#0f212d]">
                  <a href="https://x.com/Ginox_Official" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/images/twitter-icon (2).png" alt="/" className="w-4 h-4" />
                  </a>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center border-3 border-[#0f212d]">
                  <a href="https://t.me/Ginox_OfficialTP" target="_blank" rel="noopener noreferrer">
                  <img src="/footer/tg-coloured.svg" alt="/" className="w-4 h-4" />
                  </a>
                </div>
                <a 
                  href="https://www.instagram.com/ginox_official/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full flex items-center justify-center border-3 border-[#0f212d] hover:border-[#82DDB5] transition-colors"
                >
                  <img
                    src="./footer/instagram.svg"
                    alt="/"
                    className="w-4 h-4"
                  />
                </a>
                <a 
                  href="https://t.me/Ginox_Official" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full flex items-center justify-center border-3 border-[#0f212d] hover:border-[#82DDB5] transition-colors"
                >
                  <img
                    src="./footer/tg-coloured.svg"
                    alt="/"
                    className="w-4 h-4"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-full py-6    p-5 sm:p-10 space-y-5">
            <div className="w-full flex flex-col h-px bg-white/10" />

            <div className="flex sm:flex-row flex-col-reverse  items-center justify-between w-full">
              <p className="text-sm font-body1 pt-2 sm:pt-0">
                @2025 - Copyright Ginox
              </p>

              <div className="flex items-center text-sm  space-x-3">
                <Link to="/terms" className="text-white hover:text-[#82DDB5] transition-colors cursor-pointer font-body1">
                  Terms & Conditions
                </Link>
                <Link to="/privacy" className="text-white hover:text-[#82DDB5] transition-colors cursor-pointer font-body1">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          <div
            className="h-[50px] w-[50px] absolute bottom-[100px] rounded-full p-[2px] absolute right-10 cursor-pointer  bottom-26  "
            style={{
              background:
                "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
            }}
          >
            <div className="flex bg-[#0e1b20] items-center h-full w-full justify-center rounded-full">
              <IoIosArrowRoundUp className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#0ac09329] w-[192px] h-[192px] rounded-full blur-[100px] absolute  -bottom-10 -right-24" />
      
      {/* Listing Request Modal */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#0e1b20] border border-[#82DDB5] rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-3xl font-bold text-white font-header">Listing Request</h2>
              <button
                onClick={() => {
                  setShowListingModal(false);
                  setIsCopied(false);
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-white font-body1 leading-relaxed">
                Please send brief details of your project at following email. Ginox listing team will get back to you shortly.
              </p>
              
              <div className="bg-[#82DDB51A] rounded-lg p-4 border border-[#82DDB5]">
                <div className="flex items-center justify-between">
                  <span className="text-[#82DDB5] font-body1 font-medium">listing@ginox.io</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('listing@ginox.io');
                      setIsCopied(true);
                      setTimeout(() => {
                        setIsCopied(false);
                      }, 2000);
                    }}
                    className="bg-[#82DDB5] text-black px-3 py-1 rounded-lg text-sm hover:bg-[#70c9a3] transition-colors font-body1"
                  >
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              
      
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
