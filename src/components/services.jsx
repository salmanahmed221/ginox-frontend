import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import { cardData } from "./currentactive";
import { useSelector } from "react-redux";
const Services = () => {
  const { token } = useSelector((state) => state.auth);
  const [price, setPrice] = useState(null)  
  useEffect(() => {
    const fetchPrice = async () => {
      const price = await cardData[0].fetchPrice(token)
      setPrice(price)
    }
    fetchPrice()
  }, [token])

  return (
    <div className="w-full flex flex-col pt-20 sm:pt-32 relative ">
      <p className="text-[24px] text-center sm:text-[34px] font-header text-[#A0E0C4]">
        Services
      </p>

      <div
        className="grid grid-cols-1 place-items-center md:grid-cols-3 gap-4 md::gap-2  z-20  mt-10
         "
      >
        <motion.div
          className="h-[194px]  md:max-w-[422px]  p-[2px] w-full  rounded-3xl cursor-pointer shadow-lg hover:shadow-white/10"
          style={{
            background:
              "linear-gradient(0deg, rgba(3, 59, 21, 0.2) 33.42%, rgba(119, 119, 119, 0.2) 109.02%)",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Link to={"/ipvpn"}>
            <div
              style={{
                background:
                  "linear-gradient(110.8deg, #010510 -4.16%, #001016 49.91%, #010510 98.83%)",
              }}
              className="flex flex-col p-6 h-full w-full justify-between  rounded-3xl "
            >
              <div className="flex flex-col w-full space-y-1.5">
                <div className="flex items-center space-x-2">
                  <div className="h-[20px] w-[20px]">
                    <img
                      src="./signal/accuracy.svg"
                      alt="/"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="font-body1 text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Uptime :{" "}
                    <span className="text-[#F4F4F580] font-body1 ">100%</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-[20px] w-[20px]">
                    <img
                      src="./signal/signal.svg"
                      alt="/"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="font-body1 text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Security :{" "}
                    <span className="text-[#F4F4F580] font-body1">
                      Military-Grade
                    </span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-[20px] w-[20px]">
                    <img
                      src="./signal/3cubes.svg"
                      alt="/"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="font-body1 text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Servers :{" "}
                    <span className="text-[#F4F4F580] font-body1">5000+</span>
                  </p>
                </div>
              </div>
              <div className="w-full flex flex-col h-px bg-white/5" />

              <div className="w-full flex items-center justify-between">
                <div className="w-[89px] h-[35px]">
                  <img
                    src="/assets/images/ipvpn.avif"
                    alt="/"
                    className="w-12 h-12"
                  />
                </div>

                <div
                  className="flex items-center space-x-1 justify-center border border-[#FFFFFF33] bg-[#D9D9D91A]
                rounded-full px-3 py-2
                "
                >
                  <img
                    src="./signal/euro-coin.svg"
                    alt="/"
                    className="w-[15px] h-[15px]"
                  />

                  <p className="text-xs font-body1 text-[#F4F4F5] mt-0.5">
                    $3.50/month
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
        <motion.div
          className="h-[194px]  md:max-w-[422px]  p-[2px] w-full  rounded-3xl cursor-pointer shadow-lg hover:shadow-white/10"
          style={{
            background:
              "linear-gradient(0deg, rgba(3, 59, 21, 0.2) 33.42%, rgba(119, 119, 119, 0.2) 109.02%)",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Link to={"/signal-channel"}>
            <div
              style={{
                background:
                  "linear-gradient(110.8deg, #010510 -4.16%, #001016 49.91%, #010510 98.83%)",
              }}
              className="flex flex-col p-6 h-full w-full justify-between  rounded-3xl "
            >
              <div className="flex flex-col w-full space-y-1.5">
                <div className="flex items-center space-x-2">
                  <div className="h-[20px] w-[20px]">
                    <img
                      src="./signal/accuracy.svg"
                      alt="/"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="font-body1 text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Accuracy :{" "}
                    <span className="text-[#F4F4F580] font-body1">
                      Up to 80% Claimed
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-[20px] w-[20px]">
                    <img
                      src="./signal/signal.svg"
                      alt="/"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="font-body1 text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Signal :{" "}
                    <span className="text-[#F4F4F580] font-body1">
                      3 - 5 day
                    </span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-[20px] w-[20px]">
                    <img
                      src="./signal/3cubes.svg"
                      alt="/"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="font-body1 text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Platform :{" "}
                    <span className="text-[#F4F4F580] font-body1">
                      Telegram, Website
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-full flex flex-col h-px bg-white/5" />

              <div className="w-full flex items-center justify-between">
                <div className="w-[89px] h-[35px]">
                  <img
                    src="./signal/cryptosignal.svg"
                    alt="/"
                    className="w-full h-full"
                  />
                </div>

                <div
                  className="flex items-center space-x-1 justify-center border border-[#FFFFFF33] bg-[#D9D9D91A]
                rounded-full px-3 py-2
                "
                >
                  <img
                    src="./signal/euro-coin.svg"
                    alt="/"
                    className="w-[15px] h-[15px]"
                  />

                  <p className="text-xs font-body1 text-[#F4F4F5] mt-0.5">
                    $5/month
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
        <motion.div
          className="h-[194px]  md:max-w-[422px]  p-[2px] w-full  rounded-3xl cursor-pointer shadow-lg hover:shadow-white/10"
          style={{
            background:
              "linear-gradient(0deg, rgba(3, 59, 21, 0.2) 33.42%, rgba(119, 119, 119, 0.2) 109.02%)",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Link to={"/crypto-box"}>
            <div
              style={{
                background:
                  "linear-gradient(110.8deg, #010510 -4.16%, #001016 49.91%, #010510 98.83%)",
              }}
              className="flex flex-col p-6 h-full w-full justify-between  rounded-3xl "
            >
              <div className="flex flex-col w-full space-y-1.5">
                <div className="flex items-center space-x-2">
                  <p className="font-body1 text-[#F4F4F5] text-md sm:text-lg font-medium mt-1 truncate">
                   ${price}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="font-body1 text-[#F4F4F5] text-md sm:text-lg font-medium mt-1 truncate">
                    APY : <span className="text-[#FB5607] font-body1">83%</span>
                  </p>
                </div>

                {/* SVG Chart Area */}
                <div className="flex justify-end  items-center w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[130px] h-[80px] mr-10 -mt-16 "
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
                      stroke="#0fae96"
                      strokeWidth="20"
                    />
                  </svg>
                </div>
              </div>

              <div className="w-full flex flex-col h-px bg-white/5" />

              <div className="w-full flex items-center justify-between ">
                <div className="w-[89px] h-[35px]">
                  <img
                    src="./current/bfm.svg"
                    alt="/"
                    className="w-full h-full -ml-5"
                  />
                </div>

                <p className="text-[#ECF1F0] xl:text-lg text- font-medium font-body1 -ml-40  sm:-ml-40">
                  BENIFIT MINE
                </p>
                <p className="flex items-center font-body1 text-[#1D1429] justify-center -ml-28 sm:-ml-28 px-1 py-0.5 text-[8px] bg-[#C6C6C6] rounded-xs">
                  BFM
                </p>
                <div className="h-10 w-10  rounded-full bg-white/5 hidden xl:flex items-center justify-center">
                <GoArrowUpRight className="text-[#B6B6B6] h-5 w-5" />
              </div>
              <div className="h-10 w-10 rounded-full bg-white/5  flex md:hidden items-center justify-center">
                <GoArrowUpRight className="text-[#B6B6B6] h-5 w-5" />
              </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="bg-[#0AC09333] w-[165px] h-[165px] rounded-full blur-[100px] absolute -bottom-10  -right-36" />
      </div>
    </div>
  );
};

export default Services;
