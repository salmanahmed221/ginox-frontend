import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import { SparklesCore } from "../../../components/ui/sparkles";
import { PencilLine, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { setTwoFAStatus } from "../../../store/authSlice";
import TelegramLoginButton from "react-telegram-login";
import { MdArrowBack } from "react-icons/md";
import GinoxDashboard from "../../../components/profile/identity-card";



// Countdown timer hook for support pin expiration
const useCountdownTimer = (expiresAt) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0 });
        // Force a re-render when timer expires to show expired state
        setForceUpdate((prev) => prev + 1);
        clearInterval(timer);
      } else {
        const minutes = Math.floor(difference / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return timeLeft;
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("cards");
  const [selectedCard, setSelectedCard] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    country: "",
    mobile: "",
    id_number: "",
    registrationDate: "",
    telegramId: "",
    bep20Wallet: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [epinFields, setEpinFields] = useState({
    currentEpin: "",
    epin: "",
    confEpin: "",
  });
  const [epinLoading, setEpinLoading] = useState(false);
  const [epinMessage, setEpinMessage] = useState("");
  const [epinError, setEpinError] = useState("");

  // 2FA setup state
  const [twoFactorData, setTwoFactorData] = useState({
    secret: "",
    otpauth_url: "",
  });
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [disable2FALoading, setDisable2FALoading] = useState(false);
  const [disable2FAMessage, setDisable2FAMessage] = useState("");
  const [disable2FAError, setDisable2FAError] = useState("");

  // 2FA reset state
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetTempToken, setResetTempToken] = useState("");
  const [resetVerificationCode, setResetVerificationCode] = useState("");

  // Login history state
  const [loginHistory, setLoginHistory] = useState([]);
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(false);
  const [loginHistoryError, setLoginHistoryError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 10;

  // Toast state
  const [copyToast, setCopyToast] = useState({ show: false, message: "" });

  // Support pin state
  const [supportPin, setSupportPin] = useState(null);
  const [supportPinLoading, setSupportPinLoading] = useState(false);
  const [supportPinError, setSupportPinError] = useState("");
  const [supportPinMessage, setSupportPinMessage] = useState("");
  const [generatingPin, setGeneratingPin] = useState(false);

  const { token, twoFAEnabled } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Use countdown timer at component level
  const supportPinTimeLeft = useCountdownTimer(supportPin?.expiresAt);

  // Check if support pin is expired
  const isSupportPinExpired =
    supportPin?.expiresAt &&
    new Date(supportPin.expiresAt).getTime() <= new Date().getTime();

  // Fetch user profile data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user/profile", {
        headers: { token },
      });

      if (response.data.success) {
        const data = response.data.data;
        setProfileData({
          name: data.name || "",
          surname: data.surname || "",
          username: data.username || "",
          email: data.email || "",
          country: data.userInfo?.country || "",
          mobile: data.userInfo?.mobile || "",
          id_number: data.userInfo?.id_number || "",
          registrationDate: new Date(
            data.createdAt || Date.now()
          ).toLocaleDateString(),
          telegramId: data?.telegramId || "",
          bep20Wallet: data.preferences?.withdraw_bfm_address || "",
        });
      }
    } catch (err) {
      setError("Failed to fetch profile data");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const updateData = {
        name: profileData.name,
        surname: profileData.surname,
        mobile: profileData.mobile,
        email: profileData.email,
        country: profileData.country,
        id_number: profileData.id_number,
        telegramId: profileData.telegramId,
      };

      const response = await axios.post("/profile/update_profile", updateData, {
        headers: { token },
      });

      if (response.data.success) {
        setMessage("Profile updated successfully!");
        // Refresh profile data
        await fetchProfileData();
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEpinChange = (field, value) => {
    setEpinFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleEpinUpdate = async () => {
    setEpinLoading(true);
    setEpinMessage("");
    setEpinError("");
    try {
      const response = await axios.post(
        "/user/profile/update-epin",
        {
          currentEpin: epinFields.currentEpin,
          epin: epinFields.epin,
          confEpin: epinFields.confEpin,
        },
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setEpinMessage(response.data.message || "E-Pin Updated successfully");
        setEpinFields({ currentEpin: "", epin: "", confEpin: "" });
        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setEpinMessage("");
        }, 3000);
      } else {
        setEpinError(response.data.message || "Failed to update E-Pin");
        // Auto hide error message after 3 seconds
        setTimeout(() => {
          setEpinError("");
        }, 3000);
      }
    } catch (err) {
      setEpinError(err.response?.data?.message || "Failed to update E-Pin");
      // Auto hide error message after 3 seconds
      setTimeout(() => {
        setEpinError("");
      }, 3000);
    } finally {
      setEpinLoading(false);
    }
  };

  // Fetch 2FA setup data
  const fetchTwoFactorSetup = async () => {
    try {
      setTwoFactorLoading(true);
      setTwoFactorError("");

      const response = await axios.get("/user/2fa/setup", {
        headers: { token },
      });

      if (response.data.success) {
        setTwoFactorData({
          secret: response.data.data.secret,
          otpauth_url: response.data.data.otpauth_url,
        });
      } else {
        setTwoFactorError(response.data.message || "Failed to fetch 2FA setup");
      }
    } catch (err) {
      setTwoFactorError(
        err.response?.data?.message || "Failed to fetch 2FA setup"
      );
      console.error("Error fetching 2FA setup:", err);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Validate 2FA code
  const validateTwoFactorCode = async () => {
    if (!authCode || authCode.length !== 6) {
      setValidationError("Please enter a valid 6-digit code");
      // Auto hide error after 2 seconds
      setTimeout(() => {
        setValidationError("");
      }, 2000);
      return;
    }

    try {
      setValidating(true);
      setValidationMessage("");
      setValidationError("");

      const response = await axios.post(
        "/user/2fa/verify",
        {
          tempSecret: twoFactorData.secret,
          token: authCode,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setValidationMessage("2FA setup completed successfully!");
        setAuthCode("");
        // Update 2FA status in store
        dispatch(setTwoFAStatus(true));
        // Refresh 2FA setup data
        await fetchTwoFactorSetup();
        // Auto hide success message after 2 seconds
        setTimeout(() => {
          setValidationMessage("");
        }, 2000);
      } else {
        setValidationError(
          response.data.message || "Invalid code. Please try again."
        );
        // Auto hide error after 2 seconds
        setTimeout(() => {
          setValidationError("");
        }, 2000);
      }
    } catch (err) {
      setValidationError(
        err.response?.data?.message || "Failed to validate code"
      );
      console.error("Error validating 2FA code:", err);
      // Auto hide error after 2 seconds
      setTimeout(() => {
        setValidationError("");
      }, 2000);
    } finally {
      setValidating(false);
    }
  };

  // Disable 2FA
  const disableTwoFactor = async () => {
    if (!authCode || authCode.length !== 6) {
      setDisable2FAError("Please enter a valid 6-digit code");
      setTimeout(() => {
        setDisable2FAError("");
      }, 2000);
      return;
    }

    try {
      setDisable2FALoading(true);
      setDisable2FAMessage("");
      setDisable2FAError("");

      const response = await axios.post(
        "/user/2fa/disable",
        {
          token: authCode,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setDisable2FAMessage("2FA disabled successfully!");
        setAuthCode("");
        // Update 2FA status in store
        dispatch(setTwoFAStatus(false));
        // Auto hide success message after 2 seconds
        setTimeout(() => {
          setDisable2FAMessage("");
        }, 2000);
      } else {
        setDisable2FAError(
          response.data.message || "Failed to disable 2FA. Please try again."
        );
        // Auto hide error after 2 seconds
        setTimeout(() => {
          setDisable2FAError("");
        }, 2000);
      }
    } catch (err) {
      setDisable2FAError(
        err.response?.data?.message || "Failed to disable 2FA"
      );
      console.error("Error disabling 2FA:", err);
      // Auto hide error after 2 seconds
      setTimeout(() => {
        setDisable2FAError("");
      }, 2000);
    } finally {
      setDisable2FALoading(false);
    }
  };

  // Send 2FA reset verification code
  const sendResetVerificationCode = async () => {
    try {
      setResetLoading(true);
      setResetError("");
      setResetMessage("");

      const response = await axios.post(
        "/user/2fa/send-verification-code",
        {},
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setResetTempToken(response.data.tempToken);
        setResetMessage(response.data.message || "Check your Email");
        setShowResetForm(true);
        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setResetMessage("");
        }, 3000);
      } else {
        setResetError(
          response.data.message || "Failed to send verification code"
        );
        // Auto hide error after 3 seconds
        setTimeout(() => {
          setResetError("");
        }, 3000);
      }
    } catch (err) {
      setResetError(
        err.response?.data?.message || "Failed to send verification code"
      );
      console.error("Error sending reset verification code:", err);
      // Auto hide error after 3 seconds
      setTimeout(() => {
        setResetError("");
      }, 3000);
    } finally {
      setResetLoading(false);
    }
  };

  // Reset 2FA
  const resetTwoFactor = async () => {
    if (!resetVerificationCode || resetVerificationCode.length !== 6) {
      setResetError("Please enter a valid 6-digit verification code");
      setTimeout(() => {
        setResetError("");
      }, 3000);
      return;
    }

    if (!resetTempToken) {
      setResetError("Invalid session. Please request a new verification code.");
      setTimeout(() => {
        setResetError("");
      }, 3000);
      return;
    }

    try {
      setResetLoading(true);
      setResetError("");
      setResetMessage("");

      const response = await axios.post(
        "https://apis.ginox.io/api/user/2fa/reset",
        {
          tempToken: resetTempToken,
          verificationCode: resetVerificationCode,
        },
        {
          headers: { token },
        }
      );

      if (response.status === 200) {
        setResetMessage("2FA reset successfully! You can now setup 2FA again.");
        setResetVerificationCode("");
        setResetTempToken("");
        setShowResetForm(false);
        // Update 2FA status in store to false
        dispatch(setTwoFAStatus(false));
        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setResetMessage("");
        }, 3000);
      } else {
        setResetError(
          response.data?.message || "Failed to reset 2FA. Please try again."
        );
        // Auto hide error after 3 seconds
        setTimeout(() => {
          setResetError("");
        }, 3000);
      }
    } catch (err) {
      setResetError(err.response?.data?.message || "Failed to reset 2FA");
      console.error("Error resetting 2FA:", err);
      // Auto hide error after 3 seconds
      setTimeout(() => {
        setResetError("");
      }, 3000);
    } finally {
      setResetLoading(false);
    }
  };

  // Handle reset verification code input change
  const handleResetCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setResetVerificationCode(value);
  };

  // Fetch support pin
  const fetchSupportPin = async () => {
    try {
      setSupportPinLoading(true);
      setSupportPinError("");
      setSupportPinMessage("");

      const response = await axios.get("/user/support/pin", {
        headers: { token },
      });

      if (response.data.success) {
        setSupportPin(response.data.data);
      } else {
        setSupportPin(null);
      }
    } catch (err) {
      setSupportPinError(
        err.response?.data?.message || "Failed to fetch support pin"
      );
      setSupportPin(null);
      console.error("Error fetching support pin:", err);
    } finally {
      setSupportPinLoading(false);
    }
  };

  // Generate support pin
  const generateSupportPin = async () => {
    try {
      setSupportPinError("");
      setSupportPinMessage("");

      const response = await axios.post(
        "/user/support/pin",
        {},
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        // Set the pin data directly without showing loader
        setSupportPin(response.data.data);
        setSupportPinMessage("Support pin generated successfully!");
        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setSupportPinMessage("");
        }, 3000);
      } else {
        setSupportPinError(
          response.data.message || "Failed to generate support pin"
        );
        // Auto hide error after 3 seconds
        setTimeout(() => {
          setSupportPinError("");
        }, 3000);
      }
    } catch (err) {
      setSupportPinError(
        err.response?.data?.message || "Failed to generate support pin"
      );
      console.error("Error generating support pin:", err);
      // Auto hide error after 3 seconds
      setTimeout(() => {
        setSupportPinError("");
      }, 3000);
    }
  };

  // Fetch login history
  const fetchLoginHistory = async (page = 1) => {
    try {
      setLoginHistoryLoading(true);
      setLoginHistoryError("");

      const response = await axios.get(
        `/user/login-history?page=${page}&pageSize=${pageSize}&order=desc`,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setLoginHistory(data.data || []);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
        setTotalRows(data.totalRows || 0);
      } else {
        setLoginHistoryError(
          response.data.message || "Failed to fetch login history"
        );
      }
    } catch (err) {
      setLoginHistoryError(
        err.response?.data?.message || "Failed to fetch login history"
      );
      console.error("Error fetching login history:", err);
    } finally {
      setLoginHistoryLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !loginHistoryLoading) {
      setCurrentPage(newPage);
      fetchLoginHistory(newPage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Format device info
  const getDeviceInfo = (deviceData) => {
    if (!deviceData) return "Unknown Device";

    try {
      // If it's already a string, handle it as before
      if (typeof deviceData === "string") {
        // Parse device string if it contains browser and OS info
        if (
          deviceData.includes("Mozilla") ||
          deviceData.includes("Chrome") ||
          deviceData.includes("Firefox")
        ) {
          // Extract browser name
          const browserMatch = deviceData.match(
            /(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/i
          );
          const browser = browserMatch ? browserMatch[1] : "Unknown Browser";

          // Extract OS info
          let os = "Unknown OS";
          if (deviceData.includes("Windows")) os = "Windows";
          else if (deviceData.includes("Mac")) os = "macOS";
          else if (deviceData.includes("Linux")) os = "Linux";
          else if (deviceData.includes("Android")) os = "Android";
          else if (deviceData.includes("iOS")) os = "iOS";

          return `${browser} on ${os}`;
        }

        return deviceData.length > 50
          ? deviceData.substring(0, 50) + "..."
          : deviceData;
      }

      // If it's an object (parsed device info)
      if (typeof deviceData === "object") {
        const browser = deviceData.browser?.name || "Unknown Browser";
        const os = deviceData.os?.name || "Unknown OS";

        // Handle case where browser or os might still be objects
        const browserName =
          typeof browser === "string"
            ? browser
            : browser?.name || "Unknown Browser";
        const osName = typeof os === "string" ? os : os?.name || "Unknown OS";

        return `${browserName} on ${osName}`;
      }

      return "Unknown Device";
    } catch (error) {
      console.error("Error parsing device info:", error);
      return "Unknown Device";
    }
  };

  // Generic copy to clipboard function with toast
  const handleCopy = async (text, successMessage = "Copied to clipboard!") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast({ show: true, message: successMessage });
      setTimeout(() => {
        setCopyToast({ show: false, message: "" });
      }, 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setCopyToast({ show: true, message: "Failed to copy" });
      setTimeout(() => {
        setCopyToast({ show: false, message: "" });
      }, 3000);
    }
  };

  // Copy secret to clipboard
  const copySecretToClipboard = async () => {
    await handleCopy(twoFactorData.secret, "Secret copied to clipboard!");
  };

  // Handle auth code input change
  const handleAuthCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setAuthCode(value);
  };

  // Function to handle tab changes and update URL
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/profile?tab=${tabName}`, { replace: true });
  };

  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  // Fetch 2FA setup data when Google Auth tab is active
  useEffect(() => {
    if (token && activeTab === "googleAuth") {
      fetchTwoFactorSetup();
    }
  }, [token, activeTab]);

  // Read URL parameters and set active tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get("tab");

    if (tabParam) {
      // Valid tab names that exist in the component
      const validTabs = [
        "profileInfo",
        "epin",
        "supportPin",
        "googleAuth",
        "connectTelegram",
        "updatePlacement",
        "lastLogins",
      ];

      if (validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [location.search]);

  // Fetch login history when lastLogins tab is active
  useEffect(() => {
    if (token && activeTab === "lastLogins") {
      fetchLoginHistory(1);
    }
  }, [token, activeTab]);

  // Fetch support pin when supportPin tab is active
  useEffect(() => {
    if (token && activeTab === "supportPin") {
      fetchSupportPin();
    }
  }, [token, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "profileInfo":
        return (
          <div className="w-full">
            {loading && (
              <div className="md:col-span-2 text-center font-body1 text-blue-500">
                Loading profile data...
              </div>
            )}

            {message && (
              <div className="md:col-span-2 font-body1 text-center text-green-500 text-sm font-semibold mb-4">
                {message}
              </div>
            )}

            {error && (
              <div className="md:col-span-2 font-body1 text-center text-red-500 text-sm font-semibold mb-4">
                {error}
              </div>
            )}

            <div className="w-full flex items-center justify-between ">
              <div className="flex  items-center space-x-3">
                <img
                  src="./profileavatar.svg"
                  alt="/"
                  className=" w-[40px] h-[40px]   md:h-[80px] md:w-[80px]"
                />
                <div className="flex flex-col space-y-2 md:space-y-4">
                  <p className="text-[18px] md:text-2xl font-header">
                    {profileData.name} {profileData.surname}
                  </p>
                  <p className=" text-[10px] md:text-sm font-body1">
                    {profileData.email}
                  </p>
                </div>
              </div>

              <button
                className="py-2 px-6 md:px-12  gap-1 flex font-body1 items-center justify-center rounded-full text-black font-semibold
               bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90
                transition-opacity disabled:opacity-50 "
              >
                <PencilLine className="text-black  fill-black" size={18} />
                Edit
              </button>
            </div>

            <div
              className="w-full h-px mt-4"
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.1) 9.17%, rgba(10, 196, 136, 0.1) 83.83%)",
              }}
            ></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8   ">
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  NAME
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={`${profileData.name} ${profileData.surname}`}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="acNumber"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  AC NUMBER
                </label>
                <input
                  type="text"
                  id="acNumber"
                  placeholder="AC Number"
                  value={profileData.username}
                  readOnly
                  className="px-4 py-3 font-body1 rounded-lg bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color opacity-60"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="country"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  COUNTRY
                </label>
                <input
                  type="text"
                  id="country"
                  placeholder="Country"
                  value={profileData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="passportId"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  PASSPORT / ID NUMBER
                </label>
                <input
                  type="text"
                  id="passportId"
                  placeholder="Passport / ID number"
                  value={profileData.id_number}
                  onChange={(e) =>
                    handleInputChange("id_number", e.target.value)
                  }
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="mobileNumber"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  MOBILE NUMBER
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  placeholder="Mobile Number"
                  value={profileData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="registrationDate"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  REGISTRATION DATE
                </label>
                <input
                  type="text"
                  id="registrationDate"
                  placeholder="Registration Date"
                  value={profileData.registrationDate}
                  readOnly
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color opacity-60"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="emailAddress"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  placeholder="Email Address"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>
              {profileData.telegramId ? (
                <div className="flex flex-col">
                  <label
                    htmlFor="telegramId"
                    className="text-sm sm:text-xl font-header text-white mb-4"
                  >
                    TELEGRAM ID
                  </label>
                  <input
                    type="text"
                    id="telegramId"
                    disabled={true}
                    placeholder="Telegram ID"
                    value={profileData.telegramId}
                    onChange={(e) =>
                      handleInputChange("telegramId", e.target.value)
                    }
                    className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                  />
                </div>
              ) : (
                <div className="flex flex-col mt-12">
                  <TelegramLoginButton
                    dataOnauth={async (user) => {
                      try {
                        const payload = {
                          userData: {
                            id: String(user.id),
                            first_name: user.first_name || "",
                            last_name: user.last_name || "",
                            username: user.username || "",
                            photo_url: user.photo_url || "",
                            auth_date: user.auth_date,
                            hash: user.hash,
                          },
                        };

                        const response = await axios.post(
                          "/user/connect-telegram",
                          payload,
                          { headers: { token } }
                        );

                        setCopyToast({
                          show: true,
                          message:
                            response?.data?.message ||
                            "Telegram connected successfully.",
                        });
                        setTimeout(() => {
                          setCopyToast({ show: false, message: "" });
                        }, 1800);

                        // Refresh profile to reflect Telegram link if provided by backend
                        fetchProfileData();
                      } catch (error) {
                        setCopyToast({
                          show: true,
                          message:
                            error?.response?.data?.message ||
                            "Failed to connect Telegram. Please try again.",
                        });
                        setTimeout(() => {
                          setCopyToast({ show: false, message: "" });
                        }, 1800);
                        console.error("Telegram connect error:", error);
                      }
                    }}
                    botName="ginox_auth_bot"
                    buttonSize="large"
                    usePic={true}
                    requestAccess="write"
                  />
                </div>
              )}

              <div className="flex flex-col">
                <label
                  htmlFor="bep20Wallet"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  BEP20 WALLET ADDRESS
                </label>
                <input
                  type="text"
                  id="bep20Wallet"
                  placeholder="BEP20 Wallet Address"
                  value={profileData.bep20Wallet}
                  onChange={(e) =>
                    handleInputChange("bep20Wallet", e.target.value)
                  }
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-4 my-4 ">
                <button
                  className="py-2 px-12 rounded-full text-white font-semibold font-body1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50"
                  onClick={updateProfile}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className="py-2 px-12 rounded-full font-body1 text-text_primary font-semibold border border-text_secondary hover:opacity-90 transition-opacity"
                  onClick={fetchProfileData}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      case "epin":
        return (
          <div className="  flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              {epinMessage && (
                <div className="md:col-span-2 text-center font-body1 text-green-500 text-sm font-semibold mb-4">
                  {epinMessage}
                </div>
              )}
              {epinError && (
                <div className="md:col-span-2 text-center font-body1 text-red-500 text-sm font-semibold mb-4">
                  {epinError}
                </div>
              )}

              {/* Info message box when current E-PIN field is empty */}
              {!epinFields.currentEpin && (
                <div className="md:col-span-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-blue-400 font-semibold font-header text-lg mb-1">
                          E-PIN Not Set
                        </h4>
                        <p className="text-blue-300/90 font-body1 text-xs">
                          You haven't set an E-PIN yet. Please leave the
                          "Current E-PIN" field empty and set your new E-PIN
                          below.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col">
                <label
                  htmlFor="currentEpin"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  CURRENT E-PIN
                </label>
                <input
                  type="password"
                  id="currentEpin"
                  placeholder="Current E-Pin"
                  value={epinFields.currentEpin}
                  onChange={(e) =>
                    handleEpinChange("currentEpin", e.target.value)
                  }
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="epin"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  NEW E-PIN
                </label>
                <input
                  type="password"
                  id="epin"
                  placeholder="New E-Pin"
                  value={epinFields.epin}
                  onChange={(e) => handleEpinChange("epin", e.target.value)}
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confEpin"
                  className="text-sm sm:text-xl font-header text-white mb-4"
                >
                  CONFIRM NEW E-PIN
                </label>
                <input
                  type="password"
                  id="confEpin"
                  placeholder="Confirm New E-Pin"
                  value={epinFields.confEpin}
                  onChange={(e) => handleEpinChange("confEpin", e.target.value)}
                  className="px-4 py-3 rounded-lg font-body1 bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                />
              </div>
            </div>

            {/* Buttons at bottom */}
            <div className="md:col-span-2 mt-auto pt-6 flex justify-end space-x-4">
              <button
                className="py-2 px-12 h-fit rounded-full font-body1 text-white font-semibold bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50"
                onClick={handleEpinUpdate}
                disabled={epinLoading}
              >
                {epinLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="py-2 px-12 h-fit rounded-full font-body1 text-text_primary font-semibold border border-text_secondary hover:opacity-90 transition-opacity"
                onClick={() =>
                  setEpinFields({ currentEpin: "", epin: "", confEpin: "" })
                }
                disabled={epinLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        );
      case "googleAuth":
        return (
          <div className="flex flex-col mb-4">
            {twoFAEnabled ? (
              // 2FA is enabled - show disable option
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-md sm:text-2xl font-semibold text-white font-header">
                    GOOGLE AUTHENTICATION
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-500 text-sm font-semibold font-body1">
                      Enabled
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text_secondary mb-8 font-body1">
                  Your Google Authentication is currently enabled. You can
                  disable it by entering your 6-digit code below, or reset it to
                  setup again.
                </p>

                <div className="bg-[#000000] border border-input_border rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="/assets/images/google-icon.png"
                      alt="Google"
                      className="w-6 h-6"
                    />
                    <span className="text-white font-semibold sm:text-lg font-header">
                      Google Authenticator
                    </span>
                  </div>
                  <p className="text-text_secondary text-sm mb-6 font-body1">
                    To disable Google Authentication, please enter the 6-digit
                    code from your authenticator app.
                  </p>

                  <label
                    htmlFor="authCode"
                    className="text-xs sm:text-lg font-header text-white mb-4 block"
                  >
                    ENTER THE 6-DIGIT CODE
                  </label>
                  <input
                    type="text"
                    id="authCode"
                    placeholder="Enter 6-digit code"
                    value={authCode}
                    onChange={handleAuthCodeChange}
                    className="w-full max-w-md px-4 py-3 font-body1 rounded-lg bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary tracking-widest focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color mb-4"
                  />

                  {disable2FAError && (
                    <div className="text-center text-red-500 text-sm font-semibold mb-4 font-body1">
                      {disable2FAError}
                    </div>
                  )}
                  {disable2FAMessage && (
                    <div className="text-center text-green-500 text-sm font-semibold mb-4 font-body1">
                      {disable2FAMessage}
                    </div>
                  )}

                  <button
                    className="py-3 px-8 rounded-full font-body1 text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                    onClick={disableTwoFactor}
                    disabled={disable2FALoading || authCode.length !== 6}
                  >
                    {disable2FALoading ? "Disabling..." : "Disable 2FA"}
                  </button>
                </div>

                {/* Reset 2FA Section */}
                <div className="bg-[#000000] border border-input_border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="/assets/images/google-icon.png"
                      alt="Google"
                      className="w-6 h-6"
                    />
                    <span className="text-white font-semibold font-header sm:text-lg">
                      Reset Google Authenticator
                    </span>
                  </div>
                  <p className="text-text_secondary text-sm mb-6 font-body1">
                    Lost access to your authenticator app? Reset your 2FA to
                    setup again. A verification code will be sent to your email.
                  </p>

                  {!showResetForm ? (
                    // Show reset button
                    <div>
                      {resetMessage && (
                        <div className="text-center text-green-500 text-sm font-semibold mb-4 font-body1">
                          {resetMessage}
                        </div>
                      )}
                      {resetError && (
                        <div className="text-center text-red-500 text-sm font-semibold mb-4 font-body1">
                          {resetError}
                        </div>
                      )}

                      <button
                        className="py-3 px-8 rounded-full text-white font-semibold font-body1 bg-orange-600 hover:bg-orange-700 transition-colors disabled:opacity-50"
                        onClick={sendResetVerificationCode}
                        disabled={resetLoading}
                      >
                        {resetLoading ? "Sending..." : "Reset 2FA"}
                      </button>
                    </div>
                  ) : (
                    // Show verification form
                    <div>
                      <label
                        htmlFor="resetCode"
                        className="text-xs sm:text-lg font-header text-white mb-4 block"
                      >
                        ENTER VERIFICATION CODE FROM EMAIL
                      </label>
                      <input
                        type="text"
                        id="resetCode"
                        placeholder="Enter 6-digit code"
                        value={resetVerificationCode}
                        onChange={handleResetCodeChange}
                        className="w-full max-w-md px-4 py-3 rounded-lg bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary tracking-widest focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color mb-4"
                      />

                      {resetError && (
                        <div className="text-center text-red-500 text-sm font-semibold mb-4 font-body1">
                          {resetError}
                        </div>
                      )}
                      {resetMessage && (
                        <div className="text-center text-green-500 text-sm font-semibold mb-4 font-body1">
                          {resetMessage}
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button
                          className="py-3 px-8 rounded-full font-body1 text-white font-semibold bg-orange-600 hover:bg-orange-700 transition-colors disabled:opacity-50"
                          onClick={resetTwoFactor}
                          disabled={
                            resetLoading || resetVerificationCode.length !== 6
                          }
                        >
                          {resetLoading ? "Resetting..." : "Confirm Reset"}
                        </button>
                        <button
                          className="py-3 px-8 rounded-full font-body1 text-text_primary font-semibold border border-text_secondary hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setShowResetForm(false);
                            setResetVerificationCode("");
                            setResetTempToken("");
                            setResetError("");
                            setResetMessage("");
                          }}
                          disabled={resetLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // 2FA is disabled - show setup option
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-md sm:text-2xl font-semibold text-white font-header">
                    SET UP USING AN AUTHENTICATOR APP
                  </h2>
                  <button
                    onClick={fetchTwoFactorSetup}
                    disabled={twoFactorLoading}
                    className="py-2 px-4 rounded-full font-body1 text-white font-semibold bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    {twoFactorLoading ? "Loading..." : "Refresh"}
                  </button>
                </div>
                <p className="text-sm text-text_secondary mb-8 font-body1">
                  Use an authenticator app to get the authentication codes.
                </p>

                {twoFactorLoading && (
                  <div className="text-center font-body1 text-blue-500 mb-8">
                    Loading 2FA setup...
                  </div>
                )}

                {twoFactorError && (
                  <div className="text-center font-body1 text-red-500 mb-8">
                    {twoFactorError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <div className="order-2 md:order-1">
                    <p className="mt-2 text-xs sm:text-lg text-white font-header mb-4">
                      ENTER THIS TEXT INSTEAD
                    </p>
                    <div className="relative w-full max-w-full mb-6">
                      <input
                        type="text"
                        value={twoFactorData.secret}
                        readOnly
                        className="w-full sm:w-[122%] px-4 font-body1 py-3 rounded-lg bg-[#000000] border border-input_border text-text_primary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color pr-10"
                      />
                      <img
                        src="/assets/images/copy-icon.png"
                        alt="Copy"
                        className="absolute right-[10px] sm:right-[-90px] top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                        onClick={copySecretToClipboard}
                      />
                    </div>
                    <label
                      htmlFor="authCode"
                      className="text-xs sm:text-lg font-header text-white mb-4 block"
                    >
                      ENTER THE 6-DIGITS CODE
                    </label>
                    <input
                      type="text"
                      id="authCode"
                      placeholder="Enter 6-digit code"
                      value={authCode}
                      onChange={handleAuthCodeChange}
                      className="w-full max-w-md px-4 font-body1 py-3 rounded-lg bg-[#000000] border border-input_border text-text_primary placeholder-text_secondary tracking-widest focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color mb-6"
                    />
                    {validationError && (
                      <div className="md:col-span-2 font-body1 text-red-500 text-sm font-semibold mb-4">
                        {validationError}
                      </div>
                    )}
                    {validationMessage && (
                      <div className="md:col-span-2 font-body1 text-green-500 text-sm font-semibold mb-4">
                        {validationMessage}
                      </div>
                    )}
                    {/* <div
                      className="w-full flex flex-col h-px my-3"
                      style={{ background: "#FFFFFF1A" }}
                    ></div> */}
                    <button
                      className="py-3 px-12 mt-2 rounded-full font-body1 text-white font-semibold bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity"
                      onClick={validateTwoFactorCode}
                      disabled={validating}
                    >
                      {validating ? "Validating..." : "Validate"}
                    </button>
                  </div>
                  <div className="order-1 md:order-2 flex justify-center md:justify-end">
                    {twoFactorData.otpauth_url ? (
                      <div className="w-[449px] h-48 bg-transparent flex items-center justify-center mb-8 md:mb-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                            twoFactorData.otpauth_url
                          )}`}
                          alt="QR Code for 2FA Setup"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      !twoFactorLoading &&
                      !twoFactorError && (
                        <div className="w-[449px] h-48 bg-transparent flex items-center justify-center mb-8 md:mb-0">
                          <div className="text-text_secondary">
                            No QR code available
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "connectTelegram":
        return (
          <div className="flex flex-col items-center   ">
            <div
              className="w-full flex flex-col md:flex-row px-5 py-7 rounded-3xl"
              style={{
                justifyContent: "space-between",
                background:
                  " linear-gradient(180deg, #05172C 0%, #000000 100%)",
              }}
            >
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-2xl font-header text-white  mb-4">
                  {profileData.telegramId ? (
                    <>
                      TELEGRAM ACCOUNT{" "}
                      <span className="text-green-600 font-header text-lg sm:text-3xl">
                        CONNECTED
                      </span>
                    </>
                  ) : (
                    "VERIFY YOUR TELEGRAM ACCOUNT"
                  )}
                </h2>
                <p className="text-sm text-text_secondary mb-8 font-body1  ">
                  {profileData.telegramId
                    ? "Your Telegram account is connected. You can disconnect it if needed."
                    : "Verify your Telegram account to enhance your profile security."}
                </p>
              </div>
              {profileData.telegramId ? (
                <button
                  className="py-2 px-4 sm:py-0 sm:px-2 rounded-full text-white font-semibold font-body1 bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={async () => {
                    try {
                      const response = await axios.post(
                        "/user/disconnect-telegram",
                        {},
                        { headers: { token } }
                      );

                      setCopyToast({
                        show: true,
                        message:
                          response?.data?.message ||
                          "Telegram disconnected successfully.",
                      });
                      setTimeout(() => {
                        setCopyToast({ show: false, message: "" });
                      }, 1800);

                      // Refresh profile to reflect changes
                      fetchProfileData();
                    } catch (error) {
                      setCopyToast({
                        show: true,
                        message:
                          error?.response?.data?.message ||
                          "Failed to disconnect Telegram. Please try again.",
                      });
                      setTimeout(() => {
                        setCopyToast({ show: false, message: "" });
                      }, 1800);
                      console.error("Telegram disconnect error:", error);
                    }
                  }}
                >
                  Disconnect Telegram
                </button>
              ) : (
                <TelegramLoginButton
                  dataOnauth={async (user) => {
                    try {
                      const payload = {
                        userData: {
                          id: String(user.id),
                          first_name: user.first_name || "",
                          last_name: user.last_name || "",
                          username: user.username || "",
                          photo_url: user.photo_url || "",
                          auth_date: user.auth_date,
                          hash: user.hash,
                        },
                      };

                      const response = await axios.post(
                        "/user/connect-telegram",
                        payload,
                        { headers: { token } }
                      );

                      setCopyToast({
                        show: true,
                        message:
                          response?.data?.message ||
                          "Telegram connected successfully.",
                      });
                      setTimeout(() => {
                        setCopyToast({ show: false, message: "" });
                      }, 1800);

                      // Refresh profile to reflect Telegram link if provided by backend
                      fetchProfileData();
                    } catch (error) {
                      setCopyToast({
                        show: true,
                        message:
                          error?.response?.data?.message ||
                          "Failed to connect Telegram. Please try again.",
                      });
                      setTimeout(() => {
                        setCopyToast({ show: false, message: "" });
                      }, 1800);
                      console.error("Telegram connect error:", error);
                    }
                  }}
                  botName="ginox_auth_bot"
                  buttonSize="large"
                  usePic={true}
                  requestAccess="write"
                />
              )}
            </div>
            <div className="w-full h-64 bg-transparent flex items-center justify-center">
              <img
                className="w-80"
                src="/assets/images/connect-tel.png"
                alt=""
              />
            </div>
          </div>
        );
      case "lastLogins":
        return (
          <div className="flex flex-col">
            <h2 className="text-md sm:text-2xl font-semibold text-white font-header mb-4">
              LAST LOGIN ACTIVITIES
            </h2>
            <p className="text-sm text-text_secondary mb-8 font-body1 ">
              View your recent login activities and security events.
            </p>

            {!loginHistoryLoading && loginHistory.length > 0 && (
              <div className="mb-4 text-sm text-text_secondary font-body1">
                Showing {loginHistory.length} of {totalRows} login records
              </div>
            )}

            <div className="bg-[#000000] border border-input_border rounded-lg p-3 md:p-6">
              <div className="flex justify-between gap-4 text-[8px] text-center md:text-sm font-header text-white/70 mb-4 pb-2 border-b border-white/10">
                <div>DATE & TIME</div>
                <div>DEVICE / BROWSER</div>
                <div>IP ADDRESS</div>
              </div>

              {loginHistoryLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              ) : loginHistoryError ? (
                <div className="text-center text-red-500 text-sm font-semibold font-body1 py-8">
                  {loginHistoryError}
                </div>
              ) : loginHistory.length === 0 ? (
                <div className="text-center text-text_secondary font-body1 py-8">
                  No login history available.
                </div>
              ) : (
                <div className="space-y-4">
                  {loginHistory.map((login, index) => (
                    <div
                      key={index}
                      className="flex justify-between gap-4 text-sm text-white py-3 border-b border-white/5 font-body1"
                    >
                      <div>{formatDate(login.createdAt)}</div>
                      <div>{getDeviceInfo(login.device)}</div>
                      <div>{login.ip}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 text-xs text-text_secondary font-body1">
              * Last 10 login activities are shown. For complete history,
              contact support.
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loginHistoryLoading}
                  className="py-2 px-4 rounded-full text-white font-body1 font-semibold bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {loginHistoryLoading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <span className="text-white font-body1 font-semibold">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loginHistoryLoading}
                  className="py-2 px-4 rounded-full font-body1 text-white font-semibold bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      case "supportPin":
        return (
          <div className="flex flex-col">
            <h2 className="text-md sm:text-2xl font-semibold text-white font-header mb-4">
              SUPPORT PIN
            </h2>
            <p className="text-sm text-text_secondary mb-8 font-body1">
              Generate a temporary support pin for customer support assistance.
            </p>

            {supportPinMessage && (
              <div className="text-center text-green-500 text-sm font-semibold mb-4 font-body1">
                {supportPinMessage}
              </div>
            )}
            {supportPinError && (
              <div className="text-center text-red-500 text-sm font-semibold mb-4 font-body1">
                {supportPinError}
              </div>
            )}

            {supportPinLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : supportPin &&
              supportPin.pin &&
              !supportPin.isUsed &&
              !isSupportPinExpired ? (
              // Show existing pin with countdown - Compact UI
              <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-4">
                {/* Header with animated line */}
                <div className="w-full">
                  <div className="w-16 h-1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full mx-auto mb-3 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white font-header tracking-wider mb-1">
                    ACTIVE SUPPORT PIN
                  </h3>
                  <div className="text-xs text-white/70 font-body1">
                    Share this pin with our support team
                  </div>
                </div>

                {/* PIN Display - Compact */}
                <div className="w-full">
                  <div
                    className="relative mx-auto p-6 rounded-xl backdrop-blur-lg border-2 shadow-xl transform hover:scale-105 transition-transform duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(51, 160, 234, 0.2) 0%, rgba(10, 196, 136, 0.2) 100%)",
                      borderImage:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%) 1",
                      border: "2px solid",
                      borderImageSource:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                    }}
                  >
                    {/* Animated background glow */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-btn_gradient_start/5 to-btn_gradient_end/5 animate-pulse" />

                    {/* PIN Number - Smaller */}
                    <div className="relative z-10 text-3xl md:text-4xl font-mono font-black tracking-[0.3em] text-white drop-shadow-xl">
                      {supportPin.pin}
                    </div>

                    {/* Floating particles effect */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full opacity-60 animate-bounce" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full opacity-40 animate-pulse" />
                    <div className="absolute top-3 left-3 w-1 h-1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full opacity-50 animate-ping" />
                  </div>
                </div>

                {/* Countdown Timer - Compact */}
                <div className="w-full">
                  <div className="text-xs text-white/80 font-body1 mb-2 uppercase tracking-wider font-semibold">
                    ⏰ Expires in
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <div
                        className="px-4 py-3 rounded-lg border-2"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(51, 160, 234, 0.1) 0%, rgba(10, 196, 136, 0.1) 100%)",
                          border: "2px solid rgba(51, 160, 234, 0.3)",
                        }}
                      >
                        <div className="text-2xl font-bold text-white font-mono">
                          {supportPinTimeLeft.minutes}
                        </div>
                        <div className="text-xs text-white/70 font-body1 mt-1 font-semibold">
                          MIN
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full animate-pulse" />
                    </div>

                    <div className="text-white/60 text-2xl font-bold animate-pulse">
                      :
                    </div>

                    <div className="relative">
                      <div
                        className="px-4 py-3 rounded-lg border-2"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(51, 160, 234, 0.1) 0%, rgba(10, 196, 136, 0.1) 100%)",
                          border: "2px solid rgba(10, 196, 136, 0.3)",
                        }}
                      >
                        <div className="text-2xl font-bold text-white font-mono">
                          {supportPinTimeLeft.seconds
                            .toString()
                            .padStart(2, "0")}
                        </div>
                        <div className="text-xs text-white/70 font-body1 mt-1 font-semibold">
                          SEC
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Compact */}
                <div className="w-full flex flex-col gap-2">
                  <button
                    className="group relative w-full px-6 py-3 rounded-full font-bold font-body1 text-white overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl transform"
                    style={{
                      background:
                        "linear-gradient(135deg, #33A0EA 0%, #0AC488 100%)",
                      boxShadow: "0 8px 25px rgba(51, 160, 234, 0.3)",
                    }}
                    onClick={() =>
                      handleCopy(
                        supportPin.pin,
                        "Support pin copied to clipboard!"
                      )
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-base font-body1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy PIN
                    </span>
                  </button>

                  <button
                    className="group w-full px-6 py-3 rounded-full font-semibold font-body1 text-white/90 border-2 border-white/30 hover:border-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 disabled:opacity-50 transform"
                    onClick={generateSupportPin}
                    disabled={generatingPin}
                  >
                    <span className="flex items-center justify-center gap-2 text-sm font-body1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Generate New
                    </span>
                  </button>
                </div>
              </div>
            ) : isSupportPinExpired ? (
              // Show expired pin message
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto h-full justify-center">
                <div className="relative w-full">
                  {/* Expired Pin Container */}
                  <div
                    className="relative rounded-2xl p-8 backdrop-blur-sm border-2 shadow-2xl overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(51, 160, 234, 0.15) 0%, rgba(10, 196, 136, 0.15) 100%)",
                      border: "2px solid",
                      borderImageSource:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                      borderImage:
                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%) 1",
                    }}
                  >
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="mb-8">
                        <div className="w-16 h-1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-white font-header tracking-wide">
                          SUPPORT PIN EXPIRED
                        </h3>
                      </div>

                      {/* Expired Message */}
                      <div className="mb-8">
                        <div className="text-[#33A0EA] text-lg mb-4 font-body1">
                          Your support pin has expired for security reasons.
                        </div>
                        <div className="text-white/70 text-sm font-body1 max-w-md mx-auto">
                          Please generate a new support pin to share with our
                          support team.
                        </div>
                      </div>

                      {/* Generate New Button */}
                      <button
                        className="py-2 px-4 sm:py-4 sm:px-6 rounded-full text-white font-semibold font-body1 text-lg bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50"
                        onClick={generateSupportPin}
                        disabled={generatingPin}
                      >
                        {generatingPin ? "Generating..." : "Generate New Pin"}
                      </button>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full opacity-60" />
                    <div className="absolute bottom-3 left-3 w-1 h-1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full opacity-40" />
                  </div>
                </div>
              </div>
            ) : (
              // Show generate button when no pin exists
              <div className="flex flex-col items-center text-center">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-white font-header mb-4">
                    Support Pin Generator
                  </h3>
                  <p className="text-sm text-text_secondary font-body1 max-w-md">
                    Create a secure temporary PIN to share with our support team
                    for account assistance. This PIN will expire automatically
                    for your security.
                  </p>
                </div>

                <button
                  className="py-4 px-12 rounded-full text-white font-semibold font-body1 text-lg bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50"
                  onClick={generateSupportPin}
                  disabled={generatingPin}
                >
                  Generate Support Pin
                </button>
              </div>
            )}
          </div>
        );
      case "updatePlacement":
        return (
          <div className="flex flex-col items-center    ">
            <h2 className=" text-white font-header text-xl">
              No Data Available
            </h2>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#010510] flex flex-col items-center justify-center  h-screen w-full      relative ">
      {/* Toast Notification */}
      {copyToast.show && (
        <div
          className="fixed top-4 right-4 z-[9999] bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 animate-pulse cursor-pointer"
          onClick={() => setCopyToast({ show: false, message: "" })}
        >
          <div className="flex items-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">{copyToast.message}</span>
          </div>
        </div>
      )}
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
          <div className="   px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header
              title={
                activeTab === "cards"
                  ? "PROFILE"
                  : selectedCard
                  ? selectedCard.title.toUpperCase()
                  : "PROFILE"
              }
            />

            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />

            <div className="relative   w-full element">
              {activeTab === "cards" && (
                <GinoxDashboard />
              
              )}

              {activeTab !== "cards" && (
                // Detail View with Back Button
                <div className="w-full">
                  {/* Back Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => {
                        setActiveTab("cards");
                        setSelectedCard(null);
                      }}
                      className="flex items-center gap-1 mb-5"
                    >
                      <MdArrowBack size={20} />
                      <div>Back</div>
                    </button>
                  </div>
                  
                  {/* Content Area */}
                  <div
                    className={`relative w-full element ${
                      activeTab === "supportPin"
                        ? "overflow-hidden"
                        : "overflow-y-auto"
                    }`}
                  >
                    {renderTabContent()}
                  </div>
                </div>
              )}
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

export default Profile;
