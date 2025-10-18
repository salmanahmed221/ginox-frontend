import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const SignalChannels = () => {
  return (
    <div className="w-full flex flex-col pt-20 sm:pt-32 relative ">
      <p className="text-[20px] sm:text-[34px] font-header text-[#A0E0C4]">
        Signal Channels
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
          <Link to={'/signal-channel'}>
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
                  <p className="font-body text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Accuracy :{" "}
                    <span className="text-[#F4F4F580]">Up to 80% Claimed</span>
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
                  <p className="font-body text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Signal : <span className="text-[#F4F4F580]">3 - 5 day</span>
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
                  <p className="font-body text-[#F4F4F5] text-xs sm:text-sm font-medium mt-1 truncate">
                    Platform :{" "}
                    <span className="text-[#F4F4F580]">Telegram, Website</span>
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

                  <p className="text-xs font-body text-[#F4F4F5] mt-0.5">
                    $5/month
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <div
          className="h-[194px] md:max-w-[422px] p-[2px] w-full  rounded-3xl cursor-pointer "
          style={{
            background:
              "linear-gradient(0deg, rgba(3, 59, 21, 0.2) 33.42%, rgba(119, 119, 119, 0.2) 109.02%)",
          }}
        >
          <div className="flex flex-col space-y-2 bg-[#000000a7] justify-center items-center p-6 relative overflow-hidden h-full w-full j  rounded-3xl ">
                <img
              src="./signal/image.svg"
              alt=" /"
              className="w-full h-full absolute top-0 right-0"
            />
            <p className="text-white font-medium avapore text-[26px] z-10 mt-1">
              COMING
            </p>
            <p className="text-white font-medium avapore text-[26px] z-10">
              SOON
            </p>
          </div>
        </div>

        <div
          className="h-[194px] md:max-w-[422px] p-[2px] w-full  rounded-3xl cursor-pointer "
          style={{
            background:
              "linear-gradient(0deg, rgba(3, 59, 21, 0.2) 33.42%, rgba(119, 119, 119, 0.2) 109.02%)",
          }}
        >
          <div className="flex flex-col space-y-2 bg-[#000000a7] justify-center items-center p-6 relative overflow-hidden h-full w-full j  rounded-3xl ">
                <img
              src="./signal/image.svg"
              alt=" /"
              className="w-full h-full absolute top-0 right-0"
            />
            <p className="text-white font-medium avapore text-[26px] z-10 mt-1">
              COMING
            </p>
            <p className="text-white font-medium avapore text-[26px] z-10">
              SOON
            </p>
          </div>
        </div>
        <div className="bg-[#0AC09333] w-[165px] h-[165px] rounded-full blur-[100px] absolute -bottom-10  -right-36" />
      </div>
    </div>
  );
};

export default SignalChannels;
