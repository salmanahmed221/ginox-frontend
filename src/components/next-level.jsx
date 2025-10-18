import React from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

const NextLevel = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center  pt-20 sm:pt-32   relative ">
      <div className="bg-[#0AC09333] w-[150px] h-[150px] rounded-full blur-[100px] absolute top-10 -right-36" />

      <div
        className=" w-full max-w-[1300px] h-[337px] rounded-3xl z-30  p-px"
        style={{
          background:
            "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
        }}
      >
        <div className=" max-w-[1300px] h-[335px] bg-[#010510] rounded-3xl">
          <div className="bg-white/5 h-full w-full rounded-3xl space-y-6  flex flex-col items-center justify-center relative">
            <img
              src="./backlinesbg.svg"
              alt="/"
              className="absolute  max-w-[1300px] h-[335px] rounded-3xl"
            />

            <div className="flex items-center justify-center  flex-wrap space-x-2 z-30">
              <p className="avapore text-[18px] sm:text-2xl md:text-[30px] text-white text-center">
                Take your Trading Journey To
              </p>

              <p className="bg-[#032F24]">
                <span
                  className=" bg-clip-text text-transparent p-2 avapore  text-[18px] sm:text-2xl md:text-[30px]  "
                  style={{
                    backgroundImage:
                      "linear-gradient(98.54deg, #0DB4B6 8.09%, #25A7DB 54.9%, #0BC092 96.91%)",
                  }}
                >
                  {" "}
                  Next Level
                </span>
              </p>
            </div>
            <p className="  text-xs sm:text-sm md:text-[18px] text-center text-[#FFFFFF99] font-body z-30 w-[80%] sm:w-[70%]">
            </p>
            <button
              className="w-[140px] sm:w-[178px] h-[50px] flex z-30 items-center rounded-full space-x-1 justify-center  text-xs sm:text-sm md:text-[18px]]"
              style={{
                background:
                  "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
              }}
            >
              <p className="mt-px font-body">Join Now</p>
              <IoArrowForwardCircleOutline className="text-white text-2xl" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-[#0ac09329] w-[192px] h-[192px] rounded-full blur-[100px] absolute  -bottom-32 -left-36" />
    </div>
  );
};

export default NextLevel;
