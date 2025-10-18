import React, { useState, useEffect } from "react";
import ProductNavbar from "../../components/ProductNavbar";
import ProductFooter from "../../components/ProductFooter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaStar } from "react-icons/fa";
import Navigation from "../../components/navigation";
import Footer from "../../components/footers";
import axios from "../../api/axiosConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SignalChannel() {
  const [activeTab, setActiveTab] = useState(0);
  const [showSubPackageModal, setShowSubPackageModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalState, setModalState] = useState("confirm");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [resultSuccess, setResultSuccess] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSubPackage, setSelectedSubPackage] = useState(null);
  const [selectedSubSubId, setSelectedSubSubId] = useState(null);
  const [userActiveServices, setUserActiveServices] = useState([]);
  const [loadingUserServices, setLoadingUserServices] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const balance = 350;
  const navigate = useNavigate();
  // Fetch services on mount
  useEffect(() => {
    setLoadingServices(true);
    setErrorServices(null);
    axios
      .get("/services/list", {
        headers: { apikey: import.meta.env.VITE_API_KEY },
      })
      .then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setServices(res.data.data);
        } else {
          setErrorServices("Failed to load services");
        }
      })
      .catch(() => setErrorServices("Failed to load services"))
      .finally(() => setLoadingServices(false));
  }, [token]);

  // Find the Signal Channel service
  const signalChannel = services.find((s) => s.name === "Signal Channel");

  // Handler for Join Now (for subPackage)
  const handleJoinNowSub = (sub) => {
    if (!token) {
      navigate("/signin");
    }
    setSelectedService(signalChannel);
    setSelectedSubPackage(sub);
    setShowSubPackageModal(true);
  };

  // Handler for Buy Now
  const handleBuyNow = async () => {
    setShowSubPackageModal(false);
    setShowLoadingModal(true);
    try {
      let payload = {
        service: selectedService.name,
        subId: selectedSubPackage.subId,
      };
      // If subSubId is selected (for IPVPN), add it
      if (selectedSubSubId) {
        payload.subSubId = selectedSubSubId;
      }
      const res = await axios.post("/services/purchase", payload, {
        headers: { token },
      });
      setShowLoadingModal(false);
      if (res.data && res.data.success) {
        setResultSuccess(true);
        setResultMessage("You're in");
        // Refresh user's active services so Upgrade button shows right away after purchase
        await fetchUserActiveServices();
      } else {
        setResultSuccess(false);
        setResultMessage(res.data.message || "Purchase failed.");
      }
    } catch (err) {
      setShowLoadingModal(false);
      setResultSuccess(false);
      setResultMessage(err.response?.data?.message || "Purchase failed.");
    }
    setShowResultModal(true);
  };

  const hasActiveSignalChannelService = () => {
    if (loadingUserServices) return false; // Don't show upgrade button while loading
    return userActiveServices.some(
      (service) =>
        service.productName === "Signal Channel" && service.status === "active"
    );
  };

  // Handler for Upgrade (for subPackage)
  const handleUpgradeSub = (sub) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    setSelectedService(signalChannel);
    setSelectedSubPackage(sub);
    setShowConfirmModal(true);
    setModalState("confirm");
    setPurchaseError("");
    setPurchaseSuccess("");
  };

  // Confirm upgrade action
  const confirmUpgradeAction = async () => {
    setPurchaseLoading(true);
    setPurchaseError("");
    setPurchaseSuccess("");
    try {
      const res = await axios.post(
        "/services/upgrade",
        {
          service: selectedService?.name || "Signal Channel",
          subId: selectedSubPackage.subId,
          subSubId: null,
        },
        { headers: { token } }
      );
      if (res.data && res.data.success) {
        setPurchaseSuccess("Upgraded successfully");
      } else {
        setPurchaseError(res.data.message || "Upgrade failed.");
      }
    } catch (err) {
      setPurchaseError(err.response?.data?.message || "Upgrade failed.");
    } finally {
      setPurchaseLoading(false);
      setModalState("result");
    }
  };

  // Fetch user active services
  const fetchUserActiveServices = async () => {
    if (!token || !user?.username) {
      setUserActiveServices([]);
      setLoadingUserServices(false);
      return;
    }

    setLoadingUserServices(true);
    try {
      const response = await axios.get(
        `/services/user-active-services?username=${user.username}`,
        {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
          },
        }
      );

      if (response.data && response.data.success) {
        setUserActiveServices(response.data.data || []);
      } else {
        setUserActiveServices([]);
      }
    } catch (error) {
      console.error("Failed to fetch user active services:", error);
      setUserActiveServices([]);
    } finally {
      setLoadingUserServices(false);
    }
  };
  useEffect(() => {
    if (token && user?.username) {
      fetchUserActiveServices();
    }
  }, [token, user?.username]);

  return (
    <div className="min-h-screen w-screen bg-[#010510] font-['Octa Brain','Avalont-Regular','sans-serif'] flex flex-col">
      <Navigation />
      {/* Hero Banner */}
      <div
        className="w-full relative flex flex-col items-center justify-center py-6 md:py-12 px-2 md:px-4"
        style={{
          background: "url(/assets/images/chart-bg.png) center/cover no-repeat",
          minHeight: "140px",
        }}
      >
        <div className="absolute inset-0  z-0" />
        <div className="relative z-10 flex flex-col items-center gap-1 md:gap-2">
          <h1 className="text-xl md:text-5xl font-header text-white tracking-widest text-center">
            BTC/ETH PRO SIGNALS
          </h1>
        </div>
      </div>
      {/* Main Section */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-4 mt-4 md:mt-10 flex flex-col gap-4 md:gap-8">
        {/* Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <h2 className="text-lg md:text-4xl font-header text-white tracking-widest">
            BTC/ETH PRO SIGNALS
          </h2>
          <div className="bg:none md:bg-[#82DDB50D] border-none md:border border-[#232A3E] rounded-2xl px-4 md:px-8 py-2 md:py-4 flex flex-row md:flex-col min-w-[120px] md:min-w-[160px] shadow-xl">
            <span className="text-[#82DDB5] text-xs mb-0 md:mb-1 font-body1">Review</span>
            <hr className="w-full hidden md:block border-t border-[#E0E0E0] my-1 md:my-2 mx-auto" />
            <div className="flex items-center ml-4 md:ml-0 gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className="text-[#FFD600] text-base md:text-lg"
                />
              ))}
              <span className="text-[#A3AED0] font-body1 text-xs md:text-base ml-1 md:ml-2">
                4.5
              </span>
            </div>
          </div>
        </div>
        {/* Tabs */}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-8">
          <div className="bg-[#101624] border border-[#232A3E] rounded-2xl shadow-xl p-3 md:p-6 flex flex-col">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#20E0B2] text-[24px] md:text-[26px] font-body1 tracking-widest">
                WINS
              </span>
              <span className="text-[#20E0B2] text-4xl md:text-[30px] font-body1 mt-1 md:mt-2">
                07
              </span>
            </div>
            <hr className="w-full border-t border-[#FFFFFF1A] my-3 md:my-2 mx-auto" />
            <span className="text-[#fff] font-body1 mt-2 md:mt-4 text-start text-lg md:text-[22px]">
              LAST 10 CALLS
            </span>
          </div>
          <div className="bg-[#101624] border border-[#232A3E] rounded-2xl shadow-xl p-3 md:p-6 flex flex-col">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#FF4B4B] text-[24px] md:text-[26px] font-body1 tracking-widest">
                LOSSES
              </span>
              <span className="text-[#FF4B4B] text-4xl md:text-[30px] font-body1 mt-1 md:mt-2">
                03
              </span>
            </div>
            <hr className="w-full border-t border-[#FFFFFF1A] my-3 md:my-2 mx-auto" />
            <span className="text-[#fff] font-body1 mt-2 md:mt-4 text-start text-lg md:text-[22px]">
              LAST 10 CALLS
            </span>
          </div>
          <div className="bg-[#101624] border border-[#232A3E] rounded-2xl shadow-xl p-3 md:p-6 flex flex-col ">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#3A86FF] text-[24px] md:text-[26px] font-body1 tracking-widest">
                ACCURACY
              </span>
              <span className="text-[#3A86FF] text-4xl md:text-[30px] font-body1 mt-1 md:mt-2">
                70%
              </span>
            </div>
            <hr className="w-full border-t border-[#FFFFFF1A] my-3 md:my-2 mx-auto" />
            <span className="text-[#fff] font-body1 mt-2 md:mt-4 text-start text-lg md:text-[22px]">
              PAST 7 DAYS
            </span>
          </div>
        </div>
        {/* Subscription Options */}
        <div className="mt-8 md:mt-16">
          <h2 className="text-[#A0E0C4] text-2xl md:text-4xl font-header mb-4 md:mb-8 tracking-widest text-center">
            SUBSCRIPTION OPTIONS
          </h2>
          {/* Mobile Subscription Boxes */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {signalChannel &&
              signalChannel.subPackages &&
              signalChannel.subPackages.map((sub, idx) => {
                let cardImg = "/assets/images/1month.png";
                if (idx === 1) cardImg = "/assets/images/3month.png";
                if (idx === 2) cardImg = "/assets/images/6month.png";
                if (idx === 3) cardImg = "/assets/images/1year.png";
                // You can add more images for idx 2, 3 if desired
                return (
                  <div
                    key={sub.subId}
                    className="w-full max-w-[340px] mx-auto border border-[#232A3E] rounded-2xl p-6 flex flex-col gap-2 items-center mb-4 relative overflow-hidden"
                  >
                    <img
                      src={cardImg}
                      alt="subPackage"
                      className="w-[320px] h-[320px] z-0 absolute right-0 top-0"
                    />
                    <div className="w-full flex flex-col gap-2 z-10 relative">
                      <div className="flex w-full items-center justify-between mb-2">
                        <span className="text-white font-body1 text-sm">
                          {sub.name}
                        </span>
                      </div>
                      <div className="w-full h-px bg-white/20 my-2" />
                      <div className="w-full flex flex-col items-start mb-4 mt-2">
                        <span className="text-[#fff] text-xl font-body1">
                          {" "}
                          <span className="text-[#82DDB5] font-bold font-body1 ">
                            ${sub.price}
                          </span>{" "}
                          <span className="text-[#A3AED0] text-xs font-body1">
                            / {sub.name}
                          </span>
                        </span>
                      </div>
                      <span className="text-[#fff] text-xs text-center  mt-2 mb-4 font-body1">
                        {signalChannel.description}
                      </span>
                      {hasActiveSignalChannelService() ? (
                        <button
                          className="px-4 md:px-8 py-2.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] font-body1 text-white font-semibold text-xs md:text-base shadow-md mt-auto"
                          onClick={() => handleUpgradeSub(sub)}
                        >
                          Upgrade
                        </button>
                      ) : (
                        <button
                          className="px-4 md:px-8 py-2.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] font-body1 text-white font-semibold text-xs md:text-base shadow-md mt-auto"
                          onClick={() => handleJoinNowSub(sub)}
                        >
                          Join Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {/* Desktop Subscription Boxes */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {signalChannel &&
              signalChannel.subPackages &&
              signalChannel.subPackages.map((sub, idx) => {
                let cardImg = "/assets/images/1month.png";
                if (idx === 1) cardImg = "/assets/images/3month.png";
                if (idx === 2) cardImg = "/assets/images/6month.png";
                if (idx === 3) cardImg = "/assets/images/1year.png";
                // You can add more images for idx 2, 3 if desired
                return (
                  <div
                    key={sub.subId}
                    className="border border-[#232A3E] rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col gap-2 md:gap-4 relative overflow-hidden"
                  >
                    <div className="grid grid-cols-2">
                      <span className="text-[#fff] text-[8px] md:text-[15px] font-body1 tracking-widest">
                        {sub.name}
                      </span>
                      <img
                        src={cardImg}
                        alt="subPackage"
                        className="w-100 md:w-30 h-100 md:h-30 mb-2 z-0 absolute right-0 top-0"
                      />
                    </div>
                    <hr className="w-full border-t border-[#E0E0E0] my-1 md:my-2 mx-auto" />
                    <span className="text-white text-[22px] font-body1 mb-2">
                      <span className="text-[#82DDB5] font-body1">
                        ${sub.price}
                      </span>{" "}
                      <span className="text-[#A3AED0] font-body1 text-sm">
                        / {sub.name}
                      </span>
                    </span>
                    <span className="text-[#fff] font-body1 text-sm text-center mb-2 md:mb-4">
                      {signalChannel.description}
                    </span>
                    {hasActiveSignalChannelService() ? (
                      <button
                        className="px-4 md:px-8 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-body1 font-semibold text-xs md:text-base shadow-md mt-auto"
                        onClick={() => handleUpgradeSub(sub)}
                      >
                        Upgrade
                      </button>
                    ) : (
                      <button
                        className="px-4 md:px-8 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-body1 font-semibold text-xs md:text-base shadow-md mt-auto"
                        onClick={() => handleJoinNowSub(sub)}
                      >
                        Join Now
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {/* SubPackage Modal */}
      {showSubPackageModal && selectedService && selectedSubPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gradient-to-b from-[#010510] to-[#001016] border border-[#232A3E] rounded-[40px] shadow-2xl p-8 w-full max-w-xl mx-auto flex flex-col items-center relative">
            <button
              className="absolute top-4 right-6 text-white text-2xl"
              onClick={() => setShowSubPackageModal(false)}
            >
              &times;
            </button>
            <h2 className="text-[#0AC389] text-lg font-heading2 mb-6 text-center tracking-widest">
              {selectedService.name}
            </h2>
            <div className="text-white text-base mb-2">
              {selectedService.description}
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-2 border border-[#232A3E] rounded-xl p-4">
                <span className="text-white font-heading2">
                  {selectedSubPackage.name} - ${selectedSubPackage.price}{" "}
                  <span className="text-[#A3AED0] text-xs ml-2">
                    {selectedSubPackage.expiresIn}
                  </span>
                </span>
              </div>
            </div>
            <button
              className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-lg shadow-md"
              onClick={handleBuyNow}
              disabled={!selectedSubPackage}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
      {showConfirmModal && selectedSubPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181F2F] rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center border border-[#33A0EA]">
            {modalState === "confirm" && (
              <>
                <div className="text-lg font-heading2 text-white mb-4">
                  Confirm Upgrade
                </div>
                <div className="text-base text-[#A3AED0] mb-6">
                  Are you sure you want to upgrade to
                  <span className="text-[#82DDB5] font-bold">
                    {" "}
                    {selectedSubPackage?.name} - ${selectedSubPackage?.price}
                  </span>
                  ?
                </div>
                <div className="flex gap-4 w-full justify-center">
                  <button
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#0AC488] to-[#33A0EA] text-white font-semibold"
                    onClick={confirmUpgradeAction}
                    disabled={purchaseLoading}
                  >
                    {purchaseLoading ? "Processing..." : "Sure"}
                  </button>
                  <button
                    className="px-6 py-2 rounded-full bg-[#232b36] text-white font-semibold border border-[#A3AED0]"
                    onClick={() => setShowConfirmModal(false)}
                    disabled={purchaseLoading}
                  >
                    No
                  </button>
                </div>
              </>
            )}
            {modalState === "result" && (
              <>
                {purchaseSuccess && (
                  <div className="text-green-500 text-center text-base font-semibold mb-4">
                    {purchaseSuccess}
                  </div>
                )}
                {purchaseError && (
                  <div className="text-red-500 text-center text-base font-semibold mb-4">
                    {purchaseError}
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
      {showLoadingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gradient-to-b from-[#010510] to-[#001016] border border-[#232A3E] rounded-[40px] shadow-2xl p-12 w-full max-w-xl mx-auto flex flex-col items-center relative">
            <div className="mb-8 flex flex-col items-center">
              <svg
                className="animate-spin mb-6"
                width="60"
                height="60"
                viewBox="0 0 50 50"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="#0AC389"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="31.4 31.4"
                />
              </svg>
              <h2 className="text-[#0AC389] text-2xl font-heading2 text-center tracking-widest">
                ACTIVATING YOUR ACCESS...
              </h2>
            </div>
          </div>
        </div>
      )}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gradient-to-b from-[#010510] to-[#001016] border border-[#232A3E] rounded-[40px] shadow-2xl p-12 w-full max-w-xl mx-auto flex flex-col items-center relative">
            <button
              className="absolute top-4 right-6 text-white text-2xl"
              onClick={() => setShowResultModal(false)}
            >
              &times;
            </button>
            <div className="mb-8 flex flex-col items-center">
              <img src="/assets/images/green-check.png" alt="" />
              <h2 className="text-[#0AC389] text-2xl font-heading2 text-center tracking-widest">
                {resultMessage}
              </h2>
              <p className="font-body text-white text-md mt-5">
                {resultSuccess
                  ? "You have subscribed successfully."
                  : "There was an error with your purchase."}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Footer */}
      <div className="">
        <Footer />
      </div>
    </div>
  );
}
