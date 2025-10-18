import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess, logout } from "../store/authSlice";
import axiosInstance from "../api/axiosConfig";
import {
  approveSuRequest,
  rejectSuRequest,
  sendSuRequest,
  checkActiveLicense,
  purchaseLicense,
} from "../api/auth";
import {
  ArrowBigLeft,
  ArrowLeft,
  Menu,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { FaCertificate } from "react-icons/fa";

const Header = ({ title = "DASHBOARD" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isSendRequestModalOpen, setIsSendRequestModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSecurityDropdownOpen, setIsSecurityDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isApprovingRequest, setIsApprovingRequest] = useState({});
  const [isRejectingRequest, setIsRejectingRequest] = useState({});
  const [targetUsername, setTargetUsername] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [isLoadingReceivedRequests, setIsLoadingReceivedRequests] =
    useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  // Debug: Log user data to check role
  useEffect(() => {
    console.log("User data in Header:", user);
    console.log("User role:", user?.role);
    console.log("Token in Header:", token);
  }, [user, token]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".notification-dropdown") &&
        !event.target.closest(".profile-dropdown")
      ) {
        setIsNotificationDropdownOpen(false);
        setIsDropdownOpen(false);
        setIsSecurityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setIsSecurityDropdownOpen(false);
    }
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const handleLogout = () => {
    // Properly logout and clear all cache/storage
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  // Function to determine if user is new (same logic as navigation)
  const isNewUser = () => {
    if (!user) return true;
    const isNew = user.role === "NU";
    console.log("Header - isNewUser:", isNew, "for role:", user.role);
    return isNew;
  };

  // Get navigation items for profile dropdown
  const getProfileNavigationItems = () => {
    const navigationItems = [
      {
        label: "Marketplace",
        path: "/",
        icon: "/assets/images/nav1.png",
      },
      {
        label: "Wallets",
        path: "/wallets",
        icon: "/assets/images/nav3.png",
      },
      {
        label: "Profile",
        path: "/profile",
        icon: "/assets/images/nav2.png",
      },
      {
        label: "Affiliate",
        path: "/refer",
        icon: "/assets/images/nav7.png",
      },
      {
        label: "Security",
        hasDropdown: true,
        icon: "/assets/images/nav8.png",
        subItems: [
          {
            label: "Google Authenticato",
            path: "/profile?tab=googleAuth",
          },
          { label: "E Pin", path: "/profile?tab=epin" },
          { label: "Last Login", path: "/profile?tab=lastLogins" },
          { label: "Change Password", path: "/change-password" },
        ],
      },
    ];

    return navigationItems;
  };

  // Get navigation items for mobile menu (from Navbar.jsx)
  const getMobileNavigationItems = () => {
    const navigationItems = [
      {
        label: "MarketPlace",
        path: "/",
        icon: "/assets/images/nav1.png",
      },
      {
        label: "Profile",
        path: "/profile",
        icon: "/assets/images/nav2.png",
      },
      {
        label: "Wallets",
        path: "/wallets",
        icon: "/assets/images/nav3.png",
      },
      {
        label: "Refer",
        path: "/refer",
        icon: "/assets/images/nav7.png",
      },
      {
        label: "VPN Services",
        icon: "/assets/images/vpn-icon.svg",
        hasSubmenu: true,
        submenuItems: [
          {
            label: "Sell VPN",
            path: "/vpn/sell",
          },
          {
            label: "Customer List",
            path: "/vpn/customers",
          },
        ],
      },
      {
        label: "Staking Products",
        path: "/staking-products",
        icon: "/assets/images/nav9.png",
      },
    ];

    // Add SU-only items if user is not new
    if (!isNewUser()) {
      navigationItems.splice(
        3,
        0,
        {
          label: "Team",
          path: "/team",
          icon: "/assets/images/nav4.png",
        },
        {
          label: "Income",
          path: "/income",
          icon: "/assets/images/nav5.png",
        },
        {
          label: "Buying History",
          path: "/buying-history",
          icon: "/assets/images/nav6.png",
        }
      );

      navigationItems.splice(-1, 0, {
        label: "Account Statements",
        path: "/account-statements",
        icon: "/assets/images/nav8.png",
      });
    }

    return navigationItems;
  };

  const profileNavigationItems = getProfileNavigationItems();
  const mobileNavigationItems = getMobileNavigationItems();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!token) return;
    setIsLoadingNotifications(true);
    try {
      const response = await axiosInstance.get("/user/notifications", {
        headers: { token },
      });
      if (response.data.success) {
        setNotifications(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setNotifications([]);
      }
    } catch (error) {
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Fetch received SU requests from API
  const fetchReceivedRequests = async () => {
    if (!token || !user || user.role !== "NU") return;
    setIsLoadingReceivedRequests(true);
    try {
      const response = await axiosInstance.get("/user/received-su-requests", {
        headers: { token },
      });
      if (response.data.success) {
        setReceivedRequests(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setReceivedRequests([]);
      }
    } catch (error) {
      setReceivedRequests([]);
    } finally {
      setIsLoadingReceivedRequests(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    if (!token) return;
    try {
      await axiosInstance.post(
        "/user/read-notification",
        { notificationId },
        {
          headers: { token },
        }
      );
      // Refresh notifications after marking as read
      fetchNotifications();
    } catch (error) {
      // Optionally handle error
    }
  };

  // Handle notification click to navigate
  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification._id);
    // Navigate based on type
    if (notification.type === "New Referral") {
      navigate("/refer");
    } else if (notification.type === "BFM Purchase") {
      navigate("/wallets");
    } else if (notification.type === "SU Request") {
      navigate("/dashboard");
    } else if (notification.type === "Lottery") {
      navigate("/staking-products");
    }
    setIsNotificationModalOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  const handleApprove = async (notification) => {
    if (!token) {
      console.error("No token found");
      return;
    }

    setIsApprovingRequest((prev) => ({ ...prev, [notification._id]: true }));

    try {
      const response = await approveSuRequest(token, {
        requestId: notification._id,
      });

      if (response.success) {
        // Successfully approved, refetch notifications
        await fetchNotifications();
      } else {
        console.error("Failed to approve request:", response.message);
      }
    } catch (error) {
      console.error("Error approving request:", error);
    } finally {
      setIsApprovingRequest((prev) => ({ ...prev, [notification._id]: false }));
    }
  };

  const handleReject = async (notification) => {
    if (!token) {
      console.error("No token found");
      return;
    }

    setIsRejectingRequest((prev) => ({ ...prev, [notification._id]: true }));

    try {
      const response = await rejectSuRequest(token, {
        requestId: notification._id,
      });

      if (response.success) {
        // Successfully rejected, refetch notifications
        await fetchNotifications();
      } else {
        console.error("Failed to reject request:", response.message);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    } finally {
      setIsRejectingRequest((prev) => ({ ...prev, [notification._id]: false }));
    }
  };

  const handleSendRequest = async () => {
    if (!targetUsername.trim()) {
      alert("Please enter a username");
      return;
    }

    if (!token) {
      console.error("No token found");
      return;
    }

    setIsSendingRequest(true);

    try {
      const response = await sendSuRequest(token, {
        username: targetUsername.trim(),
      });

      if (response.success) {
        alert("Request sent successfully!");
        setTargetUsername("");
        setIsSendRequestModalOpen(false);
      } else {
        alert(
          "Failed to send request: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert(
        "Error sending request: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    } finally {
      setIsSendingRequest(false);
    }
  };

  const closeSendRequestModal = () => {
    setIsSendRequestModalOpen(false);
    setTargetUsername("");
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchReceivedRequests();
    }
  }, [token, user]);

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // License Modal Component
  const LicenseModal = () => {
    const [hasActiveLicense, setHasActiveLicense] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
      let mounted = true;
      const fetchLicenseStatus = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await checkActiveLicense(token);
          if (mounted) {
            setHasActiveLicense(res?.data?.activeLicense === true);
          }
        } catch (err) {
          setError("Failed to check license status");
        } finally {
          if (mounted) setLoading(false);
        }
      };
      if (isLicenseModalOpen && token) {
        fetchLicenseStatus();
      }
      return () => {
        mounted = false;
      };
    }, [isLicenseModalOpen, token]);

    const handleBuyLicense = async () => {
      setBuying(true);
      setError("");
      try {
        const res = await purchaseLicense(token, "Standard License");
        if (res.success) {
          setShowSuccess(true);
          setHasActiveLicense(true);
          // Close modal after 3 seconds
          setTimeout(() => {
            setIsLicenseModalOpen(false);
            setShowSuccess(false);
          }, 3000);
        } else {
          setError(res.message || "Failed to purchase license");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to purchase license"
        );
      } finally {
        setBuying(false);
      }
    };

    if (!isLicenseModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
        <div className="bg-[#1a1a1a] rounded-lg p-4 w-full max-w-sm border border-gray-700">
          {showSuccess ? (
            // Success View
            <div className="text-center py-6">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-body1">
                  Purchase Successful!
                </h3>
                <p className="text-green-400 text-sm mb-2 font-body1">
                  Your Premium License has been activated
                </p>
                <p className="text-gray-400 text-xs font-body1">
                  This modal will close automatically in 3 seconds
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#33A0EA] to-[#0AC488] rounded-lg p-3 mb-3">
                <p className="text-white font-bold text-lg font-body1">
                  License Activated
                </p>
                <p className="text-white/90 text-sm font-body1">
                  Enjoy your premium features!
                </p>
              </div>
              <div className="text-xs text-gray-300 space-y-1 font-body1">
                <p>✓ 3 Months Free VPN</p>
                <p>✓ 6 Months Free Signal Channel</p>
                <p>✓ 83% BFM Crypto Box allowance</p> 
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-white font-header">
                  Premium License
                </h3>
                <button
                  onClick={() => setIsLicenseModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center mb-4">
                <div className="bg-gradient-to-r from-[#33A0EA] to-[#0AC488] rounded-lg p-3 mb-3">
                  <p className="text-white font-bold text-xl font-body1">49.48 GUSD</p>
                  <p className="text-white/90 text-sm font-body1">One-time payment</p>
                </div>
                <div className="text-xs text-gray-400 space-y-1 font-body1">
                  <p className="font-body1">• 3 Months Free VPN</p>
                  <p className="font-body1">• 6 Months Free Signal Channel</p>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-center text-sm mb-3 font-body1">
                  {error}
                </div>
              )}

              {/* <div className="flex gap-2">
                <button
                  onClick={() => setIsLicenseModalOpen(false)}
                  className="flex-1 bg-gray-700 font-body1 text-white py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  disabled={buying}
                >
                  Cancel
                </button>
                {loading ? (
                  <button className="flex-1 font-body1 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white py-2 px-3 rounded-lg opacity-60 cursor-not-allowed text-sm">
                    Loading...
                  </button>
                ) : hasActiveLicense && !showSuccess ? (
                  <button
                    className="flex-1 font-body1 bg-green-600 text-white py-2 px-3 rounded-lg cursor-not-allowed text-sm"
                    disabled
                  >
                    Activated
                  </button>
                ) : (
                  <button
                    onClick={handleBuyLicense}
                    className="flex-1 font-body1 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white py-2 px-3 rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-60"
                    disabled={buying}
                  >
                    {buying ? "Processing..." : "Buy License"}
                  </button>
                )}
              </div> */}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-[-10px] flex flex-row justify-between md:items-center mb-3 gap-4 md:gap-0 px-2">
      <div className="flex flex-row justify-between items-center space-x-4">
        {/* Hide back button on dashboard page */}
        {location.pathname !== "/dashboard" && (
          <Link to={"/dashboard"}>
            <button className="p-2 bg-black text-white flex md:hidden rounded-md">
              <ArrowLeft className="w-5 h-5" />{" "}
            </button>
          </Link>
        )}

        <p className=" text-xl  md:text-4xl font-header tracking-widest text-white text-center md:text-left">
          {title}
        </p>
      </div>
      <div className="  hidden md:flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-4 w-auto">
        <div className="relative  w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-48 md:w-64 px-4 py-2 pl-10 rounded-lg font-body1 bg-transparent gradient-border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
          />
          <img
            src="/assets/images/search-icon.png"
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text_secondary"
          />
        </div>
        <div className=" hidden lg:flex items-center gap-2 sm:gap-4">
          {user && user.role === "SU" && (
            <button
              className="px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-body1 transition-colors"
              onClick={() => setIsSendRequestModalOpen(true)}
            >
              Send Request to NU
            </button>
          )}
          {user && user.role === "NU" && receivedRequests.length > 0 && (
            <button
              className="px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => setIsNotificationModalOpen(true)}
            >
              Received Requests
            </button>
          )}

          <button className="p-2 rounded-xl bg-transparent gradient-border hover:opacity-80 transition-opacity">
            <img
              src="/assets/images/message-notif.png"
              className="w-6 h-6 text-text_secondary"
            />
          </button>
          <div className="relative notification-dropdown">
            <button
              className="p-2 rounded-xl bg-transparent gradient-border hover:opacity-80 transition-opacity"
              onClick={toggleNotificationDropdown}
            >
              <img
                src="/assets/images/notification.png"
                className="w-6 h-6 text-text_secondary"
              />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>
            {/* Notification Dropdown */}
            {isNotificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] rounded-lg shadow-xl py-2 z-20 border border-gray-700 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-700">
                  <h3 className="text-white font-semibold text-sm font-body1">
                    Notifications
                  </h3>
                </div>
                {isLoadingNotifications ? (
                  <div className="px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="px-4 py-3 hover:bg-[#2a2a2a] border-b border-gray-800 last:border-b-0 flex items-center justify-between"
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {/* <span className="text-blue-400 text-xs font-medium">{notification.type}</span> */}
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <h4 className="text-white text-sm font-medium font-body1 mb-1 text-gradient">
                          {notification.title}
                        </h4>
                        <p className="text-gray-400 text-xs font-body1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-gray-500 text-xs mt-2 font-body1">
                          {new Date(notification.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      {/* Mark as read icon */}
                      {!notification.isRead && (
                        <button
                          className="ml-2 p-1 rounded hover:bg-gray-700"
                          title="Mark as read"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-gray-400 text-sm font-body1">No notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative profile-dropdown">
            <button
              className="p-2 rounded-xl bg-transparent gradient-border hover:opacity-80 transition-opacity"
              onClick={toggleDropdown}
            >
              <img
                src="/assets/images/profile1.png"
                className="w-6 h-6 text-text_secondary"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#000000] rounded-lg shadow-xl py-2 z-10 border border-gray-700">
                {profileNavigationItems.map((item, index) => (
                  <div key={index}>
                    {item.hasDropdown ? (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setIsSecurityDropdownOpen(!isSecurityDropdownOpen)
                          }
                          className="flex  items-center justify-between w-[93%] px-4 py-2 text-white text-xs hover:bg-gray_line rounded-md mx-2 my-1 border-b border-gray-700 pb-2 mb-2 font-body1"
                        >
                          <div className="flex items-center">
                            <img
                              src={item.icon}
                              alt={item.label}
                              className="w-5 h-5 mr-2"
                            />
                            {item.label}
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isSecurityDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Security Sub-dropdown */}
                        {isSecurityDropdownOpen && (
                          <div className="ml-8 mt-1 border-l border-gray-700 pl-2">
                            {item.subItems.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.path}
                                className="block px-4 py-2 font-body1 text-xs w-[93%] text-white/80 hover:text-white hover:bg-gray_line rounded-md transition-all duration-300"
                                onClick={() => {
                                  setIsSecurityDropdownOpen(false);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className="flex items-center px-4 py-2 text-white font-body1 text-xs hover:bg-gray_line rounded-md mx-2 my-1 border-b border-gray-700 pb-2 mb-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-5 h-5 mr-2"
                        />
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Buy License Button */}
                {/* <button
                  onClick={() => {
                    setIsLicenseModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center w-[90%] px-4 py-2 text-white text-xs hover:bg-gray_line rounded-md mx-2 my-1 border-b border-gray-700 pb-2 mb-2 font-body1"
                >
                  <FaCertificate className="w-5 h-5 mr-2" />
                  Buy License 
                </button> */}

                {/* Logout Button */}
                <a
                  href="#"
                  onClick={handleLogout}
                  className="flex items-center text-xs px-4 py-2 text-red-500 hover:bg-gray_line rounded-md mx-2 my-1 font-body1"
                >
                  <img
                    src="/assets/images/logout.png"
                    className="w-5 h-5 mr-2"
                  />
                  Log Out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center  space-x-4 md:hidden">
        <Search className="w-7 h-7 text-text_secondary" />

        <div className="relative profile-dropdown">
          <button
            className=" flex items-center justify-center  w-8 h-8 rounded-md bg-transparent gradient-border hover:opacity-80 transition-opacity"
            onClick={toggleDropdown}
          >
            <img
              src="/assets/images/profile1.png"
              className="w-6 h-6 text-text_secondary"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#000000] rounded-lg shadow-xl py-2 z-10 border border-gray-700">
              {profileNavigationItems.map((item, index) => (
                <div key={index}>
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setIsSecurityDropdownOpen(!isSecurityDropdownOpen)
                        }
                        className="flex  items-center justify-between w-[93%] px-4 py-2 text-white text-xs hover:bg-gray_line rounded-md mx-2 my-1 border-b border-gray-700 pb-2 mb-2 font-body1"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.icon}
                            alt={item.label}
                            className="w-5 h-5 mr-2"
                          />
                          {item.label}
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isSecurityDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Security Sub-dropdown */}
                      {isSecurityDropdownOpen && (
                        <div className="ml-8 mt-1 border-l border-gray-700 pl-2">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              className="block px-4 py-2 text-xs w-[93%] text-white/80 hover:text-white hover:bg-gray_line rounded-md transition-all duration-300 font-body1"
                              onClick={() => {
                                setIsSecurityDropdownOpen(false);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center px-4 py-2 text-white text-xs hover:bg-gray_line rounded-md mx-2 my-1 border-b border-gray-700 pb-2 mb-2 font-body1"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-5 h-5 mr-2"
                      />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Buy License Button */}
              {/* <button
                onClick={() => {
                  setIsLicenseModalOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="flex items-center w-[90%] px-4 py-2 text-white text-xs hover:bg-gray_line rounded-md mx-2 my-1 border-b border-gray-700 pb-2 mb-2 font-body1"
              >
                <FaCertificate className="w-5 h-5 mr-2" />
                Buy License
              </button> */}

              {/* Logout Button */}
              <a
                href="#"
                onClick={handleLogout}
                className="flex items-center text-xs px-4 py-2 text-red-500 hover:bg-gray_line rounded-md mx-2 my-1"
              >
                <img src="/assets/images/logout.png" className="w-5 h-5 mr-2" />
                Log Out
              </a>
            </div>
          )}
        </div>

        <button className="text-white" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#010510] z-[999] flex flex-col">
          <div className="flex items-center justify-between px-6 p-4 border-b border-white/10">
            <div className="w-[124px] h-[39px]">
              <Link to={"/"} onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="./logo.svg"
                  alt="logo"
                  className="w-[134px] h-[39px]"
                />
              </Link>
            </div>
            <button className="text-white" onClick={toggleMobileMenu}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col justify-between h-full px-6 pb-4">
            <div className="flex flex-col mt-4 space-y-3 items-center w-full">
              {/* Mobile Navigation Items */}
              {mobileNavigationItems.map((item, index) => (
                <div key={index} className="w-full">
                  {item.hasSubmenu ? (
                    // Item with submenu
                    <div>
                      <div
                        onClick={toggleSubmenu}
                        className="group flex w-full items-center bg-[#03131d] py-3 px-3 rounded-md justify-between text-white hover:bg-[linear-gradient(140.4deg,rgba(51,160,234,0.2),rgba(10,196,136,0.2))] transition-colors duration-300 cursor-pointer font-body1"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.icon}
                            alt={item.label}
                            className="w-5 h-5 mr-3"
                          />
                          <p className="text-lg uppercase font-body1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300 ">
                            {item.label}
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={18}
                          height={18}
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className={`transition-all duration-300 stroke-white group-hover:opacity-0 ${
                            isSubmenuOpen ? "rotate-180" : ""
                          }`}
                        >
                          <defs>
                            <linearGradient
                              id="gradientStroke"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="1"
                            >
                              <stop offset="9.17%" stopColor="#33A0EA" />
                              <stop offset="83.83%" stopColor="#0AC488" />
                            </linearGradient>
                          </defs>
                          <path d="M6 9L12 15L18 9" />
                        </svg>
                      </div>

                      {/* Submenu Items */}
                      {isSubmenuOpen && (
                        <div className="mt-2 space-y-1  ">
                          {item.submenuItems.map((subItem, subIndex) => (
                            <div
                              key={subIndex}
                              onClick={() => {
                                navigate(subItem.path);
                                setIsMobileMenuOpen(false);
                                setIsSubmenuOpen(false);
                              }}
                              className="group flex w-full items-center bg-[#03131d]/80 py-2 px-6 rounded-md justify-between text-white hover:bg-[linear-gradient(140.4deg,rgba(51,160,234,0.2),rgba(10,196,136,0.2))] transition-colors duration-300 cursor-pointer ml-4"
                            >
                              <div className="flex items-center">
                                <p className="text-lg uppercase font-body1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300">
                                  {subItem.label}
                                </p>
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="transition-all duration-300 stroke-white group-hover:opacity-0"
                              >
                                <defs>
                                  <linearGradient
                                    id="gradientStroke"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="1"
                                  >
                                    <stop offset="9.17%" stopColor="#33A0EA" />
                                    <stop offset="83.83%" stopColor="#0AC488" />
                                  </linearGradient>
                                </defs>
                                <path d="M9 18L15 12L9 6" />
                              </svg>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular navigation item
                    <div
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className="group flex w-full items-center bg-[#03131d] py-3 px-3 rounded-md justify-between text-white hover:bg-[linear-gradient(140.4deg,rgba(51,160,234,0.2),rgba(10,196,136,0.2))] transition-colors duration-300 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-5 h-5 mr-3"
                        />
                        <p className="text-lg uppercase font-body1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300">
                          {item.label}
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="transition-all duration-300 stroke-white group-hover:opacity-0"
                      >
                        <defs>
                          <linearGradient
                            id="gradientStroke"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop offset="9.17%" stopColor="#33A0EA" />
                            <stop offset="83.83%" stopColor="#0AC488" />
                          </linearGradient>
                        </defs>
                        <path d="M9 18L15 12L9 6" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {/* Request Buttons */}
              {user && user.role === "SU" && (
                <div
                  onClick={() => {
                    setIsSendRequestModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group flex w-full items-center bg-blue-600/20 py-3 px-3 rounded-md justify-between text-blue-400 hover:bg-blue-600/30 transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="text-xs uppercase font-body1">
                      Send Request to NU
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="transition-all duration-300 stroke-blue-400"
                  >
                    <path d="M9 18L15 12L9 6" />
                  </svg>
                </div>
              )}

              {user && user.role === "NU" && receivedRequests.length > 0 && (
                <div
                  onClick={() => {
                    setIsNotificationModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group flex w-full items-center bg-green-600/20 py-3 px-3 rounded-md justify-between text-green-400 hover:bg-green-600/30 transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5v-5zM4 2h11l5 5v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
                      />
                    </svg>
                    <p className="text-xs uppercase avapore">
                      Received Requests
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="transition-all duration-300 stroke-green-400"
                  >
                    <path d="M9 18L15 12L9 6" />
                  </svg>
                </div>
              )}

              {/* Logout Button */}
              <div
                onClick={handleLogout}
                className="group flex w-full items-center bg-red-600/20 py-3 px-3 rounded-md justify-between text-red-400 hover:bg-red-600/30 transition-colors duration-300 cursor-pointer"
              >
                <div className="flex items-center">
                  <img
                    src="/assets/images/logout.png"
                    className="w-5 h-5 mr-3"
                  />
                  <p className="text-xs uppercase avapore">Log Out</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="transition-all duration-300 stroke-red-400"
                >
                  <path d="M9 18L15 12L9 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Request Modal */}
      {isSendRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-header text-white">
                Send Request to NU
              </h2>
              <button
                onClick={closeSendRequestModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2 font-body1">
                  Enter Username:
                </label>
                <input
                  type="text"
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 font-body1 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeSendRequestModal}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-body1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={isSendingRequest || !targetUsername.trim()}
                  className="bg-blue-600 hover:bg-blue-700 font-body1 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingRequest ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading text-white">
                Received Requests
              </h2>
              <button
                onClick={closeNotificationModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {isLoadingReceivedRequests ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="text-gray-400 mt-2 font-body1">Loading...</p>
                </div>
              ) : receivedRequests.length > 0 ? (
                receivedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-white text-sm font-body1">
                          <span className="font-medium">Sponsor:</span>{" "}
                          {notification.sponsor}
                        </p>
                        <p className="text-gray-400 text-xs mt-1 font-body1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2 py-1 font-body1 rounded text-xs ${
                            notification.status === "pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {notification.status}
                        </span>
                        {notification.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleApprove(notification)}
                              disabled={
                                isApprovingRequest[notification._id] ||
                                isRejectingRequest[notification._id]
                              }
                            >
                              {isApprovingRequest[notification._id]
                                ? "Activating..."
                                : "Activate"}
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              onClick={() => handleReject(notification)}
                              disabled={
                                isApprovingRequest[notification._id] ||
                                isRejectingRequest[notification._id]
                              }
                              title="Reject Request"
                            >
                              {isRejectingRequest[notification._id] ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 font-body1">No Requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* License Modal */}
      <LicenseModal />
    </div>
  );
};

export default Header;
