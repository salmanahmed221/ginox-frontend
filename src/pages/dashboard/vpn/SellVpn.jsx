import React, { useState, useEffect, useMemo } from "react";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import { useSelector } from "react-redux";
import axios from "../../../api/axiosConfig";
import { SparklesCore } from "../../../components/ui/sparkles";
import { motion } from "framer-motion";

const SellVpn = () => {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    customerEmail: "",
    customerName: "",
    selectedPackage: "",
    selectedDevices: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [services, setServices] = useState([]);
  const [ipvpnService, setIpvpnService] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);

  // VPN Maintenance mode - set to false to enable VPN selling
  const [isVpnMaintenanceMode] = useState(false);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/services/list", {
          headers: {
            apikey: import.meta.env.VITE_API_KEY,
          },
        });

        if (response.data.success) {
          setServices(response.data.data);
          // Find IPVPN service
          const ipvpn = response.data.data.find(
            (service) => service.name === "IPVPN"
          );
          setIpvpnService(ipvpn);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setAlert({
          show: true,
          type: "error",
          message: "Failed to load VPN services. Please try again.",
        });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.customerEmail ||
      !formData.selectedPackage ||
      !formData.selectedDevices
    ) {
      setAlert({
        show: true,
        type: "error",
        message: "Please fill in all required fields.",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a valid email address.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare payload for services/future-purchase API
      const payload = {
        email: formData.customerEmail,
        subId: parseInt(formData.selectedPackage),
        subSubId: parseInt(formData.selectedDevices),
      };

      console.log("API Payload:", payload);

      const response = await axios.post("/services/future-purchase", payload, {
        headers: { token },
      });

      if (response.data.success) {
        setAlert({
          show: true,
          type: "success",
          message: "VPN sold successfully! Amount deducted from wallet.",
        });
        setFormData({
          customerEmail: "",
          customerName: "",
          selectedPackage: "",
          selectedDevices: "",
        });
        setShowModal(false);
      } else {
        setAlert({
          show: true,
          type: "error",
          message: response.data.message || "Failed to sell VPN.",
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error("API Error:", error);
      setAlert({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred while selling VPN.",
      });
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  // Get selected package details
  const getSelectedPackage = () => {
    if (!ipvpnService || !formData.selectedPackage) return null;
    return ipvpnService.subPackages.find(
      (pkg) => pkg.subId.toString() === formData.selectedPackage
    );
  };

  // Get selected device pricing
  const getSelectedDevicePricing = () => {
    const selectedPackage = getSelectedPackage();
    if (!selectedPackage || !formData.selectedDevices) return null;
    return selectedPackage.pricing.find(
      (price) => price.subSubId.toString() === formData.selectedDevices
    );
  };

  const selectedPackage = getSelectedPackage();
  const selectedDevicePricing = getSelectedDevicePricing();

  // Memoize the background to prevent re-rendering when form data changes
  const backgroundElements = useMemo(
    () => (
      <>
        <div
          className="w-[1200px] h-screen blur-3xl opacity-30 rounded-full absolute top-12"
          style={{
            background:
              "linear-gradient(180deg, #0E7BF8 0%, rgba(14, 123, 248, 0) 86.35%)",
          }}
        />
        <div
          className="w-[1200px] h-screen blur-3xl opacity-20 rotate-180 rounded-full absolute"
          style={{
            background:
              "linear-gradient(180deg, #0E7BF8 0%, rgba(14, 123, 248, 0) 86.35%)",
          }}
        />
        <div className="w-full absolute h-full">
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
      </>
    ),
    []
  ); // Empty dependency array ensures this only renders once

  return (
    <div className="h-full flex flex-col items-center justify-center w-full z-50 relative">
      {/* {backgroundElements} */}

              <div
                className="w-full rounded-2xl p-4 md:p-3 flex flex-col gap-4 shadow-xl border h-full border-[#22304a] relative"
                style={{
                  background:
                    "linear-gradient(180deg, #05172C 0%, #000000 100%)",
                }}
              >
                {/* VPN Maintenance Mode Overlay */}
                {isVpnMaintenanceMode && (
                  <div className="absolute inset-0 z-[50] flex items-start justify-center pt-4 bg-[#06101A]/90 backdrop-blur-[4px] transition-all duration-300 rounded-2xl">
                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto p-">
                      {/* Maintenance Icon */}
                      <div className="mb-[-20]">
                        <svg
                          width="80"
                          height="80"
                          viewBox="0 0 100 100"
                          className="text-[#33A0EA]"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="5,5"
                            className="animate-spin"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="30"
                            stroke="url(#gradientStroke2)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <defs>
                            <linearGradient
                              id="gradientStroke2"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#33A0EA" />
                              <stop offset="100%" stopColor="#0AC488" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      {/* Maintenance Text */}
                      <h2 className="text-2xl sm:text-3xl text-white font-heading tracking-widest mb-4">
                        UNDER MAINTENANCE
                      </h2>

                      <p className="text-base sm:text-lg text-[#b0b8c1] font-heading2 tracking-wide text-center leading-relaxed mb-6">
                        VPN services are currently undergoing maintenance.
                        <br className="hidden sm:block" />
                        Please check back later.
                      </p>

                      {/* Animated dots */}
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 bg-[#33A0EA] rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#33A0EA] rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#33A0EA] rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`${
                    isVpnMaintenanceMode ? "blur-sm pointer-events-none" : ""
                  }`}
                >
                  <div className="text-center ">
                    {/* <h1 className="text-2xl sm:text-3xl font-bold font-header text-white mb-2">
                      Sell VPN licenses to customers
                    </h1> */}
                  </div>

                  {/* Alert */}
                  {alert.show && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-6 p-4 rounded-lg ${
                        alert.type === "success"
                          ? "bg-green-500/20 border border-green-500/30 text-green-300 font-body1" 
                          : "bg-red-500/20 border border-red-500/30 text-red-300 font-body1"
                      }`}
                    >
                      <div className="flex justify-between items-center font-body1">
                        <span>{alert.message}</span>
                        <button
                          onClick={closeAlert}
                          className="text-white font-body1 hover:text-gray-300"
                        >
                          ×
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {loadingServices ? (
                    <div className="text-center py-8">
                      <div className="text-white font-body1">Loading VPN services...</div>
                    </div>
                  ) : (
                    <form
                      className="space-y-6"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2 font-body1">
                            Customer Email *
                          </label>
                          <input
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-1 font-body1 placeholder:text-xs bg-[#0A1428] border border-[#2A4A7A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-[#3A5A8A]"
                            placeholder="Enter customer email"
                            required
                          />
                        </div>
                      </div>

                      {ipvpnService && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-white text-sm font-medium mb-2 font-body1">
                                Package Duration *
                              </label>
                              <select
                                name="selectedPackage"
                                value={formData.selectedPackage}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 text-xs font-body1 bg-[#0A1428] border border-[#2A4A7A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-[#3A5A8A]"
                                required
                              >
                                <option value="">
                                  Select Package Duration
                                </option>
                                {ipvpnService.subPackages.map((pkg) => (
                                  <option key={pkg.subId} value={pkg.subId}>
                                    {pkg.name}
                                    {/* - {pkg.expiresIn} ($
                                    {pkg.pricing[0].price}) */}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {formData.selectedPackage && selectedPackage && (
                              <div>
                                <label className="block text-white  text-sm font-medium mb-2 font-body1">
                                  Number of Devices *
                                </label>
                                <select
                                  name="selectedDevices"
                                  value={formData.selectedDevices}
                                  onChange={handleInputChange}
                                  className="w-full px-4  py-2 text-xs  font-body1 bg-[#0A1428] border border-[#2A4A7A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-[#3A5A8A]"
                                  required
                                >
                                  <option value="">
                                    Select Number of Devices
                                  </option>
                                  {selectedPackage.pricing.map((price) => (
                                    <option
                                      key={price.subSubId}
                                      value={price.subSubId}
                                    >
                                      {price.Devices} Device
                                      {price.Devices > 1 ? "s" : ""} - $
                                      {price.price}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                          {selectedDevicePricing && (
                            <>
                              {console.log("Final Selection:", {
                                packageId: formData.selectedPackage,
                                packageName: selectedPackage.name,
                                deviceId: formData.selectedDevices,
                                devices: selectedDevicePricing.Devices,
                                price: selectedDevicePricing.price,
                              })}
                              <div className="bg-gradient-to-r from-[#0A1428] to-[#1A2A48] p-2 rounded-xl border border-[#2A4A7A] shadow-lg">
                                <h3 className="text-white font-body1 font-bold mb-2 text-sm">
                                  Selected Plan Details:
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center py-1 border-b border-[#2A4A7A]">
                                    <span className="text-gray-300 font-body1 text-xs">
                                      Package:
                                    </span>
                                    <span className="text-white font-medium font-body1 text-xs">
                                      {selectedPackage.name} (
                                      {selectedPackage.expiresIn})
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center py-1 border-b border-[#2A4A7A]">
                                    <span className="text-gray-300 font-body1 text-xs">
                                      Devices:
                                    </span>
                                    <span className="text-white font-medium font-body1 text-xs">
                                      {selectedDevicePricing.Devices}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center py-1">
                                    <span className="text-gray-300 font-body1 text-xs">
                                      Total Price:
                                    </span>
                                    <span className="text-green-400 font-bold text-xs font-body1">
                                      ${selectedDevicePricing.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      <div className="text-center ">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowModal(true);
                          }}
                          disabled={loading || !selectedDevicePricing}
                          className="bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab font-body1 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Processing..." : "Purchase VPN"}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

    

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#06101A] backdrop-blur-lg rounded-[20px] p-8 max-w-md w-full mx-4 border border-[#FFFFFF33]"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm VPN Sale
            </h3>
            <p className="text-text_secondary mb-6">
              Are you sure you want to sell VPN to {formData.customerEmail}? The
              amount will be deducted from your wallet.
            </p>
            {selectedDevicePricing && (
              <div className="bg-[#FFFFFF0A] p-3 rounded-lg mb-4">
                <p className="text-white text-sm">
                  <strong>Plan:</strong> {selectedPackage.name} (
                  {selectedPackage.expiresIn})
                </p>
                <p className="text-white text-sm">
                  <strong>Devices:</strong> {selectedDevicePricing.Devices}
                </p>
                <p className="text-white text-sm font-semibold">
                  <strong>Price:</strong> ${selectedDevicePricing.price}
                </p>
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-full hover:opacity-90 transition-opacity"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SellVpn;
