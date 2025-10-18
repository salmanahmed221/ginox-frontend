import { useState, useEffect } from "react";

// Slides data with content - 10 slides
const slides = [
  {
    id: 1,
    content: (
      <div className="p-4 flex w-full h-full flex-col items-start">
        <img
          src="./hero/slider2.svg"
          alt="slider2"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto"
        />
        <img
          src="./featured/benifit-mine.svg"
          alt="benefit"
          className="w-[140px] sm:w-[200px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4">
          By{" "}
          <span className="font-bod text-[10px] font-body text-[#F4F4F566]">
            A faster, more efficient, and secure crypto ecosystem that rewards
            users.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="p-4 w-full h-full flex flex-col items-start">
        <img
          src="./hero/slider1.svg"
          alt="slider1"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto"
        />
        <img
          src="/tradeforecast.png"
          alt="logo"
          className="w-[30px] sm:w-[40px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4 sm:mt-2">
          By{" "}
          <span className="text-[10px] text-[#F4F4F566] font-body">
            Advance level signal channel provider
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="p-4 w-full h-full flex flex-col items-start">
        <img
          src="./hero/slider3.svg"
          alt="slider3"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto ml-1"
        />
        <img
          src="/logo.svg"
          alt="logo"
          className="w-[90px] sm:w-[110px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4">
          By{" "}
          <span className="text-[10px] text-[#F4F4F566] font-body">
            A hybrid Web3.0 marketplace offering a variety of crypto products
            and services.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 4,
    content: (
      <div className="p-4 flex w-full h-full flex-col items-start">
        <img
          src="./hero/slider2.svg"
          alt="slider4"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto"
        />
        <img
          src="./featured/benifit-mine.svg"
          alt="benefit"
          className="w-[140px] sm:w-[200px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4">
          By{" "}
          <span className="font-bod text-[10px] font-body text-[#F4F4F566]">
            Advanced blockchain technology for modern traders and investors.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 5,
    content: (
      <div className="p-4 w-full h-full flex flex-col items-start">
        <img
          src="./hero/slider1.svg"
          alt="slider5"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto"
        />
        <img
          src="/tradeforecast.png"
          alt="logo"
          className="w-[30px] sm:w-[40px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4 sm:mt-2">
          By{" "}
          <span className="text-[10px] text-[#F4F4F566] font-body">
            Premium analytics and real-time market insights platform.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 6,
    content: (
      <div className="p-4 w-full h-full flex flex-col items-start">
        <img
          src="./hero/slider3.svg"
          alt="slider6"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto ml-1"
        />
        <img
          src="/logo.svg"
          alt="logo"
          className="w-[90px] sm:w-[110px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4">
          By{" "}
          <span className="text-[10px] text-[#F4F4F566] font-body">
            Next-generation DeFi platform for global cryptocurrency trading.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 7,
    content: (
      <div className="p-4 flex w-full h-full flex-col items-start">
        <img
          src="./hero/slider2.svg"
          alt="slider7"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto"
        />
        <img
          src="./featured/benifit-mine.svg"
          alt="benefit"
          className="w-[140px] sm:w-[200px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4">
          By{" "}
          <span className="font-bod text-[10px] font-body text-[#F4F4F566]">
            Cutting-edge smart contracts and automated trading solutions.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 8,
    content: (
      <div className="p-4 w-full h-full flex flex-col items-start">
        <img
          src="./hero/slider1.svg"
          alt="slider8"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto"
        />
        <img
          src="/tradeforecast.png"
          alt="logo"
          className="w-[30px] sm:w-[40px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4 sm:mt-2">
          By{" "}
          <span className="text-[10px] text-[#F4F4F566] font-body">
            Professional grade trading signals and technical analysis tools.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 9,
    content: (
      <div className="p-4 w-full h-full flex flex-col items-start">
        <img
          src="./hero/slider3.svg"
          alt="slider9"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto ml-1"
        />
        <img
          src="/logo.svg"
          alt="logo"
          className="w-[90px] sm:w-[110px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4">
          By{" "}
          <span className="text-[10px] text-[#F4F4F566] font-body">
            Innovative Web3 solutions for the future of decentralized finance.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: 10,
    content: (
      <div className="p-4 flex w-full h-full flex-col items-start">
        <img
          src="./hero/slider2.svg"
          alt="slider10"
          className="w-full max-w-[450px] md:max-w-[550px] h-auto"
        />
        <img
          src="./featured/benifit-mine.svg"
          alt="benefit"
          className="w-[140px] sm:w-[200px] h-auto mt-4"
        />
        <p className="text-sm sm:text-base font-header mt-4">
          By{" "}
          <span className="font-bod text-[10px] font-body text-[#F4F4F566]">
            Revolutionary crypto ecosystem with advanced rewards and staking.
          </span>
        </p>
      </div>
    ),
  },
];

export default function SliderHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
  };

  // Auto play: advance slides every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Circular positioning logic
  const getSlidePosition = (index) => {
    let diff = index - currentSlide;

    // Handle circular wrapping
    if (diff > slides.length / 2) {
      diff = diff - slides.length;
    } else if (diff < -slides.length / 2) {
      diff = diff + slides.length;
    }

    return diff;
  };

  const getSlideClasses = (position) => {
    const base =
      "absolute top-1/2 transform -translate-y-1/2 transition-all duration-600 ease-in-out cursor-pointer";

    switch (position) {
      case 0: // Center
        return `${base} left-1/2 -translate-x-1/2 scale-[0.7]  z-30 opacity-100`;
      case 1: // Right 1
        return `${base} left-[70%] sm:left-[85%] top-44 -translate-x-1/2 scale-[0.4] z-20 opacity-80`;

      case -1: // Left 1
        return `${base} left-[30%] sm:left-[15%] top-44 -translate-x-1/2 scale-[0.4] z-20 opacity-80`;

      case 2: // Right 2
        return `${base} left-[85%] sm:left-[90%] top-24 -translate-x-1/2 scale-[0.4] z-10 opacity-60`;

      case -2: // Left 2
        return `${base} left-[15%] sm:left-[10%] top-24 -translate-x-1/2 scale-[0.4] z-10 opacity-60`;

      case 3: // Right 3
        return `${base} left-[95%] sm:left-[80%] top-5 -translate-x-1/2 scale-[0.4] z-5 opacity-60`;

      case -3: // Left 3
        return `${base} left-[5%] sm:left-[20%] top-5 -translate-x-1/2 scale-[0.4] z-5 opacity-60`;

      case 4: // Right 4
        return `${base} left-[100%] sm:left-[70%] top-[-15%] -translate-x-1/2 scale-[0.4] z-5 opacity-60`;

      case -4: // Left 4
        return `${base} left-[0%] sm:left-[30%] top-[-15%] -translate-x-1/2 scale-[0.4] z-5 opacity-60`;

      case 5: // Right 5 (back)
        return `${base} left-[90%] sm:left-[50%] top-[-25%] -translate-x-1/2 scale-[0.4] z-3 opacity-60`;

      case -5: // Left 5 (back)
        return `${base} left-[60%] sm:left-[50%] top-[-25%] -translate-x-1/2 scale-[0.4] z-3 opacity-60`;

      default: // Hidden slides
        return `${base} opacity-0 scale-30 pointer-events-none z-1`;
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center  py-6 sm:py-10">
      {/* Enhanced side fades for better effect */}
      <div className="absolute top-0 left-0 h-full w-32 sm:w-40 bg-gradient-to-r from-transparent via-black/20 to-transparent z-40 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-32 sm:w-40 bg-gradient-to-l from-transparent via-black/20 to-transparent z-40 pointer-events-none" />

      {/* Slide Container */}
      <div className="relative w-full h-auto min-h-[290px] sm:min-h-[360px] md:min-h-[400px] px-4">
        {slides.map((slide, index) => {
          const position = getSlidePosition(index);
          // Show all 10 cards

          return (
            <div
              key={slide.id}
              onClick={() => goToSlide(index)}
              style={{
                background:
                  "linear-gradient(90deg, #010510 0%, #001016 52%, #010510 100%)",
              }}
              className={`${getSlideClasses(
                position
              )} w-full max-w-[300px] sm:max-w-[500px] flex justify-center items-center rounded-2xl backdrop-blur-md border border-white/10 hover:border-[#82DDB5]/30 transition-all duration-300`}
            >
              {slide.content}
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      {/* <div className="flex justify-center space-x-2 mt-6 z-30 flex-wrap max-w-lg">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all duration-300 border mb-1 hover:scale-125
              ${
                index === currentSlide
                  ? "bg-[#82ddb6] border-[#82DDB5] shadow-[0_0_15px_#82DDB5aa] scale-110"
                  : "bg-white/20 border-white/30 hover:bg-white/40 hover:border-white/60"
              }`}
          />
        ))}
      </div> */}
    </div>
  );
}
