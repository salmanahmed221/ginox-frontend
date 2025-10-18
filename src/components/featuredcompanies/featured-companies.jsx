import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { featureCardsData } from ".";
import { Link } from "react-router-dom";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const FeaturedCompanies = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(window.innerWidth >= 1024 ? 2 : 1);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const totalSlides = featureCardsData.length;
  const maxSlide = Math.max(0, totalSlides - slidesPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full flex flex-col pt-20 sm:pt-32 relative ">
      <p className="text-[24px] text-center sm:text-[34px]  font-header text-[#A0E0C4]">
        Featured Companies
      </p>

      {/* Top Blur */}
      <div className="bg-[#0AC09333] w-[160px] sm:w-[192px] h-[160px] md:h-[192px] rounded-full blur-[100px] absolute -right-20 sm:-right-32 top-10" />

      {/* Slider Container */}
      <div className="relative overflow-hidden mt-6 sm:mt-10 z-20 flex justify-center">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
            width: `${(totalSlides / slidesPerView) * 100}%`,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {featureCardsData.map((cardData, idx) => (
            <div
              key={idx}
              className="w-[343px] justify-center md:w-full lg:w-full flex h-[300px] md:h-[467px]"
              style={{ flex: `0 0 ${100 / slidesPerView}%` }}
            >
              <motion.div
                className="w-[343px] md:w-[590px] max-w-[590px] p-[2px] h-[467px] rounded-xl sm:rounded-3xl cursor-pointer shadow-lg hover:shadow-white/10"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(3, 59, 21, 0.2) 33.42%, rgba(119, 119, 119, 0.2) 109.02%)",
                }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={cardData.link}>
                  <div
                    style={{
                      background:
                        "linear-gradient(110.8deg, #010510 -4.16%, #001016 49.91%, #010510 98.83%)",
                    }}
                    className="flex flex-col p-3 sm:p-6 h-[467px] w-[343px] md:w-[590px] rounded-xl sm:rounded-3xl"
                  >
                    {/* Title img */}
                    <div className="w-[140px]  sm:w-[250px] sm:h-[48px] lg:w-[308px] h-[25px] lg:h-[48px] flex items-start">
                      <img
                        src={cardData.titleImage}
                        alt="title"
                        className="h-full object-contain"
                      />
                    </div>

                    {/* Description */}
                    <div className="mt-2 sm:mt-4 min-w-0">
                      <p className="text-xs sm:text-base lg:text-[20px] avapore text-[#D4D4D8] p-1 sm:p-2 break-words">
                        <span className="font-body1">BY</span>
                        <span className="text-[#F4F4F566] text-sm font-body1 ml-1">
                          {cardData.description.replace(/^BY\s*/, "")}
                        </span>
                      </p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2.5 sm:mt-4">
                      {cardData.infoCards.map((info, infoIdx) => (
                        <div
                          key={infoIdx}
                          className="bg-black/40 w-full h-[80px] sm:h-[120px] lg:h-[136px] rounded-lg sm:rounded-2xl p-2 sm:p-4 sm:py-6 flex flex-col space-y-4"
                        >
                          {/* Title */}
                          <div className="flex flex-col w-full space-y-2">
                            <div className="flex items-center space-x-2">
                              <img
                                src={info.icon}
                                alt="icon"
                                className="w-4 h-4 sm:w-[23px] sm:h-[23px]"
                              />
                              <p className="text-[10px] sm:text-sm lg:text-lg text-white truncate font-body1">
                                {info.title}
                              </p>
                            </div>
                            <div className="w-full h-px bg-white/5" />
                          </div>

                          {/* Divider */}

                          {/* Details */}
                          {info.details ? (
                            <ul className="list-disc list-inside space-y-1">
                              {info.details.map((point, i) => (
                                <li
                                  key={i}
                                  className="text-[9px] sm:text-xs relative -top-2 sm:top-0 lg:text-sm font-body1 text-white/50 truncate"
                                >
                                  {point}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[9px] line-break sm:text-xs lg:text-sm font-body1 text-white/50 break-words">
                              {info.detail}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="w-full flex items-center justify-center space-x-6 mt-10 z-20 md:hidden">
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

      {/* Bottom Blur */}
      <div className="bg-[#0AC09333] w-[160px] sm:w-[192px] h-[160px] sm:h-[192px] rounded-full blur-[100px] absolute -bottom-10 -left-20 sm:-left-36" />
    </div>
  );
};

export default FeaturedCompanies;
