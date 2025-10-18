// BuyingHistory.jsx
// Pixel-perfect implementation of the Buying History page with tab navigation and styled tables/cards
// Exported for use in dashboard routes
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import axios from "../../api/axiosConfig";
import { SparklesCore } from "../../components/ui/sparkles";
import { FaCube, FaSignal, FaShieldAlt, FaTicketAlt, FaGamepad } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const TABS = [
  { label: "Crypto Box" },
  { label: "Signals Channels" },
  { label: "VPN" },
  { label: "Lottery" },
  { label: "Games" },
];

// Card data structure for each tab
const BUYING_HISTORY_CARDS = [
  {
    id: "crypto-box",
    title: "Crypto Box",
    description:
      "View your crypto box purchase history, transaction IDs, stake amounts, and purchase dates. Track all your crypto box investments.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    gradient: "from-[#33A0EA]/20 to-[#0AC488]/20",
    hoverGradient: "from-[#33A0EA]/30 to-[#0AC488]/30",
  },
  {
    id: "signals-channels",
    title: "Signals Channels",
    description:
      "Access your signal channel subscription history with purchase amounts, status updates, and expiry dates for all active channels.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4"
        />
      </svg>
    ),
    gradient: "from-[#0AC488]/20 to-[#33A0EA]/20",
    hoverGradient: "from-[#0AC488]/30 to-[#33A0EA]/30",
  },
  {
    id: "vpn",
    title: "VPN Services",
    description:
      "Monitor your VPN service purchases, subscription status, payment amounts, and service expiration dates for secure browsing.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    gradient: "from-[#33A0EA]/20 to-[#0AC488]/20",
    hoverGradient: "from-[#33A0EA]/30 to-[#0AC488]/30",
  },
  {
    id: "lottery",
    title: "Lottery",
    description:
      "Review your lottery participation history, ticket purchases, winning amounts, and draw dates for all lottery games.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    gradient: "from-[#0AC488]/20 to-[#33A0EA]/20",
    hoverGradient: "from-[#0AC488]/30 to-[#33A0EA]/30",
  },
  {
    id: "games",
    title: "Games",
    description:
      "Track your gaming product purchases, game titles, payment amounts, and purchase dates for all gaming services.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M16 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    gradient: "from-[#33A0EA]/20 to-[#0AC488]/20",
    hoverGradient: "from-[#33A0EA]/30 to-[#0AC488]/30",
  },
];

const TABLES = [
  // Crypto Box (service)
  {
    headers: ["#", "Tranx ID", "Stake Amount", "Date"],
    rows: [],
  },
  // Signals Channels
  {
    headers: ["#", "Amount", "Status", "Purchase Date", "Expiry Date"],
    rows: [],
  },
  // VPN
  {
    headers: ["#", "Amount", "Status", "Purchase Date", "Expiry Date"],
    rows: [],
  },
  // Lottery (not mapped in API)
  {
    headers: ["#", "Lottery", "Ticket Price", "Winning Amount", "Date"],
    rows: [],
  },
  // Games (product)
  {
    headers: ["#", "Product", "Amount", "Date"],
    rows: [],
  },
];

const BuyingHistory = () => {
  const [activeTab, setActiveTab] = useState("cards"); // Changed to start with cards view
  const [selectedCard, setSelectedCard] = useState(null); // Track selected card for detailed view
  const [activeSection, setActiveSection] = useState("item-1");
  const [tableRows, setTableRows] = useState([[], [], [], [], []]);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("/services/history", { headers: { token } })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const data = res.data.data;

          // Prepare rows for each tab
          const cryptoBoxRows = data
            .filter((x) => x.productName === "Crypto Box")
            .map((row, i) => [
              i + 1,
              row.tranx_id,
              row.amount,
              new Date(row.createdAt).toISOString().slice(0, 10),
            ]);

          // Signals Channels - show active and updated status
          const signalsRows = data
            .filter(
              (x) =>
                x.productName === "Signal Channel" &&
                (x.status === "active" || x.status === "updated")
            )
            .map((row, i) => [
              i + 1,
              row.amount,
              row.status,
              new Date(row.createdAt).toISOString().slice(0, 10),
              new Date(row.expiresAt).toISOString().slice(0, 10),
            ]);

          // VPN - show all IPVPN products (active and updated status)
          const vpnRows = data
            .filter((x) => x.productName === "IPVPN")
            .map((row, i) => [
              i + 1,
              row.amount,
              row.status,
              new Date(row.createdAt).toISOString().slice(0, 10),
              new Date(row.expiresAt).toISOString().slice(0, 10),
            ]);

          const lotteryRows = data
            .filter((x) => x.productName === "Lottery")
            .map((row, i) => [
              i + 1,
              row.productName,
              row.amount,
              row.winningAmount || "N/A", // Assuming winningAmount might be present for lottery
              new Date(row.createdAt).toISOString().slice(0, 10),
            ]);

          // Games (product)
          const gamesRows = data
            .filter((x) => x.productType === "product")
            .map((row, i) => [
              i + 1,
              row.productName,
              row.amount,
              new Date(row.createdAt).toISOString().slice(0, 10),
            ]);

          setTableRows([
            cryptoBoxRows,
            signalsRows,
            vpnRows,
            lotteryRows,
            gamesRows,
          ]);
        }
      })
      .catch((error) => {
        console.error("Error fetching buying history:", error);
      })
      .finally(() => setLoading(false));
  }, [token]);
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
            <Header title="BUYING HISTORY" />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  mt-2"
            />

            {/* Table/Card Section */}
            <div className="flex-1 flex flex-col justify-start  element w-full overflow-y-auto ">
              {/* Cards View */}
              {activeTab === "cards" && (
                <div className="w-full md:p-2 overflow-y-auto element  mt-1 md:mt-2">
                  {/* Mobile Circle Icons */}
                  <div className="w-full md:hidden flex justify-between items-center p-2">
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                        activeSection === "item-1"
                          ? "border-[#33A0EA]"
                          : "border-white/10"
                      } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                      onClick={() => handleSectionChange("item-1")}
                    >
                      <div className="text-lg ">
                        <FaCube />
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
                        <FaSignal />
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
                        <FaShieldAlt />
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
                        <FaTicketAlt />
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
                        <FaGamepad />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Accordion Sections */}
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full md:hidden block mt-3"
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
                    {BUYING_HISTORY_CARDS.map((card, index) => (
                      <AccordionItem key={card.id} value={`item-${index + 1}`}>
                        <AccordionTrigger
                          id={`mobile-section-${index + 1}`}
                          className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
                        >
                          {card.title}
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                          <div className="group relative bg-gradient-to-br overflow-y-auto from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 overflow-hidden transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20">
                            <div className="relative z-10 space-y-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                  {card.title}
                                </h3>
                              </div>
                              <div className="w-full rounded-2xl element bg-[#181f29]/80 backdrop-blur-md border border-[#232b36] shadow-lg h-[200px]">
                                <div
                                  className="grid overflow-x-auto overflow-y-auto"
                                  style={{
                                    gridTemplateColumns: `repeat(${TABLES[index].headers.length}, 1fr)`,
                                  }}
                                >
                                  {TABLES[index].headers.map((header, idx) => (
                                    <div
                                      key={header}
                                      className=" px-2 py-2  flex items-center   font-body1 text-center bg-black text-white text-[7px]  tracking-widest border-b border-[#232b36] first:rounded-tl-2xl last:rounded-tr-2xl"
                                    >
                                      {header}
                                    </div>
                                  ))}
                                </div>
                                <div className="">
                                  {tableRows[index].length === 0 && (
                                    <div className="text-center flex flex-col text-white py-8 font-body1 text-[10px]">
                                      No data available
                                    </div>
                                  )}
                                  {tableRows[index].map((row, rIdx) => (
                                    <div
                                      key={rIdx}
                                      className="grid "
                                      style={{
                                        gridTemplateColumns: `repeat(${TABLES[index].headers.length}, 1fr)`,
                                      }}
                                    >
                                      {row.map((cell, cIdx) => (
                                        <div
                                          key={cIdx}
                                          className="p-3 font-body1    text-white text-[8px] border-b border-[#232b36] last:border-b-0 tracking-widest"
                                        >
                                          {cell}
                                        </div>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* Desktop Cards Grid */}
                  <div className="md:grid grid-cols-3 md:gap-5 hidden">
                    {BUYING_HISTORY_CARDS.map((card, index) => (
                      <div
                        key={card.id}
                        className="group relative bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 h-[200px] w-[330px] transition-all duration-700 hover:border-[#33A0EA]/30 hover:shadow-2xl hover:shadow-[#33A0EA]/20 cursor-pointer"
                      >
                        <div className="relative z-10 space-y-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                              {card.title}
                            </h3>
                          </div>
                          <div className="w-full rounded-2xl element bg-[#181f29]/80 backdrop-blur-md border border-[#232b36] shadow-lg h-[120px]">
                            <div
                              className="grid overflow-x-auto overflow-y-auto"
                              style={{
                                gridTemplateColumns: `repeat(${TABLES[index].headers.length}, 1fr)`,
                              }}
                            >
                              {TABLES[index].headers.map((header, idx) => (
                                <div
                                  key={header}
                                  className=" px-2 py-2  flex items-center   font-body1 text-center bg-black text-white text-[9px]  tracking-widest border-b border-[#232b36] first:rounded-tl-2xl last:rounded-tr-2xl"
                                >
                                  {header}
                                </div>
                              ))}
                            </div>
                            <div className="">
                              {tableRows[index].length === 0 && (
                                <div className="text-center flex flex-col text-white py-8 font-body1 text-[10px]">
                                  No data available
                                </div>
                              )}
                              {tableRows[index].map((row, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="grid "
                                  style={{
                                    gridTemplateColumns: `repeat(${TABLES[index].headers.length}, 1fr)`,
                                  }}
                                >
                                  {row.map((cell, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className="p-3 font-body1    text-white text-[7px] border-b border-[#232b36] last:border-b-0 tracking-widest"
                                    >
                                      {cell}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
export default BuyingHistory;
