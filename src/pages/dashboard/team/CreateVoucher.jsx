import React from "react";
import Header from "../../../components/Header";
import { SparklesCore } from "../../../components/ui/sparkles";

const CreateVoucher = () => (
  <div className="bg-[#010510] flex flex-col items-center justify-center  h-screen w-full      relative ">
    <div
      className=" w-[1200px] h-screen       blur-3xl opacity-30 rounded-full absolute top-12 "
      style={{
        background:
          "linear-gradient(180deg, #0E7BF8 0%, rgba(14, 123, 248, 0) 86.35%)",
      }}
    />
    <div
      className=" w-[1200px] h-screen  blur-3xl opacity-20     rotate-180 rounded-full absolute  "
      style={{
        background:
          "linear-gradient(180deg, #0E7BF8 0%, rgba(14, 123, 248, 0) 86.35%)",
      }}
    />
    <div className="w-full absolute  h-full">
      <SparklesCore
        id="tsparticlesfullpage"
        background="06101A"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#FFFFFF"
      />
    </div>

    <div className="w-full  max-w-[1100px] items-center justify-center px-4  ">
      <div className="relative z-50 w-full ">
        <div className=" h-[90vh] md:h-[80vh] px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
          {" "}
          <Header title="VOUCHER" />
          <div
            style={{
              background:
                "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
            }}
            className="w-full h-px  my-2"
          />
          <div className="relative overflow-y-auto pt-6 px-4 sm:px-6 md:p-10 w-full element">
            <div className="mb-8 text-md font-heading2 tracking-widest border-b border-[#FFFFFF1A] pb-8 ">
              CREATE VOUCHER
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-white text-xs font-heading2  mb-6">
                  VOUCHER NAME
                </label>
                <input
                  className="w-full bg-black text-white rounded-lg mb-5 px-4 py-3 font-body outline-none "
                  placeholder="Enter name"
                />
                <label className="block text-white text-xs font-heading2  mb-6">
                  EXPIRY DATE
                </label>
                <input
                  className="w-full bg-black text-white rounded-lg mb-6 px-4 py-3 font-body outline-none"
                  placeholder="AC number"
                />
              </div>
              <div>
                <label className="block text-white text-xs font-heading2  mb-6">
                  DISCOUNT VALUE ( $ OR % )
                </label>
                <input
                  className="w-full bg-black text-white rounded-lg mb-5 px-4 py-3 font-body outline-none "
                  placeholder="Enter value"
                />
                <label className="block text-white text-xs font-heading2  mb-6">
                  NUMBER OF VOUCHER
                </label>
                <input
                  className="w-full bg-black text-white rounded-lg mb-4 px-4 py-3 font-body outline-none"
                  placeholder="Country"
                />
              </div>
            </form>
            <button className="w-60 py-2 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white  text-lg shadow-md mx-auto block">
              Create Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CreateVoucher;
