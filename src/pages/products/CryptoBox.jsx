import React, { useState, useEffect } from "react";
import ProductNavbar from "../../components/ProductNavbar";
import ProductFooter from "../../components/ProductFooter";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  YAxis,
  XAxis,
} from "recharts";
import Navigation from "../../components/navigation";
import Footer from "../../components/footers";
import { Link } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const chartTabs = [
  { label: "1D", type: "daily" },
  { label: "1W", type: "weekly" },
  { label: "1M", type: "monthly" },
  { label: "1Y", type: "yearly" },
];

export default function CryptoBox() {
  const [activeTab, setActiveTab] = useState("weekly");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  const [pageData, setPageData] = useState(null);
  const [pageDataLoading, setPageDataLoading] = useState(false);
  const [pageDataError, setPageDataError] = useState("");
  // Add state for total staked data
  const [totalStakedData, setTotalStakedData] = useState(null);
  const [totalStakedLoading, setTotalStakedLoading] = useState(false);
  const [totalStakedError, setTotalStakedError] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeInfo, setStakeInfo] = useState(null);
  const [stakeInfoType, setStakeInfoType] = useState("");
  const [stakeLoading, setStakeLoading] = useState(false);
  const [stakeError, setStakeError] = useState("");
  const [stakeSuccess, setStakeSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStakeAmount, setPendingStakeAmount] = useState("");
  const [modalState, setModalState] = useState("confirm"); // 'confirm' | 'result'
  const navigate = useNavigate();

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return Number(num).toLocaleString();
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Only make API call if token exists
    if (!token) {
      setPageDataLoading(false);
      setPageDataError("");
      return;
    }

    setPageDataLoading(true);
    setPageDataError("");
    axios
      .get("/cryptobox/page-data", { headers: { token } })
      .then((res) => {
        if (res.data && res.data.success) {
          setPageData(res.data.data.data);
        } else {
          setPageDataError(res.data.message || "Failed to fetch page data");
        }
      })
      .catch((err) => {
        setPageDataError(
          err.response?.data?.message || "Failed to fetch page data"
        );
      })
      .finally(() => setPageDataLoading(false));
  }, [token]);

  // Add useEffect for fetching total staked data
  useEffect(() => {
    setTotalStakedLoading(true);
    setTotalStakedError("");
    axios
      .get("/cryptobox/total-staked", {
        headers: { apikey: import.meta.env.VITE_API_KEY },
      })
      .then((res) => {
        if (res.data && res.data.success) {
          setTotalStakedData(res.data.data);
        } else {
          setTotalStakedError(
            res.data.message || "Failed to fetch total staked data"
          );
        }
      })
      .catch((err) => {
        setTotalStakedError(
          err.response?.data?.message || "Failed to fetch total staked data"
        );
      })
      .finally(() => setTotalStakedLoading(false));
  }, [token]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get(`/bfm/chart?type=${activeTab}`, {
        headers: { apikey: import.meta.env.VITE_API_KEY },
      })
      .then((res) => {
        if (
          isMounted &&
          res.data &&
          res.data.success &&
          Array.isArray(res.data.data)
        ) {
          // Map API data to chart format
          const mapped = res.data.data.map((item, idx) => ({
            name: item._id?.day ? `${item._id.day}/${item._id.month}` : idx + 1,
            value: item.averagePrice,
          }));
          setChartData(mapped);
        }
      })
      .catch(() => {
        if (isMounted) setChartData([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Redirect to /signin if not logged in

  // Handle BFM amount input change
  const handleStakeAmountChange = async (e) => {
    const value = e.target.value;
    setStakeAmount(value);
    setStakeInfo(null);
    setStakeError("");
    setStakeSuccess("");
    if (!value || isNaN(value) || Number(value) <= 0) return;
    setStakeLoading(true);
    setStakeInfoType("initial");
    try {
      const res = await axios.post(
        "/cryptobox/initial-values",
        { tokens: Number(value) },
        { headers: { apikey: import.meta.env.VITE_API_KEY }, }
      );
      if (res.data && res.data.success) {
        setStakeInfo(res.data.data);
      } else {
        setStakeError(res.data.message || "Failed to fetch initial values");
      }
    } catch (err) {
      setStakeError(
        err.response?.data?.message || "Failed to fetch initial values"
      );
    } finally {
      setStakeLoading(false);
    }
  };

  // Handle Max button click
  const handleMaxClick = async () => {
    setStakeLoading(true);
    setStakeInfoType("max");
    setStakeError("");
    setStakeSuccess("");
    setStakeInfo(null);
    try {
      const res = await axios.post(
        "/cryptobox/max-values",
        {},
        { headers: { token } }
      );
      if (res.data && res.data.success) {
        setStakeInfo(res.data.data);
        setStakeAmount(
          res.data.data.totalDeposit !== undefined &&
            res.data.data.totalDeposit !== null
            ? String(res.data.data.totalDeposit)
            : ""
        );
      } else {
        setStakeError(res.data.message || "Failed to fetch max values");
      }
    } catch (err) {
      setStakeError(
        err.response?.data?.message || "Failed to fetch max values"
      );
    } finally {
      setStakeLoading(false);
    }
  };

  // Handle Stake Now
  const handleStakeNow = () => {
    setPendingStakeAmount(stakeAmount);
    setShowConfirmModal(true);
    setModalState("confirm");
    setStakeError("");
    setStakeSuccess("");
  };

  // Confirm stake action
  const confirmStakeAction = async () => {
    setStakeLoading(true);
    setStakeError("");
    setStakeSuccess("");
    try {
      const res = await axios.post(
        "/cryptobox/create",
        {
          token_name: "BFM",
          tokens: Number(pendingStakeAmount),
          confirmed: 1,
        },
        { headers: { token } }
      );
      if (
        res.data &&
        (res.data.success === true || res.data.success === "success")
      ) {
        setStakeSuccess(res.data.message || "Crypto Box created successfully");
        setStakeAmount("");
        setStakeInfo(null);
      } else {
        setStakeError(res.data.message || "Failed to create Crypto Box");
      }
    } catch (err) {
      setStakeError(
        err.response?.data?.message || "Failed to create Crypto Box"
      );
    } finally {
      setStakeLoading(false);
      setModalState("result");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#010510] font-['Octa Brain','Avalont-Regular','sans-serif'] flex flex-col">
      <Navigation />
      {/* Hero Section */}
      <div className="relative w-full pt-6 md:pt-10 pb-4 md:pb-8 px-2 md:px-0 flex flex-col items-center bg-gradient-to-b from-[#0B101B] to-[#181F2F] overflow-hidden">
        {/* Starry BG effect (optional) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ background: 'url("/assets/images/crypto-bg.png")' }}
        />
        <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <div className="flex-shrink-0 order-1 md:order-2">
            <img
              src="/assets/images/bfm-light.png"
              alt="BMF Logo"
              className="w-32 h-32 md:w-48 md:h-48 object-contain"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2 md:gap-6 order-2 md:order-1">
            <div className=" flex items-center gap-1 font-body1 md:gap-2 text-[#82DDB5] text-xs md:text-sm font-medium">
              <span className=" inline-block font-body1 w-4 h-4 bg-[url('/assets/images/crypto-investments.png')] bg-contain bg-no-repeat" />
              crypto investment
            </div>
            <h1 className="text-lg md:text-5xl font-bold text-white tracking-wide font-header md:leading-[60px] leading-[30px]">
              GET REWARD FOR STAKING <br className="hidden md:block" />
              ASSETS ON <span className="text-[#82DDB5] font-header">BMF</span>
            </h1>
          </div>
        </div>

        {/* Cards Row */}
      </div>
      <div className="w-full max-w-7xl mx-auto mt-6 md:mt-8 px-2 md:px-4">
        <div
          style={{ background: "rgba(130, 221, 181, 0.05)" }}
          className="border border-[#232A3E] rounded-2xl p-4 md:p-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
            <h3 className="text-[#82DDB5] text-[20px] md:text-3xl font-bold font-header mb-2 md:mb-0">
              CRYPTO BOX POOL STATUS
            </h3>
            <div className="text-right">
              <div className="text-white text-xl md:text-xl font-bold font-body1">
                {totalStakedLoading
                  ? "Loading..."
                  : totalStakedData
                  ? `${formatNumber(
                      totalStakedData.totalStaked
                    )} / ${formatNumber(totalStakedData.totalAmount)}`
                  : "0 / 0"}
              </div>
              <div className="text-[#A3AED0] text-xs md:text-sm font-body1">
                BFM Tokens Locked
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="w-full bg-[#232A3E] rounded-full h-3 md:h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0AC488] to-[#33A0EA] rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: totalStakedData
                    ? `${parseFloat(totalStakedData.percentage)}%`
                    : "0%",
                }}
              >
                <div className="h-full bg-gradient-to-r from-[#82DDB5]/30 to-transparent animate-pulse"></div>
              </div>
            </div>

            <div className="flex justify-between text-xs md:text-sm ">
              <span className="text-[#A3AED0] font-body1">
                Pool:{" "}
                {totalStakedData
                  ? `${parseFloat(totalStakedData.percentage)}%`
                  : "0%"}{" "}
                Filled
              </span>
              <span className="text-[#82DDB5] font-semibold font-body1">
                {totalStakedLoading
                  ? "Loading..."
                  : totalStakedData
                  ? `${formatNumber(
                      totalStakedData.remainingAmount
                    )} BFM Remaining`
                  : "0 BFM Remaining"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline and Profits Section - Moved here */}

      <div className="w-full flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-0 md:gap-4 mt-4 md:mt-10">
        {[
          {
            value: "~ 83 %",
            label: "APY",
            borderImage: 'url("/assets/images/border1.png")',
            width: "332px",
            height: "127px",
          },
          {
            value: "10 BFM",
            label: "MIN STAKE AMOUNT",
            borderImage: 'url("/assets/images/border3.png")',
            width: "338px",
            height: "127px",
          },
          {
            value: "10000 BFM",
            label: "MAX STAKE AMOUNT",
            borderImage: 'url("/assets/images/border4.png")',
            width: "332px",
            height: "127px",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="w-full max-w-[95vw] md:max-w-none mb-4 md:mb-0 md:mx-2"
            style={
              isDesktop
                ? {
                    backgroundImage: card.borderImage,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    width: card.width,
                    height: card.height,
                    padding: 0,
                  }
                : {}
            }
          >
            <div className="rounded-3xl p-[2px] md:bg-none bg-gradient-to-r from-[#033B15] via-[#777777] to-[#033B15] md:bg-none h-full">
              <div className="bg-gradient-to-b from-[#010510] to-[#001016] md:bg-none rounded-3xl flex flex-col items-center justify-center py-6 px-2 h-full">
                <span className="text-white text-3xl md:text-4xl font-body1 mb-2">
                  {card.value}
                </span>
                <hr className="w-4/5 border-t border-[#1EFFA3] my-2 opacity-20" />
                <span className="text-[#fff] text-xl md:text-[18px] font-body1 mt-2">
                  {card.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Price History Chart Section */}
      <div className="w-full max-w-7xl mx-auto mt-6 md:mt-12 px-2 md:px-4">
        <h2 className="text-[#82DDB5] text-[24px] md:text-3xl font-bold mb-2 md:mb-4 tracking-widest font-header">
          PRICE HISTORY
        </h2>
        <div className="md:p-10 shadow-xl relative min-h-[220px] md:min-h-[320px] flex flex-col">
          {/* Chart Tabs */}
          <div className="flex gap-1 md:gap-2 absolute top-2 md:top-[-50px] right-2 md:right-[30px] z-10">
            {chartTabs.map((tab) => (
              <button
                key={tab.label}
                className={`px-2 md:px-3 py-0.5 md:py-1 rounded bg-[#181F2F] text-[#fff] text-sm font-body1 border border-[#232A3E] hover:bg-[#1A6AFF] hover:text-white transition ${
                  activeTab === tab.type
                    ? "border-[#1A6AFF] text-[#1A6AFF] font-bold"
                    : ""
                }`}
                onClick={() => setActiveTab(tab.type)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Chart */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-40 md:h-64 bg-transparent font-body1 rounded-xl border border-[#232A3E] flex items-center justify-center">
              {loading ? (
                <span className="text-[#82DDB5] text-sm">Loading...</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#232A3E"
                      strokeDasharray="3 3"
                      vertical={true}
                      horizontal={true}
                    />
                    <YAxis
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#A3AED0", fontSize: 12 }}
                      width={40}
                      domain={["auto", "auto"]}
                      tickCount={10}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      tickCount={20}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "none",
                        color: "#F85842",
                        borderRadius: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#82DDB5"
                      strokeWidth={2}
                      fill="transparent"
                      dot={false}
                      isAnimationActive={true}
                      curve="basis"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto mt-6 md:mt-12 px-2 md:px-4">
        <div
          style={{ background: "rgba(130, 221, 181, 0.05)" }}
          className="border border-[#232A3E] rounded-2xl p-4 md:p-8 shadow-xl"
        >
          <h3 className="text-[#82DDB5] text-[24px] md:text-3xl font-bold mb-4 md:mb-6 font-header">
            CRYPTO BOX TIMELINE & PROFITS
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6">
            {/* Profit Table */}
            <div className="space-y-4">
              <h4 className="text-white text-sm md:text-base font-body1 font-semibold mb-3">
                Monthly Profit Rates
              </h4>
              <div className="overflow-hidden rounded-lg border border-[#232A3E]">
                <div className="grid grid-cols-2 bg-gradient-to-r from-[#0AC488] to-[#33A0EA] text-white text-xs md:text-sm font-semibold">
                  <div className="px-3 py-2 text-center font-body1">Month</div>
                  <div className="px-3 py-2 text-center font-body1">
                    Profit %
                  </div>
                </div>
                {(() => {
                  const currentDate = new Date();
                  const currentMonth = currentDate.getMonth(); // 0-11 (0 = January, 11 = December)

                  const monthsData = [
                    { month: "Aug", monthIndex: 7, profit: "110%" },
                    { month: "Sep", monthIndex: 8, profit: "104%" },
                    { month: "Oct", monthIndex: 9, profit: "97%" },
                    { month: "Nov", monthIndex: 10, profit: "89%" },
                    { month: "Dec", monthIndex: 11, profit: "80%" },
                    { month: "Jan", monthIndex: 0, profit: "70%" },
                    { month: "Feb", monthIndex: 1, profit: "55%" },
                    { month: "Mar", monthIndex: 2, profit: "40%" },
                    { month: "Apr", monthIndex: 3, profit: "20%" },
                  ];

                  return monthsData.map((row, idx) => {
                    const isCurrent = row.monthIndex === currentMonth;

                    // Handle year transition: Jan, Feb, Mar, Apr are next year months
                    // Only consider months as "past" if they are in the current year and before current month
                    const isNextYearMonth = row.monthIndex < 5; // Jan=0, Feb=1, Mar=2, Apr=3 are next year
                    const isPast =
                      !isNextYearMonth && row.monthIndex < currentMonth;

                    return (
                      <div
                        key={idx}
                        className={`grid grid-cols-2 text-xs md:text-sm ${
                          isCurrent
                            ? "bg-gradient-to-r from-[#0AC488]/20 to-[#33A0EA]/20 text-[#82DDB5]"
                            : isPast
                            ? "text-[#6B7280] opacity-60" // Greyish for past months
                            : "text-[#A3AED0]" // Normal for future months
                        } ${
                          idx % 2 === 0 ? "bg-[#0a0f1a]/30" : "bg-[#111624]/30"
                        }`}
                      >
                        <div className="px-3 py-2 text-center font-semibold font-body1">
                          {row.month}
                        </div>
                        <div className="px-3 py-2 text-center font-bold font-body1">
                          {row.profit}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Stake Form */}
            <div
              className="bg-[#111624] rounded-2xl p-4 md:p-8 shadow-xl flex flex-col gap-3 md:gap-6 h-[300px] min-w-[180px] md:min-w-[320px] relative"
              style={{ backgroundColor: "rgba(130, 221, 181, 0.1)" }}
            >
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <span className="text-[#fff] text-xs md:text-sm font-body1">
                  Staked Amount
                </span>
                <span className="text-[#fff] text-xs md:text-sm font-body1">
                  Available to stake
                </span>
              </div>
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <span className="text-white  text-xl md:text-2xl font-body1">
                  {pageData?.staked_amount} BFM
                </span>
                <span className="text-white  text-xl md:text-2xl font-body1">
                  {pageData?.available_to_stake.toFixed(2)} BFM
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                {/* Dropdown with sun icon and arrow */}
                <div className="relative ">
                  <select
                    className="appearance-none rounded-full pl-10 pr-6 py-2 w-16 h-10 focus:outline-none text-[#82DDB5] font-bold text-base shadow-sm"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    value="BFM"
                    onClick={(e) => {
                      if (!token) {
                        e.preventDefault();
                        navigate("/signin");
                      }
                    }}
                  >
                    <option className="bg-[#111624]">Select Option</option>
                    <option className="bg-[#111624]" value="BFM">
                      BFM
                    </option>
                  </select>
                  {/* Sun icon absolute left */}
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center pointer-events-none">
                    <img src="/assets/images/bfm-logo.png" alt="" />
                  </span>
                  {/* Dropdown arrow absolute right */}
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M7 10l5 5 5-5"
                        stroke="#A3AED0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                {/* Input with Max button inside */}
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="BFM Amount"
                    className="w-full h-10 text-white rounded-full pl-4 pr-20 text-[#232A3E] text-base font-semibold focus:outline-none shadow-sm font-body1"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    value={stakeAmount}
                    onChange={handleStakeAmountChange}
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-6 py-1 rounded-full font-body1 bg-gradient-to-r from-[#0AC488] to-[#33A0EA] text-white font-semibold text-base shadow-md"
                    style={{ height: "32px", minWidth: "70px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (token) {
                        handleMaxClick();
                      } else {
                        navigate("/register");
                      }
                    }}
                    disabled={stakeLoading}
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (token) {
                      handleStakeNow();
                    } else {
                      navigate("/register");
                    }
                  }}
                  className="bg-gradient-to-t from-[#0AC488] to-[#33A0EA] text-white px-6 md:px-8 py-1.5 md:py-2 rounded-full font-semibold text-sm md:text-base shadow-md self-start font-body1"
                  disabled={stakeLoading || (!stakeAmount && token)}
                >
                  Stake Now
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#0AC488]/10 to-[#33A0EA]/10 rounded-lg p-3 md:p-4 border border-[#82DDB5]/30">
            <p className="text-[#82DDB5] text-xs md:text-lg font-header font-semibold mb-1">
              Important Note:
            </p>
            <p className="text-white text-xs md:text-sm font-body1">
              Your profit rate is fixed at the time of deposit and won't change
              even if rates drop for new users. Lock early to secure higher
              returns!
            </p>
          </div>
        </div>
      </div>
      {/* Info Card */}
      <div className="w-full max-w-6xl mx-auto mt-6 md:mt-12 px-2 md:px-4">
        <div
          style={{ background: "rgba(255, 255, 255, 0.02)" }}
          className=" border border-[#232A3E] rounded-2xl p-4 md:p-8 shadow-xl text-[#A3AED0] text-xs md:text-sm leading-relaxed"
        >
          <h3 className="text-[#82DDB5] text-[22px] md:text-3xl font-bold mb-2 md:mb-4 font-header leading-[30px] mb-5">
            BFM STAKING: SAFE AND EASY STAKING WITH CRYPTO BOX
          </h3>
          <p className="text-[#fff] font-body1">
            BFM Staking offers a safe, simple, and rewarding way to grow your
            crypto holdings through the Crypto Box platform. Designed for both
            beginners and experienced users, BFM Staking allows you to lock your
            tokens securely and earn passive income with ease. With a
            user-friendly interface, transparent returns, and complete control
            over your assets, staking BFM through Crypto Box is one of the most
            efficient ways to maximize your crypto potential while contributing
            to the BenefitMine ecosystem.
          </p>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-[-15px]">
        <Footer />
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181F2F] rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center border border-[#33A0EA]">
            {modalState === "confirm" && (
              <>
                <div className="text-lg font-heading2 text-white mb-4">
                  Confirm Staking
                </div>
                <div className="text-base text-[#A3AED0] mb-6">
                  Are you sure you want to stake{" "}
                  <span className="text-[#82DDB5] font-bold">
                    {pendingStakeAmount} BFM
                  </span>
                  ?
                </div>
                <div className="flex gap-4 w-full justify-center">
                  <button
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#0AC488] to-[#33A0EA] text-white font-semibold"
                    onClick={confirmStakeAction}
                    disabled={stakeLoading}
                  >
                    {stakeLoading ? "Processing..." : "Sure"}
                  </button>
                  <button
                    className="px-6 py-2 rounded-full bg-[#232b36] text-white font-semibold border border-[#A3AED0]"
                    onClick={() => setShowConfirmModal(false)}
                    disabled={stakeLoading}
                  >
                    No
                  </button>
                </div>
              </>
            )}
            {modalState === "result" && (
              <>
                {stakeSuccess && (
                  <div className="text-green-500 text-center text-base font-semibold mb-4">
                    {stakeSuccess}
                  </div>
                )}
                {stakeError && (
                  <div className="text-red-500 text-center text-base font-semibold mb-4">
                    {stakeError}
                  </div>
                )}
                <button
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#0AC488] to-[#33A0EA] text-white font-semibold"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
