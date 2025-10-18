import React, { useState } from "react";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import TeamGroupSales from "./team/TeamGroupSales";
import TeamGroupTree from "./team/TeamGroupTree";
import TeamDirectReferralList from "./team/TeamDirectReferralList";
import TeamCreateAccount from "./team/TeamCreateAccount";
import TeamSponsorBonusReport from "./team/TeamSponsorBonusReport";
import TeamPromotionReport from "./team/TeamPromotionReport";
import TeamVouchers from "./team/TeamVouchers";
import { SparklesCore } from "../../components/ui/sparkles";
import { MdArrowBack } from "react-icons/md";
import {
  FaUsers,
  FaChartLine,
  FaUserPlus,
  FaGift,
  FaTrophy,
  FaTicketAlt,
} from "react-icons/fa";
import { BiSupport } from "react-icons/bi";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Team = () => {
  const [activeTab, setActiveTab] = useState("Team");
  const [activeSection, setActiveSection] = useState("item-1");
  const [listTab, setListTab] = useState("referallist"); // History tabs state

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  // const renderTabContent = () => {
  //   switch (activeTab) {
  //     case "group-sales":
  //       return <TeamGroupSales />;
  //     case "group-tree":
  //       return <TeamGroupTree />;
  //     case "direct-referral-list":
  //       return <TeamDirectReferralList />;
  //     case "create-account":
  //       return <TeamCreateAccount />;
  //     case "sponsor-bonus-report":
  //       return <TeamSponsorBonusReport />;
  //     case "promotion-report":
  //       return <TeamPromotionReport />;
  //     case "vouchers":
  //       return <TeamVouchers />;
  //     default:
  //       return null;
  //   }
  // };

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
          <div className="  h-[90vh] md:h-[80vh] px-4  pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header title={activeTab} />{" "}
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />
            {/* Team Cards Grid */}
            <div className="relative overflow-y-auto md:pt-2 h-full justify-between  w-full element ">
              {activeTab === "Team" && (
                <div className="flex      w-full  h-full">
                  <div className="flex flex-col w-full  md:hidden">
                    <div className="w-full flex justify-between items-center py-2 px-1">
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-1"
                            ? "border-[#33A0EA]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-1")}
                      >
                        <div className="text-lg ">
                          <FaChartLine />
                        </div>
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-2"
                            ? "border-[#33A0EA]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-2")}
                      >
                        <div className="text-lg ">
                          <FaUsers />
                        </div>
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-3"
                            ? "border-[#33A0EA]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-3")}
                      >
                        <div className="text-lg ">
                          <FaUserPlus />
                        </div>
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-4"
                            ? "border-[#33A0EA]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-4")}
                      >
                        <div className="text-lg ">
                          <FaGift />
                        </div>
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-5"
                            ? "border-[#33A0EA]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-5")}
                      >
                        <div className="text-lg ">
                          <FaTrophy />
                        </div>
                      </div>
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                          activeSection === "item-6"
                            ? "border-[#33A0EA]"
                            : "border-white/10"
                        } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                        onClick={() => handleSectionChange("item-6")}
                      >
                        <div className="text-lg ">
                          <FaTicketAlt />
                        </div>
                      </div>
                    </div>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full md:hidden block mt-2"
                      value={activeSection}
                      onValueChange={(value) => {
                        setActiveSection(value);
                        // Add smooth scrolling to the selected section
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }, 100);
                      }}
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger
                          id="mobile-section-1"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Group Sales
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className="group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3  overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                            <TeamGroupSales />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger
                          id="mobile-section-2"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Group Tree
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className="group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                            <TeamGroupTree />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger
                          id="mobile-section-3"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Direct Referral List
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className="group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                            <TeamDirectReferralList />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger
                          id="mobile-section-4"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Sponsor Bonus Report
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className=" group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3  overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                            <TeamSponsorBonusReport />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5">
                        <AccordionTrigger
                          id="mobile-section-5"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Promotion Report
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className="group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                            <TeamPromotionReport />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6">
                        <AccordionTrigger
                          id="mobile-section-6"
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          Vouchers
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className="group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                            <TeamVouchers />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="hidden gap-5 md:flex w-full">
                    <div className="max-w-[60%]  gap-4   w-full flex ">
                      <div className="flex flex-col gap-3 max-w-[40%] w-full justify-between ">
                        <div className="md:block hidden group relative bg-gradient-to-br h-[220px]   from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3  overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                          <TeamGroupSales />
                        </div>
                        <div className="md:flex hidden group relative bg-gradient-to-br h-[220px]  flex-col items-center    from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                          {/* <TeamVouchers /> */}

                          <div className=" text-[10px] font-header  flex items-center w-full  tracking-widest">
                            VOUCHERS
                          </div>

                          <p className="text-[32px] font-bold  pt-6 ">
                            Coming soon
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col max-w-[60%] gap-3  justify-between w-full">
                        <div className="md:block hidden group relative bg-gradient-to-br  h-[220px]   from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 woverflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                          <TeamSponsorBonusReport />
                        </div>

                       
                     

                      <div className="md:block hidden group relative bg-gradient-to-br h-[220px]  from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3  overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20 ">
                        <div>
                          {/* History Tabs Section */}
                          {/* Tab Navigation */}
                          <div className="flex items-end justify-end  ">
                            <button
                              onClick={() => setListTab("referallist")}
                              className={`px-2 rounded-full py-1 text-[10px] font-medium transition-colors ${
                                listTab === "referallist"
                                  ? "bg-[linear-gradient(140.4deg,_rgba(51,_160,_234,_0.4)_9.17%,_rgba(10,_196,_136,_0.4)_83.83%)]"
                                  : "text-gray-400 hover:text-white"
                              }`}
                            >
                              Referal List
                            </button>
                            <button
                              onClick={() => setListTab("promotion")}
                              className={`px-2 rounded-full py-1 text-[10px] font-medium transition-colors ${
                                listTab === "promotion"
                                  ? "bg-[linear-gradient(140.4deg,_rgba(51,_160,_234,_0.4)_9.17%,_rgba(10,_196,_136,_0.4)_83.83%)]"
                                  : "text-gray-400 hover:text-white"
                              }`}
                            >
                              Promotion List
                            </button>
                          </div>

                          {/* Tab Content */}
                          <div className="">
                            {listTab === "referallist" && (
                              <div className="md:block hidden group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl   rounded-2xl   overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                                <TeamDirectReferralList />
                              </div>
                            )}
                            {listTab === "promotion" && (
                              <div className="md:block hidden group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl    overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                                <TeamPromotionReport />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>

                    <div className="max-w-[40%] w-full flex  ">
                      <div className="md:block hidden w-full group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3  overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                        <TeamGroupTree />
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

export default Team;
