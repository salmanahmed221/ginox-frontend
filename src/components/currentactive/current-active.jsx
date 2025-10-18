"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GoArrowUpRight } from "react-icons/go";
import { cardData } from "."; // make sure it's imported properly
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CurrentActive = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prices, setPrices] = useState(cardData.map(() => null));
  const [loading, setLoading] = useState(cardData.map(() => true));
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    cardData.forEach(async (card, idx) => {
      setLoading((prev) => {
        const arr = [...prev];
        arr[idx] = true;
        return arr;
      });
      try {
        let price;
        if (card.name === "BENIFIT MINE") {
          price = await card.fetchPrice(token);
        } else {
          price = await card.fetchPrice();
        }
        setPrices((prev) => {
          const arr = [...prev];
          arr[idx] = price;
          return arr;
        });
      } catch {
        setPrices((prev) => {
          const arr = [...prev];
          arr[idx] = "N/A";
          return arr;
        });
      } finally {
        setLoading((prev) => {
          const arr = [...prev];
          arr[idx] = false;
          return arr;
        });
      }
    });
    // eslint-disable-next-line
  }, [token]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cardData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cardData.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full flex flex-col pt-20 sm:pt-32 relative ">
      <p className="text-[20px] text-center sm:text-[34px] font-header text-[#A0E0C4] mb-2 sm:mb-0 tracking-wide sm:tracking-normal leading-snug sm:leading-none">
        CURRENT ACTIVE STAKING BOXES
      </p>

      {/* ✅ Desktop View */}
      <div className="hidden md:grid  md:grid-cols-3 mt-10 gap-3 xl:gap-6">
        {cardData.map((card, idx) => (
          <CardItem
            key={card.id}
            card={card}
            price={prices[idx]}
            loading={loading[idx]}
          />
        ))}
      </div>

      {/* ✅ Mobile View - Show one card at a time */}
      <div className="md:hidden mt-10 flex justify-center">
        <CardItem
          card={cardData[currentIndex]}
          price={prices[currentIndex]}
          loading={loading[currentIndex]}
        />
      </div>

      {/* ✅ Navigation Buttons */}
      <div className="w-full flex items-center justify-center space-x-6 mt-10 z-20 md:hidden" >
        <div
          onClick={handlePrev}
          className="h-[50px] w-[50px] rounded-full p-px cursor-pointer"
          style={{
            background:
              "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
          }}
        >
          <div
            className="flex bg-[#010510] items-center h-full w-full justify-center rounded-full"
            style={{
              boxShadow: "inset 0px 0px 20px #0ABA4366",
            }}
          >
            <MdKeyboardArrowLeft className="text-white text-2xl" />
          </div>
        </div>

        <div
          onClick={handleNext}
          className="h-[50px] w-[50px] rounded-full p-px cursor-pointer"
          style={{
            background:
              "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
          }}
        >
          <div
            className="flex bg-[#010510] items-center h-full w-full justify-center rounded-full"
            style={{
              boxShadow: "inset 0px 0px 20px #0ABA4366",
            }}
          >
            <MdKeyboardArrowRight className="text-white text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-[#0ac09325] w-[192px] h-[192px] rounded-full blur-[100px] absolute bottom-0 -left-36" />
    </div>
  );
};

// ✅ Separated out Card Component for reuse
const CardItem = ({ card, price, loading }) => {
  const cardContent = (
    <motion.div
      className=" overflow-hidden h-[196px] sm:h-[235px] lg:max-w-[416px] p-[2px] w-full rounded-3xl shadow-lg hover:shadow-white/10"
      style={{
        background:
          "linear-gradient(0deg, rgba(3, 59, 21, 0.2) 33.42%, rgba(119, 119, 119, 0.2) 109.02%)",
      }}
      whileHover={card.link ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div
        style={{
          background:
            "linear-gradient(110.8deg, #010510 -4.16%, #001016 49.91%, #010510 98.83%)",
        }}
        className="flex flex-col p-3 xl:p-6 h-full w-full justify-between rounded-3xl"
      >
        {/* Top Row */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={card.logo} alt="/" className="w-[50px] h-[50px]" />
            <p className="text-[#ECF1F0] xl:text-lg font-medium font-body1 mt-1">
              {card.name}
            </p>
            <p className="flex items-center font-body1 text-[#1D1429] justify-center px-1 py-0.5 text-[8px] bg-[#C6C6C6] rounded-xs">
              {card.shortCode}
            </p>
          </div>
          {card.link && (
            <>
              <div className="h-10 w-10 rounded-full bg-white/5 hidden xl:flex items-center justify-center">
                <GoArrowUpRight className="text-[#B6B6B6] h-5 w-5" />
              </div>
              <div className="h-10 w-10 rounded-full bg-white/5  flex md:hidden items-center justify-center">
                <GoArrowUpRight className="text-[#B6B6B6] h-5 w-5" />
              </div>
            </>
          )}
        </div>

        <div className="w-full flex flex-col h-px bg-white/5" />

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <p className=" text-[18px] xl:text-2xl  font-body1 text-[#ECF1F0] font-medium">
              {loading
                ? "Loading..."
                : price
                ? `$${parseFloat(price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "N/A"}
            </p>
            {card.name === "BENIFIT MINE" && (
              <p className="text-xs     xl:text-lg font-medium text-[#B6B6B6] font-body1">
                APY : <span className="text-[#FB5607] font-body1">{card.apy}</span>
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <div className="w-[130px] h-[80px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[130px] h-[80px]"
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
                  stroke={card.strokeColor}
                  strokeWidth="10"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Only wrap with Link if card has a link (only BFM card)
  if (card.link) {
    return (
      <Link to={card.link} className="cursor-pointer">
        {cardContent}
      </Link>
    );
  }

  // For cards without links (BTC and ETH), just return the card content
  return cardContent;
};

export default CurrentActive;
