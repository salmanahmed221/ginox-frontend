import React, { useEffect, useState } from "react";
import SliderHero from "./heroslider";

const Hero = () => {
  const part1 = ["Discover", "the", "Future", "of"];
  const part2 = ["Crypto", "&", "Digital", "Products"];
  const totalWords = part1.length + part2.length;
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const intervalId = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= totalWords) return prev;
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(intervalId);
  }, []);

  const firstPartVisible = part1
    .slice(0, Math.min(visibleCount, part1.length))
    .join(" ");
  const secondCount = Math.max(visibleCount - part1.length, 0);
  const secondPartVisible = part2
    .slice(0, Math.min(secondCount, part2.length))
    .join(" ");
  return (
    <div className="w-full h-full pt-10 sm:pt-20 relative flex flex-col items-center justify-center">
      <div
        className=" w-44 h-44 sm:h-[400px] sm:w-[400px]    blur-3xl opacity-50 rounded-full absolute z-10"
        style={{
          background:
            "linear-gradient(180deg, #0E7BF8 0%, rgba(14, 123, 248, 0) 86.35%)",
        }}
      />
      <div className="w-full max-w-[1500px]   mx-auto relative z-20 flex flex-col md:flex-row items-center md:items-start justify-between md:gap-8 gap-10 md:px-8 px-4">
        <div className="w-full md:w-1/2 flex flex-col space-y-4 items-center md:items-start leading-[25px] md:leading-[60px] justify-center avalont text-center md:text-left">
          <p className="md:px-0 px-1 mt-16 sm:mt-40 text-xl font-header  sm:text-[50px] leading-[25px] md:leading-[60px] font-light ">
            {firstPartVisible}
            {secondPartVisible ? " " : ""}
            <span className="text-[#82DDB5] font-header sm:text-[90px]  leading-[25px] md:leading-[60px]">
              {secondPartVisible}
            </span>
          </p>
        </div>
        <div className="w-full md:w-[60%] sm:mt-40">
          <SliderHero />
        </div>
      </div>
    </div>
  );
};

export default Hero;
