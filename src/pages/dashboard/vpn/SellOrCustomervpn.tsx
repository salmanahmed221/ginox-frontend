import React, { useState } from "react";
import { SparklesCore } from "../../../components/ui/sparkles";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";

import SellVpn from "../vpn/SellVpn";
import CustomersList from "../vpn/CustomersList";

const SellOrCustomervpn = () => {
  const [activeTab, setActiveTab] = useState("VPN Services");
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

      <div className="w-full  max-w-[1100px] items-center justify-center px-4   ">
        <div className="relative z-50 w-full ">
          <div className="  h-[90vh] md:h-[80vh] px-4  pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header title={"Sell VPN"} />{" "}
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />
            {/* Team Cards Grid */}
            <div className="relative overflow-y-auto md:pt-2 h-full justify-between    w-full element ">
              <div className="grid grid-cols-2 w-full justify-between gap-5 h-full ">
                <div className="flex-1">
                  <SellVpn />
                </div>
                <div className="flex-1 ">
                  <CustomersList />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full hidden md:flex">
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellOrCustomervpn;
