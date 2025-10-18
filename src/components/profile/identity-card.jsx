import React, { useState, useEffect } from "react";
import { Copy, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../api/axiosConfig";
import { setTwoFAStatus } from "../../store/authSlice";
import TelegramLoginButton from "react-telegram-login";
import { FaUserAlt, FaLock, FaKey, FaTelegram } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

export default function GinoxDashboard() {
  const [activeSection, setActiveSection] = useState("item-1");
  const [copyToast, setCopyToast] = useState({ show: false, message: "" });
  const [supportPinToast, setSupportPinToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Function to handle section change
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const showSupportPinToast = (message, type) => {
    setSupportPinToast({ show: true, message, type });
    setTimeout(() => {
      setSupportPinToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [username, setUsername] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  // ePin state
  const [epinFields, setEpinFields] = useState({
    currentEpin: "",
    epin: "",
    confEpin: "",
  });
  const [epinLoading, setEpinLoading] = useState(false);
  const [epinMessage, setEpinMessage] = useState("");
  const [epinError, setEpinError] = useState("");

  // Support pin state
  const [supportPin, setSupportPin] = useState(null);
  const [supportPinLoading, setSupportPinLoading] = useState(false);
  const [supportPinError, setSupportPinError] = useState("");
  const [supportPinMessage, setSupportPinMessage] = useState("");
  const [generatingPin, setGeneratingPin] = useState(false);

  // Derivations for support pin timer
  const supportPinTimeLeft = useCountdownTimer(supportPin?.expiresAt);
  const isSupportPinExpired =
    supportPin &&
    supportPin.expiresAt && // Ensure expiresAt exists
    new Date(supportPin.expiresAt).getTime() <= new Date().getTime(); // Check if expiresAt is in the past

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
  const [error, setError] = useState("");

  // 2FA setup state
  const [twoFactorData, setTwoFactorData] = useState({
    secret: "",
    otpauth_url: "",
  });
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [resetTempToken, setResetTempToken] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [disable2FALoading, setDisable2FALoading] = useState(false);
  const [disable2FAMessage, setDisable2FAMessage] = useState("");
  const [disable2FAError, setDisable2FAError] = useState("");

  // Login history state
  const [loginHistory, setLoginHistory] = useState([]);
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(false);
  const [loginHistoryError, setLoginHistoryError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 10;

  // 2FA reset state
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetVerificationCode, setResetVerificationCode] = useState("");
  const [showPin, setShowPin] = useState(true);

  const { token, twoFAEnabled } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

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
        dispatch(setTwoFAStatus(true));
        await fetchTwoFactorSetup();
        setTimeout(() => {
          setValidationMessage("");
        }, 2000);
      } else {
        setValidationError(
          response.data.message || "Invalid code. Please try again."
        );
        setTimeout(() => {
          setValidationError("");
        }, 2000);
      }
    } catch (err) {
      setValidationError(
        err.response?.data?.message || "Failed to validate code"
      );
      console.error("Error validating 2FA code:", err);
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
        dispatch(setTwoFAStatus(false));
        setTwoFactorData({ secret: "", otpauth_url: "" }); // Clear 2FA data
        setTimeout(() => {
          setDisable2FAMessage("");
        }, 2000);
      } else {
        setDisable2FAError(
          response.data.message || "Failed to disable 2FA. Invalid code."
        );
        setTimeout(() => {
          setDisable2FAError("");
        }, 2000);
      }
    } catch (err) {
      setDisable2FAError(
        err.response?.data?.message || "Failed to disable 2FA"
      );
      console.error("Error disabling 2FA:", err);
      setTimeout(() => {
        setDisable2FAError("");
      }, 2000);
    } finally {
      setDisable2FALoading(false);
    }
  };

  const handleResetCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setResetVerificationCode(value);
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
        "/user/2fa/reset",
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

  useEffect(() => {
    fetchProfileData();
    fetchTwoFactorSetup();
    fetchSupportPin(); // Add this line to fetch support pin on mount
  }, [token, twoFAEnabled]);

  // Fetch support pin
  const fetchSupportPin = async () => {
    try {
      setSupportPinLoading(true);

      const response = await axios.get("/user/support/pin", {
        headers: { token },
      });

      if (response.data.success) {
        setSupportPin(response.data.data);
      } else {
        setSupportPin(null);
      }
    } catch (err) {
      showSupportPinToast(
        err.response?.data?.message || "Failed to fetch support pin",
        "error"
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
        showSupportPinToast("Support pin generated successfully!", "success");
        // Auto hide success message after 3 seconds
        setTimeout(() => {}, 3000);
      } else {
        showSupportPinToast(
          response.data.message || "Failed to generate support pin",
          "error"
        );
        // Auto hide error after 3 seconds
        setTimeout(() => {}, 3000);
      }
    } catch (err) {
      showSupportPinToast(
        error.response?.data?.message || "Failed to generate support pin.",
        "error"
      );
      console.error("Error generating support pin:", err);
      // Auto hide error after 3 seconds
      setTimeout(() => {}, 3000);
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

  useEffect(() => {
    if (token) {
      fetchLoginHistory(1);
    }
  }, [token]);

  return (
    <div className=" md:p-3 rounded-lg">
      {/* Toast Notification */}
      {copyToast.show && (
        <div className="fixed top-4 right-4 z-[9999] bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 animate-pulse">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <p className="font-body1">{copyToast.message}</p>
          </div>
        </div>
      )}

      {/* Support Pin Toast Notification */}
      {supportPinToast.show && (
        <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg border-l-4 max-w-md ${
              supportPinToast.type === "success"
                ? "bg-[#0AC48830] border-[#0AC488] text-[#0AC488]"
                : "bg-[#FF6B6B30] border-[#FF6B6B] text-[#FF6B6B]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {supportPinToast.type === "success" ? (
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
                ) : (
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                <p className="font-medium">{supportPinToast.message}</p>
              </div>
              <button
                onClick={() =>
                  setSupportPinToast({
                    show: false,
                    message: "",
                    type: "success",
                  })
                }
                className="ml-4 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" md:flex  h-full justify-between gap-3">
        <div className="md:flex md:flex-col md:gap-6   h-full">
          {/* Mobile Circle Icons */}
          <div className="w-full md:hidden flex justify-between items-center mb-4  py-2 px-1">
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                activeSection === "item-1"
                  ? "border-[#0AC488]"
                  : "border-white/10"
              } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
              onClick={() => handleSectionChange("item-1")}
            >
              <div className="text-lg ">
                <FaUserAlt />
              </div>
              {/* <div className="text-[6px] text-white mt-1">Profile</div> */}
            </div>
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                activeSection === "item-2"
                  ? "border-[#0AC488]"
                  : "border-white/10"
              } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
              onClick={() => handleSectionChange("item-2")}
            >
              <div className="text-lg ">
                <FiLogIn />
              </div>
              {/* <div className="text-[6px] text-white mt-1">Login</div> */}
            </div>
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                activeSection === "item-3"
                  ? "border-[#0AC488]"
                  : "border-white/10"
              } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
              onClick={() => handleSectionChange("item-3")}
            >
              <div className="text-lg ">
                <FaLock />
              </div>
              {/* <div className="text-[6px] text-white mt-1">Security</div> */}
            </div>
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                activeSection === "item-4"
                  ? "border-[#0AC488]"
                  : "border-white/10"
              } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
              onClick={() => handleSectionChange("item-4")}
            >
              <div className="text-lg ">
                <BiSupport />
              </div>
              {/* <div className="text-[6px] text-white mt-1">Support</div> */}
            </div>
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                activeSection === "item-5"
                  ? "border-[#0AC488]"
                  : "border-white/10"
              } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
              onClick={() => handleSectionChange("item-5")}
            >
              <div className="text-lg ">
                <FaKey />
              </div>
              {/* <div className="text-[6px] text-white mt-1">2FA</div> */}
            </div>
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                activeSection === "item-6"
                  ? "border-[#0AC488]"
                  : "border-white/10"
              } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
              onClick={() => handleSectionChange("item-6")}
            >
              <div className="text-lg ">
                <FaTelegram />
              </div>
              {/* <div className="text-[6px] text-white mt-1">Telegram</div> */}
            </div>
          </div>

          {/* Mobile View ID Cards */}
          <Accordion
            type="single"
            collapsible
            className="w-full md:hidden block "
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
                Profile
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3      overflow-y-auto transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                  {/* Header */}

                  <p className="bg-green-700  w-fit absolute top-5 right-4 text-green-200 text-[8px] px-2 font-header  rounded-full">
                    ACTIVE
                  </p>

                  {/* <div className="text-xs text-gray-300 mb-4">VERIFIED MEMBER</div> */}

                  {/* Profile Section */}
                  <div className="flex items-center gap-1">
                    <div className="w-7 h-7 bg-orange-500 rounded-xl flex items-center justify-center text-xl lg:text-xs font-bold">
                      G
                    </div>
                    <div>
                      <h2 className="font-bold font-header">
                        {profileData?.name && profileData?.surname
                          ? `${profileData.name} ${profileData.surname}`
                          : "NOT CONNECTED"}
                      </h2>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3  text-xs lg:text-sm mt-6">
                    <div>
                      <div className="flex items-center gap-1  text-gray-300">
                        <span>🌍</span>
                        <span className="font-body1">COUNTRY</span>
                      </div>
                      <div className="font-body1 text-[11px]">
                        {profileData.country || "NOT PROVIDED"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1  text-gray-300">
                        <span>📄</span>
                        <span className="font-body1">PASSPORT/ID</span>
                      </div>
                      <div className="font-body1 text-[11px]">
                        {profileData.id_number || "NOT PROVIDED"}
                      </div>
                      {/* <div className="font-body1">
                    {profileData.id_number ? "" : "PROVIDED"}
                  </div> */}
                    </div>
                    <div>
                      <div className="flex items-center gap-1  text-gray-300">
                        <span>📱</span>
                        <span className="font-body1">MOBILE</span>
                      </div>
                      <div className="font-body1 text-[11px]">
                        {profileData.mobile || "NOT PROVIDED"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1  text-gray-300">
                        <span>👤</span>
                        <span className="font-body1">MEMBER SINCE</span>
                      </div>
                      {/* <div className="font-body1">SINCE</div> */}
                      <div className="font-body1 text-[11px]">
                        {profileData.registrationDate}
                      </div>
                    </div>
                    {/* Contact Info */}
                    <div>
                      <div className="flex items-center gap-1  text-gray-300">
                        <span>📧</span>
                        <span className="font-body1">EMAIL</span>
                      </div>
                      <div className="text-[11px]  mb-3 lg:mb-4 break-all font-body1">
                        {profileData.email || "NOT CONNECTED"}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1  text-gray-300">
                        <span>📱</span>
                        <span className="font-body1">TELEGRAM</span>
                      </div>
                      <div className="text-[11px]  font-body1">
                        {profileData.telegramId
                          ? profileData.telegramId
                          : "NOT CONNECTED"}
                      </div>
                    </div>
                    {/* <div className="border-t border-gray-600 "></div> */}
                  </div>

                  {/* Bottom Info */}
                  <div className="flex justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className=" text-[11px] font-body1">
                        SECURITY VERIFIED
                      </span>
                    </div>

                    <div className=" text-[11px] text-yellow-400">
                      ID: {profileData.username || "NA"}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/*Desktop View ID Cards */}
          <div className="md:block hidden  w-[430px]  relative  h-[220px]  bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3   transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
            {/* Header */}

            <p className="bg-green-700  w-fit absolute right-4 text-green-200 text-[7px] p-1 font-header  rounded-full">
              ACTIVE
            </p>

            {/* <div className="text-xs text-gray-300 mb-4">VERIFIED MEMBER</div> */}

            {/* Profile Section */}
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-500 rounded-xl flex items-center justify-center text-xl lg:text-xs font-bold">
                G
              </div>
              <div>
                <h2 className="text-xs font-bold font-header">
                  {profileData?.name && profileData?.surname
                    ? `${profileData.name} ${profileData.surname}`
                    : "NOT CONNECTED"}
                </h2>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-1.5  text-xs lg:text-sm mt-3">
              <div>
                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                  <span>🌍</span>
                  <span className="font-body1">COUNTRY</span>
                </div>
                <div className="font-body1 text-[10px]">
                  {profileData.country || "NOT PROVIDED"}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                  <span>📄</span>
                  <span className="font-body1">PASSPORT/ID</span>
                </div>
                <div className="font-body1 text-[10px]">
                  {profileData.id_number || "NOT PROVIDED"}
                </div>
                {/* <div className="font-body1">
                    {profileData.id_number ? "" : "PROVIDED"}
                  </div> */}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                  <span>📱</span>
                  <span className="font-body1">MOBILE</span>
                </div>
                <div className="font-body1 text-[10px]">
                  {profileData.mobile || "NOT PROVIDED"}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                  <span>👤</span>
                  <span className="font-body1">MEMBER SINCE</span>
                </div>
                {/* <div className="font-body1">SINCE</div> */}
                <div className="font-body1 text-[10px]">
                  {profileData.registrationDate}
                </div>
              </div>
              {/* Contact Info */}
              <div>
                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                  <span>📧</span>
                  <span className="font-body1">EMAIL</span>
                </div>
                <div className="text-[9px]  mb-3 lg:mb-4 break-all font-body1">
                  {profileData.email || "NOT CONNECTED"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                  <span>📱</span>
                  <span className="font-body1">TELEGRAM</span>
                </div>
                <div className="text-[10px]  font-body1">
                  {profileData.telegramId
                    ? profileData.telegramId
                    : "NOT CONNECTED"}
                </div>
              </div>
              {/* <div className="border-t border-gray-600 "></div> */}
            </div>

            {/* Bottom Info */}
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className=" text-[10px] font-body1">
                  SECURITY VERIFIED
                </span>
              </div>

              <div className=" text-[10px] text-yellow-400">
                ID: {profileData.username || "NA"}
              </div>
            </div>
          </div>

          {/* Mobile View Recent Login */}
          <Accordion
            type="single"
            collapsible
            className="w-full md:hidden block"
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
            <AccordionItem value="item-2">
              <AccordionTrigger
                id="mobile-section-2"
                className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
              >
                Recent Login
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className=" bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl   p-3  overflow-y-auto  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium  text-white font-header">
                      Recent Logins
                    </span>
                  </div>

                  <div className="space-y-1">
                    {loading ? (
                      <p className="text-white">
                        {" "}
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      </p>
                    ) : error ? (
                      <p className="text-red-500">Error: {error.message}</p>
                    ) : loginHistory.length > 0 ? (
                      loginHistory.slice(0, 3).map((login, index) => (
                        <div
                          key={index}
                          className={`group mt-2 relative bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 `}
                        >
                          <div className="flex items-center gap-2 ">
                            <div
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-400`}
                            ></div>
                            <div className="w-full">
                              <div className="flex items-center w-full justify-between gap-2">
                                <div className="font-medium text-[11px] text-white font-body1">
                                  {getDeviceInfo(login.device)}
                                </div>
                                <div className="text-right">
                                  <div className="text-[10px] text-gray-400 mt-1 font-body1">
                                    {new Date(login.createdAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              <div className="text-[10px] text-gray-400 font-body1">
                                📍 {login.timeZone}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white font-body1">
                        No login history found.
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/*Desktop View Recent Login */}
          <div className="md:block hidden bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl  w-[430px]  h-[200px] p-3  overflow-y-auto  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-[10px] text-white font-header">
                Recent Logins
              </span>
            </div>

            <div className="space-y-1">
              {loading ? (
                <p className="text-white">
                  {" "}
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                </p>
              ) : error ? (
                <p className="text-red-500">Error: {error.message}</p>
              ) : loginHistory.length > 0 ? (
                loginHistory.slice(0, 3).map((login, index) => (
                  <div
                    key={index}
                    className={`group relative bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 `}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1 h-1 rounded-full flex-shrink-0 bg-gray-400`}
                      ></div>
                      <div className="w-full">
                        <div className="flex items-center w-full justify-between gap-2">
                          <div className="font-medium text-[8px] text-white font-body1">
                            {getDeviceInfo(login.device)}
                          </div>
                          <div className="text-right">
                            <div className="text-[8px] text-gray-400 mt-1 font-body1">
                              {new Date(login.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="text-[9px] text-gray-400 font-body1">
                          📍 {login.timeZone}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white font-body1">No login history found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 h-full">
          {/* Mobile View Security Settings/E-PIN */}
          <Accordion
            type="single"
            collapsible
            className="w-full md:hidden block"
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
            <AccordionItem value="item-3">
              <AccordionTrigger
                id="mobile-section-3"
                className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
              >
                Security Pin
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="     bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                  {showPin === false && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span>🔒</span>
                        <span className="font-medium font-header  text-white">
                          Security Settings
                        </span>
                      </div>

                      <div className="text-sm mb-1.5 font-body1 text-white">
                        Change Password
                      </div>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-1 bg-gray-700 text-white placeholder-gray-400 rounded  text-[10px] font-body1"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="p-1 text-[10px] font-body1 bg-gray-700 text-white placeholder-gray-400 rounded "
                          />
                          <input
                            type="password"
                            placeholder="Confirm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            className="p-1 text-[10px] font-body1 bg-gray-700 text-white placeholder-gray-400 rounded "
                          />
                        </div>
                        <div className="mt-5">
                          <button className="w-full bg-blue-600 text-white py-1.5 rounded text-xs font-medium hover:bg-blue-500">
                            Update Password
                          </button>
                        </div>
                        <div className="flex justify-end">
                          <button
                            className="text-xs font-body1 mt-1.5"
                            onClick={() => setShowPin(true)}
                          >
                            Switch to change e -pin
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {showPin === true && (
                    <>
                      <div className="flex w-full  justify-between items-center">
                        <div className="flex items-center">
                          <span>🔑</span>
                          <span className=" text-white font-header">
                            Change ePin
                          </span>
                        </div>

                        {epinMessage && (
                          <div className="text-center text-green-500 text-[10px] font-semibold  font-body1">
                            {epinMessage}
                          </div>
                        )}
                        {epinError && (
                          <div className="text-center text-red-500 text-[12px] font-semibold  font-body1">
                            {epinError}
                          </div>
                        )}
                      </div>
                      {!epinFields.currentEpin && (
                        <div className="mb-4 mt-2">
                          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-blue-400"
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
                                <p className="text-blue-300/90 text-[10px] font-body1">
                                  Leave "Current E-PIN" empty to set your first
                                  E-PIN
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col justify-between  gap-3 mt-2">
                        <input
                          type="password"
                          placeholder="Current"
                          value={epinFields.currentEpin}
                          onChange={(e) =>
                            handleEpinChange("currentEpin", e.target.value)
                          }
                          className="p-1 bg-gray-700 text-white placeholder-gray-400 rounded text-[10px] font-body1"
                        />
                        <input
                          type="password"
                          placeholder="New"
                          value={epinFields.epin}
                          onChange={(e) =>
                            handleEpinChange("epin", e.target.value)
                          }
                          className="p-1 bg-gray-700 text-white placeholder-gray-400 rounded text-[10px] font-body1"
                        />
                        <input
                          type="password"
                          placeholder="Confirm"
                          value={epinFields.confEpin}
                          onChange={(e) =>
                            handleEpinChange("confEpin", e.target.value)
                          }
                          className="p-1 bg-gray-700 text-white placeholder-gray-400 rounded text-[10px] font-body1"
                        />
                      </div>
                      <button
                        onClick={handleEpinUpdate}
                        disabled={epinLoading}
                        className="mt-3 w-full bg-orange-600 text-white py-1.5 rounded text-xs font-body1 hover:bg-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed"
                      >
                        {epinLoading ? "Updating..." : "Update ePin"}
                      </button>
                      <div className="flex justify-end">
                        <button
                          className="text-xs font-body1 mt-2.5"
                          onClick={() => setShowPin(false)}
                        >
                          Switch to change password
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Desktop View Security/E-PIN */}
          <div className="md:block hidden w-[200px]   h-[230px]    bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
            {showPin === false && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span>🔒</span>
                  <span className="font-medium text-[10px] text-white">
                    Security Settings
                  </span>
                </div>

                <div className="text-xs mb-1.5 text-white">Change Password</div>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-1 bg-gray-700 text-white placeholder-gray-400 rounded  text-[10px] font-body1"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="p-1 text-[10px] font-body1 bg-gray-700 text-white placeholder-gray-400 rounded "
                    />
                    <input
                      type="password"
                      placeholder="Confirm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className="p-1 text-[10px] font-body1 bg-gray-700 text-white placeholder-gray-400 rounded "
                    />
                  </div>
                  <div className="mt-5">
                    <button className="w-full bg-blue-600 text-white py-1.5 rounded text-[10px] font-medium hover:bg-blue-500">
                      Update Password
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="text-[10px] mt-1.5"
                      onClick={() => setShowPin(true)}
                    >
                      Switch to change e -pin
                    </button>
                  </div>
                </div>
              </>
            )}
            {showPin === true && (
              <>
                <div className="flex w-full  justify-between items-center">
                  <div className="flex items-center">
                    <span>🔑</span>
                    <span className="text-[10px] text-white font-header">
                      Change ePin
                    </span>
                  </div>

                  {epinMessage && (
                    <div className="text-center text-green-500 text-[7px] font-semibold  font-body1">
                      {epinMessage}
                    </div>
                  )}
                  {epinError && (
                    <div className="text-center text-red-500 text-[7px] font-semibold  font-body1">
                      {epinError}
                    </div>
                  )}
                </div>
                {!epinFields.currentEpin && (
                  <div className="mb-1">
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-400"
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
                          <p className="text-blue-300/90 text-[7px] font-body1">
                            Leave "Current E-PIN" empty to set your first E-PIN
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col justify-between  gap-2 mt-2">
                  <input
                    type="password"
                    placeholder="Current"
                    value={epinFields.currentEpin}
                    onChange={(e) =>
                      handleEpinChange("currentEpin", e.target.value)
                    }
                    className="p-1 bg-gray-700 text-white placeholder-gray-400 rounded text-[10px] font-body1"
                  />
                  <input
                    type="password"
                    placeholder="New"
                    value={epinFields.epin}
                    onChange={(e) => handleEpinChange("epin", e.target.value)}
                    className="p-1 bg-gray-700 text-white placeholder-gray-400 rounded text-[10px] font-body1"
                  />
                  <input
                    type="password"
                    placeholder="Confirm"
                    value={epinFields.confEpin}
                    onChange={(e) =>
                      handleEpinChange("confEpin", e.target.value)
                    }
                    className="p-1 bg-gray-700 text-white placeholder-gray-400 rounded text-[10px] font-body1"
                  />
                </div>
                <button
                  onClick={handleEpinUpdate}
                  disabled={epinLoading}
                  className="mt-2 w-full bg-orange-600 text-white py-1.5 rounded text-[10px] font-body1 hover:bg-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed"
                >
                  {epinLoading ? "Updating..." : "Update ePin"}
                </button>
                <div className="flex justify-end">
                  <button
                    className="text-[10px] mt-2.5"
                    onClick={() => setShowPin(false)}
                  >
                    Switch to change password
                  </button>
                </div>
              </>
            )}
          </div>
          {/* Mobile View Support Pin */}
          <Accordion
            type="single"
            collapsible
            className="w-full md:hidden block"
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
            <AccordionItem value="item-4">
              <AccordionTrigger
                id="mobile-section-4"
                className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
              >
                Support Pin
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="  bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3      overflow-y-auto transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                  {supportPinLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  ) : supportPin &&
                    supportPin.pin &&
                    !supportPin.isUsed &&
                    !isSupportPinExpired ? (
                    // Show existing pin with countdown - Compact UI
                    <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-1">
                      {/* Header with animated line */}
                      <div className="w-full">
                        <div className="w-16 h-1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full mx-auto mb-3 animate-pulse" />
                        <h3 className=" font-bold text-white font-header tracking-wider mb-1">
                          ACTIVE SUPPORT PIN
                        </h3>
                        <div className="text-[10px] text-white/70 font-body1">
                          Share this pin with our support team
                        </div>
                      </div>

                      {/* PIN Display - Compact */}

                      <div className="flex flex-col gap-3">
                        <div className="">
                          <div
                            className="relative mx-auto p-2 rounded-xl backdrop-blur-lg border-2 shadow-xl transform  transition-transform duration-300"
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
                            <div className="relative z-10 text-xl  font-mono font-black tracking-[0.3em] text-white drop-shadow-xl">
                              {supportPin.pin}
                            </div>
                          </div>
                        </div>

                        {/* Countdown Timer - Compact */}
                        <div className="w-full">
                          <div className="flex items-center justify-center gap-1">
                            <div className="relative">
                              <div
                                className="px-3 py-1 rounded-lg border-2"
                                style={{
                                  background:
                                    "linear-gradient(135deg, rgba(51, 160, 234, 0.1) 0%, rgba(10, 196, 136, 0.1) 100%)",
                                  border: "2px solid rgba(51, 160, 234, 0.3)",
                                }}
                              >
                                <div className="text-lg font-bold text-white font-mono">
                                  {supportPinTimeLeft.minutes}
                                </div>
                                <div className="text-xs text-white/70 font-body1  font-semibold">
                                  MIN
                                </div>
                              </div>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full animate-pulse" />
                            </div>

                            <div className="text-white/60 text-sm font-bold animate-pulse">
                              :
                            </div>

                            <div className="relative">
                              <div
                                className="px-3 py-1 rounded-lg border-2"
                                style={{
                                  background:
                                    "linear-gradient(135deg, rgba(51, 160, 234, 0.1) 0%, rgba(10, 196, 136, 0.1) 100%)",
                                  border: "2px solid rgba(10, 196, 136, 0.3)",
                                }}
                              >
                                <div className="text-lg font-bold text-white font-mono">
                                  {supportPinTimeLeft.seconds
                                    .toString()
                                    .padStart(2, "0")}
                                </div>
                                <div className="text-xs text-white/70 font-body1 mt- font-semibold">
                                  SEC
                                </div>
                              </div>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full animate-pulse" />
                            </div>
                          </div>
                          <div className="text-xs text-white/80 font-body1 my-4 uppercase tracking-wider font-semibold">
                            ⏰ Expires in
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Compact */}
                      <div className="flex flex-col gap-2 ">
                        <button
                          className="group relative px-4 py-2 rounded-full font-bold font-body1 text-white overflow-hidden transition-all duration-500  hover:shadow-xl transform"
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
                          <span className="relative z-10 flex items-center justify-center  text-xs font-body1">
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
                          className="group  rounded-full px-4 py-2 font-semibold font-body1 text-white/90 border-2 border-white/30 hover:border-white/60 hover:text-white hover:bg-white/10 transition-all duration-300  disabled:opacity-50 transform"
                          onClick={generateSupportPin}
                          disabled={generatingPin}
                        >
                          <span className="flex items-center justify-center gap-1 text-xs font-body1">
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
                          className="relative rounded-2xl p-4 backdrop-blur-sm border-2 shadow-2xl overflow-hidden"
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
                            <div className="mb-3">
                              <div className="w-16 h-1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full mx-auto mb-4" />
                              <h3 className=" font-semibold text-white font-header tracking-wide">
                                SUPPORT PIN EXPIRED
                              </h3>
                            </div>

                            {/* Expired Message */}
                            <div>
                              <div className="text-[#33A0EA] text-xs  mb-3 font-body1">
                                Your support pin has expired for security
                                reasons.
                              </div>
                            </div>

                            {/* Generate New Button */}
                            <button
                              className="py-1 px-4 rounded-full text-white font-semibold font-body1 text-xs bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50"
                              onClick={generateSupportPin}
                              disabled={generatingPin}
                            >
                              {generatingPin ? "Generating..." : "Generate"}
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
                    <div className="flex flex-col items-center text-center md:mt-6">
                      <div className="mb-4">
                        <h3 className="text-xs font-semibold text-white font-header mb-4">
                          Support Pin Generator
                        </h3>
                        <p className="text-[10px] text-text_secondary font-body1 max-w-md">
                          Create a secure temporary PIN to share with our
                          support team
                        </p>
                      </div>
                      <button
                        className=" px-2 py-2 rounded-full text-white font-semibold font-body1 text-[10px] bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50"
                        onClick={generateSupportPin}
                        disabled={generatingPin}
                      >
                        {generatingPin
                          ? "Generating..."
                          : "Generate Support Pin"}
                      </button>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Desktop View Support Pin */}
          <div className="md:block hidden  bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3 w-[200px]   h-[200px]     overflow-y-auto transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
            {supportPinLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : supportPin &&
              supportPin.pin &&
              !supportPin.isUsed &&
              !isSupportPinExpired ? (
              // Show existing pin with countdown - Compact UI
              <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-1">
                {/* Header with animated line */}
                <div className="w-full">
                  <div className="w-16 h-1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full mx-auto mb-3 animate-pulse" />
                  <h3 className="md:text-xs font-bold text-white font-header tracking-wider mb-1">
                    ACTIVE SUPPORT PIN
                  </h3>
                  <div className="text-[9px] text-white/70 font-body1">
                    Share this pin with our support team
                  </div>
                </div>

                {/* PIN Display - Compact */}

                <div className="flex gap-1">
                  <div className="">
                    <div
                      className="relative mx-auto p-1 rounded-xl backdrop-blur-lg border-2 shadow-xl transform  transition-transform duration-300"
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
                      <div className="relative z-10 text-sx font-mono font-black tracking-[0.3em] text-white drop-shadow-xl">
                        {supportPin.pin}
                      </div>
                    </div>
                  </div>

                  {/* Countdown Timer - Compact */}
                  <div className="w-full">
                    <div className="flex items-center justify-center gap-1">
                      <div className="relative">
                        <div
                          className="px-2 py-1 rounded-lg border-2"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(51, 160, 234, 0.1) 0%, rgba(10, 196, 136, 0.1) 100%)",
                            border: "2px solid rgba(51, 160, 234, 0.3)",
                          }}
                        >
                          <div className="text-sm font-bold text-white font-mono">
                            {supportPinTimeLeft.minutes}
                          </div>
                          <div className="text-[8px] text-white/70 font-body1  font-semibold">
                            MIN
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full animate-pulse" />
                      </div>

                      <div className="text-white/60 text-sm font-bold animate-pulse">
                        :
                      </div>

                      <div className="relative">
                        <div
                          className="px-2 py-1 rounded-lg border-2"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(51, 160, 234, 0.1) 0%, rgba(10, 196, 136, 0.1) 100%)",
                            border: "2px solid rgba(10, 196, 136, 0.3)",
                          }}
                        >
                          <div className="text-sm font-bold text-white font-mono">
                            {supportPinTimeLeft.seconds
                              .toString()
                              .padStart(2, "0")}
                          </div>
                          <div className="text-[8px] text-white/70 font-body1 mt- font-semibold">
                            SEC
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="text-[8px] text-white/80 font-body1 mt-2 uppercase tracking-wider font-semibold">
                      ⏰ Expires in
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Compact */}
                <div className="flex  gap-2">
                  <button
                    className="group relative p-1 rounded-full font-bold font-body1 text-white overflow-hidden transition-all duration-500  hover:shadow-xl transform"
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
                    <span className="relative z-10 flex items-center justify-center  text-[7px] font-body1">
                      <svg
                        className="w-3 h-3"
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
                    className="group  rounded-full p-1 font-semibold font-body1 text-white/90 border-2 border-white/30 hover:border-white/60 hover:text-white hover:bg-white/10 transition-all duration-300  disabled:opacity-50 transform"
                    onClick={generateSupportPin}
                    disabled={generatingPin}
                  >
                    <span className="flex items-center justify-center gap-1 text-[7px] font-body1">
                      <svg
                        className="w-3 h-3"
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
                    className="relative rounded-2xl p-4 backdrop-blur-sm border-2 shadow-2xl overflow-hidden"
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
                      <div className="mb-4">
                        <div className="w-16 h-1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end rounded-full mx-auto mb-4" />
                        <h3 className="text-xs font-semibold text-white font-header tracking-wide">
                          SUPPORT PIN EXPIRED
                        </h3>
                      </div>

                      {/* Expired Message */}
                      <div className="mb-4">
                        <div className="text-[#33A0EA] text-[10px]  mb-4 font-body1">
                          Your support pin has expired for security reasons.
                        </div>
                      </div>

                      {/* Generate New Button */}
                      <button
                        className="p-1 px-2 rounded-full text-white font-semibold font-body1 text-[10px] bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50"
                        onClick={generateSupportPin}
                        disabled={generatingPin}
                      >
                        {generatingPin ? "Generating..." : "Generate"}
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
              <div className="flex flex-col items-center text-center md:mt-6">
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-white font-header mb-4">
                    Support Pin Generator
                  </h3>
                  <p className="text-[10px] text-text_secondary font-body1 max-w-md">
                    Create a secure temporary PIN to share with our support team
                  </p>
                </div>
                <button
                  className=" px-2 py-2 rounded-full text-white font-semibold font-body1 text-[10px] bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity disabled:opacity-50"
                  onClick={generateSupportPin}
                  disabled={generatingPin}
                >
                  {generatingPin ? "Generating..." : "Generate Support Pin"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {/* Mobile View 2FA  */}
          <Accordion
            type="single"
            collapsible
            className="w-full md:hidden block"
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
            <AccordionItem value="item-5">
              <AccordionTrigger
                id="mobile-section-5"
                className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
              >
                2FA Authentication
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="group relative bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3  overflow-y-auto  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="font-medium  text-white font-header">
                        2FA Authentication
                      </span>
                    </div>
                    {twoFAEnabled ? (
                      <span className="bg-green-900 font-header text-green-300 text-[8px] px-1 rounded font-medium">
                        ENABLED
                      </span>
                    ) : (
                      <span className="bg-red-900 font-header text-red-300 text-[8px] px-1 rounded font-medium">
                        DISABLED
                      </span>
                    )}
                  </div>

                  {twoFAEnabled ? (
                    <div className="text-center">
                      <p className="text-xs  text-white mb-2 font-body1">
                        Two-Factor Authentication is currently enabled.
                      </p>
                      <input
                        type="text"
                        placeholder="Enter 6-digit code to disable"
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        className="w-full py-2 p-1 bg-gray-700 text-white font-body1 placeholder-gray-400 rounded text-[11px] mb-2"
                        maxLength={6}
                      />
                      <button
                        onClick={disableTwoFactor}
                        className="w-full bg-red-600 text-white py-1 rounded font-body1 text-xs font-medium hover:bg-red-500"
                        disabled={disable2FALoading}
                      >
                        {disable2FALoading ? "Disabling..." : "Disable 2FA"}
                      </button>
                      {disable2FAMessage && (
                        <p className="text-green-400 text-xs mt-1">
                          {disable2FAMessage}
                        </p>
                      )}
                      {disable2FAError && (
                        <p className="text-red-400 text-xs mt-1">
                          {disable2FAError}
                        </p>
                      )}

                      {/* Reset Your 2FA */}
                      <div className="space-y-1">
                        <h3 className="mt-1 text-lg">Reset Your 2FA</h3>
                        <span className="text-xs font-body1">
                          If you forget your 2FA, you can reset it through your
                          email.
                        </span>
                        <button
                          onClick={sendResetVerificationCode}
                          disabled={resetLoading}
                          className="bg-red-600 text-white py-1 font-body1 rounded text-xs font-medium hover:bg-red-500 w-full"
                        >
                          Reset Two-Factor Authentication
                        </button>
                        <div className="flex items-center justify-center flex-col">
                          {resetLoading && !showResetForm ? (
                            <div className="flex justify-center items-center py-8">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                          ) : (
                            showResetForm && (
                              <div className="w-full">
                                <p className="text-xs text-white mb-2 font-body1">
                                  Enter the verification code sent to your
                                  email:
                                </p>
                                <input
                                  type="text"
                                  placeholder="Enter 6-digit verification code"
                                  value={resetVerificationCode}
                                  onChange={handleResetCodeChange}
                                  className="w-full py-2 p-1 bg-gray-700 text-white font-body1 placeholder-gray-400 rounded text-[11px] mb-2"
                                  maxLength={6}
                                />
                                <button
                                  onClick={resetTwoFactor}
                                  disabled={resetLoading}
                                  className="w-full bg-blue-600 text-white py-1  font-body1 rounded text-xs font-medium hover:bg-blue-500"
                                >
                                  {resetLoading
                                    ? "Resetting..."
                                    : "Confirm Reset"}
                                </button>
                              </div>
                            )
                          )}
                          {resetMessage && (
                            <p className="text-green-400 text-xs mt-1">
                              {resetMessage}
                            </p>
                          )}
                          {resetError && (
                            <p className="text-red-400 text-xs">{resetError}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      {twoFactorLoading ? (
                        <p className="text-white">
                          <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        </p>
                      ) : twoFactorError ? (
                        <p className="text-red-400">{twoFactorError}</p>
                      ) : (
                        <>
                          {/* QR Code */}
                          <div className="flex flex-col mt-5">
                            <div className="text-center text-gray-400 mb-2 font-header text-[11px]">
                              Scan with authenticator app
                            </div>
                            <div className="flex justify-center mb-2">
                              <div className="w-25 h-25  bg-black rounded-lg flex items-center justify-center">
                                {twoFactorData.otpauth_url ? (
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                                      twoFactorData.otpauth_url
                                    )}`}
                                    alt="QR Code"
                                    className="w-full h-full p-1"
                                  />
                                ) : (
                                  <div className="grid grid-cols-8 gap-px">
                                    {Array.from({ length: 64 }, (_, i) => (
                                      <div
                                        key={i}
                                        className={`w-1 h-1 ${
                                          Math.random() > 0.5
                                            ? "bg-white"
                                            : "bg-gray-900"
                                        }`}
                                      ></div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-gray-400 mb-2 font-body1 text-center">
                              Manual Code
                            </div>
                            <div className="flex items-center mx-auto gap-2 mb-3  w-full">
                              <div className="bg-gray-700 p-2  rounded text-[10px] font-mono flex-1 text-center overflow-hidden">
                                <span className="text-white font-body1 ">
                                  {twoFactorData.secret
                                    ? twoFactorData.secret.substring(0, 13) +
                                      "......" +
                                      twoFactorData.secret.substring(0, 13)
                                    : "N/A"}
                                </span>
                              </div>
                              <button
                                onClick={() => handleCopy(twoFactorData.secret)}
                                className="p-2 text-gray-400 hover:text-gray-200 flex-shrink-0"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter 6-digit code to enable"
                            value={authCode}
                            onChange={(e) => setAuthCode(e.target.value)}
                            className="w-full p-2 bg-gray-700 text-white placeholder-gray-400 rounded text-[11px] mb-3 font-body1"
                            maxLength={6}
                          />
                          {validationMessage && (
                            <p className="text-green-400 text-xs mb-2">
                              {validationMessage}
                            </p>
                          )}
                          {validationError && (
                            <p className="text-red-400 text-xs mb-2">
                              {validationError}
                            </p>
                          )}
                          <button
                            onClick={validateTwoFactorCode}
                            className="w-full bg-blue-600 text-white py-1.5 rounded text-xs font-body1 hover:bg-blue-500"
                            disabled={validating}
                          >
                            {validating ? "Validating..." : "Enable 2FA"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Desktop View 2FA */}
          <div className="md:block hidden group relative bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3 w-[330px] h-[330px]  overflow-y-auto  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-xs text-white font-header">
                  2FA Authentication
                </span>
              </div>
              {twoFAEnabled ? (
                <span className="bg-green-900 font-header text-green-300 text-[8px] p-1 rounded font-medium">
                  ENABLED
                </span>
              ) : (
                <span className="bg-red-900 font-header text-red-300 text-[8px] p-1 rounded font-medium">
                  DISABLED
                </span>
              )}
            </div>

            {twoFAEnabled ? (
              <div className="text-center">
                <p className="text-[10px]  text-white mb-2 font-body1">
                  Two-Factor Authentication is currently enabled.
                </p>
                <input
                  type="text"
                  placeholder="Enter 6-digit code to disable"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="w-full py-2 p-1 bg-gray-700 text-white font-body1 placeholder-gray-400 rounded text-[10px] mb-2"
                  maxLength={6}
                />
                <button
                  onClick={disableTwoFactor}
                  className="w-full bg-red-600 text-white py-1 rounded font-body1 text-xs font-medium hover:bg-red-500"
                  disabled={disable2FALoading}
                >
                  {disable2FALoading ? "Disabling..." : "Disable 2FA"}
                </button>
                {disable2FAMessage && (
                  <p className="text-green-400 text-xs mt-1">
                    {disable2FAMessage}
                  </p>
                )}
                {disable2FAError && (
                  <p className="text-red-400 text-xs mt-1">{disable2FAError}</p>
                )}

                {/* Reset Your 2FA */}
                <div className="space-y-1">
                  <h3 className="mt-1">Reset Your 2FA</h3>
                  <span className="text-[10px]">
                    If you forget your 2FA, you can reset it through your email.
                  </span>
                  <button
                    onClick={sendResetVerificationCode}
                    disabled={resetLoading}
                    className="bg-red-600 text-white py-1 font-body1 rounded text-xs font-medium hover:bg-red-500 w-full"
                  >
                    Reset Two-Factor Authentication
                  </button>
                  <div className="flex items-center justify-center flex-col">
                    {resetLoading && !showResetForm ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    ) : (
                      showResetForm && (
                        <div className="w-full">
                          <p className="text-[10px] text-white mb-2 font-body1">
                            Enter the verification code sent to your email:
                          </p>
                          <input
                            type="text"
                            placeholder="Enter 6-digit verification code"
                            value={resetVerificationCode}
                            onChange={handleResetCodeChange}
                            className="w-full py-2 p-1 bg-gray-700 text-white font-body1 placeholder-gray-400 rounded text-xs mb-2"
                            maxLength={6}
                          />
                          <button
                            onClick={resetTwoFactor}
                            disabled={resetLoading}
                            className="w-full bg-blue-600 text-white py-1  font-body1 rounded text-xs font-medium hover:bg-blue-500"
                          >
                            {resetLoading ? "Resetting..." : "Confirm Reset"}
                          </button>
                        </div>
                      )
                    )}
                    {resetMessage && (
                      <p className="text-green-400 text-xs mt-1">
                        {resetMessage}
                      </p>
                    )}
                    {resetError && (
                      <p className="text-red-400 text-xs">{resetError}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {twoFactorLoading ? (
                  <p className="text-white">
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  </p>
                ) : twoFactorError ? (
                  <p className="text-red-400">{twoFactorError}</p>
                ) : (
                  <>
                    {/* QR Code */}
                    <div className="flex flex-col mt-5">
                      <div className="text-center text-md text-gray-400 mb-2 font-header text-sm">
                        Scan with authenticator app
                      </div>
                      <div className="flex justify-center mb-2">
                        <div className="w-20 h-20 lg:w-22 lg:h-22 bg-black rounded-lg flex items-center justify-center">
                          {twoFactorData.otpauth_url ? (
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                                twoFactorData.otpauth_url
                              )}`}
                              alt="QR Code"
                              className="w-full h-full p-1"
                            />
                          ) : (
                            <div className="grid grid-cols-8 gap-px">
                              {Array.from({ length: 64 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 h-1 ${
                                    Math.random() > 0.5
                                      ? "bg-white"
                                      : "bg-gray-900"
                                  }`}
                                ></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mb-2 font-body1 text-center">
                        Manual Code
                      </div>
                      <div className="flex items-center mx-auto gap-2 mb-3  w-[200px]">
                        <div className="bg-gray-700 p-2 rounded text-[10px] font-mono flex-1 text-center overflow-hidden">
                          <span className="block lg:hidden text-white">
                            {twoFactorData.secret
                              ? twoFactorData.secret.substring(0, 10) + "..."
                              : "N/A"}
                          </span>
                          <span className=" text-white font-body1">
                            {twoFactorData.secret || "N/A"}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(twoFactorData.secret)}
                          className="p-2 text-gray-400 hover:text-gray-200 flex-shrink-0"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code to enable"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white placeholder-gray-400 rounded text-[10px] mb-3 font-body1"
                      maxLength={6}
                    />
                    {validationMessage && (
                      <p className="text-green-400 text-xs mb-2">
                        {validationMessage}
                      </p>
                    )}
                    {validationError && (
                      <p className="text-red-400 text-xs mb-2">
                        {validationError}
                      </p>
                    )}
                    <button
                      onClick={validateTwoFactorCode}
                      className="w-full bg-blue-600 text-white py-1.5 rounded text-[10px] font-body1 hover:bg-blue-500"
                      disabled={validating}
                    >
                      {validating ? "Validating..." : "Enable 2FA"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile View Telegram */}
          <Accordion
            type="single"
            collapsible
            className="w-full md:hidden block"
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
            <AccordionItem value="item-6">
              <AccordionTrigger
                id="mobile-section-6"
                className="font-header focus:outline-none focus:ring-0 focus:border-none hover:no-underline sr-only"
              >
                Telegram
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="group relative bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5   transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                  <div className="md:flex md:items-center md:justify-between flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          profileData.telegramId
                            ? "bg-green-500 animate-pulse"
                            : "bg-red-500 animate-pulse"
                        }`}
                      ></div>
                      <span className="text-sm text-white font-header">
                        Telegram
                      </span>
                    </div>
                    <div
                    // className={`flex items-center gap-1 font-body1 ${
                    //   profileData.telegramId ? "text-green-400" : "text-red-400"
                    // }`}
                    >
                      {/* <span className="text-[10px] font-body1">
                  {profileData.telegramId ? "CONNECTED" : "NOT CONNECTED"}
                </span> */}
                      {/* <div className="text-sm font-medium mb-3 text-white">
                  Steps to connect:
                </div> */}
                    </div>
                  </div>

                  <p className="text-[10px] text-text_secondary mb-2 font-body1">
                    {profileData.telegramId
                      ? "Your Telegram account is connected. You can disconnect it if needed."
                      : "Verify your Telegram account to enhance your profile security."}
                  </p>
                  {profileData.telegramId ? (
                    <button
                      className="text-[10px] px-3 py-1 z-50  rounded-full text-white font-semibold font-body1 bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
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
                          console.log(
                            "fetchProfileData() called after Telegram disconnect in identity-card.jsx"
                          );
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Desktop View Telegram */}
          <div className="md:block hidden group relative bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 lg:p-3 w-[330px]  h-[110px]  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    profileData.telegramId
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500 animate-pulse"
                  }`}
                ></div>
                <span className="md:text-xs  text-sm text-white font-header">
                  Telegram
                </span>
              </div>
              <div
              // className={`flex items-center gap-1 font-body1 ${
              //   profileData.telegramId ? "text-green-400" : "text-red-400"
              // }`}
              >
                {/* <span className="text-[10px] font-body1">
                  {profileData.telegramId ? "CONNECTED" : "NOT CONNECTED"}
                </span> */}
                {/* <div className="text-sm font-medium mb-3 text-white">
                  Steps to connect:
                </div> */}
                {profileData.telegramId ? (
                  <button
                    className="text-xs px-2 py-1 z-50 rounded-full text-white font-semibold font-body1 bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
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
                        console.log(
                          "fetchProfileData() called after Telegram disconnect in identity-card.jsx"
                        );
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
            </div>

            <p className="md:text-[10px] text-sm text-text_secondary mb-2 font-body1">
              {profileData.telegramId
                ? "Your Telegram account is connected. You can disconnect it if needed."
                : "Verify your Telegram account to enhance your profile security."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
