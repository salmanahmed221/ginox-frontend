import React, { useState, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import { useSelector } from "react-redux";
import axios from "../../../api/axiosConfig";
import { SparklesCore } from "../../../components/ui/sparkles";
import { motion } from "framer-motion";

const CustomersList = () => {
  const { token } = useSelector((state) => state.auth);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // "all", "active", "expired"
  const [historyDetails, setHistoryDetails] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [copied, setCopied] = useState(false);
  const copyFeedbackTimeoutRef = useRef(null);

  // Server selection states
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState("");

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // VPN Maintenance mode - set to true to enable maintenance mode
  const [isVpnMaintenanceMode] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    purchaseDate: "",
    licenseType: "",
    expiryDate: "",
  });

  // Fetch data from future-purchase API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/services/future-purchase", {
        headers: { token },
      });

      if (response.data.success) {
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      } else {
        console.error("Failed to fetch customers:", response.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch servers list API
  const fetchServers = async () => {
    try {
      const response = await axios.get("/services/servers-list", {
        headers: { apikey: import.meta.env.VITE_API_KEY },
      });

      if (response.data.success) {
        setServers(response.data.data || []);
      } else {
        console.error("Failed to fetch servers:", response.data);
        setServers([]);
      }
    } catch (error) {
      console.error("Error fetching servers:", error);
      setServers([]);
    }
  };

  // Show toast message
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide toast after 3 seconds
  };

  useEffect(() => {
    fetchCustomers();
    fetchServers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, filters, viewMode]);

  const filterCustomers = () => {
    let filtered = [...customers];

    // Apply view mode filter
    if (viewMode === "active") {
      filtered = filtered.filter((customer) => {
        const isExpired = new Date(customer.expiresAt) < new Date();
        return customer.status === "active" && !isExpired;
      });
    } else if (viewMode === "expired") {
      filtered = filtered.filter((customer) => {
        const isExpired = new Date(customer.expiresAt) < new Date();
        return customer.status === "inactive" || isExpired;
      });
    }

    // Apply search filter - Email only (case-insensitive)
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter((customer) => {
        // Check if forEmail exists and matches search term
        if (
          customer.forEmail &&
          customer.forEmail.toLowerCase().includes(searchTerm)
        ) {
          return true;
        }
        // Also check username if email doesn't match
        if (
          customer.forUsername &&
          customer.forUsername.toLowerCase().includes(searchTerm)
        ) {
          return true;
        }
        // Check buyer ID as well
        if (
          customer.buyer &&
          customer.buyer.toLowerCase().includes(searchTerm)
        ) {
          return true;
        }
        return false;
      });
    }

    // Apply purchase date filter
    if (filters.purchaseDate) {
      filtered = filtered.filter((customer) => {
        if (!customer.createdAt) return false;

        const purchaseDate = new Date(customer.createdAt);
        const filterDate = new Date(filters.purchaseDate);

        // Compare dates (ignoring time)
        return purchaseDate.toDateString() === filterDate.toDateString();
      });
    }

    // Apply license type filter
    if (filters.licenseType) {
      filtered = filtered.filter((customer) => {
        if (!customer.productName) return false;
        return (
          customer.productName.toLowerCase() ===
          filters.licenseType.toLowerCase()
        );
      });
    }

    // Apply expiry date filter
    if (filters.expiryDate) {
      filtered = filtered.filter((customer) => {
        if (!customer.expiresAt) return false;

        const expiryDate = new Date(customer.expiresAt);
        const filterDate = new Date(filters.expiryDate);

        // Compare dates (ignoring time)
        return expiryDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      purchaseDate: "",
      licenseType: "",
      expiryDate: "",
    });
    setViewMode("all");
  };

  const handleActivateLicense = async (customerId) => {
    try {
      const response = await axios.post(
        `/vpn/activate-license/${customerId}`,
        {},
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        // Update customer status in local state
        setCustomers((prev) =>
          prev.map((customer) =>
            customer._id === customerId
              ? { ...customer, status: "active" }
              : customer
          )
        );

        // Refresh the data
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error activating license:", error);
    }
  };

  const fetchHistoryDetails = async (licenseId, serverName) => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      setHistoryDetails(null);

      const response = await axios.get("/services/future-configs", {
        params: { licenseId, serverName },
        headers: { token },
      });

      if (response?.data?.success) {
        setHistoryDetails(response.data.data);
        // Set the current server from the response
        if (response.data.data?.config?.[0]?.server) {
          setSelectedServer(response.data.data.config[0].server);
        }
      } else {
        setHistoryError("Unable to load configuration.");
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);

      // Check if it's a 400 status - show toast message
      if (error.response?.status === 400) {
        showToastMessage("Please select server for configuration");
        setHistoryError("Please select a server to view configuration.");
      } else {
        setHistoryError("Unable to load configuration.");
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const showCustomerHistory = (customer) => {
    setSelectedCustomer(customer);
    setShowHistoryModal(true);
    // Reset states for new modal
    setHistoryDetails(null);
    setHistoryError(null);
    setSelectedServer("");
    setCopied(false);
    setShowToast(false);
    if (copyFeedbackTimeoutRef.current) {
      clearTimeout(copyFeedbackTimeoutRef.current);
      copyFeedbackTimeoutRef.current = null;
    }
    // Automatically call fetchHistoryDetails with default serverName
    if (customer?._id) {
      fetchHistoryDetails(customer._id, "Germany Server");
    }
  };

  const handleServerSelection = (serverName) => {
    setSelectedServer(serverName);
    if (serverName && selectedCustomer?._id) {
      fetchHistoryDetails(selectedCustomer._id, serverName);
    }
  };

  const handleSwitchServer = async (newServerName) => {
    if (!historyDetails?._id || !newServerName) return;

    try {
      setHistoryLoading(true);
      const response = await axios.post(
        "/services/future-configs/switch-server",
        {
          configId: historyDetails._id,
          serverName: newServerName,
        },
        {
          headers: { token },
        }
      );

      if (response?.data?.success) {
        // After successful switch, call future-configs with licenseId + new serverName
        fetchHistoryDetails(selectedCustomer._id, newServerName);
      } else {
        setHistoryError("Unable to switch server.");
        setHistoryLoading(false);
      }
    } catch (error) {
      console.error("Error switching server:", error);
      setHistoryError("Unable to switch server.");
      setHistoryLoading(false);
    }
  };

  const handleCopyConnectionString = () => {
    const textToCopy = historyDetails?.config?.[0]?.connectionString || "";
    if (!textToCopy) return;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        if (copyFeedbackTimeoutRef.current) {
          clearTimeout(copyFeedbackTimeoutRef.current);
        }
        copyFeedbackTimeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch(() => {});
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if license is expired
  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusColor = (status, expiresAt) => {
    if (isExpired(expiresAt)) {
      return "bg-red-500/20 text-red-300 border-red-500/30";
    }
    return status === "active"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  };

  const getStatusText = (status, expiresAt) => {
    if (isExpired(expiresAt)) {
      return "Expired";
    }
    return status === "active" ? "Active" : "Inactive";
  };

  return (
    <div className=" flex flex-col items-center justify-center h-full w-full z-50 relative">
      <div className="relative overflow-y-auto h-full  w-full element">
              <div
                className="w-full rounded-2xl p-4 md:p-2 flex h-full flex-col gap-4 shadow-xl border border-[#22304a] relative"
                style={{
                  background:
                    "linear-gradient(180deg, #05172C 0%, #000000 100%)",
                }}
              >
                {/* VPN Maintenance Mode Overlay */}
                {isVpnMaintenanceMode && (
                  <div className="absolute inset-0 z-[50] flex items-start justify-center pt- bg-[#06101A]/90 backdrop-blur-[4px] transition-all duration-300 rounded-2xl">
                    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto p-8">
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
                            stroke="url(#gradientStroke3)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <defs>
                            <linearGradient
                              id="gradientStroke3"
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
                  {/* Filters */}
                  <div className="mb-8 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-semibold text-lg font-body1">
                        Filters
                      </h3>
                      <button
                        onClick={clearFilters}
                        className="px-2 py-1 text-xs font-body1 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors "
                      >
                        Clear All Filters
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-white text-xs font-medium mb-2 font-body1">
                          Search
                        </label>
                        <input
                          type="text"
                          value={filters.search}
                          onChange={(e) =>
                            handleFilterChange("search", e.target.value)
                          }
                          placeholder="Search by Email"
                          className="w-full px-1  font-body1 placeholder:text-[10px] bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ color: "white" }}
                        />
                      </div>

                      <div>
                        <label className="block text-white text-xs font-medium mb-2 font-body1">
                          Purchase Date
                        </label>
                        <input
                          type="date"
                          value={filters.purchaseDate}
                          onChange={(e) =>
                            handleFilterChange("purchaseDate", e.target.value)
                          }
                          className="w-full px-2 py-1 text-[10px] font-body1 bg-[#FFFFFF1A] rounded-md border border-[#FFFFFF33]  text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ color: "white" }}
                        />
                      </div>

                      {/* <div>
                      <label className="block text-white font-medium mb-2">
                        Product Type
                      </label>
                      <select
                        value={filters.licenseType}
                        onChange={(e) =>
                          handleFilterChange("licenseType", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ color: "white" }}
                      >
                        <option
                          value=""
                          style={{ backgroundColor: "#06101A", color: "white" }}
                        >
                          All Types
                        </option>
                        <option
                          value="IPVPN"
                          style={{ backgroundColor: "#06101A", color: "white" }}
                        >
                          IPVPN
                        </option>
                        <option
                          value="VPN"
                          style={{ backgroundColor: "#06101A", color: "white" }}
                        >
                          VPN
                        </option>
                      </select>
                    </div> */}

                      <div>
                        <label className="block text-white text-xs font-medium mb-2 font-body1">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={filters.expiryDate}
                          onChange={(e) =>
                            handleFilterChange("expiryDate", e.target.value)
                          }
                          className="w-full px-2  py-1 text-[10px] rounded-md font-body1 bg-[#FFFFFF1A] border border-[#FFFFFF33]  text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ color: "white" }}
                        />
                      </div>

                      <div>
                        <label className="block text-white text-xs font-medium mb-2 font-body1">
                          View Mode
                        </label>
                        <select
                          value={viewMode}
                          onChange={(e) => setViewMode(e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFFFF1A] text-[10px] font-body1 border  border-[#FFFFFF33] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ color: "white" }}
                        >
                          <option
                            value="all"
                            style={{
                              backgroundColor: "#06101A",
                              color: "white",
                            }}
                          >
                            All Customers
                          </option>
                          <option
                            value="active"
                            style={{
                              backgroundColor: "#06101A",
                              color: "white",
                            }}
                          >
                            Active Only
                          </option>
                          <option
                            value="expired"
                            style={{
                              backgroundColor: "#06101A",
                              color: "white",
                            }}
                          >
                            Expired Only
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Filter Summary */}
                    {(filters.search ||
                      filters.purchaseDate ||
                      filters.licenseType ||
                      filters.expiryDate ||
                      viewMode !== "all") && (
                      <div className="bg-[#FFFFFF0A] rounded-lg p-3">
                        <p className="text-white text-sm font-body1">
                          <span className="font-semibold font-body1">Active Filters:</span>
                          {filters.search && ` Email: "${filters.search}"`}
                          {filters.purchaseDate &&
                            ` Purchase Date: ${filters.purchaseDate}`}
                          {filters.licenseType &&
                            ` Product: ${filters.licenseType}`}
                          {filters.expiryDate &&
                            ` Expiry Date: ${filters.expiryDate}`}
                          {viewMode !== "all" &&
                            ` View: ${
                              viewMode === "active"
                                ? "Active Only"
                                : "Expired Only"
                            }`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Table */}
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                      <p className="text-white mt-4 font-body1">Loading customers...</p>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-white text-lg font-medium mb-2 font-body1">
                        No customers found
                      </div>
                      <p className="text-gray-400 text-sm font-body1">
                        {filters.search ||
                        filters.purchaseDate ||
                        filters.licenseType ||
                        filters.expiryDate ||
                        viewMode !== "all"
                          ? "Try adjusting your filters"
                          : "No customers available"}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-[#FFFFFF33]">
                            <th className="px-4 py-3 text-white font-semibold font-body1">
                              Email
                            </th>
                            <th className="px-4 py-3 text-white font-semibold font-body1">
                              Username
                            </th>

                            <th className="px-4 py-3 text-white font-semibold font-body1">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-white font-semibold font-body1">
                              Purchase Date
                            </th>
                            <th className="px-4 py-3 text-white font-semibold font-body1">
                              Status
                            </th>
                            <th className="px-4 py-3 text-white font-semibold font-body1">
                              Expires At
                            </th>
                            <th className="px-4 py-3 text-white font-semibold font-body1">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((customer) => (
                            <tr
                              key={customer._id}
                              className="border-b border-[#FFFFFF1A] hover:bg-[#FFFFFF0A]"
                            >
                              <td className="px-4 py-3 text-white font-body1">
                                {customer.forEmail || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-white font-body1">
                                {customer.forUsername || "N/A"}
                              </td>

                              <td className="px-4 py-3 text-white font-body1">
                                {customer.amount} {customer.wallet_type}
                              </td>
                              <td className="px-4 py-3 text-white font-body1">
                                {formatDate(customer.createdAt)}
                              </td>
                              <td className="px-4 py-3 font-body1">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                                    customer.status,
                                    customer.expiresAt
                                  )}`}
                                >
                                  {getStatusText(
                                    customer.status,
                                    customer.expiresAt
                                  )}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-white font-body1">
                                {formatDate(customer.expiresAt)}
                              </td>
                              <td className="px-4 py-3 font-body1">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      showCustomerHistory(customer)
                                    }
                                    className="px-3 py-1 font-body1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded hover:bg-blue-500/30 transition-colors text-sm"
                                  >
                                    View
                                  </button>
                                  {isExpired(customer.expiresAt) && (
                                    <button
                                      onClick={() =>
                                        handleActivateLicense(customer._id)
                                      }
                                      className="px-3 py-1 font-body1 bg-green-500/20 border border-green-500/30 text-green-300 rounded hover:bg-green-500/30 transition-colors text-sm"
                                    >
                                      Activate
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 font-body1 bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-lg text-white hover:bg-[#FFFFFF2A] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`px-4 py-2 font-body1 rounded-lg ${
                              currentPage === page
                                ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white"
                                : "bg-[#FFFFFF1A] border border-[#FFFFFF33] text-white hover:bg-[#FFFFFF2A]"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 font-body1 bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-lg text-white hover:bg-[#FFFFFF2A] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="mt-6 text-center text-white font-body1">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
                    {filteredCustomers.length} customers
                    {customers.length !== filteredCustomers.length && (
                      <span className="text-gray-400 ml-2 font-body1">
                        (filtered from {customers.length} total)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

      {/* Navbar */}
      

      {/* History Modal */}
      {showHistoryModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#06101A] backdrop-blur-lg rounded-[20px] p-8 max-w-2xl w-full mx-4 border border-[#FFFFFF33]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white font-body1">
                History - {selectedCustomer.buyer || selectedCustomer.forEmail}
              </h3>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setHistoryDetails(null);
                  setHistoryError(null);
                  setSelectedServer("");
                  setCopied(false);
                  setShowToast(false);
                  if (copyFeedbackTimeoutRef.current) {
                    clearTimeout(copyFeedbackTimeoutRef.current);
                    copyFeedbackTimeoutRef.current = null;
                  }
                }}
                className="text-white hover:text-gray-300 text-2xl font-body1"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm font-body1">
                <div>
                  <span className="text-gray-400 font-body1">Buyer ID:</span>
                  <p className="text-white font-body1">
                    {selectedCustomer.buyer || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-body1">Email:</span>
                  <p className="text-white font-body1">
                    {selectedCustomer.forEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-body1">Username:</span>
                  <p className="text-white font-body1">
                    {selectedCustomer.forUsername || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-body1">Amount:</span>
                  <p className="text-white font-body1">
                    {selectedCustomer.amount} {selectedCustomer.wallet_type}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-body1">Product:</span>
                  <p className="text-white font-body1">
                    {selectedCustomer.productName || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-body1">Status:</span>
                  <p className="text-white font-body1">
                    {getStatusText(
                      selectedCustomer.status,
                      selectedCustomer.expiresAt
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-body1">Created:</span>
                  <p className="text-white font-body1">
                    {formatDate(selectedCustomer.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-body1">Expires:</span>
                  <p className="text-white font-body1">
                    {formatDate(selectedCustomer.expiresAt)}
                  </p>
                </div>
              </div>

              {/* Server Configuration Section */}
              <div className="mt-6 border-t border-[#FFFFFF33] pt-4">
                <h4 className="text-white font-semibold mb-3 font-body1">
                  Server Configuration
                </h4>

                {historyDetails ? (
                  /* Show current server info and switch option */
                  <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <p className="text-green-300 text-sm font-body1">
                        <span className="font-semibold font-body1">Current Server:</span>{" "}
                        {historyDetails?.config?.[0]?.server || selectedServer}
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2 font-body1">
                        Switch to Different Server
                      </label>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleSwitchServer(e.target.value);
                          }
                        }}
                        className="w-full px-4 py-3 font-body1 bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ color: "white" }}
                      >
                        <option
                          value=""
                          style={{
                            backgroundColor: "#06101A",
                            color: "white",
                          }}
                        >
                          Choose server to switch...
                        </option>
                        {servers
                          .filter(
                            (server) =>
                              server !==
                              (historyDetails?.config?.[0]?.server ||
                                selectedServer)
                          )
                          .map((server) => (
                            <option
                              key={server}
                              value={server}
                              style={{
                                backgroundColor: "#06101A",
                                color: "white",
                              }}
                            >
                              {server}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ) : historyError && historyError.includes("select a server") ? (
                  /* Show server selection when 400 error */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2 font-body1">
                        Select Server to View Configuration
                      </label>
                      <select
                        value={selectedServer}
                        onChange={(e) => handleServerSelection(e.target.value)}
                        className="w-full px-4 py-3 font-body1 bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ color: "white" }}
                      >
                        <option
                          value=""
                          style={{ backgroundColor: "#06101A", color: "white" }}
                        >
                          Select a server...
                        </option>
                        {servers.map((server) => (
                          <option
                            key={server}
                            value={server}
                            style={{
                              backgroundColor: "#06101A",
                              color: "white",
                            }}
                          >
                            {server}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <p className="text-orange-300 text-sm font-body1">
                        Please select a server to view the configuration
                        details.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {historyLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="text-white mt-2 text-sm font-body1">
                    Loading configuration...
                  </p>
                </div>
              ) : historyError ? (
                <div className="p-3 bg-red-500/10 rounded-lg text-red-300 text-sm font-body1">
                  {historyError}
                </div>
              ) : historyDetails ? (
                <div className="mt-2 space-y-3">
                  <h4 className="text-white font-semibold font-body1">License Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm font-body1">
                    <div>
                      <span className="text-gray-400 font-body1">Devices:</span>
                      <p className="text-white font-body1">
                        {historyDetails?.devices ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="block text-gray-400 text-sm mb-1 font-body1">
                      Connection String
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={
                          historyDetails?.config?.[0]?.connectionString || ""
                        }
                        className="flex-1 px-3 py-2 font-body1 bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded text-white text-xs"
                      />
                      <button
                        onClick={handleCopyConnectionString}
                        className={`px-3 py-2 font-body1 rounded text-xs border ${
                          copied
                            ? "bg-green-500/20 font-body1 border-green-500/30 text-green-300"
                            : "bg-blue-500/20 font-body1 border-blue-500/30 text-blue-300"
                        }`}
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-6">
                <div className="space-y-2">
                  {isExpired(selectedCustomer.expiresAt) && (
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <p className="text-red-300 text-sm font-body1">License expired</p>
                      <p className="text-gray-400 text-xs font-body1">
                        {formatDate(selectedCustomer.expiresAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[100]">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-[#06101A] border border-orange-500/30 rounded-lg p-4 shadow-lg max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-orange-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-orange-300 text-sm font-medium font-body1">
                  {toastMessage}
                </p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-orange-400 hover:text-orange-300 font-body1"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;
