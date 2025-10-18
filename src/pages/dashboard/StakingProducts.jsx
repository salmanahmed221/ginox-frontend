import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "../../api/axiosConfig";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { SparklesCore } from "../../components/ui/sparkles";
import { MdArrowBack } from "react-icons/md";
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
  FaUsers,
  FaChartLine,
  FaUserPlus,
  FaGift,
  FaTrophy,
  FaTicketAlt,
  FaBox,
  FaLock,
  FaSignal,
} from "react-icons/fa";
import { BiSupport } from "react-icons/bi";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Countdown Timer Component
const CountdownTimer = ({
  targetDate,
  onComplete,
  expiredLabel = "UNLOCKED",
  className = "font-body1",
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        if (onComplete) onComplete();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.isExpired) {
    return (
      <div
        className={`text-[8px] sm:text-sm text-[#0AC488] ${className} tracking-widest`}
      >
        {expiredLabel}
      </div>
    );
  }

  return (
    <div
      className={`flex gap-0.5 text-[8px] sm:text-sm text-[#E0103A] ${className} tracking-widest`}
    >
      {timeLeft.days > 0 && (
        <>
          <span className="md:text-[9px] text-[11px]">{timeLeft.days}d</span>
          <span className="md:text-[9px] text-[11px]">:</span>
        </>
      )}
      <span className="md:text-[9px] text-[11px]">
        {String(timeLeft.hours).padStart(2, "0")}h
      </span>
      <span className="md:text-[9px] text-[11px]">:</span>
      <span className="md:text-[9px] text-[11px]">
        {String(timeLeft.minutes).padStart(2, "0")}m
      </span>
      <span className="md:text-[9px] text-[11px]">:</span>
      <span className="md:text-[9px] text-[11px]">
        {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
};

const TABS = [
  { label: "Services" },
  { label: "Staking Boxes" },
  { label: "VPN" },
  { label: "Services" },
  { label: "Signal channels" },
  { label: "Lotteries" },
  { label: "Games" },
];

const LOCAL_TABS = [
  { label: "Services" },
  { label: "Staking Boxes" },
  { label: "VPN" },
  { label: "Signal channels" },
  { label: "Lotteries" },
];

const lotteriesSummary = [];

const LOTTERY_CARD_BG = "/assets/images/lottery-bg.png";

const lotteries = [];

const signalChannels = [
  {
    logo: "/assets/images/bfm-logo.png",
    title: "BENEFIT MINE",
    daysLeft: 18,
    platform: "$35434",
    amount: "$3.53534",
    subscribed: true,
  },
];

const StakingProducts = () => {
  const [activeSection, setActiveSection] = useState("item-1");
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [lotteryTab, setLotteryTab] = useState(0);

  // SIGNAL_TABS
  // LOTTERY_TABS
  const SIGNAL_TABS = ["All", "Active", "Closed"];
  const LOTTERY_TABS = ["All", "Active Today", "Expired Today"];
  const [signalTab, setSignalTab] = useState(0);
  // CryptoBox state
  const [cryptoBoxes, setCryptoBoxes] = useState([]);
  const [openMsg, setOpenMsg] = useState({}); // { [cryptoBoxId]: message }
  const [loadingOpen, setLoadingOpen] = useState({}); // { [cryptoBoxId]: boolean }
  const [loading, setLoading] = useState(true);
  const [vpnAccessKeys, setVpnAccessKeys] = useState([]);
  const [vpnLoading, setVpnLoading] = useState(false);
  const [servers, setServers] = useState([]);
  const [serversLoading, setServersLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState("");
  const [totalStaked, setTotalStaked] = useState(0);
  const [copyToast, setCopyToast] = useState({ show: false, message: "" });
  const [hasInitialVpnConfigs, setHasInitialVpnConfigs] = useState(false);
  const [showServerSelection, setShowServerSelection] = useState(false);
  const [vpnConfigError, setVpnConfigError] = useState(false);
  const [currentConfigId, setCurrentConfigId] = useState("");
  const [currentServerName, setCurrentServerName] = useState("");
  const [switchingServer, setSwitchingServer] = useState(false);
  const [hasInvalidServerNameError, setHasInvalidServerNameError] =
    useState(false);
  const [vpnExpiresAt, setVpnExpiresAt] = useState("");
  const [vpnDevices, setVpnDevices] = useState(null);
  const [vpnIsDisabled, setVpnIsDisabled] = useState(null);
  const [showSwitchConfirmModal, setShowSwitchConfirmModal] = useState(false);
  const [pendingServerName, setPendingServerName] = useState("");
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);
  const serverDropdownRef = useRef(null);

  // Signal Channels - User Profile & Telegram check
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [hasTelegramId, setHasTelegramId] = useState(false);
  const [userActiveServices, setUserActiveServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [hasSignalChannelLicense, setHasSignalChannelLicense] = useState(false);

  // VPN License status
  const [hasActiveVpnLicense, setHasActiveVpnLicense] = useState(true);

  // Telegram API integration state
  const [telegramMembershipStatus, setTelegramMembershipStatus] =
    useState(null);
  const [telegramMembershipLoading, setTelegramMembershipLoading] =
    useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLinkData, setInviteLinkData] = useState(null);
  const [inviteLinkLoading, setInviteLinkLoading] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // VPN Maintenance mode - disabled
  const [isVpnMaintenanceMode] = useState(false);

  // VPN Modal state
  const [showVpnModal, setShowVpnModal] = useState(false);
  const [vpnModalUnderstood, setVpnModalUnderstood] = useState(false);
  const [keyToCopy, setKeyToCopy] = useState("");

  // Services state
  const [services, setServices] = useState(0);

  // Telegram API functions
  const checkTelegramMembership = async (telegramId) => {
    if (!telegramId) return false;

    setTelegramMembershipLoading(true);
    try {
      // Use the specific bot token for checking membership
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const channelId = import.meta.env.VITE_CHANNEL_ID;

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/getChatMember`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: channelId,
            user_id: telegramId,
          }),
        }
      );

      const data = await response.json();

      if (
        data.ok &&
        data.result &&
        (data.result.status === "member" || data.result.status === "creator")
      ) {
        setTelegramMembershipStatus("member");
        return true;
      } else {
        setTelegramMembershipStatus("not_member");
        return false;
      }
    } catch (error) {
      console.error("Error checking Telegram membership:", error);
      setTelegramMembershipStatus("error");
      return false;
    } finally {
      setTelegramMembershipLoading(false);
    }
  };

  const createTelegramInviteLink = async () => {
    setInviteLinkLoading(true);
    try {
      // Use the specific bot token for creating invite links
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const channelId = import.meta.env.VITE_CHANNEL_ID;

      // Set expire date to 1 hour from now
      const expireDate = Math.floor(Date.now() / 1000) + 60 * 60;

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/createChatInviteLink`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: channelId,
            expire_date: expireDate,
            creates_join_request: true,
            name: "SignalX",
          }),
        }
      );

      const data = await response.json();

      if (data.ok && data.result) {
        setInviteLinkData(data.result);
        setShowInviteModal(true);
      } else {
        throw new Error("Failed to create invite link");
      }
    } catch (error) {
      console.error("Error creating Telegram invite link:", error);
      setCopyToast({
        show: true,
        message: "Failed to create invite link. Please try again.",
      });
      setTimeout(() => {
        setCopyToast({ show: false, message: "" });
      }, 3000);
    } finally {
      setInviteLinkLoading(false);
    }
  };

  const handleJoinChannel = async () => {
    if (telegramMembershipStatus === "member") {
      // User is already a member or creator
      setCopyToast({
        show: true,
        message: "You are already a member of the channel!",
      });
      setTimeout(() => {
        setCopyToast({ show: false, message: "" });
      }, 3000);
      return;
    }

    // Create invite link and show modal
    await createTelegramInviteLink();
  };

  const copyInviteLink = async () => {
    if (inviteLinkData && inviteLinkData.invite_link) {
      try {
        await navigator.clipboard.writeText(inviteLinkData.invite_link);
        setIsLinkCopied(true);
        setTimeout(() => {
          setIsLinkCopied(false);
        }, 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  // Copy to clipboard function with toast
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

  // VPN access key copy function with modal
  const handleVpnKeyCopy = async (key) => {
    // Show modal first
    setShowVpnModal(true);
    setVpnModalUnderstood(false);

    // Store the key to copy after modal is closed
    setKeyToCopy(key);
  };

  // Helper function to get user-friendly error message for VPN 400 errors
  const getVpnErrorMessage = (apiMessage) => {
    if (apiMessage === "Invalid serverName value") {
      return "Please select a server to generate configs";
    }
    return apiMessage;
  };

  // Switch server function
  const handleServerSwitch = async (newServerName) => {
    if (
      !currentConfigId ||
      !newServerName ||
      newServerName === currentServerName
    ) {
      return;
    }

    setSwitchingServer(true);
    try {
      const payload = {
        configId: currentConfigId,
        serverName: newServerName,
      };

      const response = await axios.post(
        "/services/vpnconfigs/switch-server",
        payload,
        {
          headers: { token },
        }
      );

      if (response.data && response.data.success) {
        // Update current server
        setCurrentServerName(newServerName);
        setSelectedServer(newServerName);

        // Re-fetch VPN configs after successful switch
        setVpnLoading(true);
        const configResponse = await axios.get("/services/vpnconfigs", {
          headers: { token },
        });

        if (
          configResponse.data &&
          configResponse.data.success &&
          Array.isArray(configResponse.data.data) &&
          configResponse.data.data.length > 0
        ) {
          const updatedItem = configResponse.data.data[0];
          if (updatedItem.config && Array.isArray(updatedItem.config)) {
            const activeConfigs = updatedItem.config.filter(
              (config) => config.connectionString && config.status === "active"
            );
            setVpnAccessKeys(
              activeConfigs.map((config) => config.connectionString)
            );
            setCurrentConfigId(updatedItem._id);
          } else if (updatedItem.config && !Array.isArray(updatedItem.config)) {
            const cfg = updatedItem.config;
            const isActive = cfg.status ? cfg.status === "active" : true;
            if (cfg.connectionString && isActive) {
              setVpnAccessKeys([cfg.connectionString]);
              setCurrentConfigId(updatedItem._id);
            }
          }
        }
        setVpnLoading(false);

        // Show success toast
        setCopyToast({
          show: true,
          message: `Server switched to ${newServerName} successfully!`,
        });
        setTimeout(() => {
          setCopyToast({ show: false, message: "" });
        }, 3000);
      } else {
        setCopyToast({
          show: true,
          message: response.data?.message || "Failed to switch server",
        });
        setTimeout(() => {
          setCopyToast({ show: false, message: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Server switch error:", error);
      setCopyToast({
        show: true,
        message: error.response?.data?.message || "Error switching server",
      });
      setTimeout(() => {
        setCopyToast({ show: false, message: "" });
      }, 3000);
    } finally {
      setSwitchingServer(false);
    }
  };

  useEffect(() => {
    if (
      (services === 1 && token) ||
      (services === 4 && token) ||
      (activeTab === 0 && token)
    ) {
      axios
        .get("/cryptobox/total-staked", {
          headers: { apikey: import.meta.env.VITE_API_KEY },
        })
        .then((res) => {
          if (
            res.data &&
            res.data.success &&
            res.data.data &&
            typeof res.data.data.totalStaked === "number"
          ) {
            setTotalStaked(res.data.data.totalStaked);
          }
        })
        .catch(() => setTotalStaked(0));
    }
  }, [activeTab, token, services]);
  const TOTAL_VALUE = 10606060;

  // Set initial active tab from location state
  useEffect(() => {
    if (location.state && location.state.initialTab !== undefined) {
      const tabIndex = location.state.initialTab;
      if (tabIndex >= 0 && tabIndex < TABS.length) {
        setActiveTab(tabIndex);
      }
    }

    // Set services state if provided
    if (location.state && location.state.services !== undefined) {
      setServices(location.state.services);
    }
  }, [location.state]);

  // Remove the automatic modal show on tab change
  // Modal will now only show when user copies access key

  // Fetch cryptobox history
  const fetchCryptoBoxes = () => {
    setLoading(true);
    axios
      .get("/cryptobox/history?pageSize=50&order=asc&page=1", {
        headers: { token },
      })
      .then((res) => {
        if (
          res.data &&
          res.data.success &&
          res.data.data &&
          Array.isArray(res.data.data.data)
        ) {
          setCryptoBoxes(res.data.data.data);
        }
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchCryptoBoxes();
    // eslint-disable-next-line
  }, [token]);

  // Open Crypto Box handler
  const handleOpenCryptoBox = async (cryptoBoxId) => {
    setLoadingOpen((prev) => ({ ...prev, [cryptoBoxId]: true }));
    setOpenMsg((prev) => ({ ...prev, [cryptoBoxId]: "" }));
    try {
      const res = await axios.post(
        "/cryptobox/open",
        { crypto_box_id: cryptoBoxId, confirmed: 1 },
        { headers: { token } }
      );
      setOpenMsg((prev) => ({
        ...prev,
        [cryptoBoxId]:
          res.data.message || (res.data.success ? "Success" : "Failed"),
      }));
      fetchCryptoBoxes();
    } catch (err) {
      setOpenMsg((prev) => ({
        ...prev,
        [cryptoBoxId]:
          err.response?.data?.message || "Failed to open Crypto Box",
      }));
    } finally {
      setLoadingOpen((prev) => ({ ...prev, [cryptoBoxId]: false }));
    }
  };

  // Helper to calculate remaining days
  const getRemainingDays = (nextProfitReleaseDate) => {
    if (!nextProfitReleaseDate) return "-";
    const now = new Date();
    const next = new Date(nextProfitReleaseDate);
    const diff = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // Initial VPN config call (without serverName)
  useEffect(() => {
    if (token && !isVpnMaintenanceMode && !hasInitialVpnConfigs) {
      setVpnLoading(true);
      setVpnConfigError(false);

      axios
        .get("/services/vpnconfigs", { headers: { token } })
        .then((res) => {
          if (
            res.data &&
            res.data.success &&
            Array.isArray(res.data.data) &&
            res.data.data.length > 0
          ) {
            // Process existing configs from API response
            const firstItem = res.data.data[0]; // Get first config item

            if (
              firstItem.config &&
              Array.isArray(firstItem.config) &&
              firstItem.config.length > 0
            ) {
              const activeConfigs = firstItem.config.filter(
                (config) =>
                  config.connectionString && config.status === "active"
              );

              if (activeConfigs.length > 0) {
                // Set current config information
                setCurrentConfigId(firstItem._id);
                setCurrentServerName(
                  firstItem.serverName || activeConfigs[0].server
                );
                setSelectedServer(
                  firstItem.serverName || activeConfigs[0].server
                );

                // Set connection strings
                setVpnAccessKeys(
                  activeConfigs.map((config) => config.connectionString)
                );
                setVpnExpiresAt(firstItem.expiresAt || "");
                setVpnDevices(
                  typeof firstItem.devices === "number"
                    ? firstItem.devices
                    : null
                );
                if (typeof firstItem.isDisabled === "boolean") {
                  setVpnIsDisabled(firstItem.isDisabled);
                } else {
                  setVpnIsDisabled(null);
                }
                setHasInitialVpnConfigs(true);
                setShowServerSelection(false);
                setVpnConfigError(false);
                setHasActiveVpnLicense(true);
              } else {
                // No active configs found
                // Still capture config _id so user can switch servers
                setCurrentConfigId(firstItem._id);
                setShowServerSelection(true);
                setVpnConfigError(true);
              }
            } else if (firstItem.config && !Array.isArray(firstItem.config)) {
              // Handle single-object config shape
              const cfg = firstItem.config;
              const isActive = cfg.status ? cfg.status === "active" : true;
              const inferredServer =
                firstItem.serverName || cfg.server || cfg.serverIP || "";
              if (cfg.connectionString && isActive) {
                setCurrentConfigId(firstItem._id);
                setCurrentServerName(inferredServer);
                setSelectedServer(inferredServer);
                setVpnAccessKeys([cfg.connectionString]);
                setVpnExpiresAt(firstItem.expiresAt || "");
                setVpnDevices(
                  typeof firstItem.devices === "number"
                    ? firstItem.devices
                    : null
                );
                if (typeof firstItem.isDisabled === "boolean") {
                  setVpnIsDisabled(firstItem.isDisabled);
                } else {
                  setVpnIsDisabled(null);
                }
                setHasInitialVpnConfigs(true);
                setShowServerSelection(false);
                setVpnConfigError(false);
                setHasActiveVpnLicense(true);
              } else {
                // Capture config _id even if inactive/missing connection string
                setCurrentConfigId(firstItem._id);
                setShowServerSelection(true);
                setVpnConfigError(true);
              }
            } else {
              // No config array or empty
              // Capture config _id so switching can proceed
              setCurrentConfigId(firstItem._id);
              setShowServerSelection(true);
              setVpnConfigError(true);
            }
          } else {
            // No data or empty response
            setShowServerSelection(true);
            setVpnConfigError(true);
          }
        })
        .catch((error) => {
          console.log(
            "Initial VPN config failed, showing server selection:",
            error
          );

          // Handle 400 status specifically
          if (error.response && error.response.status === 400) {
            const apiMessage =
              error.response.data?.message || "VPN service error";

            // Check if this is "Invalid serverName value" error
            if (apiMessage === "Invalid serverName value") {
              setHasInvalidServerNameError(true);
            }

            // Check if this is "You don't have active VPN license" error
            if (apiMessage === "You don't have active VPN license") {
              setHasActiveVpnLicense(false);
            }

            const errorMessage = getVpnErrorMessage(apiMessage);

            setCopyToast({
              show: true,
              message: errorMessage,
            });
            setTimeout(() => {
              setCopyToast({ show: false, message: "" });
            }, 5000); // Show for 5 seconds for 400 errors
          }

          setShowServerSelection(true);
          setVpnConfigError(true);
          setVpnAccessKeys([]);
        })
        .finally(() => setVpnLoading(false));
    } else if (activeTab !== 1) {
      // Reset VPN loading state when switching away from VPN tab
      setVpnLoading(false);
    }
  }, [token, isVpnMaintenanceMode, hasInitialVpnConfigs]);

  // UI behaviors for custom dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        serverDropdownRef.current &&
        !serverDropdownRef.current.contains(e.target)
      ) {
        setIsServerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (switchingServer) setIsServerDropdownOpen(false);
  }, [switchingServer]);

  // Execute server switch (called after user confirmation)
  const executeServerSwitch = async (newServerName) => {
    setSwitchingServer(true);
    try {
      if (hasInvalidServerNameError) {
        // Direct VPN config API call with serverName query
        setVpnLoading(true);
        const apiUrl = `/services/vpnconfigs?serverName=${encodeURIComponent(
          newServerName
        )}`;
        const configResponse = await axios.get(apiUrl, { headers: { token } });

        if (
          configResponse.data &&
          configResponse.data.success &&
          Array.isArray(configResponse.data.data) &&
          configResponse.data.data.length > 0
        ) {
          const firstItem = configResponse.data.data[0];

          if (firstItem.config && Array.isArray(firstItem.config)) {
            const activeConfigs = firstItem.config.filter(
              (config) => config.connectionString && config.status === "active"
            );

            if (activeConfigs.length > 0) {
              setCurrentConfigId(firstItem._id);
              setCurrentServerName(firstItem.serverName || newServerName);
              setVpnAccessKeys(
                activeConfigs.map((config) => config.connectionString)
              );
              setHasInitialVpnConfigs(true);
              setShowServerSelection(false);
              setVpnConfigError(false);
              setHasInvalidServerNameError(false);
              setHasActiveVpnLicense(true);

              setCopyToast({
                show: true,
                message: `Connected to ${newServerName} successfully!`,
              });
              setTimeout(() => {
                setCopyToast({ show: false, message: "" });
              }, 3000);
            } else {
              setVpnAccessKeys([]);
              setCopyToast({
                show: true,
                message: `No active configs found for ${newServerName}. Please try another server.`,
              });
              setTimeout(() => {
                setCopyToast({ show: false, message: "" });
              }, 3000);
            }
          } else if (firstItem.config && !Array.isArray(firstItem.config)) {
            const cfg = firstItem.config;
            const isActive = cfg.status ? cfg.status === "active" : true;
            if (cfg.connectionString && isActive) {
              setCurrentConfigId(firstItem._id);
              setCurrentServerName(firstItem.serverName || newServerName);
              setVpnAccessKeys([cfg.connectionString]);
              setHasInitialVpnConfigs(true);
              setShowServerSelection(false);
              setVpnConfigError(false);
              setHasInvalidServerNameError(false);
              setHasActiveVpnLicense(true);
              setCopyToast({
                show: true,
                message: `Connected to ${newServerName} successfully!`,
              });
              setTimeout(() => {
                setCopyToast({ show: false, message: "" });
              }, 3000);
            } else {
              setVpnAccessKeys([]);
              setCopyToast({
                show: true,
                message: `No active configs found for ${newServerName}. Please try another server.`,
              });
              setTimeout(() => {
                setCopyToast({ show: false, message: "" });
              }, 3000);
            }
          }
        } else {
          setVpnAccessKeys([]);
          setCopyToast({
            show: true,
            message: `No VPN configs found for ${newServerName}. Please try another server.`,
          });
          setTimeout(() => {
            setCopyToast({ show: false, message: "" });
          }, 3000);
        }
        setVpnLoading(false);
      } else {
        // Normal flow: Use switch-server API first
        const payload = {
          configId: currentConfigId || "",
          serverName: newServerName,
        };

        const switchResponse = await axios.post(
          "/services/vpnconfigs/switch-server",
          payload,
          {
            headers: { token },
          }
        );

        if (switchResponse.data && switchResponse.data.success) {
          // After successful switch, fetch VPN configs
          setVpnLoading(true);
          try {
            const configResponse = await axios.get("/services/vpnconfigs", {
              headers: { token },
            });

            if (
              configResponse.data &&
              configResponse.data.success &&
              Array.isArray(configResponse.data.data) &&
              configResponse.data.data.length > 0
            ) {
              const firstItem = configResponse.data.data[0];

              if (firstItem.config && Array.isArray(firstItem.config)) {
                const activeConfigs = firstItem.config.filter(
                  (config) =>
                    config.connectionString && config.status === "active"
                );

                if (activeConfigs.length > 0) {
                  setCurrentConfigId(firstItem._id);
                  setCurrentServerName(firstItem.serverName || newServerName);
                  setVpnAccessKeys(
                    activeConfigs.map((config) => config.connectionString)
                  );
                  setVpnExpiresAt(firstItem.expiresAt || "");
                  setVpnDevices(
                    typeof firstItem.devices === "number"
                      ? firstItem.devices
                      : null
                  );
                  if (typeof firstItem.isDisabled === "boolean") {
                    setVpnIsDisabled(firstItem.isDisabled);
                  } else {
                    setVpnIsDisabled(null);
                  }
                  setHasInitialVpnConfigs(true);
                  setShowServerSelection(false);
                  setVpnConfigError(false);
                  setHasActiveVpnLicense(true);

                  setCopyToast({
                    show: true,
                    message: `Connected to ${newServerName} successfully!`,
                  });
                  setTimeout(() => {
                    setCopyToast({ show: false, message: "" });
                  }, 3000);
                } else {
                  setVpnAccessKeys([]);
                  setCopyToast({
                    show: true,
                    message: `No active configs found for ${newServerName}. Please try another server.`,
                  });
                  setTimeout(() => {
                    setCopyToast({ show: false, message: "" });
                  }, 3000);
                }
              } else if (firstItem.config && !Array.isArray(firstItem.config)) {
                const cfg = firstItem.config;
                const isActive = cfg.status ? cfg.status === "active" : true;
                if (cfg.connectionString && isActive) {
                  setCurrentConfigId(firstItem._id);
                  setCurrentServerName(firstItem.serverName || newServerName);
                  setVpnAccessKeys([cfg.connectionString]);
                  setVpnExpiresAt(firstItem.expiresAt || "");
                  setVpnDevices(
                    typeof firstItem.devices === "number"
                      ? firstItem.devices
                      : null
                  );
                  if (typeof firstItem.isDisabled === "boolean") {
                    setVpnIsDisabled(firstItem.isDisabled);
                  } else {
                    setVpnIsDisabled(null);
                  }
                  setHasInitialVpnConfigs(true);
                  setShowServerSelection(false);
                  setVpnConfigError(false);
                  setHasActiveVpnLicense(true);
                  setCopyToast({
                    show: true,
                    message: `Connected to ${newServerName} successfully!`,
                  });
                  setTimeout(() => {
                    setCopyToast({ show: false, message: "" });
                  }, 3000);
                } else {
                  setVpnAccessKeys([]);
                  setCopyToast({
                    show: true,
                    message: `No active configs found for ${newServerName}. Please try another server.`,
                  });
                  setTimeout(() => {
                    setCopyToast({ show: false, message: "" });
                  }, 3000);
                }
              }
            } else {
              setVpnAccessKeys([]);
              setCopyToast({
                show: true,
                message: `No VPN configs found after switching to ${newServerName}.`,
              });
              setTimeout(() => {
                setCopyToast({ show: false, message: "" });
              }, 3000);
            }
          } catch (configError) {
            console.error("VPN config fetch error:", configError);
            setVpnAccessKeys([]);

            let errorMessage = `Failed to fetch VPN configs for ${newServerName}`;
            let showDuration = 3000;

            if (configError.response && configError.response.status === 400) {
              const apiMessage =
                configError.response.data?.message ||
                "You don't have active VPN license";

              // Check if this is "You don't have active VPN license" error
              if (apiMessage === "You don't have active VPN license") {
                setHasActiveVpnLicense(false);
              }

              errorMessage = getVpnErrorMessage(apiMessage);
              showDuration = 5000;
            } else if (configError.response) {
              errorMessage = configError.response.data?.message || errorMessage;
            }

            setCopyToast({
              show: true,
              message: errorMessage,
            });
            setTimeout(() => {
              setCopyToast({ show: false, message: "" });
            }, showDuration);
          } finally {
            setVpnLoading(false);
          }
        } else {
          const errorMessage =
            switchResponse.data?.message ||
            `Failed to switch to ${newServerName}`;
          const showDuration = 5000;

          setCopyToast({
            show: true,
            message: errorMessage,
          });
          setTimeout(() => {
            setCopyToast({ show: false, message: "" });
          }, showDuration);
        }
      }
    } catch (error) {
      console.error("Server switch error:", error);
      let errorMessage = `Error switching to ${newServerName}`;
      let showDuration = 3000;
      if (error.response) {
        if (error.response.status === 400) {
          const apiMessage =
            error.response.data?.message || "VPN service error";

          // Check if this is "You don't have active VPN license" error
          if (apiMessage === "You don't have active VPN license") {
            setHasActiveVpnLicense(false);
          }

          errorMessage = getVpnErrorMessage(apiMessage);
          showDuration = 5000;
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }
      setCopyToast({ show: true, message: errorMessage });
      setTimeout(() => {
        setCopyToast({ show: false, message: "" });
      }, showDuration);
    } finally {
      setSwitchingServer(false);
    }
  };

  // Handle server selection change (no API call; show Generate action)
  const handleServerSelectionChange = (newServerName) => {
    if (newServerName === selectedServer) return;
    setSelectedServer(newServerName);
  };

  // Fetch servers list for VPN dropdown on page load
  useEffect(() => {
    setServersLoading(true);
    axios
      .get("/services/servers-list", {
        headers: { apikey: import.meta.env.VITE_API_KEY },
      })
      .then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setServers(res.data.data);
        }
      })
      .finally(() => setServersLoading(false));
  }, []);

  // Fetch user profile when Signal Channels tab is active
  useEffect(() => {
    if (activeTab === 2) {
      setProfileLoading(true);
      setServicesLoading(true);

      // Fetch user profile
      axios
        .get("/user/profile", {
          headers: { token },
        })
        .then((res) => {
          if (res.data && res.data.success && res.data.data) {
            setUserProfile(res.data.data);
            // Check if user has telegramId
            const hasTelegram =
              res.data.data.telegramId &&
              res.data.data.telegramId.trim() !== "";
            setHasTelegramId(hasTelegram);

            // If user has telegramId, check Telegram membership and fetch their active services
            if (hasTelegram && res.data.data.telegramId) {
              // Check Telegram membership status
              checkTelegramMembership(res.data.data.telegramId);

              if (res.data.data.username) {
                return axios.get(
                  `/services/user-active-services?username=${res.data.data.username}`,
                  {
                    headers: {
                      apikey: import.meta.env.VITE_API_KEY,
                    },
                  }
                );
              }
            }
            return null;
          }
          return null;
        })
        .then((servicesRes) => {
          if (servicesRes && servicesRes.data && servicesRes.data.success) {
            setUserActiveServices(servicesRes.data.data || []);

            // Check if user has Signal Channel license
            const hasSignalChannel = servicesRes.data.data.some(
              (service) =>
                service.productName === "Signal Channel" &&
                service.status === "active"
            );
            setHasSignalChannelLicense(hasSignalChannel);
          } else {
            setUserActiveServices([]);
            setHasSignalChannelLicense(false);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user profile or services:", error);
          setHasTelegramId(false);
          setUserActiveServices([]);
          setHasSignalChannelLicense(false);
        })
        .finally(() => {
          setProfileLoading(false);
          setServicesLoading(false);
        });
    }
  }, [activeTab, token]);

  return (
    <div className="bg-[#010510] flex flex-col items-center justify-center  h-screen w-full      relative ">
      {/* VPN Modal */}
      {showVpnModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500 ease-out"
          onClick={(e) => {
            // Only close modal if clicking on the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              setShowVpnModal(false);
            }
          }}
          onTouchEnd={(e) => {
            // Handle touch on backdrop for mobile
            if (e.target === e.currentTarget) {
              setShowVpnModal(false);
            }
          }}
        >
          {/* Background overlay with subtle animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#33A0EA]/10 to-[#0AC488]/5 animate-pulse pointer-events-none"></div>
          <div
            className="bg-[#06101A] border border-[#232b36] rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95 z-[100000]"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            style={{
              background:
                "linear-gradient(145deg, rgba(6, 16, 26, 0.95) 0%, rgba(6, 16, 26, 0.98) 100%)",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(51, 160, 234, 0.1)",
              backdropFilter: "blur(20px)",
              touchAction: "manipulation"
            }}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#FF6B6B] rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl text-white font-header tracking-wide mb-3">
                  Important Notice
                </h3>
                <p className="text-[#b0b8c1] text-base leading-relaxed font-body1">
                  Your VPN plan is limited to certain allowed devices. If you
                  connect from more devices than allowed, your VPN access will
                  be automatically disabled for 1 hour. Please make sure you
                  only connect from your purchased device limit to avoid
                  interruptions.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-6 relative z-[100001]">
              <input
                type="checkbox"
                id="vpn-understand"
                checked={vpnModalUnderstood}
                onChange={(e) => {
                  e.stopPropagation();
                  setVpnModalUnderstood(e.target.checked);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-5 h-5 text-[#33A0EA] bg-transparent border-2 border-[#232b36] rounded focus:ring-[#33A0EA] focus:ring-2 focus:border-[#33A0EA] checked:bg-[#33A0EA] checked:border-[#33A0EA] cursor-pointer relative z-[100002] pointer-events-auto"
                style={{
                  accentColor: '#33A0EA',
                  position: 'relative',
                  zIndex: 100002
                }}
              />
              <label 
                htmlFor="vpn-understand" 
                className="text-white text-base cursor-pointer select-none relative z-[100001] pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setVpnModalUnderstood(!vpnModalUnderstood);
                }}
              >
                I understand
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!vpnModalUnderstood) return;
                  setShowVpnModal(false);
                  // Copy the key after user acknowledges
                  if (keyToCopy) {
                    handleCopy(keyToCopy, "VPN Access Key copied!");
                    setKeyToCopy(""); // Reset the key
                  }
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!vpnModalUnderstood) return;
                  
                  // Add a small delay to ensure proper touch handling
                  setTimeout(() => {
                    setShowVpnModal(false);
                    // Copy the key after user acknowledges
                    if (keyToCopy) {
                      handleCopy(keyToCopy, "VPN Access Key copied!");
                      setKeyToCopy(""); // Reset the key
                    }
                  }, 50);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={!vpnModalUnderstood}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation select-none ${
                  vpnModalUnderstood
                    ? "bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white hover:shadow-lg hover:shadow-[#33A0EA]/25 active:shadow-inner cursor-pointer"
                    : "bg-[#232b36] text-[#b0b8c1] cursor-not-allowed opacity-50"
                }`}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  position: 'relative',
                  zIndex: 100003,
                  pointerEvents: vpnModalUnderstood ? 'auto' : 'none'
                }}
              >
                {keyToCopy ? "Copy & Close" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Confirmation Modal */}
      {showSwitchConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-[#06101A] border border-[#232b36] rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h3 className="text-lg text-white font-heading tracking-wide mb-3">
              Confirmation
            </h3>
            <p className="text-[#b0b8c1] text-base leading-relaxed mb-6">
              Are you sure you want to do this action? This action will revoke
              the setting which you are using now.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 rounded-lg bg-[#232b36] text-white"
                onClick={() => setShowSwitchConfirmModal(false)}
                disabled={switchingServer}
              >
                Cancel
              </button>
              <button
                className={`px-5 py-2 rounded-lg ${
                  switchingServer
                    ? "bg-[#232b36] text-[#b0b8c1]"
                    : "bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white"
                }`}
                onClick={async () => {
                  const toServer = pendingServerName || selectedServer;
                  if (!toServer) return;
                  setShowSwitchConfirmModal(false);
                  await executeServerSwitch(toServer);
                }}
                disabled={switchingServer}
              >
                {switchingServer ? "Processing..." : "Agree"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">{copyToast.message}</span>
          </div>
        </div>
      )}

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
            <Header title={LOCAL_TABS[services].label.toUpperCase()} />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-[2px]  my-2"
            />

            <div className=" w-full overflow-y-auto element">
              {/* Staking Boxes */}
              {activeTab === 0 && (
                <div className="flex flex-wrap justify-between items-center gap-10">
                  {cryptoBoxes.map((box, idx) => (
                    <div
                      key={box.cryptoBoxId}
                      className="bg-[##010510] border border-[#232b36] rounded-3xl p-4 sm:p-8 min-w-[220px] max-w-full md:min-w-[340px] md:max-w-[370px] w-full md:flex-1 flex flex-col relative mb-4 md:mb-0"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <img
                            src="/assets/images/bfm-logo.png"
                            alt="logo"
                            className="w-10 h-10"
                          />
                          <span className="text-sm sm:text-lg text-white tracking-widest font-body1">
                            BENEFIT MINE{" "}
                            <span className="rounded-md text-[#000] text-xs font-body1 bg-[#C6C6C6] px-1 py-1">
                              BFM
                            </span>
                          </span>
                        </div>
                        {box.is_lottery === true ? (
                          <div className="flex flex-col items-center">
                            <img
                              src="/lottery/cryptobox.svg"
                              alt="cryptobox"
                              className="w-20 h-20"
                            />
                            <p className="text-sm text-white tracking-widest ">
                              Box Lottery
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 mt-2">
                        <div>
                          <div className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest mb-1 ">
                            TOTAL INVESTED
                          </div>
                          <div className="text-xs sm:text-lg text-[#FF6A00] font-body1 tracking-widest ">
                            {box.tokens}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest mb-1">
                            APY
                          </div>
                          <div className="text-xs sm:text-lg text-[#FF6A00] font-body1 tracking-widest ">
                            {box.percentage}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest mb-1">
                            TOTAL EARNED
                          </div>
                          <div className="text-xs sm:text-lg text-[#FF6A00] font-body1 tracking-widest ">
                            {box.return_token}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest mb-1">
                            PERIOD
                          </div>
                          <div className="text-xs sm:text-lg text-[#FF6A00] font-body1 tracking-widest ">
                            {new Date(box.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {/* Timer Section - Only for locked boxes */}
                      {box.is_locked && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest">
                              TIME TO UNLOCK
                            </span>
                            <CountdownTimer
                              targetDate={box.locked_till}
                              onComplete={() => {
                                // Refresh data when countdown completes
                                fetchCryptoBoxes();
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Lotteries */}
              {activeTab === 4 && (
                <div>
                  {/* Sub-tabs for lotteries */}
                  <div className="flex gap-2 sm:gap-6 mb-8">
                    {LOTTERY_TABS.map((tab, idx) => (
                      <button
                        key={tab}
                        className={`px-4 sm:px-8 py-2 rounded-full font-body1 text-sm sm:text-base tracking-wide transition-all duration-200 focus:outline-none whitespace-nowrap
                      ${
                        lotteryTab === idx
                          ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white "
                          : "bg-[#000000] text-white border border-[#232b36]"
                      }
                    `}
                        onClick={() => setLotteryTab(idx)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {/* Filter lotteries based on sub-tab */}
                  {(() => {
                    let filteredLotteries = lotteries;
                    if (lotteryTab === 1) {
                      // Active
                      filteredLotteries = lotteries.filter(
                        (lot) => lot.won > 0
                      );
                    }
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                        {filteredLotteries.map((lot, idx) => (
                          <div
                            key={idx}
                            className="bg-[#181f29]/80 border border-[#232b36] rounded-2xl  p-4 sm:p-8 flex flex-col items-center relative overflow-hidden"
                          >
                            {/* Card background image */}
                            <img
                              src={LOTTERY_CARD_BG}
                              alt="bg"
                              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none rounded-2xl"
                            />
                            <div className="relative z-10 w-full flex flex-col items-center">
                              <div className="text-lg text-white tracking-widest mb-2">
                                {lot.title}
                              </div>
                              <img
                                src={lot.image}
                                alt="lottery"
                                className="w-32 h-32 object-contain mb-4"
                              />
                              <div className="text-xl text-white font-heading tracking-widest mb-2">
                                WON ${lot.won}
                              </div>
                              <button className="w-full py-2 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white text-base ">
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
              {/* Signal Channels */}
              {activeTab === 3 && (
                <div>
                  {profileLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="flex flex-col items-center justify-center">
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
                            stroke="url(#gradientStroke)"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray="31.4 31.4"
                          />
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
                        </svg>
                        <span className="text-xl bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent font-body1">
                          Loading...
                        </span>
                      </div>
                    </div>
                  ) : !hasTelegramId ? (
                    // Show "Link Telegram" message if no telegramId
                    <div className="flex items-center justify-center h-auto">
                      <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-8 max-w-md w-full mx-4 text-center">
                        <div className="mb-6">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                            </svg>
                          </div>
                          <h3 className="text-xl sm:text-3xl text-white font-header tracking-wide mb-3">
                            Link Your Telegram
                          </h3>
                          <p className="text-[#b0b8c1] text-base leading-relaxed mb-6 font-body1">
                            To access Signal Channels, please link your Telegram
                            account first. This allows you to receive trading
                            signals.
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            (window.location.href =
                              "/profile?tab=connectTelegram")
                          }
                          className="w-full py-3 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-medium text-base transition-all duration-300 hover:opacity-90 font-body1"
                        >
                          Link Telegram Account
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Show signal channels content if user has telegramId
                    <>
                      {servicesLoading ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="flex flex-col items-center justify-center">
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
                                stroke="url(#gradientStroke)"
                                strokeWidth="5"
                                fill="none"
                                strokeDasharray="31.4 31.4"
                              />
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
                            </svg>
                            <span className="text-xl font-header bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent">
                              Loading Services...
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Top Box - User Active Services Status */}
                          <div className="w-full bg-[#010510] border border-[#232b36] rounded-3xl p-6 mb-8">
                            <h3 className="text-xl sm:text-3xl text-white font-header tracking-wide mb-6">
                              Signal Channel License Status
                            </h3>

                            {hasSignalChannelLicense ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#0AC488]/10 border border-[#0AC488]/20 rounded-2xl p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 bg-[#0AC488] rounded-full"></div>
                                    <span className="text-[#0AC488] font-medium font-body1">
                                      Status: Active
                                    </span>
                                  </div>
                                  <p className="text-[#b0b8c1] text-sm font-body1">
                                    Your Signal Channel subscription is active
                                  </p>
                                </div>

                                <div className="bg-[#E0103A]/10 border border-[#E0103A]/20 rounded-2xl p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 bg-[#E0103A] rounded-full"></div>
                                    <span className="text-[#E0103A] font-medium font-body1">
                                      Expires In:
                                    </span>
                                  </div>
                                  <div className="text-2xl  text-[#E0103A] font-body1">
                                    {(() => {
                                      const signalService =
                                        userActiveServices.find(
                                          (service) =>
                                            service.productName ===
                                            "Signal Channel"
                                        );
                                      if (
                                        signalService &&
                                        signalService.expiresAt
                                      ) {
                                        return (
                                          <CountdownTimer
                                            targetDate={signalService.expiresAt}
                                            onComplete={() => {
                                              setHasSignalChannelLicense(false);
                                            }}
                                            expiredLabel="EXPIRED"
                                            className
                                          />
                                        );
                                      }
                                      return "N/A";
                                    })()}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-[#E0103A]/10 border border-[#E0103A]/20 rounded-2xl p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="w-3 h-3 bg-[#E0103A] rounded-full"></div>
                                      <span className="text-[#E0103A] font-medium text-sm  sm:text-lg  font-header">
                                        Status: No Active License
                                      </span>
                                    </div>
                                    <p className="text-[#b0b8c1] text-xs sm:text-sm font-body1">
                                      You don't have an active Signal Channel
                                      license.{" "}
                                      <span className="text-[#0AC488] text-xs sm:text-sm font-body1">
                                        Get 1 week free trial when you join.
                                      </span>
                                    </p>
                                  </div>
                                  <div className="sm:ml-4 w-full sm:w-auto">
                                    <button
                                      onClick={() =>
                                        (window.location.href =
                                          "/signal-channel")
                                      }
                                      className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-full bg-[#E0103A] text-white font-medium text-xs sm:text-sm transition-all duration-300 hover:opacity-90 hover:scale-105 font-body1"
                                    >
                                      Buy License
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bottom Box - Channel Information */}
                          <div className="w-full bg-[#010510] border border-[#232b36] rounded-3xl p-8">
                            <div className="text-center">
                              <h3 className="text-2xl sm:text-4xl text-white font-header tracking-wide mb-3">
                                SignalX
                              </h3>

                              <div className="flex items-center justify-center gap-8 mb-8">
                                <div className="text-center">
                                  <div className="text-3xl sm:text-5xl font-header text-[#0AC488] mb-1">
                                    1K+
                                  </div>
                                  <div className="text-[#b0b8c1] text-sm font-body1">
                                    Members
                                  </div>
                                </div>

                                <div className="w-px h-12 bg-[#232b36]"></div>

                                <div className="text-center">
                                  <div className="text-3xl sm:text-5xl font-header text-[#33A0EA] mb-1">
                                    24/7
                                  </div>
                                  <div className="text-[#b0b8c1] text-sm font-body1">
                                    Signals
                                  </div>
                                </div>
                              </div>

                              <p className="text-[#b0b8c1] text-base leading-relaxed mb-6 max-w-2xl mx-auto font-body1">
                                Join our premium forex signals for real-time
                                trading opportunities, market analysis, and
                                expert insights to maximize your trading
                                potential.
                              </p>

                              {/* Telegram Membership Status */}
                              {hasTelegramId && <div className="mb-6"></div>}

                              <button
                                onClick={handleJoinChannel}
                                disabled={
                                  telegramMembershipLoading ||
                                  inviteLinkLoading ||
                                  telegramMembershipStatus === "member"
                                }
                                className={`px-12 py-4 rounded-full font-body1 text-white font-medium text-lg transition-all duration-300 ${
                                  telegramMembershipStatus === "member"
                                    ? "bg-gray-500 cursor-not-allowed font-body1"
                                    : "bg-gradient-to-r from-[#33A0EA] font-body1 to-[#0AC488] hover:opacity-90 hover:scale-105"
                                }`}
                              >
                                {telegramMembershipLoading ||
                                inviteLinkLoading ? (
                                  <div className="flex items-center gap-2">
                                    <svg
                                      className="animate-spin h-5 w-5"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                      />
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      />
                                    </svg>
                                    {telegramMembershipLoading
                                      ? "Checking..."
                                      : "Creating Invite..."}
                                  </div>
                                ) : telegramMembershipStatus === "member" ? (
                                  "Already Joined ✓"
                                ) : hasSignalChannelLicense ? (
                                  "Join Channel"
                                ) : (
                                  "Join Channel"
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {activeTab === 5 && (
                <div className="flex items-center justify-center h-64">
                  <span className="text-white text-xl sm:text-2xl tracking-widest font-body1">
                    NO PRODUCT AVAILABLE
                  </span>
                </div>
              )}
              {activeTab === 1 && (
                <div className="w-full element relative overflow-y-auto">
                  <div className="w-full space-y-8 transition-all duration-300">
                    {/* VPN License Status Box - Show when no active license */}
                    {!hasActiveVpnLicense && (
                      <div className="bg-[#010510] border border-[#E0103A] rounded-3xl p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-3 h-3 bg-[#E0103A] rounded-full"></div>
                              <span className="text-[#E0103A] font-medium text-lg sm:text-xl font-header">
                                VPN License Required
                              </span>
                            </div>
                            <p className="text-[#b0b8c1] text-sm sm:text-base font-body1">
                              You don't have an active VPN license. Purchase a
                              VPN license to access secure VPN services.
                            </p>
                          </div>
                          <div className="sm:ml-4 w-full sm:w-auto">
                            <button
                              onClick={() => window.open("/ipvpn", "_blank")}
                              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-medium text-sm sm:text-base transition-all duration-300 hover:opacity-90 hover:scale-105 font-body1"
                            >
                              Purchase Now
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Server Selection Section - Always show */}
                    <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8">
                      <h2 className="text-xl sm:text-3xl text-white font-header heading tracking-widest mb-6">
                        SERVER SELECTION
                      </h2>

                      {/* Current Server Info */}
                      {hasInitialVpnConfigs && currentServerName && (
                        <div className="mb-4">
                          <div className="text-sm sm:text-lg text-[#0AC488] font-header tracking-widest mb-2">
                            CURRENT SERVER:{" "}
                            <span className="font-body1">
                              {currentServerName}
                            </span>
                          </div>
                          <div className="text-xs text-[#b0b8c1] font-body1">
                            You can switch to a different server below
                          </div>
                        </div>
                      )}

                      <div className="mb-2">
                        <label className="block text-sm sm:text-lg text-[#b0b8c1] font-header tracking-widest mb-3">
                          {hasInitialVpnConfigs
                            ? "SWITCH TO SERVER"
                            : "AVAILABLE SERVERS"}
                        </label>
                        {serversLoading ? (
                          <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 text-sm text-white font-body1">
                            Loading servers...
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            {/* Custom Dropdown */}
                            <div
                              className="relative w-2/3 sm:flex-1"
                              ref={serverDropdownRef}
                            >
                              <button
                                type="button"
                                className={`w-full font-body1 bg-[#000000] border border-[#232b36] text-white rounded-lg p-3 flex items-center justify-between focus:outline-none ${
                                  switchingServer
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() =>
                                  !switchingServer &&
                                  setIsServerDropdownOpen((v) => !v)
                                }
                              >
                                <span className="truncate font-body1">
                                  {selectedServer ||
                                    (hasInitialVpnConfigs
                                      ? "Switch to different server"
                                      : "Select a server")}
                                </span>
                                <svg
                                  className={`w-4 h-4 transition-transform ${
                                    isServerDropdownOpen ? "rotate-180" : ""
                                  }`}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6 9l6 6 6-6"
                                    stroke="#b0b8c1"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                              {isServerDropdownOpen && (
                                <div className="absolute z-20 mt-2 w-full bg-[#010510] border border-[#232b36] rounded-lg shadow-lg overflow-hidden">
                                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    {(servers || []).length === 0 && (
                                      <div className="px-3 py-2 text-sm text-[#b0b8c1] font-body1">
                                        No servers available
                                      </div>
                                    )}
                                    {(servers || []).map((srv, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        className={`w-full text-left px-3 py-2 text-sm transition-colors  font-body1 ${
                                          srv === selectedServer
                                            ? "bg-[#0b1621] text-white"
                                            : "text-[#b0b8c1]  hover:bg-[#0b1621] hover:text-white"
                                        }`}
                                        onClick={() => {
                                          handleServerSelectionChange(srv);
                                          setIsServerDropdownOpen(false);
                                        }}
                                      >
                                        {srv}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              disabled={
                                !selectedServer ||
                                switchingServer ||
                                (hasInitialVpnConfigs &&
                                  selectedServer === currentServerName)
                              }
                              onClick={() => {
                                if (!selectedServer) return;
                                setPendingServerName(selectedServer);
                                setShowSwitchConfirmModal(true);
                              }}
                              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                !selectedServer ||
                                switchingServer ||
                                (hasInitialVpnConfigs &&
                                  selectedServer === currentServerName)
                                  ? "bg-[#232b36] text-[#b0b8c1] font-body1 cursor-not-allowed"
                                  : "bg-gradient-to-r from-[#33A0EA] font-body1 to-[#0AC488] text-white hover:opacity-90"
                              }`}
                            >
                              {switchingServer ? "Generating..." : "Generate"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* VPN Configuration Section */}
                    <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8">
                      <h2 className="text-xl sm:text-3xl text-white font-header heading tracking-widest mb-6">
                        VPN CONFIGURATION
                      </h2>

                      {/* License Info */}
                      {(vpnExpiresAt ||
                        vpnDevices !== null ||
                        vpnIsDisabled !== null) && (
                        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {vpnDevices !== null && (
                            <div>
                              <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                DEVICES
                              </div>
                              <div className="text-sm text-white">
                                {vpnDevices}
                              </div>
                            </div>
                          )}
                          {vpnExpiresAt && (
                            <div>
                              <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                EXPIRES AT
                              </div>
                              <div className="text-sm text-white font-body1">
                                <CountdownTimer
                                  targetDate={vpnExpiresAt}
                                  expiredLabel="EXPIRED"
                                />
                              </div>
                            </div>
                          )}

                          {vpnIsDisabled !== null && (
                            <div className="sm:col-span-2 lg:col-span-1">
                              <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                STATUS
                              </div>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-body1 font-medium ${
                                  vpnIsDisabled
                                    ? "bg-[#3a1f1f] text-[#ff6b6b] border border-[#ff6b6b33]"
                                    : "bg-[#1f3a2e] text-[#0AC488] border border-[#0AC48833]"
                                }`}
                              >
                                {vpnIsDisabled ? "RESTRICTED" : "ACTIVE"}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Configuration String */}
                      <div className="mb-6">
                        <div className="text-sm sm:text-lg text-[#b0b8c1] font-header tracking-widest mb-3">
                          YOUR VPN ACCESS KEY
                        </div>
                        {vpnLoading ? (
                          <div className="relative">
                            <div className="bg-[#000000] border border-[#232b36] rounded-lg p-8 flex items-center justify-center">
                              <div className="flex flex-col items-center justify-center">
                                <svg
                                  className="animate-spin mb-3"
                                  width="40"
                                  height="40"
                                  viewBox="0 0 50 50"
                                >
                                  <circle
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    stroke="url(#gradientStroke)"
                                    strokeWidth="5"
                                    fill="none"
                                    strokeDasharray="31.4 31.4"
                                  />
                                  <defs>
                                    <linearGradient
                                      id="gradientStroke"
                                      x1="0"
                                      y1="0"
                                      x2="1"
                                      y2="1"
                                    >
                                      <stop
                                        offset="9.17%"
                                        stopColor="#33A0EA"
                                      />
                                      <stop
                                        offset="83.83%"
                                        stopColor="#0AC488"
                                      />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <span className="text-sm font-body1 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent">
                                  Loading VPN Access Key...
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : vpnAccessKeys.length === 0 ? (
                          <div className="relative">
                            <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 pr-12  text-sm text-[#33A0EA] break-all font-body1">
                              {vpnLoading
                                ? "Loading VPN configurations..."
                                : showServerSelection && !selectedServer
                                ? "Please select a server from above to get your VPN access key."
                                : showServerSelection && selectedServer
                                ? "No VPN access key found for the selected server. Please try another server."
                                : "Checking for existing VPN configurations..."}
                            </div>
                          </div>
                        ) : (
                          vpnAccessKeys.map((key, idx) => (
                            <div className="relative mb-4" key={idx}>
                              <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 pr-12  text-sm text-[#33A0EA] break-all font-body1">
                                {key}
                              </div>
                              <button
                                onClick={() => handleVpnKeyCopy(key)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-[#232b36] rounded-md transition-colors"
                              >
                                <img
                                  src="/assets/images/copy-icon.png"
                                  alt="Copy"
                                  className="w-5 h-5"
                                />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8">
                      <h2 className="text-xl sm:text-3xl text-white font-header tracking-widest mb-6">
                        SETUP INSTRUCTIONS
                      </h2>

                      <div className="text-[#b0b8c1] space-y-6">
                        <p className="text-base leading-relaxed font-body1">
                          Use this server to safely access the open internet:
                        </p>

                        {/* Step 2 */}
                        <div>
                          <h3 className="text-lg text-white font-header tracking-wide mb-3">
                            1) Copy your connection string
                          </h3>
                          <p className="text-base leading-relaxed font-body1">
                            You have received a connection string that starts
                            with{" "}
                            <span className="text-[#33A0EA]  font-body1">
                              ss://
                            </span>
                            . Copy this connection string using the copy button
                            above.
                          </p>
                        </div>

                        {/* Step 3 */}
                        <div>
                          <h3 className="text-lg text-white font-header tracking-wide mb-3">
                            2) Connect using the Outline app
                          </h3>
                          <p className="text-base leading-relaxed font-body1">
                            Open the Outline client app. If your connection
                            string is auto-detected, tap "Connect" and proceed.
                            If your connection string is not auto-detected, then
                            paste it in the field, then tap "Connect" and
                            proceed.
                          </p>
                        </div>

                        {/* Final Step */}
                        <div className="bg-gradient-to-r from-[#33A0EA]/10 to-[#0AC488]/10 border border-[#33A0EA]/20 rounded-lg p-4">
                          <p className="text-base text-[#20E0B2] font-semibold font-body1">
                            🎉 You're ready to use the open internet!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Services Tab */}
              {activeTab === 2 &&
                (services === 1 ? (
                  <div className="">
                    <BackButton setServices={setServices} />
                    <div className="flex flex-wrap justify-between items-center gap-10">
                      {cryptoBoxes.map((box, idx) => (
                        <div
                          key={box.cryptoBoxId}
                          className="bg-[##010510] border border-[#232b36] rounded-3xl p-4 sm:p-8 min-w-[220px] max-w-full md:min-w-[340px] md:max-w-[370px] w-full md:flex-1 flex flex-col relative mb-4 md:mb-0"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <img
                                src="/assets/images/bfm-logo.png"
                                alt="logo"
                                className="w-10 h-10"
                              />
                              <span className="text-sm sm:text-lg text-white tracking-widest font-body1">
                                BENEFIT MINE{" "}
                                <span className="rounded-md text-[#000] text-xs font-body1 bg-[#C6C6C6] px-1 py-1">
                                  BFM
                                </span>
                              </span>
                            </div>
                            {box.is_lottery === true ? (
                              <div className="flex flex-col items-center">
                                <img
                                  src="/lottery/cryptobox.svg"
                                  alt="cryptobox"
                                  className="w-20 h-20"
                                />
                                <p className="text-sm text-white tracking-widest ">
                                  Box Lottery
                                </p>
                              </div>
                            ) : null}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6 mt-2">
                            <div>
                              <div className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest mb-1 ">
                                TOTAL INVESTED
                              </div>
                              <div className="text-xs sm:text-lg text-[#FF6A00] font-body1 tracking-widest ">
                                {box.tokens}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest mb-1">
                                APY
                              </div>
                              <div className="text-xs sm:text-lg text-[#FF6A00] font-body1 tracking-widest ">
                                {box.percentage}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest mb-1">
                                TOTAL EARNED
                              </div>
                              <div className="text-xs sm:text-lg text-[#FF6A00] font-body1 tracking-widest ">
                                {box.return_token}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest mb-1">
                                PERIOD
                              </div>
                              <div className="text-xs sm:text-lg text-[#FF6A00] font-body1 tracking-widest ">
                                {new Date(box.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {/* Timer Section - Only for locked boxes */}
                          {box.is_locked && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] sm:text-xs text-[#b0b8c1] font-header tracking-widest">
                                  TIME TO UNLOCK
                                </span>
                                <CountdownTimer
                                  targetDate={box.locked_till}
                                  onComplete={() => {
                                    // Refresh data when countdown completes
                                    fetchCryptoBoxes();
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : services === 2 ? (
                  <div>
                    <BackButton setServices={setServices} />
                    <div className="w-full element relative overflow-y-auto">
                      <div className="w-full space-y-8 transition-all duration-300">
                        {/* VPN License Status Box - Show when no active license */}
                        {!hasActiveVpnLicense && (
                          <div className="bg-[#010510] border border-[#E0103A] rounded-3xl p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-3 h-3 bg-[#E0103A] rounded-full"></div>
                                  <span className="text-[#E0103A] font-medium text-lg sm:text-xl font-header">
                                    VPN License Required
                                  </span>
                                </div>
                                <p className="text-[#b0b8c1] text-sm sm:text-base font-body1">
                                  You don't have an active VPN license. Purchase
                                  a VPN license to access secure VPN services.
                                </p>
                              </div>
                              <div className="sm:ml-4 w-full sm:w-auto">
                                <button
                                  onClick={() =>
                                    window.open("/ipvpn", "_blank")
                                  }
                                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-medium text-sm sm:text-base transition-all duration-300 hover:opacity-90 hover:scale-105 font-body1"
                                >
                                  Purchase Now
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Server Selection Section - Always show */}
                        <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8">
                          <h2 className="text-xl sm:text-3xl text-white font-header heading tracking-widest mb-6">
                            SERVER SELECTION
                          </h2>

                          {/* Current Server Info */}
                          {hasInitialVpnConfigs && currentServerName && (
                            <div className="mb-4">
                              <div className="text-sm sm:text-lg text-[#0AC488] font-header tracking-widest mb-2">
                                CURRENT SERVER:{" "}
                                <span className="font-body1">
                                  {currentServerName}
                                </span>
                              </div>
                              <div className="text-xs text-[#b0b8c1] font-body1">
                                You can switch to a different server below
                              </div>
                            </div>
                          )}

                          <div className="mb-2">
                            <label className="block text-sm sm:text-lg text-[#b0b8c1] font-header tracking-widest mb-3">
                              {hasInitialVpnConfigs
                                ? "SWITCH TO SERVER"
                                : "AVAILABLE SERVERS"}
                            </label>
                            {serversLoading ? (
                              <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 text-sm text-white font-body1">
                                Loading servers...
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3">
                                {/* Custom Dropdown */}
                                <div
                                  className="relative w-2/3 sm:flex-1"
                                  ref={serverDropdownRef}
                                >
                                  <button
                                    type="button"
                                    className={`w-full font-body1 bg-[#000000] border border-[#232b36] text-white rounded-lg p-3 flex items-center justify-between focus:outline-none ${
                                      switchingServer
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      !switchingServer &&
                                      setIsServerDropdownOpen((v) => !v)
                                    }
                                  >
                                    <span className="truncate font-body1">
                                      {selectedServer ||
                                        (hasInitialVpnConfigs
                                          ? "Switch to different server"
                                          : "Select a server")}
                                    </span>
                                    <svg
                                      className={`w-4 h-4 transition-transform ${
                                        isServerDropdownOpen ? "rotate-180" : ""
                                      }`}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M6 9l6 6 6-6"
                                        stroke="#b0b8c1"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                  {isServerDropdownOpen && (
                                    <div className="absolute z-20 mt-2 w-full bg-[#010510] border border-[#232b36] rounded-lg shadow-lg overflow-hidden">
                                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                        {(servers || []).length === 0 && (
                                          <div className="px-3 py-2 text-sm text-[#b0b8c1] font-body1">
                                            No servers available
                                          </div>
                                        )}
                                        {(servers || []).map((srv, idx) => (
                                          <button
                                            key={idx}
                                            type="button"
                                            className={`w-full text-left px-3 py-2 text-sm transition-colors font-body1 ${
                                              srv === selectedServer
                                                ? "bg-[#0b1621] text-white"
                                                : "text-[#b0b8c1] hover:bg-[#0b1621] hover:text-white"
                                            }`}
                                            onClick={() => {
                                              handleServerSelectionChange(srv);
                                              setIsServerDropdownOpen(false);
                                            }}
                                          >
                                            {srv}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  disabled={
                                    !selectedServer ||
                                    switchingServer ||
                                    (hasInitialVpnConfigs &&
                                      selectedServer === currentServerName)
                                  }
                                  onClick={() => {
                                    if (!selectedServer) return;
                                    setPendingServerName(selectedServer);
                                    setShowSwitchConfirmModal(true);
                                  }}
                                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                    !selectedServer ||
                                    switchingServer ||
                                    (hasInitialVpnConfigs &&
                                      selectedServer === currentServerName)
                                      ? "bg-[#232b36] text-[#b0b8c1] font-body1 cursor-not-allowed"
                                      : "bg-gradient-to-r from-[#33A0EA] font-body1 to-[#0AC488] text-white hover:opacity-90"
                                  }`}
                                >
                                  {switchingServer
                                    ? "Generating..."
                                    : "Generate"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* VPN Configuration Section */}
                        <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8">
                          <h2 className="text-xl sm:text-3xl text-white font-header heading tracking-widest mb-6">
                            VPN CONFIGURATION
                          </h2>

                          {/* License Info */}
                          {(vpnExpiresAt ||
                            vpnDevices !== null ||
                            vpnIsDisabled !== null) && (
                            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {vpnDevices !== null && (
                                <div>
                                  <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                    DEVICES
                                  </div>
                                  <div className="text-sm text-white">
                                    {vpnDevices}
                                  </div>
                                </div>
                              )}
                              {vpnExpiresAt && (
                                <div>
                                  <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                    EXPIRES AT
                                  </div>
                                  <div className="text-sm text-white font-body1">
                                    <CountdownTimer
                                      targetDate={vpnExpiresAt}
                                      expiredLabel="EXPIRED"
                                    />
                                  </div>
                                </div>
                              )}

                              {vpnIsDisabled !== null && (
                                <div className="sm:col-span-2 lg:col-span-1">
                                  <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                    STATUS
                                  </div>
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-body1 font-medium ${
                                      vpnIsDisabled
                                        ? "bg-[#3a1f1f] text-[#ff6b6b] border border-[#ff6b6b33]"
                                        : "bg-[#1f3a2e] text-[#0AC488] border border-[#0AC48833]"
                                    }`}
                                  >
                                    {vpnIsDisabled ? "RESTRICTED" : "ACTIVE"}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Configuration String */}
                          <div className="mb-6">
                            <div className="text-sm sm:text-lg text-[#b0b8c1] font-header tracking-widest mb-3">
                              YOUR VPN ACCESS KEY
                            </div>
                            {vpnLoading ? (
                              <div className="relative">
                                <div className="bg-[#000000] border border-[#232b36] rounded-lg p-8 flex items-center justify-center">
                                  <div className="flex flex-col items-center justify-center">
                                    <svg
                                      className="animate-spin mb-3"
                                      width="40"
                                      height="40"
                                      viewBox="0 0 50 50"
                                    >
                                      <circle
                                        cx="25"
                                        cy="25"
                                        r="20"
                                        stroke="url(#gradientStroke)"
                                        strokeWidth="5"
                                        fill="none"
                                        strokeDasharray="31.4 31.4"
                                      />
                                      <defs>
                                        <linearGradient
                                          id="gradientStroke"
                                          x1="0"
                                          y1="0"
                                          x2="1"
                                          y2="1"
                                        >
                                          <stop
                                            offset="9.17%"
                                            stopColor="#33A0EA"
                                          />
                                          <stop
                                            offset="83.83%"
                                            stopColor="#0AC488"
                                          />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                    <span className="text-sm font-body1 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent">
                                      Loading VPN Access Key...
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : vpnAccessKeys.length === 0 ? (
                              <div className="relative">
                                <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 pr-12  text-sm text-[#33A0EA] break-all font-body1">
                                  {vpnLoading
                                    ? "Loading VPN configurations..."
                                    : showServerSelection && !selectedServer
                                    ? "Please select a server from above to get your VPN access key."
                                    : showServerSelection && selectedServer
                                    ? "No VPN access key found for the selected server. Please try another server."
                                    : "Checking for existing VPN configurations..."}
                                </div>
                              </div>
                            ) : (
                              vpnAccessKeys.map((key, idx) => (
                                <div className="relative mb-4" key={idx}>
                                  <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 pr-12  text-sm text-[#33A0EA] break-all font-body1">
                                    {key}
                                  </div>
                                  <button
                                    onClick={() => handleVpnKeyCopy(key)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-[#232b36] rounded-md transition-colors"
                                  >
                                    <img
                                      src="/assets/images/copy-icon.png"
                                      alt="Copy"
                                      className="w-5 h-5"
                                    />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8">
                          <h2 className="text-xl sm:text-3xl text-white font-header tracking-widest mb-6">
                            SETUP INSTRUCTIONS
                          </h2>

                          <div className="text-[#b0b8c1] space-y-6">
                            <p className="text-base leading-relaxed font-body1">
                              Use this server to safely access the open
                              internet:
                            </p>

                            {/* Step 2 */}
                            <div>
                              <h3 className="text-lg text-white font-header tracking-wide mb-3">
                                1) Copy your connection string
                              </h3>
                              <p className="text-base leading-relaxed font-body1">
                                You have received a connection string that
                                starts with{" "}
                                <span className="text-[#33A0EA]  font-body1">
                                  ss://
                                </span>
                                . Copy this connection string using the copy
                                button above.
                              </p>
                            </div>

                            {/* Step 3 */}
                            <div>
                              <h3 className="text-lg text-white font-header tracking-wide mb-3">
                                2) Connect using the Outline app
                              </h3>
                              <p className="text-base leading-relaxed font-body1">
                                Open the Outline client app. If your connection
                                string is auto-detected, tap "Connect" and
                                proceed. If your connection string is not
                                auto-detected, then paste it in the field, then
                                tap "Connect" and proceed.
                              </p>
                            </div>

                            {/* Final Step */}
                            <div className="bg-gradient-to-r from-[#33A0EA]/10 to-[#0AC488]/10 border border-[#33A0EA]/20 rounded-lg p-4">
                              <p className="text-base text-[#20E0B2] font-semibold font-body1">
                                🎉 You're ready to use the open internet!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : services === 3 ? (
                  <div>
                    <BackButton setServices={setServices} />
                    <div>
                      {profileLoading ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="flex flex-col items-center justify-center">
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
                                stroke="url(#gradientStroke)"
                                strokeWidth="5"
                                fill="none"
                                strokeDasharray="31.4 31.4"
                              />
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
                            </svg>
                            <span className="text-xl bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent font-body1">
                              Loading...
                            </span>
                          </div>
                        </div>
                      ) : !hasTelegramId ? (
                        // Show "Link Telegram" message if no telegramId
                        <div className="flex items-center justify-center h-auto">
                          <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-8 max-w-md w-full mx-4 text-center">
                            <div className="mb-6">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] rounded-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                                </svg>
                              </div>
                              <h3 className="text-xl sm:text-3xl text-white font-header tracking-wide mb-3">
                                Link Your Telegram
                              </h3>
                              <p className="text-[#b0b8c1] text-base leading-relaxed mb-6 font-body1">
                                To access Signal Channels, please link your
                                Telegram account first. This allows you to
                                receive trading signals.
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                (window.location.href =
                                  "/profile?tab=connectTelegram")
                              }
                              className="w-full py-3 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-medium text-base transition-all duration-300 hover:opacity-90 font-body1"
                            >
                              Link Telegram Account
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Show signal channels content if user has telegramId
                        <>
                          {servicesLoading ? (
                            <div className="flex items-center justify-center h-64">
                              <div className="flex flex-col items-center justify-center">
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
                                    stroke="url(#gradientStroke)"
                                    strokeWidth="5"
                                    fill="none"
                                    strokeDasharray="31.4 31.4"
                                  />
                                  <defs>
                                    <linearGradient
                                      id="gradientStroke"
                                      x1="0"
                                      y1="0"
                                      x2="1"
                                      y2="1"
                                    >
                                      <stop
                                        offset="9.17%"
                                        stopColor="#33A0EA"
                                      />
                                      <stop
                                        offset="83.83%"
                                        stopColor="#0AC488"
                                      />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <span className="text-xl font-header bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent">
                                  Loading Services...
                                </span>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Top Box - User Active Services Status */}
                              <div className="w-full bg-[#010510] border border-[#232b36] rounded-3xl p-6 mb-8">
                                <h3 className="text-xl sm:text-3xl text-white font-header tracking-wide mb-6">
                                  Signal Channel License Status
                                </h3>

                                {hasSignalChannelLicense ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#0AC488]/10 border border-[#0AC488]/20 rounded-2xl p-4">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="w-3 h-3 bg-[#0AC488] rounded-full"></div>
                                        <span className="text-[#0AC488] font-medium font-body1">
                                          Status: Active
                                        </span>
                                      </div>
                                      <p className="text-[#b0b8c1] text-sm font-body1">
                                        Your Signal Channel subscription is
                                        active
                                      </p>
                                    </div>

                                    <div className="bg-[#E0103A]/10 border border-[#E0103A]/20 rounded-2xl p-4">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="w-3 h-3 bg-[#E0103A] rounded-full"></div>
                                        <span className="text-[#E0103A] font-medium font-body1">
                                          Expires In:
                                        </span>
                                      </div>
                                      <div className="text-2xl  text-[#E0103A] font-body1">
                                        {(() => {
                                          const signalService =
                                            userActiveServices.find(
                                              (service) =>
                                                service.productName ===
                                                "Signal Channel"
                                            );
                                          if (
                                            signalService &&
                                            signalService.expiresAt
                                          ) {
                                            return (
                                              <CountdownTimer
                                                targetDate={
                                                  signalService.expiresAt
                                                }
                                                onComplete={() => {
                                                  setHasSignalChannelLicense(
                                                    false
                                                  );
                                                }}
                                                expiredLabel="EXPIRED"
                                                className
                                              />
                                            );
                                          }
                                          return "N/A";
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-[#E0103A]/10 border border-[#E0103A]/20 rounded-2xl p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                          <div className="w-3 h-3 bg-[#E0103A] rounded-full"></div>
                                          <span className="text-[#E0103A] font-medium text-sm  sm:text-lg  font-header">
                                            Status: No Active License
                                          </span>
                                        </div>
                                        <p className="text-[#b0b8c1] text-xs sm:text-sm font-body1">
                                          You don't have an active Signal
                                          Channel license.{" "}
                                          <span className="text-[#0AC488] text-xs sm:text-sm font-body1">
                                            Get 1 week free trial when you join.
                                          </span>
                                        </p>
                                      </div>
                                      <div className="sm:ml-4 w-full sm:w-auto">
                                        <button
                                          onClick={() =>
                                            (window.location.href =
                                              "/signal-channel")
                                          }
                                          className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-full bg-[#E0103A] text-white font-medium text-xs sm:text-sm transition-all duration-300 hover:opacity-90 hover:scale-105 font-body1"
                                        >
                                          Buy License
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Bottom Box - Channel Information */}
                              <div className="w-full bg-[#010510] border border-[#232b36] rounded-3xl p-8">
                                <div className="text-center">
                                  <h3 className="text-2xl sm:text-4xl text-white font-header tracking-wide mb-3">
                                    SignalX
                                  </h3>

                                  <div className="flex items-center justify-center gap-8 mb-8">
                                    <div className="text-center">
                                      <div className="text-3xl sm:text-5xl font-header text-[#0AC488] mb-1">
                                        1K+
                                      </div>
                                      <div className="text-[#b0b8c1] text-sm font-body1">
                                        Members
                                      </div>
                                    </div>

                                    <div className="w-px h-12 bg-[#232b36]"></div>

                                    <div className="text-center">
                                      <div className="text-3xl sm:text-5xl font-header text-[#33A0EA] mb-1">
                                        24/7
                                      </div>
                                      <div className="text-[#b0b8c1] text-sm font-body1">
                                        Signals
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-[#b0b8c1] text-base leading-relaxed mb-6 max-w-2xl mx-auto font-body1">
                                    Join our premium forex signals for real-time
                                    trading opportunities, market analysis, and
                                    expert insights to maximize your trading
                                    potential.
                                  </p>

                                  {/* Telegram Membership Status */}
                                  {hasTelegramId && (
                                    <div className="mb-6"></div>
                                  )}

                                  <button
                                    onClick={handleJoinChannel}
                                    disabled={
                                      telegramMembershipLoading ||
                                      inviteLinkLoading ||
                                      telegramMembershipStatus === "member"
                                    }
                                    className={`px-12 py-4 rounded-full font-body1 text-white font-medium text-lg transition-all duration-300 ${
                                      telegramMembershipStatus === "member"
                                        ? "bg-gray-500 cursor-not-allowed font-body1"
                                        : "bg-gradient-to-r from-[#33A0EA] font-body1 to-[#0AC488] hover:opacity-90 hover:scale-105"
                                    }`}
                                  >
                                    {telegramMembershipLoading ||
                                    inviteLinkLoading ? (
                                      <div className="flex items-center gap-2">
                                        <svg
                                          className="animate-spin h-5 w-5"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                          />
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          />
                                        </svg>
                                        {telegramMembershipLoading
                                          ? "Checking..."
                                          : "Creating Invite..."}
                                      </div>
                                    ) : telegramMembershipStatus ===
                                      "member" ? (
                                      "Already Joined ✓"
                                    ) : hasSignalChannelLicense ? (
                                      "Join Channel"
                                    ) : (
                                      "Join Channel"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : services === 4 ? (
                  <div>
                    <BackButton setServices={setServices} />
                    <div>
                      {/* Sub-tabs for lotteries */}
                      <div className="flex gap-2 sm:gap-6 mb-8">
                        {LOTTERY_TABS.map((tab, idx) => (
                          <button
                            key={tab}
                            className={`px-4 sm:px-8 py-2 rounded-full font-body1 text-sm sm:text-base tracking-wide transition-all duration-200 focus:outline-none whitespace-nowrap
                      ${
                        lotteryTab === idx
                          ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white "
                          : "bg-[#000000] text-white border border-[#232b36]"
                      }
                    `}
                            onClick={() => setLotteryTab(idx)}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      {/* Filter lotteries based on sub-tab */}
                      {(() => {
                        let filteredLotteries = lotteries;
                        if (lotteryTab === 1) {
                          // Active
                          filteredLotteries = lotteries.filter(
                            (lot) => lot.won > 0
                          );
                        }
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                            {filteredLotteries.map((lot, idx) => (
                              <div
                                key={idx}
                                className="bg-[#181f29]/80 border border-[#232b36] rounded-2xl  p-4 sm:p-8 flex flex-col items-center relative overflow-hidden"
                              >
                                {/* Card background image */}
                                <img
                                  src={LOTTERY_CARD_BG}
                                  alt="bg"
                                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none rounded-2xl"
                                />
                                <div className="relative z-10 w-full flex flex-col items-center">
                                  <div className="text-lg text-white tracking-widest mb-2">
                                    {lot.title}
                                  </div>
                                  <img
                                    src={lot.image}
                                    alt="lottery"
                                    className="w-32 h-32 object-contain mb-4"
                                  />
                                  <div className="text-xl text-white font-heading tracking-widest mb-2">
                                    WON ${lot.won}
                                  </div>
                                  <button className="w-full py-2 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white text-base ">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="w-full element relative md:p-2">
                    <div className="w-full md:space-y-8  transition-all duration-500 ">
                      {/* Mobile Circle Icons */}
                      <div className="w-full md:hidden flex justify-center gap-4 items-center py-2 px-1">
                        <div
                          className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 border ${
                            activeSection === "item-1"
                              ? "border-[#33A0EA]"
                              : "border-white/10"
                          } flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mx-1`}
                          onClick={() => handleSectionChange("item-1")}
                        >
                          <div className="text-lg ">
                            <FaBox />
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
                            <FaLock />
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
                            <FaSignal />
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
                      </div>
                      {/* Services Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Mobile Accordion Sections */}
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
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="group relative  overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 ov transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                                <div className="relative">
                                  <div className="flex-1">
                                    <h3 className="text-[10px] font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                      Staking Boxes{" "}
                                    </h3>
                                  </div>
                                  <div className="md:flex gap-3 md:mt-2 mt-1 space-y-2">
                                    {cryptoBoxes.map((box, idx) => (
                                      <div
                                        key={box.cryptoBoxId}
                                        className="bg-[##010510] border border-[#232b36] rounded-3xl p-2 w-full md:flex-1 flex flex-col relative"
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center gap-1">
                                            <img
                                              src="/assets/images/bfm-logo.png"
                                              alt="logo"
                                              className="md:w-3 md:h-3 w-6 h-6"
                                            />
                                            <span className="md:text-[9px] text-white tracking-widest font-body1">
                                              BENEFIT MINE{" "}
                                              <span className="rounded-md text-[#000] text-[9px] p-1 md:text-[6px] md:p-0.5 font-body1 bg-[#C6C6C6]">
                                                BFM
                                              </span>
                                            </span>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2">
                                          <div>
                                            <div className="md:text-[8px] text-[10px] text-[#b0b8c1] font-header ">
                                              TOTAL INVESTED
                                            </div>
                                            <div className="md:text-[8px] text-[9px] text-[#FF6A00] font-body1 ">
                                              {box.tokens}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="md:text-[8px] text-[10px] text-[#b0b8c1] font-header ">
                                              APY
                                            </div>
                                            <div className="md:text-[8px] text-[9px] text-[#FF6A00] font-body1 ">
                                              {box.percentage}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="md:text-[8px] text-[10px] text-[#b0b8c1] font-header  ">
                                              TOTAL EARNED
                                            </div>
                                            <div className="md:text-[8px] text-[9px] text-[#FF6A00] font-body1  ">
                                              {box.return_token}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="md:text-[8px] text-[10px] text-[#b0b8c1] font-header">
                                              PERIOD
                                            </div>
                                            <div className="md:text-[8px] text-[9px] text-[#FF6A00] font-body1  ">
                                              {new Date(
                                                box.createdAt
                                              ).toLocaleDateString()}
                                            </div>
                                          </div>
                                        </div>
                                        {/* Timer Section - Only for locked boxes */}
                                        {box.is_locked && (
                                          <div className="ml-2">
                                            <div className="">
                                              <span className="md:text-[8px] text-[10px]  text-[#b0b8c1] font-header ">
                                                TIME TO UNLOCK
                                              </span>
                                              <CountdownTimer
                                                targetDate={box.locked_till}
                                                onComplete={() => {
                                                  // Refresh data when countdown completes
                                                  fetchCryptoBoxes();
                                                }}
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="item-2">
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="group relative  overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 ov transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                                <div className="relative z-8">
                                  <div className="flex-1">
                                    <h3 className="text-[10px] font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                      VPN
                                    </h3>
                                  </div>
                                  <div className="w-full element relative overflow-y-auto mt-2">
                                    <div className="w-full space-y- transition-all duration-300">
                                      {/* VPN License Status Box - Show when no active license */}
                                      {!hasActiveVpnLicense && (
                                        <div className="bg-[#010510] border border-[#E0103A] rounded-3xl p-2">
                                          <div className="flex flex-col gap-1">
                                            <div className="flex justify-between">
                                              <div className="flex items-center gap-1 ">
                                                <div className="md:w-1 md:h-1 w-1.5 h-1.5 bg-[#E0103A] rounded-full"></div>
                                                <span className="text-[#E0103A] font-medium md:text-[8px] text-[10px] font-header">
                                                  VPN License Required
                                                </span>
                                              </div>
                                              {/* <p className="text-[#b0b8c1] text-[8px] font-body1">
                                          You don't have an active VPN license.
                                          Purchase a VPN license to access
                                          secure VPN services.
                                        </p> */}

                                              <div className=" flex justify-center">
                                                <button
                                                  onClick={() =>
                                                    window.open(
                                                      "/ipvpn",
                                                      "_blank"
                                                    )
                                                  }
                                                  className="rounded-full p-1 bg-gradient-to-r  from-[#33A0EA] to-[#0AC488] text-white font-medium md:text-[5px] text-[8px] transition-all duration-300 hover:opacity-90  font-body1"
                                                >
                                                  Purchase Now
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Server Selection Section - Always show */}
                                      <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-2 mt-1">
                                        <h2 className="md:text-[8px] text-xs text-white font-header heading mb-1">
                                          SERVER SELECTION
                                        </h2>

                                        {/* Current Server Info */}
                                        {hasInitialVpnConfigs &&
                                          currentServerName && (
                                            <div className="">
                                              <div className="text-xs  text-[#0AC488] font-header tracking-widest">
                                                CURRENT SERVER:{" "}
                                                <span className="font-body1 text-xs">
                                                  {currentServerName}
                                                </span>
                                              </div>
                                              <div className="text-[10px] text-[#b0b8c1] font-body1">
                                                You can switch to a different
                                                server below
                                              </div>
                                            </div>
                                          )}

                                        <div className="mb-2">
                                          <label className="block md:text-[6px] text-[8px] text-[#b0b8c1] font-header tracking-widest mb-1">
                                            {hasInitialVpnConfigs
                                              ? "SWITCH TO SERVER"
                                              : "AVAILABLE SERVERS"}
                                          </label>
                                          {serversLoading ? (
                                            <div className="bg-[#000000] border  border-[#232b36] rounded-lg p-1  text-white font-body1 text-[8px]">
                                              Loading servers...
                                            </div>
                                          ) : (
                                            <div className="flex items-center space-x-1 text-[10px]">
                                              {/* Custom Dropdown */}
                                              <div
                                                className="relative w-full "
                                                ref={serverDropdownRef}
                                              >
                                                <button
                                                  type="button"
                                                  className={`w-full font-body1 bg-[#000000] border border-[#232b36] text-white rounded-lg p-1 flex items-center justify-between focus:outline-none ${
                                                    switchingServer
                                                      ? "opacity-50 cursor-not-allowed"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    !switchingServer &&
                                                    setIsServerDropdownOpen(
                                                      (v) => !v
                                                    )
                                                  }
                                                >
                                                  <span className="truncate font-body1 md:text-[6px] text-[8px]">
                                                    {selectedServer ||
                                                      (hasInitialVpnConfigs
                                                        ? "Switch to different server"
                                                        : "Select a server")}
                                                  </span>
                                                  <svg
                                                    className={`w-4 h-4 transition-transform ${
                                                      isServerDropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <path
                                                      d="M6 9l6 6 6-6"
                                                      stroke="#b0b8c1"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                  </svg>
                                                </button>
                                                {isServerDropdownOpen && (
                                                  <div className="absolute z-50 mt- w-full bg-[#010510] border border-[#232b36] rounded-lg shadow-lg overflow-hidden">
                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                      {(servers || [])
                                                        .length === 0 && (
                                                        <div className="px-3 py-2 text-sm text-[#b0b8c1] font-body1">
                                                          No servers available
                                                        </div>
                                                      )}
                                                      {(servers || []).map(
                                                        (srv, idx) => (
                                                          <button
                                                            key={idx}
                                                            type="button"
                                                            className={`w-full text-left px-3 py-2 text-[8px] transition-colors font-body1 ${
                                                              srv ===
                                                              selectedServer
                                                                ? "bg-[#0b1621] text-white"
                                                                : "text-[#b0b8c1] hover:bg-[#0b1621] hover:text-white"
                                                            }`}
                                                            onClick={(e) => {
                                                              e.preventDefault();
                                                              e.stopPropagation();
                                                              handleServerSelectionChange(
                                                                srv
                                                              );
                                                              setIsServerDropdownOpen(
                                                                false
                                                              );
                                                            }}
                                                          >
                                                            {srv}
                                                          </button>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>

                                              <button
                                                type="button"
                                                disabled={
                                                  !selectedServer ||
                                                  switchingServer ||
                                                  (hasInitialVpnConfigs &&
                                                    selectedServer ===
                                                      currentServerName)
                                                }
                                                onClick={() => {
                                                  if (!selectedServer) return;
                                                  setPendingServerName(
                                                    selectedServer
                                                  );
                                                  setShowSwitchConfirmModal(
                                                    true
                                                  );
                                                }}
                                                className={` rounded-lg text-[8px] p-1 transition-colors ${
                                                  !selectedServer ||
                                                  switchingServer ||
                                                  (hasInitialVpnConfigs &&
                                                    selectedServer ===
                                                      currentServerName)
                                                    ? "bg-[#232b36] text-[#b0b8c1] font-body1 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-[#33A0EA] font-body1 to-[#0AC488] text-white hover:opacity-90"
                                                }`}
                                              >
                                                {switchingServer
                                                  ? "Generating..."
                                                  : "Generate"}
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <Dialog>
                                        <form className="flex items-center justify-center">
                                          <DialogTrigger asChild>
                                            <button
                                              style={{
                                                background:
                                                  "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                                              }}
                                              className="flex items-center gap-2 rounded-lg 
              text-xs font-medium text-white shadow-md transition 
             py-1 px-3  active:scale-95  font-body1 mt-3"
                                            >
                                              View Details
                                            </button>
                                          </DialogTrigger>
                                          <DialogContent className="md:w-[600px]  md:h-[300px] h-[80%] bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5   overflow-y-auto  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20  shadow-xl">
                                            {/* VPN Configuration Section */}
                                            <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8 mt-4">
                                              <h2 className="text-xl sm:text-3xl text-white font-header heading tracking-widest mb-6">
                                                VPN CONFIGURATION
                                              </h2>

                                              {/* License Info */}
                                              {(vpnExpiresAt ||
                                                vpnDevices !== null ||
                                                vpnIsDisabled !== null) && (
                                                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                  {vpnDevices !== null && (
                                                    <div>
                                                      <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                                        DEVICES
                                                      </div>
                                                      <div className="text-sm text-white">
                                                        {vpnDevices}
                                                      </div>
                                                    </div>
                                                  )}
                                                  {vpnExpiresAt && (
                                                    <div>
                                                      <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                                        EXPIRES AT
                                                      </div>
                                                      <div className="text-sm text-white font-body1">
                                                        <CountdownTimer
                                                          targetDate={
                                                            vpnExpiresAt
                                                          }
                                                          expiredLabel="EXPIRED"
                                                        />
                                                      </div>
                                                    </div>
                                                  )}

                                                  {vpnIsDisabled !== null && (
                                                    <div className="flex flex-col items-end justify-end">
                                                      <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1 ">
                                                        STATUS
                                                      </div>
                                                      <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs  sm:text-sm font-body1 font-medium ${
                                                          vpnIsDisabled
                                                            ? "bg-[#3a1f1f] text-[#ff6b6b] border border-[#ff6b6b33]"
                                                            : "bg-[#1f3a2e] text-[#0AC488] border border-[#0AC48833]"
                                                        }`}
                                                      >
                                                        {vpnIsDisabled
                                                          ? "RESTRICTED"
                                                          : "ACTIVE"}
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>
                                              )}

                                              {/* Configuration String */}
                                              <div className="mb-6">
                                                <div className="text-sm sm:text-lg text-[#b0b8c1] font-header tracking-widest mb-3">
                                                  YOUR VPN ACCESS KEY
                                                </div>
                                                {vpnLoading ? (
                                                  <div className="relative">
                                                    <div className="bg-[#000000] border border-[#232b36] rounded-lg p-8 flex items-center justify-center">
                                                      <div className="flex flex-col items-center justify-center">
                                                        <svg
                                                          className="animate-spin mb-3"
                                                          width="40"
                                                          height="40"
                                                          viewBox="0 0 50 50"
                                                        >
                                                          <circle
                                                            cx="25"
                                                            cy="25"
                                                            r="20"
                                                            stroke="url(#gradientStroke)"
                                                            strokeWidth="5"
                                                            fill="none"
                                                            strokeDasharray="31.4 31.4"
                                                          />
                                                          <defs>
                                                            <linearGradient
                                                              id="gradientStroke"
                                                              x1="0"
                                                              y1="0"
                                                              x2="1"
                                                              y2="1"
                                                            >
                                                              <stop
                                                                offset="9.17%"
                                                                stopColor="#33A0EA"
                                                              />
                                                              <stop
                                                                offset="83.83%"
                                                                stopColor="#0AC488"
                                                              />
                                                            </linearGradient>
                                                          </defs>
                                                        </svg>
                                                        <span className="text-sm font-body1 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent">
                                                          Loading VPN Access
                                                          Key...
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ) : vpnAccessKeys.length ===
                                                  0 ? (
                                                  <div className="relative">
                                                    <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 pr-12  text-sm text-[#33A0EA] break-all font-body1">
                                                      {vpnLoading
                                                        ? "Loading VPN configurations..."
                                                        : showServerSelection &&
                                                          !selectedServer
                                                        ? "Please select a server from above to get your VPN access key."
                                                        : showServerSelection &&
                                                          selectedServer
                                                        ? "No VPN access key found for the selected server. Please try another server."
                                                        : "Checking for existing VPN configurations..."}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  vpnAccessKeys.map(
                                                    (key, idx) => (
                                                      <div
                                                        className="relative mb-4"
                                                        key={idx}
                                                      >
                                                        <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 pr-12  text-sm text-[#33A0EA] break-all font-body1">
                                                          {key}
                                                        </div>
                                                        <button
                                                          onClick={() =>
                                                            handleVpnKeyCopy(
                                                              key
                                                            )
                                                          }
                                                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-[#232b36] rounded-md transition-colors"
                                                        >
                                                          <img
                                                            src="/assets/images/copy-icon.png"
                                                            alt="Copy"
                                                            className="w-5 h-5"
                                                          />
                                                        </button>
                                                      </div>
                                                    )
                                                  )
                                                )}
                                              </div>
                                            </div>

                                            {/* Instructions Section */}
                                            <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8">
                                              <h2 className="text-2xl  text-white font-header tracking-widest mb-6">
                                                SETUP INSTRUCTIONS
                                              </h2>

                                              <div className="text-[#b0b8c1] space-y-6">
                                                <p className="text-base leading-relaxed font-body1">
                                                  Use this server to safely
                                                  access the open internet:
                                                </p>

                                                {/* Step 2 */}
                                                <div>
                                                  <h3 className="text-lg text-white font-header tracking-wide mb-3">
                                                    1) Copy your connection
                                                    string
                                                  </h3>
                                                  <p className="text-base leading-relaxed font-body1">
                                                    You have received a
                                                    connection string that
                                                    starts with{" "}
                                                    <span className="text-[#33A0EA]  font-body1">
                                                      ss://
                                                    </span>
                                                    . Copy this connection
                                                    string using the copy button
                                                    above.
                                                  </p>
                                                </div>

                                                {/* Step 3 */}
                                                <div>
                                                  <h3 className="text-lg text-white font-header tracking-wide mb-3">
                                                    2) Connect using the Outline
                                                    app
                                                  </h3>
                                                  <p className="text-base leading-relaxed font-body1">
                                                    Open the Outline client app.
                                                    If your connection string is
                                                    auto-detected, tap "Connect"
                                                    and proceed. If your
                                                    connection string is not
                                                    auto-detected, then paste it
                                                    in the field, then tap
                                                    "Connect" and proceed.
                                                  </p>
                                                </div>

                                                {/* Final Step */}
                                                <div className="bg-gradient-to-r from-[#33A0EA]/10 to-[#0AC488]/10 border border-[#33A0EA]/20 rounded-lg p-4">
                                                  <p className="text-base text-[#20E0B2] font-semibold font-body1">
                                                    🎉 You're ready to use the
                                                    open internet!
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </form>
                                      </Dialog>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="item-3">
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="group relative  overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 ov transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                                <div className="relative z-10 space-y-2">
                                  <div className="flex-1">
                                    <h3 className="text-[10px] font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                      Signal Channels
                                    </h3>
                                  </div>

                                  {/* Top Box - User Active Services Status */}
                                  <div className="w-full bg-[#010510] border border-[#232b36] rounded-3xl p-2">
                                    <h3 className="text-xs text-white font-header tracking-wide mb-2">
                                      Signal Channel License Status
                                    </h3>

                                    {hasSignalChannelLicense ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div className="bg-[#0AC488]/10 border border-[#0AC488]/20 rounded-2xl p-3">
                                          <div className="flex items-center gap-1 mb-1">
                                            <div className="md:w-1 md:h-1 w-1.5 h-1.5 bg-[#0AC488] rounded-full"></div>
                                            <span className="text-[#0AC488] font-medium font-body1 md:text-[10px]">
                                              Status: Active
                                            </span>
                                          </div>
                                          <p className="text-[#b0b8c1] md:text-[8px] text-[10px] font-body1">
                                            Your Signal Channel subscription is
                                            active
                                          </p>
                                        </div>

                                        <div className="bg-[#E0103A]/10 border border-[#E0103A]/20 rounded-2xl p-3">
                                          <div className="flex items-center gap-3 mb-3">
                                            <div className="md:w-1 md:h-1 w-1.5 h-1.5 bg-[#E0103A] rounded-full"></div>
                                            <span className="text-[#E0103A] font-medium font-body1 md:text-[10px]">
                                              Expires In:
                                            </span>
                                          </div>
                                          <div className="  text-[#E0103A] font-body1">
                                            {(() => {
                                              const signalService =
                                                userActiveServices.find(
                                                  (service) =>
                                                    service.productName ===
                                                    "Signal Channel"
                                                );
                                              if (
                                                signalService &&
                                                signalService.expiresAt
                                              ) {
                                                return (
                                                  <CountdownTimer
                                                    targetDate={
                                                      signalService.expiresAt
                                                    }
                                                    onComplete={() => {
                                                      setHasSignalChannelLicense(
                                                        false
                                                      );
                                                    }}
                                                    expiredLabel="EXPIRED"
                                                    className
                                                  />
                                                );
                                              }
                                              return "N/A";
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-[#E0103A]/10 border border-[#E0103A]/20 rounded-2xl p-1">
                                        <div className="flex flex-col justify-center items-center">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-1">
                                              <div className="w-1 h-1 bg-[#E0103A] rounded-full"></div>
                                              <span className="text-[#E0103A] font-medium text-[9px]  font-header">
                                                Status: No Active License
                                              </span>
                                            </div>
                                            <p className="text-[#b0b8c1] text-[8px] font-body1">
                                              You don't have an active Signal
                                              Channel license.{" "}
                                              <span className="text-[#0AC488] text-[8px] font-body1">
                                                Get 1 week free trial when you
                                                join.
                                              </span>
                                            </p>
                                          </div>
                                          <div className="">
                                            <button
                                              onClick={() =>
                                                (window.location.href =
                                                  "/signal-channel")
                                              }
                                              className="w-full px-2 py-1 rounded-full bg-[#E0103A] text-white font-medium text-[8px] transition-all duration-300 hover:opacity-90 hover:scale-105 font-body1"
                                            >
                                              Buy License
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <Dialog>
                                    <form className="flex items-center justify-center">
                                      <DialogTrigger asChild>
                                        <button
                                          style={{
                                            background:
                                              "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                                          }}
                                          className="flex items-center gap-2 rounded-lg 
              text-xs font-medium text-white shadow-md transition 
             py-1 px-3  active:scale-95  font-body1 mt-1"
                                        >
                                          View Join Details
                                        </button>
                                      </DialogTrigger>
                                      <DialogContent className="md:w-[600px] md:h-[470px] bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5   overflow-y-auto  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20  shadow-xl">
                                        <div className="mt-5">
                                          {/* Bottom Box - Channel Information */}
                                          <div className="w-full bg-[#010510] border border-[#232b36] rounded-3xl p-8">
                                            <div className="text-center">
                                              <h3 className="text-2xl sm:text-4xl text-white font-header tracking-wide mb-3">
                                                SignalX
                                              </h3>

                                              <div className="flex items-center justify-center gap-8 mb-8">
                                                <div className="text-center">
                                                  <div className="text-3xl sm:text-5xl font-header text-[#0AC488] mb-1">
                                                    1K+
                                                  </div>
                                                  <div className="text-[#b0b8c1] text-sm font-body1">
                                                    Members
                                                  </div>
                                                </div>

                                                <div className="w-px h-12 bg-[#232b36]"></div>

                                                <div className="text-center">
                                                  <div className="text-3xl sm:text-5xl font-header text-[#33A0EA] mb-1">
                                                    24/7
                                                  </div>
                                                  <div className="text-[#b0b8c1] text-sm font-body1">
                                                    Signals
                                                  </div>
                                                </div>
                                              </div>

                                              <p className="text-[#b0b8c1] text-base leading-relaxed mb-6 max-w-2xl mx-auto font-body1">
                                                Join our premium forex signals
                                                for real-time trading
                                                opportunities, market analysis,
                                                and expert insights to maximize
                                                your trading potential.
                                              </p>

                                              {/* Telegram Membership Status */}
                                              {hasTelegramId && (
                                                <div className="mb-6"></div>
                                              )}

                                              <button
                                                onClick={handleJoinChannel}
                                                disabled={
                                                  telegramMembershipLoading ||
                                                  inviteLinkLoading ||
                                                  telegramMembershipStatus ===
                                                    "member"
                                                }
                                                className={`px-12 py-4 rounded-full font-body1 text-white font-medium text-lg transition-all duration-300 ${
                                                  telegramMembershipStatus ===
                                                  "member"
                                                    ? "bg-gray-500 cursor-not-allowed font-body1"
                                                    : "bg-gradient-to-r from-[#33A0EA] font-body1 to-[#0AC488] hover:opacity-90 hover:scale-105"
                                                }`}
                                              >
                                                {telegramMembershipLoading ||
                                                inviteLinkLoading ? (
                                                  <div className="flex items-center gap-2">
                                                    <svg
                                                      className="animate-spin h-5 w-5"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                      />
                                                      <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                      />
                                                    </svg>
                                                    {telegramMembershipLoading
                                                      ? "Checking..."
                                                      : "Creating Invite..."}
                                                  </div>
                                                ) : telegramMembershipStatus ===
                                                  "member" ? (
                                                  "Already Joined ✓"
                                                ) : hasSignalChannelLicense ? (
                                                  "Join Channel"
                                                ) : (
                                                  "Join Channel"
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </form>
                                  </Dialog>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="item-4">
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="group relative  overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 ov transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                                <div className="relative z-10 space-y-2">
                                  <div className="flex-1">
                                    <h3 className="text-[10px] font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                      Lotteries
                                    </h3>
                                  </div>

                                  <div>
                                    {/* Sub-tabs for lotteries */}
                                    <div className="flex gap-2 sm:gap-3 mb-8">
                                      {LOTTERY_TABS.map((tab, idx) => (
                                        <button
                                          key={tab}
                                          className={`md:px-3 md:py-2 px-3 py-1 rounded-full font-body1 md:text-[10px] text-[9px] tracking-wide transition-all duration-200 focus:outline-none whitespace-nowrap
                      ${
                        lotteryTab === idx
                          ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white "
                          : "bg-[#000000] text-white border border-[#232b36]"
                      }
                    `}
                                          onClick={() => setLotteryTab(idx)}
                                        >
                                          {tab}
                                        </button>
                                      ))}
                                    </div>
                                    {/* Filter lotteries based on sub-tab */}
                                    {(() => {
                                      let filteredLotteries = lotteries;
                                      if (lotteryTab === 1) {
                                        // Active
                                        filteredLotteries = lotteries.filter(
                                          (lot) => lot.won > 0
                                        );
                                      }
                                      return (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                                          {filteredLotteries.map((lot, idx) => (
                                            <div
                                              key={idx}
                                              className="bg-[#181f29]/80 border border-[#232b36] rounded-2xl  p-4 sm:p-8 flex flex-col items-center relative overflow-hidden"
                                            >
                                              {/* Card background image */}
                                              <img
                                                src={LOTTERY_CARD_BG}
                                                alt="bg"
                                                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none rounded-2xl"
                                              />
                                              <div className="relative z-10 w-full flex flex-col items-center">
                                                <div className="text-lg text-white tracking-widest mb-2">
                                                  {lot.title}
                                                </div>
                                                <img
                                                  src={lot.image}
                                                  alt="lottery"
                                                  className="w-32 h-32 object-contain mb-4"
                                                />
                                                <div className="text-xl text-white font-heading tracking-widest mb-2">
                                                  WON ${lot.won}
                                                </div>
                                                <button className="w-full py-2 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white text-base ">
                                                  View Details
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        {/*Desktop View Service 1 - Staking Boxes */}
                        <div className="group relative w-[330px] h-[200px] md:block hidden overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 ov transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                          <div className="relative">
                            <div className="flex-1">
                              <h3 className="text-[10px] font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                Staking Boxes{" "}
                              </h3>
                            </div>
                            <div className="flex gap-3 mt-2">
                              {cryptoBoxes.map((box, idx) => (
                                <div
                                  key={box.cryptoBoxId}
                                  className="bg-[##010510] border border-[#232b36] rounded-3xl p-2 w-full md:flex-1 flex flex-col relative"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1">
                                      <img
                                        src="/assets/images/bfm-logo.png"
                                        alt="logo"
                                        className="w-3 h-3"
                                      />
                                      <span className="text-[9px] text-white tracking-widest font-body1">
                                        BENEFIT MINE{" "}
                                        <span className="rounded-md text-[#000] text-[6px] p-0.5 font-body1 bg-[#C6C6C6]">
                                          BFM
                                        </span>
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap">
                                    <div>
                                      <div className="text-[8px] text-[#b0b8c1] font-header ">
                                        TOTAL INVESTED
                                      </div>
                                      <div className="text-[8px] text-[#FF6A00] font-body1 ">
                                        {box.tokens}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[8px] text-[#b0b8c1] font-header ">
                                        APY
                                      </div>
                                      <div className="text-[8px] text-[#FF6A00] font-body1 ">
                                        {box.percentage}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[8px]  text-[#b0b8c1] font-header  ">
                                        TOTAL EARNED
                                      </div>
                                      <div className="text-[8px] text-[#FF6A00] font-body1  ">
                                        {box.return_token}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[8px] text-[#b0b8c1] font-header">
                                        PERIOD
                                      </div>
                                      <div className="text-[8px] text-[#FF6A00] font-body1  ">
                                        {new Date(
                                          box.createdAt
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Timer Section - Only for locked boxes */}
                                  {box.is_locked && (
                                    <div className="ml-2">
                                      <div className="">
                                        <span className="text-[8px]  text-[#b0b8c1] font-header ">
                                          TIME TO UNLOCK
                                        </span>
                                        <CountdownTimer
                                          targetDate={box.locked_till}
                                          onComplete={() => {
                                            // Refresh data when countdown completes
                                            fetchCryptoBoxes();
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/*Desktop View Service 2 - VPN */}
                        <div className="group relative w-[330px] h-[200px] md:block hidden overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 ov transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                          <div className="relative z-8">
                            <div className="flex-1">
                              <h3 className="text-[10px] font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                VPN
                              </h3>
                            </div>
                            <div className="w-full element relative overflow-y-auto mt-1">
                              <div className="w-full space-y- transition-all duration-300">
                                {/* VPN License Status Box - Show when no active license */}
                                {!hasActiveVpnLicense && (
                                  <div className="bg-[#010510] border border-[#E0103A] rounded-3xl p-2">
                                    <div className="flex flex-col gap-1">
                                      <div className="flex justify-between">
                                        <div className="flex items-center gap-1 ">
                                          <div className="w-1 h-1 bg-[#E0103A] rounded-full"></div>
                                          <span className="text-[#E0103A] font-medium text-[8px] font-header">
                                            VPN License Required
                                          </span>
                                        </div>
                                        {/* <p className="text-[#b0b8c1] text-[8px] font-body1">
                                          You don't have an active VPN license.
                                          Purchase a VPN license to access
                                          secure VPN services.
                                        </p> */}

                                        <div className=" flex justify-center">
                                          <button
                                            onClick={() =>
                                              window.open("/ipvpn", "_blank")
                                            }
                                            className="rounded-full p-1 bg-gradient-to-r  from-[#33A0EA] to-[#0AC488] text-white font-medium text-[5px] transition-all duration-300 hover:opacity-90  font-body1"
                                          >
                                            Purchase Now
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Server Selection Section - Always show */}
                                <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-2 mt-1">
                                  <h2 className="text-[8px] text-white font-header heading mb-1">
                                    SERVER SELECTION
                                  </h2>

                                  {/* Current Server Info */}
                                  {hasInitialVpnConfigs &&
                                    currentServerName && (
                                      <div className="">
                                        <div className="text-xs  text-[#0AC488] font-header tracking-widest">
                                          CURRENT SERVER:{" "}
                                          <span className="font-body1 text-xs">
                                            {currentServerName}
                                          </span>
                                        </div>
                                        <div className="text-[10px] text-[#b0b8c1] font-body1">
                                          You can switch to a different server
                                          below
                                        </div>
                                      </div>
                                    )}

                                  <div className="mb-2">
                                    <label className="block text-[6px] text-[#b0b8c1] font-header tracking-widest mb-1">
                                      {hasInitialVpnConfigs
                                        ? "SWITCH TO SERVER"
                                        : "AVAILABLE SERVERS"}
                                    </label>
                                    {serversLoading ? (
                                      <div className="bg-[#000000] border  border-[#232b36] rounded-lg p-1 text-sm text-white font-body1 text-[6px]">
                                        Loading servers...
                                      </div>
                                    ) : (
                                      <div className="flex items-center space-x-1 text-[10px]">
                                        {/* Custom Dropdown */}
                                        <div
                                          className="relative w-7 sm:flex-1 "
                                          ref={serverDropdownRef}
                                        >
                                          <button
                                            type="button"
                                            className={`w-full font-body1 bg-[#000000] border border-[#232b36] text-white rounded-lg p-1 flex items-center justify-between focus:outline-none ${
                                              switchingServer
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              !switchingServer &&
                                              setIsServerDropdownOpen((v) => !v)
                                            }
                                          >
                                            <span className="truncate font-body1 text-[6px]">
                                              {selectedServer ||
                                                (hasInitialVpnConfigs
                                                  ? "Switch to different server"
                                                  : "Select a server")}
                                            </span>
                                            <svg
                                              className={`w-4 h-4 transition-transform ${
                                                isServerDropdownOpen
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M6 9l6 6 6-6"
                                                stroke="#b0b8c1"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </button>
                                          {isServerDropdownOpen && (
                                            <div className="absolute z-20 mt-2 w-full bg-[#010510] border border-[#232b36] rounded-lg shadow-lg overflow-hidden">
                                              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                {(servers || []).length ===
                                                  0 && (
                                                  <div className="px-3 py-2 text-sm text-[#b0b8c1] font-body1">
                                                    No servers available
                                                  </div>
                                                )}
                                                {(servers || []).map(
                                                  (srv, idx) => (
                                                    <button
                                                      key={idx}
                                                      type="button"
                                                      className={`w-full text-left px-3 py-2 text-[8px] transition-colors font-body1 ${
                                                        srv === selectedServer
                                                          ? "bg-[#0b1621] text-white"
                                                          : "text-[#b0b8c1] hover:bg-[#0b1621] hover:text-white"
                                                      }`}
                                                      onClick={() => {
                                                        handleServerSelectionChange(
                                                          srv
                                                        );
                                                        setIsServerDropdownOpen(
                                                          false
                                                        );
                                                      }}
                                                    >
                                                      {srv}
                                                    </button>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        <button
                                          type="button"
                                          disabled={
                                            !selectedServer ||
                                            switchingServer ||
                                            (hasInitialVpnConfigs &&
                                              selectedServer ===
                                                currentServerName)
                                          }
                                          onClick={() => {
                                            if (!selectedServer) return;
                                            setPendingServerName(
                                              selectedServer
                                            );
                                            setShowSwitchConfirmModal(true);
                                          }}
                                          className={` rounded-lg text-[8px] p-1 transition-colors ${
                                            !selectedServer ||
                                            switchingServer ||
                                            (hasInitialVpnConfigs &&
                                              selectedServer ===
                                                currentServerName)
                                              ? "bg-[#232b36] text-[#b0b8c1] font-body1 cursor-not-allowed"
                                              : "bg-gradient-to-r from-[#33A0EA] font-body1 to-[#0AC488] text-white hover:opacity-90"
                                          }`}
                                        >
                                          {switchingServer
                                            ? "Generating..."
                                            : "Generate"}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Dialog>
                                  <form className="flex items-center justify-center">
                                    <DialogTrigger asChild>
                                      <button
                                        style={{
                                          background:
                                            "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                                        }}
                                        className="flex items-center gap-2 rounded-lg 
              text-xs font-medium text-white shadow-md transition 
             py-1 px-3  active:scale-95  font-body1 mt-3"
                                      >
                                        View Details
                                      </button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[600px] h-[300px] bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5   overflow-y-auto  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20  shadow-xl">
                                      {/* VPN Configuration Section */}
                                      <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8 mt-4">
                                        <h2 className="text-xl sm:text-3xl text-white font-header heading tracking-widest mb-6">
                                          VPN CONFIGURATION
                                        </h2>

                                        {/* License Info */}
                                        {(vpnExpiresAt ||
                                          vpnDevices !== null ||
                                          vpnIsDisabled !== null) && (
                                          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {vpnDevices !== null && (
                                              <div>
                                                <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                                  DEVICES
                                                </div>
                                                <div className="text-sm text-white">
                                                  {vpnDevices}
                                                </div>
                                              </div>
                                            )}
                                            {vpnExpiresAt && (
                                              <div>
                                                <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1">
                                                  EXPIRES AT
                                                </div>
                                                <div className="text-sm text-white font-body1">
                                                  <CountdownTimer
                                                    targetDate={vpnExpiresAt}
                                                    expiredLabel="EXPIRED"
                                                  />
                                                </div>
                                              </div>
                                            )}

                                            {vpnIsDisabled !== null && (
                                              <div className="flex flex-col items-end justify-end">
                                                <div className="text-xs sm:text-sm text-[#b0b8c1] font-header tracking-widest mb-1 ">
                                                  STATUS
                                                </div>
                                                <span
                                                  className={`inline-block px-3 py-1 rounded-full text-xs  sm:text-sm font-body1 font-medium ${
                                                    vpnIsDisabled
                                                      ? "bg-[#3a1f1f] text-[#ff6b6b] border border-[#ff6b6b33]"
                                                      : "bg-[#1f3a2e] text-[#0AC488] border border-[#0AC48833]"
                                                  }`}
                                                >
                                                  {vpnIsDisabled
                                                    ? "RESTRICTED"
                                                    : "ACTIVE"}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* Configuration String */}
                                        <div className="mb-6">
                                          <div className="text-sm sm:text-lg text-[#b0b8c1] font-header tracking-widest mb-3">
                                            YOUR VPN ACCESS KEY
                                          </div>
                                          {vpnLoading ? (
                                            <div className="relative">
                                              <div className="bg-[#000000] border border-[#232b36] rounded-lg p-8 flex items-center justify-center">
                                                <div className="flex flex-col items-center justify-center">
                                                  <svg
                                                    className="animate-spin mb-3"
                                                    width="40"
                                                    height="40"
                                                    viewBox="0 0 50 50"
                                                  >
                                                    <circle
                                                      cx="25"
                                                      cy="25"
                                                      r="20"
                                                      stroke="url(#gradientStroke)"
                                                      strokeWidth="5"
                                                      fill="none"
                                                      strokeDasharray="31.4 31.4"
                                                    />
                                                    <defs>
                                                      <linearGradient
                                                        id="gradientStroke"
                                                        x1="0"
                                                        y1="0"
                                                        x2="1"
                                                        y2="1"
                                                      >
                                                        <stop
                                                          offset="9.17%"
                                                          stopColor="#33A0EA"
                                                        />
                                                        <stop
                                                          offset="83.83%"
                                                          stopColor="#0AC488"
                                                        />
                                                      </linearGradient>
                                                    </defs>
                                                  </svg>
                                                  <span className="text-sm font-body1 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent">
                                                    Loading VPN Access Key...
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          ) : vpnAccessKeys.length === 0 ? (
                                            <div className="relative">
                                              <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 pr-12  text-sm text-[#33A0EA] break-all font-body1">
                                                {vpnLoading
                                                  ? "Loading VPN configurations..."
                                                  : showServerSelection &&
                                                    !selectedServer
                                                  ? "Please select a server from above to get your VPN access key."
                                                  : showServerSelection &&
                                                    selectedServer
                                                  ? "No VPN access key found for the selected server. Please try another server."
                                                  : "Checking for existing VPN configurations..."}
                                              </div>
                                            </div>
                                          ) : (
                                            vpnAccessKeys.map((key, idx) => (
                                              <div
                                                className="relative mb-4"
                                                key={idx}
                                              >
                                                <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4 pr-12  text-sm text-[#33A0EA] break-all font-body1">
                                                  {key}
                                                </div>
                                                <button
                                                  onClick={() =>
                                                    handleVpnKeyCopy(key)
                                                  }
                                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-[#232b36] rounded-md transition-colors"
                                                >
                                                  <img
                                                    src="/assets/images/copy-icon.png"
                                                    alt="Copy"
                                                    className="w-5 h-5"
                                                  />
                                                </button>
                                              </div>
                                            ))
                                          )}
                                        </div>
                                      </div>

                                      {/* Instructions Section */}
                                      <div className="bg-[#010510] border border-[#232b36] rounded-3xl p-6 sm:p-8">
                                        <h2 className="text-2xl  text-white font-header tracking-widest mb-6">
                                          SETUP INSTRUCTIONS
                                        </h2>

                                        <div className="text-[#b0b8c1] space-y-6">
                                          <p className="text-base leading-relaxed font-body1">
                                            Use this server to safely access the
                                            open internet:
                                          </p>

                                          {/* Step 2 */}
                                          <div>
                                            <h3 className="text-lg text-white font-header tracking-wide mb-3">
                                              1) Copy your connection string
                                            </h3>
                                            <p className="text-base leading-relaxed font-body1">
                                              You have received a connection
                                              string that starts with{" "}
                                              <span className="text-[#33A0EA]  font-body1">
                                                ss://
                                              </span>
                                              . Copy this connection string
                                              using the copy button above.
                                            </p>
                                          </div>

                                          {/* Step 3 */}
                                          <div>
                                            <h3 className="text-lg text-white font-header tracking-wide mb-3">
                                              2) Connect using the Outline app
                                            </h3>
                                            <p className="text-base leading-relaxed font-body1">
                                              Open the Outline client app. If
                                              your connection string is
                                              auto-detected, tap "Connect" and
                                              proceed. If your connection string
                                              is not auto-detected, then paste
                                              it in the field, then tap
                                              "Connect" and proceed.
                                            </p>
                                          </div>

                                          {/* Final Step */}
                                          <div className="bg-gradient-to-r from-[#33A0EA]/10 to-[#0AC488]/10 border border-[#33A0EA]/20 rounded-lg p-4">
                                            <p className="text-base text-[#20E0B2] font-semibold font-body1">
                                              🎉 You're ready to use the open
                                              internet!
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </form>
                                </Dialog>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*Desktop View Service 3 - Signal Channels */}
                        <div className="group relative w-[330px] h-[200px] md:block hidden overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 ov transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                          <div className="relative z-10 space-y-2">
                            <div className="flex-1">
                              <h3 className="text-[10px] font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                Signal Channels
                              </h3>
                            </div>

                            {/* Top Box - User Active Services Status */}
                            <div className="w-full bg-[#010510] border border-[#232b36] rounded-3xl p-2">
                              <h3 className="text-xs text-white font-header tracking-wide mb-2">
                                Signal Channel License Status
                              </h3>

                              {hasSignalChannelLicense ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <div className="bg-[#0AC488]/10 border border-[#0AC488]/20 rounded-2xl p-3">
                                    <div className="flex items-center gap-1 mb-1">
                                      <div className="w-1 h-1 bg-[#0AC488] rounded-full"></div>
                                      <span className="text-[#0AC488] font-medium font-body1 text-[10px]">
                                        Status: Active
                                      </span>
                                    </div>
                                    <p className="text-[#b0b8c1] text-[8px] font-body1">
                                      Your Signal Channel subscription is active
                                    </p>
                                  </div>

                                  <div className="bg-[#E0103A]/10 border border-[#E0103A]/20 rounded-2xl p-3">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="w-1 h-1 bg-[#E0103A] rounded-full"></div>
                                      <span className="text-[#E0103A] font-medium font-body1 text-[10px]">
                                        Expires In:
                                      </span>
                                    </div>
                                    <div className="  text-[#E0103A] font-body1">
                                      {(() => {
                                        const signalService =
                                          userActiveServices.find(
                                            (service) =>
                                              service.productName ===
                                              "Signal Channel"
                                          );
                                        if (
                                          signalService &&
                                          signalService.expiresAt
                                        ) {
                                          return (
                                            <CountdownTimer
                                              targetDate={
                                                signalService.expiresAt
                                              }
                                              onComplete={() => {
                                                setHasSignalChannelLicense(
                                                  false
                                                );
                                              }}
                                              expiredLabel="EXPIRED"
                                              className
                                            />
                                          );
                                        }
                                        return "N/A";
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-[#E0103A]/10 border border-[#E0103A]/20 rounded-2xl p-1">
                                  <div className="flex flex-col justify-center items-center">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-[#E0103A] rounded-full"></div>
                                        <span className="text-[#E0103A] font-medium text-[9px]  font-header">
                                          Status: No Active License
                                        </span>
                                      </div>
                                      <p className="text-[#b0b8c1] text-[8px] font-body1">
                                        You don't have an active Signal Channel
                                        license.{" "}
                                        <span className="text-[#0AC488] text-[8px] font-body1">
                                          Get 1 week free trial when you join.
                                        </span>
                                      </p>
                                    </div>
                                    <div className="">
                                      <button
                                        onClick={() =>
                                          (window.location.href =
                                            "/signal-channel")
                                        }
                                        className="w-full px-2 py-1 rounded-full bg-[#E0103A] text-white font-medium text-[8px] transition-all duration-300 hover:opacity-90 hover:scale-105 font-body1"
                                      >
                                        Buy License
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <Dialog>
                              <form className="flex items-center justify-center">
                                <DialogTrigger asChild>
                                  <button
                                    style={{
                                      background:
                                        "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                                    }}
                                    className="flex items-center gap-2 rounded-lg 
              text-xs font-medium text-white shadow-md transition 
             py-1 px-3  active:scale-95  font-body1 mt-1"
                                  >
                                    View Join Details
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="w-[600px] h-[470px] bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5   overflow-y-auto  transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20  shadow-xl">
                                  <div className="mt-5">
                                    {/* Bottom Box - Channel Information */}
                                    <div className="w-full bg-[#010510] border border-[#232b36] rounded-3xl p-8">
                                      <div className="text-center">
                                        <h3 className="text-2xl sm:text-4xl text-white font-header tracking-wide mb-3">
                                          SignalX
                                        </h3>

                                        <div className="flex items-center justify-center gap-8 mb-8">
                                          <div className="text-center">
                                            <div className="text-3xl sm:text-5xl font-header text-[#0AC488] mb-1">
                                              1K+
                                            </div>
                                            <div className="text-[#b0b8c1] text-sm font-body1">
                                              Members
                                            </div>
                                          </div>

                                          <div className="w-px h-12 bg-[#232b36]"></div>

                                          <div className="text-center">
                                            <div className="text-3xl sm:text-5xl font-header text-[#33A0EA] mb-1">
                                              24/7
                                            </div>
                                            <div className="text-[#b0b8c1] text-sm font-body1">
                                              Signals
                                            </div>
                                          </div>
                                        </div>

                                        <p className="text-[#b0b8c1] text-base leading-relaxed mb-6 max-w-2xl mx-auto font-body1">
                                          Join our premium forex signals for
                                          real-time trading opportunities,
                                          market analysis, and expert insights
                                          to maximize your trading potential.
                                        </p>

                                        {/* Telegram Membership Status */}
                                        {hasTelegramId && (
                                          <div className="mb-6"></div>
                                        )}

                                        <button
                                          onClick={handleJoinChannel}
                                          disabled={
                                            telegramMembershipLoading ||
                                            inviteLinkLoading ||
                                            telegramMembershipStatus ===
                                              "member"
                                          }
                                          className={`px-12 py-4 rounded-full font-body1 text-white font-medium text-lg transition-all duration-300 ${
                                            telegramMembershipStatus ===
                                            "member"
                                              ? "bg-gray-500 cursor-not-allowed font-body1"
                                              : "bg-gradient-to-r from-[#33A0EA] font-body1 to-[#0AC488] hover:opacity-90 hover:scale-105"
                                          }`}
                                        >
                                          {telegramMembershipLoading ||
                                          inviteLinkLoading ? (
                                            <div className="flex items-center gap-2">
                                              <svg
                                                className="animate-spin h-5 w-5"
                                                viewBox="0 0 24 24"
                                              >
                                                <circle
                                                  className="opacity-25"
                                                  cx="12"
                                                  cy="12"
                                                  r="10"
                                                  stroke="currentColor"
                                                  strokeWidth="4"
                                                  fill="none"
                                                />
                                                <path
                                                  className="opacity-75"
                                                  fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                              </svg>
                                              {telegramMembershipLoading
                                                ? "Checking..."
                                                : "Creating Invite..."}
                                            </div>
                                          ) : telegramMembershipStatus ===
                                            "member" ? (
                                            "Already Joined ✓"
                                          ) : hasSignalChannelLicense ? (
                                            "Join Channel"
                                          ) : (
                                            "Join Channel"
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </form>
                            </Dialog>
                          </div>
                        </div>
                        {/*Desktop view Service 4 - Lotteries */}
                        <div className="group relative w-[330px] h-[200px] md:block hidden overflow-y-auto bg-gradient-to-br from-[#010510]/80 via-[#0a0f1a]/60 to-[#010510]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-3 ov transition-all duration-700 hover:border-[#0AC488]/30 hover:shadow-2xl hover:shadow-[#0AC488]/20 ">
                          <div className="relative z-10 space-y-2">
                            <div className="flex-1">
                              <h3 className="text-[10px] font-header font-semibold text-white/90 group-hover:text-white transition-colors duration-700">
                                Lotteries
                              </h3>
                            </div>

                            <div>
                              {/* Sub-tabs for lotteries */}
                              <div className="flex gap-2 sm:gap-3 mb-8">
                                {LOTTERY_TABS.map((tab, idx) => (
                                  <button
                                    key={tab}
                                    className={`px-3 py-2 rounded-full font-body1 text-[10px] tracking-wide transition-all duration-200 focus:outline-none whitespace-nowrap
                      ${
                        lotteryTab === idx
                          ? "bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white "
                          : "bg-[#000000] text-white border border-[#232b36]"
                      }
                    `}
                                    onClick={() => setLotteryTab(idx)}
                                  >
                                    {tab}
                                  </button>
                                ))}
                              </div>
                              {/* Filter lotteries based on sub-tab */}
                              {(() => {
                                let filteredLotteries = lotteries;
                                if (lotteryTab === 1) {
                                  // Active
                                  filteredLotteries = lotteries.filter(
                                    (lot) => lot.won > 0
                                  );
                                }
                                return (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                                    {filteredLotteries.map((lot, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-[#181f29]/80 border border-[#232b36] rounded-2xl  p-4 sm:p-8 flex flex-col items-center relative overflow-hidden"
                                      >
                                        {/* Card background image */}
                                        <img
                                          src={LOTTERY_CARD_BG}
                                          alt="bg"
                                          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none rounded-2xl"
                                        />
                                        <div className="relative z-10 w-full flex flex-col items-center">
                                          <div className="text-lg text-white tracking-widest mb-2">
                                            {lot.title}
                                          </div>
                                          <img
                                            src={lot.image}
                                            alt="lottery"
                                            className="w-32 h-32 object-contain mb-4"
                                          />
                                          <div className="text-xl text-white font-heading tracking-widest mb-2">
                                            WON ${lot.won}
                                          </div>
                                          <button className="w-full py-2 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white text-base ">
                                            View Details
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full hidden md:flex">
            <Navbar />
          </div>
        </div>
      </div>

      {/* Telegram Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out">
          {/* Background overlay with subtle animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#33A0EA]/5 to-[#0AC488]/3 animate-pulse"></div>
          <div
            className="bg-[#06101A] border border-[#232b36] rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95"
            style={{
              background:
                "linear-gradient(145deg, rgba(6, 16, 26, 0.95) 0%, rgba(6, 16, 26, 0.98) 100%)",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(51, 160, 234, 0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl text-white font-header tracking-wide mb-3">
                  Join SignalX
                </h3>
                <p className="text-[#b0b8c1] text-base font-body1 leading-relaxed">
                  Use the invite link below to join our premium forex signals
                  channel.
                </p>
              </div>
            </div>

            {inviteLinkData && (
              <div className="space-y-4">
                <div className="bg-[#000000] border border-[#232b36] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body1 text-[#b0b8c1] font-medium">
                      Channel Name:
                    </span>
                    <span className="text-white font-medium font-body1">
                      {inviteLinkData.name}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-[#b0b8c1] font-body1">
                      Invite Link:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-xs text-white  truncate font-body1">
                        {inviteLinkData.invite_link}
                      </div>
                      <button
                        onClick={copyInviteLink}
                        className={`px-3 py-2 text-xs rounded-md transition-all duration-200 font-body1 ${
                          isLinkCopied
                            ? "bg-[#0AC488] text-white"
                            : "bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white hover:opacity-90"
                        }`}
                      >
                        {isLinkCopied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href={inviteLinkData.invite_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-3 font-body1 px-6 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Open in Telegram
                  </a>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-[#b0b8c1] hover:text-white transition-colors font-body1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BackButton = ({ setServices }) => {
  return (
    <button
      className="flex items-center gap-1 mb-5"
      onClick={() => setServices(0)}
    >
      <MdArrowBack size={20} />
      <div>Back</div>
    </button>
  );
};

export default StakingProducts;
