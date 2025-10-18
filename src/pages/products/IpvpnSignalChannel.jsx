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

const chartData = [
  { date: "18 Mar", value: 300 },
  { date: "19 Mar", value: 500 },
  { date: "20 Mar", value: 250 },
  { date: "21 Mar", value: 400 },
  { date: "22 Mar", value: 600 },
  { date: "23 Mar", value: 800 },
  { date: "24 Mar", value: 900 },
  { date: "25 Mar", value: 700 },
  { date: "26 Mar", value: 350 },
  { date: "27 Mar", value: 800 },
];

const tabs = ["BTC/ETH", "Futures", "Spot", "Daily Signals"];

export default function IpvpnSignalChannel() {
  const [activeTab, setActiveTab] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalState, setModalState] = useState("confirm"); // 'confirm' | 'result'
  const [actionType, setActionType] = useState("purchase"); // 'purchase' | 'upgrade'
  const [pendingPurchase, setPendingPurchase] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
  const [selectedSubPackage, setSelectedSubPackage] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [ipvpn, setIpvpn] = useState(null);
  const [loadingIpvpn, setLoadingIpvpn] = useState(true);
  const [errorIpvpn, setErrorIpvpn] = useState(null);
  const [userActiveServices, setUserActiveServices] = useState([]);
  const [loadingUserServices, setLoadingUserServices] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const balance = 350;
  // Add per-card device and price state
  const [deviceSelections, setDeviceSelections] = useState({}); // { [subId]: subSubId }
  const [priceSelections, setPriceSelections] = useState({}); // { [subId]: price }
  const navigate = useNavigate();

  // VPN Maintenance mode - disabled
  const [isVpnMaintenanceMode] = useState(false);

  // Check if user has active IPVPN service
  const hasActiveIpvpnService = () => {
    if (loadingUserServices) return false; // Don't show upgrade button while loading
    return userActiveServices.some(
      (service) =>
        service.productName === "IPVPN" && service.status === "active"
    );
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

  // Fetch IPVPN service on mount
  useEffect(() => {
    if (!isVpnMaintenanceMode) {
      setLoadingIpvpn(true);
      setErrorIpvpn(null);
      axios
        .get("/services/list", {
          headers: { apikey: import.meta.env.VITE_API_KEY },
        })
        .then((res) => {
          if (res.data && res.data.success && Array.isArray(res.data.data)) {
            const found = res.data.data.find((s) => s.name === "IPVPN");
            setIpvpn(found);
          } else {
            setErrorIpvpn("Failed to load IPVPN service");
          }
        })
        .catch(() => setErrorIpvpn("Failed to load IPVPN service"))
        .finally(() => setLoadingIpvpn(false));
    }
  }, [token, isVpnMaintenanceMode]);

  // Fetch user active services when user is available
  useEffect(() => {
    if (token && user?.username) {
      fetchUserActiveServices();
    }
  }, [token, user?.username]);

  // Handler for device select change (per card)
  const handleDeviceChange = (sub, subSubId) => {
    setDeviceSelections((prev) => ({ ...prev, [sub.subId]: subSubId }));
    const found = sub.pricing.find((p) => p.subSubId === Number(subSubId));
    setPriceSelections((prev) => ({
      ...prev,
      [sub.subId]: found ? found.price : null,
    }));
  };

  // Handler for Join Now (for subPackage)
  const handleJoinNowSub = (sub) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    // Use per-card selection or default to first
    const selectedSubSubId =
      deviceSelections[sub.subId] || (sub.pricing && sub.pricing[0]?.subSubId);
    const found = sub.pricing.find(
      (p) => p.subSubId === Number(selectedSubSubId)
    );
    setSelectedSubPackage(sub);
    setSelectedDevice(selectedSubSubId);
    setSelectedPrice(found ? found.price : null);
    setPendingPurchase({
      subPackage: sub,
      device: selectedSubSubId,
      price: found ? found.price : null,
    });
    setShowConfirmModal(true);
    setModalState("confirm");
    setActionType("purchase");
    setPurchaseError("");
    setPurchaseSuccess("");
  };

  // Handler for Upgrade (for subPackage)
  const handleUpgradeSub = (sub) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    const selectedSubSubId =
      deviceSelections[sub.subId] || (sub.pricing && sub.pricing[0]?.subSubId);
    const found = sub.pricing.find(
      (p) => p.subSubId === Number(selectedSubSubId)
    );
    setSelectedSubPackage(sub);
    setSelectedDevice(selectedSubSubId);
    setSelectedPrice(found ? found.price : null);
    setPendingPurchase({
      subPackage: sub,
      device: selectedSubSubId,
      price: found ? found.price : null,
    });
    setShowConfirmModal(true);
    setModalState("confirm");
    setActionType("upgrade");
    setPurchaseError("");
    setPurchaseSuccess("");
  };

  // Confirm purchase action
  const confirmPurchaseAction = async () => {
    setPurchaseLoading(true);
    setPurchaseError("");
    setPurchaseSuccess("");
    try {
      const endpoint =
        actionType === "upgrade" ? "/services/upgrade" : "/services/purchase";
      const res = await axios.post(
        endpoint,
        {
          service: "IPVPN",
          subId: selectedSubPackage.subId,
          subSubId: Number(selectedDevice),
        },
        { headers: { token } }
      );
      if (res.data && res.data.success) {
        setPurchaseSuccess(
          actionType === "upgrade" ? "Upgraded successfully" : "You're in"
        );
        // Refresh user's active services so Upgrade button shows right away after purchase
        await fetchUserActiveServices();
      } else {
        setPurchaseError(
          res.data.message ||
            (actionType === "upgrade" ? "Upgrade failed." : "Purchase failed.")
        );
      }
    } catch (err) {
      setPurchaseError(
        err.response?.data?.message ||
          (actionType === "upgrade" ? "Upgrade failed." : "Purchase failed.")
      );
    } finally {
      setPurchaseLoading(false);
      setModalState("result");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#010510] font-['Octa Brain','Avalont-Regular','sans-serif'] flex flex-col">
      <Navigation />
      {/* Hero Banner */}
      <div
        className="w-full relative flex flex-col items-center justify-center py-6 md:py-12 px-2 md:px-4"
        style={{
          background: "url(./vpn.webp) center/cover no-repeat",
          minHeight: "140px",
        }}
      >
        <div className="absolute inset-0  z-0" />
      </div>
      {/* Main Section */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-4 mt-4 md:mt-10 flex flex-col gap-4 md:gap-8">
        {/* Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <h2 className="text-lg md:text-5xl font-header text-white tracking-widest">
            IP VPN
          </h2>
        </div>
        {/* Subscription Options */}
        <div className="mt-8 md:mt-16">
          <h2 className="text-[#A0E0C4] text-2xl md:text-5xl font-header mb-4 md:mb-8 tracking-widest text-center">
            SUBSCRIPTION OPTIONS
          </h2>

          <>
            {/* Mobile Subscription Boxes */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {ipvpn &&
                ipvpn.subPackages &&
                ipvpn.subPackages.map((sub, idx) => {
                  let cardImg = "/assets/images/1month.png";
                  if (idx === 1) cardImg = "/assets/images/3month.png";
                  if (idx === 2) cardImg = "/assets/images/6month.png";
                  if (idx === 3) cardImg = "/assets/images/1year.png";
                  // Default to first pricing
                  const firstPricing = sub.pricing && sub.pricing[0];
                  const selectedSubSubId =
                    deviceSelections[sub.subId] || firstPricing?.subSubId;
                  const selectedPrice =
                    priceSelections[sub.subId] !== undefined
                      ? priceSelections[sub.subId]
                      : firstPricing?.price;
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
                          <span className="text-white font-body1 text-lg">
                            {sub.name}
                          </span>
                        </div>
                        <div className="w-full h-px bg-white/20 my-2" />
                        <div className="w-full flex flex-col items-start mb-4 mt-2">
                          <span className="text-[#fff] text-xl font-body1">
                            {" "}
                            <span className="text-[#82DDB5] text-3xl font-body1">
                              ${selectedPrice}
                            </span>{" "}
                            <span className="text-[#A3AED0] text-xs font-body1">
                              / {sub.name}
                            </span>
                          </span>
                        </div>
                        <span className="text-[#fff] text-xs text-center font-body1 mt-2 mb-4">
                          {ipvpn.description}
                        </span>
                        <select
                          className="w-full bg-transparent border border-[#232A3E] text-white rounded-lg px-4 py-2 font-body1 outline-none focus:ring-2 focus:ring-[#33A0EA] focus:border-[#33A0EA] transition mb-2"
                          value={selectedSubSubId}
                          onChange={(e) =>
                            handleDeviceChange(sub, e.target.value)
                          }
                        >
                          {sub.pricing.map((p) => (
                            <option
                              className="bg-[#03131d]"
                              key={p.subSubId}
                              value={p.subSubId}
                            >
                              {p.Devices} Device{p.Devices > 1 ? "s" : ""} - $
                              {p.price}
                            </option>
                          ))}
                        </select>
                        {hasActiveIpvpnService() ? (
                          <button
                            className="px-4 md:px-8 py-2.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-xs md:text-base shadow-md mt-auto font-body1"
                            onClick={() => handleUpgradeSub(sub)}
                          >
                            Upgrade
                          </button>
                        ) : (
                          <button
                            className="px-4 md:px-8 py-2.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-xs md:text-base shadow-md mt-auto font-body1"
                            onClick={() => handleJoinNowSub(sub)}
                          >
                            Subscribe
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* Desktop Subscription Boxes */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {ipvpn &&
                ipvpn.subPackages &&
                ipvpn.subPackages.map((sub, idx) => {
                  let cardImg = "/assets/images/1month.png";
                  if (idx === 1) cardImg = "/assets/images/3month.png";
                  if (idx === 2) cardImg = "/assets/images/6month.png";
                  if (idx === 3) cardImg = "/assets/images/1year.png";
                  const firstPricing = sub.pricing && sub.pricing[0];
                  const selectedSubSubId =
                    deviceSelections[sub.subId] || firstPricing?.subSubId;
                  const selectedPrice =
                    priceSelections[sub.subId] !== undefined
                      ? priceSelections[sub.subId]
                      : firstPricing?.price;
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
                          ${selectedPrice}
                        </span>{" "}
                        <span className="text-[#A3AED0] font-body1 text-sm">
                          / {sub.name}
                        </span>
                      </span>
                      <span className="text-[#fff] text-sm font-body1 text-center mb-2 md:mb-4">
                        {ipvpn.description}
                      </span>
                      <select
                        className="w-full md:w-full bg-transparent border border-[#232A3E] text-white rounded-lg px-4 py-2 font-body1 outline-none focus:ring-2 focus:ring-[#33A0EA] focus:border-[#33A0EA] transition mb-2"
                        value={selectedSubSubId}
                        onChange={(e) =>
                          handleDeviceChange(sub, e.target.value)
                        }
                      >
                        {sub.pricing.map((p) => (
                          <option
                            className="bg-[#03131d]"
                            key={p.subSubId}
                            value={p.subSubId}
                          >
                            {p.Devices} Device{p.Devices > 1 ? "s" : ""} - $
                            {p.price}
                          </option>
                        ))}
                      </select>
                      {hasActiveIpvpnService() ? (
                        <button
                          className="px-4 md:px-8 py-1.5 md:py-2 rounded-full font-body1 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-xs md:text-base shadow-md mt-auto"
                          onClick={() => handleUpgradeSub(sub)}
                        >
                          Upgrade
                        </button>
                      ) : (
                        <button
                          className="px-4 md:px-8 py-1.5 md:py-2 rounded-full font-body1 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-xs md:text-base shadow-md mt-auto"
                          onClick={() => handleJoinNowSub(sub)}
                        >
                          Subscribe
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181F2F] rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center border border-[#33A0EA]">
            {modalState === "confirm" && (
              <>
                <div className="text-lg font-heading2 text-white mb-4">
                  {actionType === "upgrade"
                    ? "Confirm VPN Upgrade"
                    : "Confirm VPN Purchase"}
                </div>
                <div className="text-base text-[#A3AED0] mb-6">
                  {actionType === "upgrade"
                    ? "Are you sure you want to upgrade to "
                    : "Are you sure you want to purchase "}
                  <span className="text-[#82DDB5] font-bold">
                    {selectedSubPackage?.name} - ${selectedPrice}
                  </span>
                  ?
                </div>
                <div className="flex gap-4 w-full justify-center">
                  <button
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#0AC488] to-[#33A0EA] text-white font-semibold"
                    onClick={confirmPurchaseAction}
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
      {/* Footer */}
      <div className="">
        <Footer />
      </div>
    </div>
  );
}
