import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Lottery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const lotteryItems = [
    {
      id: 1,
      image: "./lottery/freelottery.svg",
      title: "Free Lottery",
      description: "Join for free and stand a chance to win exciting prizes!",
      buttonText: "Enter Now",
      buttonLink: "/lottery-all",
      isActive: true,
      hasGradient: true,
      bg: "./lottery/grid.svg",
      hover: `"0px 0px 12px 0px #FFFFFF4D" : "none"`,
      link: "/lottery-all",
    },
    {
      id: 2,
      image: "./lottery/cryptobox.svg",
      title: "BFM Crypto Box ",
      description: "Join for free and stand a chance to win exciting prizes!",
      buttonText: "Enter Now",
      buttonLink: "/lottery-all",
      isActive: true,
      hasGradient: true,
      bg: "./lottery/grid.svg",
      hover: `"0px 0px 12px 0px #FFFFFF4D" : "none"`,
      link: "/lottery-all",
    },
    // {
    //   id: 3,
    //   image: "./lottery/vpn.svg",
    //   title: "Buy VPN - WIn $5000",
    //   description:
    //     "Purchase and VPN service and enter the exclusive $5000 lottery draw!",
    //   buttonText: "Buy Ticket",
    //   buttonLink: null,
    //   isActive: false,
    //   hasGradient: false,
    //   bg: "./lottery/grid.svg",
    // },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % lotteryItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + lotteryItems.length) % lotteryItems.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const LotteryCard = ({ item, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        className="h-[449px] z-20 max-w-[364px] relative overflow-hidden p-[2px] bg-black/10  w-full rounded-3xl cursor-pointer"
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          boxShadow: isHovered ? item.hover : "",
        }}
      >
        <img
          src={item.bg}
          alt="/"
          className="absolute w-full h-[449px] rounded-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010002] rounded-3xl to-[#ffffff] to-[61%] opacity-5" />
        <Link to={item.link}>
          <div className="flex flex-col p-6 h-full w-full items-center justify-between z-50 rounded-3xl">
            {item.isActive ? (
              <>
                <div className="w-[295px] h-[205px] relative flex items-center justify-center">
                  <img
                    src={item.image}
                    alt="/"
                    className={`absolute  ${
                      item.id === 2
                        ? "w-[170px] h-[170px]  top-8" // Second card ke liye custom size
                        : "w-[295px] h-[305px] -top-14" // Baaki cards ke liye default size
                    }`}
                  />
                </div>

                <div className="text-sm text-white text-center space-y-4">
                  <p className="font-body1 sm:text-[20px]">{item.title}</p>
                  <p className="font-body1 opacity-60">{item.description}</p>
                </div>

                <div className="w-full flex flex-col h-px bg-white/15" />

                <Link
                  to={item.buttonLink}
                  className="text-[#fff] justify-center flex w-full py-3 rounded-full font-body1 text-sm"
                  style={{
                    background: item.hasGradient
                      ? "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)"
                      : "rgba(61, 61, 61, 0.4)",
                  }}
                >
                  {item.buttonText}
                </Link>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center ">
                <img
                  src="./lottery/comingsoon.svg"
                  alt="Coming Soon"
                  className="w-[200px] h-[200px]"
                  style={{ transform: "rotate(50deg)" }}
                />
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="w-full flex flex-col pt-20 sm:pt-32 relative">
      <p className="text-[24px] text-center sm:text-[34px] font-header text-[#A0E0C4]">
        Lottery
      </p>
      <div className="bg-[#0AC09333] w-[192px] h-[192px] rounded-full blur-[100px] absolute -right-32" />

      {/* Desktop Grid View */}
      <div className="hidden md:grid place-items-center md:grid-cols-2 mt-10 gap-6 xl:mx-16">
        {lotteryItems.map((item, index) => (
          <LotteryCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Mobile Slider View */}
      <div className="md:hidden mt-10">
        <div className="flex justify-center">
          <div className="relative overflow-hidden w-full max-w-[364px]">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {lotteryItems.map((item, index) => (
                <div key={item.id} className="w-full flex-shrink-0 px-4">
                  <LotteryCard item={item} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons at Bottom */}
        <div className="w-full flex items-center justify-center space-x-6 mt-10 z-20">
          <div
            onClick={prevSlide}
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
            onClick={nextSlide}
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
      </div>

      <div className="bg-[#0AC09333] w-[192px] h-[192px] rounded-full blur-[100px] absolute bottom-0 -left-32" />
    </div>
  );
};

export default Lottery;
