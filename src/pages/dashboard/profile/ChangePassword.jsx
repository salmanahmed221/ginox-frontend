import React from "react";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import { SparklesCore } from "../../../components/ui/sparkles";

const ChangePassword = () => {
  return (
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
          <div className=" h-[90vh] md:h-[80vh]  px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header title={"Change Password"} />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />

            <div className="relative overflow-y-auto pt-6 px-4 sm:px-6 md:p-10 w-full element">
              <form className="w-full flex flex-col items-center">
                <div className="w-full flex flex-col mb-8">
                  <label
                    className=" font-header text-xs sm:text-xl tracking-widest mb-4"
                    htmlFor="currentPassword"
                  >
                    CURRENT PASSWORD
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter Current Password"
                    className="w-full bg-[#000000] font-body1 rounded-xl px-4 py-3 text-text_secondary  outline-none border-[1px] border-[#FFFFFF1A]"
                  />
                </div>
                <div className="w-full flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex-1 flex flex-col">
                    <label
                      className=" text-xs sm:text-xl font-header tracking-widest mb-4"
                      htmlFor="newPassword"
                    >
                      NEW PASSWORD
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="Enter New Password"
                      className="border-[1px] border-[#FFFFFF1A] w-full bg-[#000000] rounded-xl px-4 py-3 text-text_secondary font-body1 outline-none border-none"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label
                      className=" text-xs sm:text-xl font-header tracking-widest mb-4"
                      htmlFor="confirmPassword"
                    >
                      CONFIRM PASSWORD
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Enter Confirm Password"
                      className="border-[1px] border-[#FFFFFF1A] w-full bg-[#000000] rounded-xl px-4 py-3 text-text_secondary font-body1 outline-none border-none"
                    />
                  </div>
                </div>
                <div className="w-full border-b border-[#FFFFFF1A] mb-12" />
                <div className="flex justify-end w-full">
                  <button
                    type="submit"
                    className="w-[320px] py-3 rounded-full text-text_primary font-body1 text-base bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-all shadow-lg"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full hidden md:flex">
            <Navbar />
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
