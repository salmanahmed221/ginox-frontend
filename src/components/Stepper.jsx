import React from "react";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center  w-full mb-1">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <button
            className={` py-1 rounded-full text-[7px]  md:text-[8px] px-2  transition-all duration-200 font-body1
              ${
                currentStep === idx
                  ? " bg-[linear-gradient(140.4deg,_rgba(51,_160,_234,_0.4)_9.17%,_rgba(10,_196,_136,_0.4)_83.83%)] text-white"
                  : "bg-black text-white border border-[#222b3a]"
              }`}
            disabled
          >
            {`${idx + 1}. ${step}`}
          </button>
          {idx < steps.length - 1 && (
            <div className="w-4 h-1 bg-[#222b3a] mx-1 rounded-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
