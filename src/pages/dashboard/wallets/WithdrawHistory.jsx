import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../../api/axiosConfig";
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

const WithdrawHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedWithdrawId, setSelectedWithdrawId] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const fetchWithdrawHistory = () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    axios
      .get("/financials/gusd/withdraw/history?pageSize=50&order=asc", {
        headers: { token },
      })
      .then((res) => {
        if (
          res.data &&
          res.data.success &&
          res.data.data &&
          Array.isArray(res.data.data.data)
        ) {
          setWithdrawHistory(res.data.data.data);
          setCurrentPage(res.data.data.currentPage || 1);
          setTotalPages(res.data.data.totalPages || 1);
          setTotalRows(res.data.data.totalRows || 0);
        } else {
          setWithdrawHistory([]);
          setCurrentPage(1);
          setTotalPages(1);
          setTotalRows(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching withdraw history:", err);
        setError("Failed to load withdraw history");
        setWithdrawHistory([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalRows(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWithdrawHistory();
  }, [token]);

  const openCancelModal = (withdrawId) => {
    setSelectedWithdrawId(withdrawId);
    setTwoFACode("");
    setCancelError("");
    setShowCancelModal(true);
  };

  const handleCancelWithdraw = async () => {
    if (!selectedWithdrawId) return;
    if (!twoFACode || twoFACode.length !== 6) {
      setCancelError("Please enter a valid 6-digit code");
      return;
    }
    setIsCancelling(true);
    setCancelError("");
    try {
      const res = await axios.post(
        "/financials/withdraw/cancel",
        {
          withdrawId: selectedWithdrawId,
          twoFA: twoFACode,
        },
        { headers: { token } }
      );
      if (res.data && res.data.success) {
        setShowCancelModal(false);
        setSelectedWithdrawId("");
        setTwoFACode("");
        fetchWithdrawHistory();
      } else {
        setCancelError(res.data?.message || "Cancellation failed");
      }
    } catch (err) {
      setCancelError(err.response?.data?.message || "Cancellation failed");
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Completed";
      case 2:
        return "Rejected";
      case 3:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "text-yellow-400";
      case 1:
        return "text-help_link_green";
      case 2:
        return "text-[#FF6B6B]";
      case 3:
        return "text-[#FF6B6B]";
      default:
        return "text-text_primary";
    }
  };

  const formatAmount = (amount, walletType) => {
    if (amount === null || amount === undefined) return "0";
    return `${Number(amount).toFixed(2)} `;
  };

  return (
    <div className="w-full">
      {/* Withdraw History Table */}
      {/* <div className="text-sm  font-header mx-2 tracking-widest text-white">
        WITHDRAW HISTORY
      </div> */}

      <div className="w-full bg-[#11161f] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a] overflow-x-auto mt-2">
        <div className="min-w-[900px]">
          <div
            className="grid text-center bg-black text-white font-body1 text-[10px] p-2"
            style={{
              gridTemplateColumns: "1fr 0.8fr 0.8fr 2fr 0.8fr 1.2fr 1.2fr 1fr",
            }}
          >
            <div className="truncate">Amount</div>
            <div className="truncate">Fee</div>
            <div className="truncate">Payable</div>
            <div className="truncate">Address</div>
            <div className="truncate">Status</div>
            <div className="">Request Date</div>
            <div className="">Approval Date</div>
            <div className="truncate">Action</div>
          </div>
          <div className="divide-y divide-[#222b3a] md:h-[70px] h-[200px] overflow-y-auto">
            {loading ? (
              <div className="text-center text-white py-2 text-[10px] font-body1">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-2 text-[10px] font-body1">
                {error}
              </div>
            ) : withdrawHistory.length === 0 ? (
              <div className="text-center text-white py-6 text-[10px] font-body1">
                No withdraw history found.
              </div>
            ) : (
              withdrawHistory.map((withdraw, index) => (
                <div
                  key={withdraw._id || index}
                  className={`grid items-center text-center  px-2 sm:px-6 py-4 ${
                    index % 2 === 0 ? "bg-[#FFFFFF1A]" : "bg-[#11161f]"
                  }`}
                  style={{
                    gridTemplateColumns:
                      "1fr 0.8fr 0.8fr 2fr 0.8fr 1.2fr 1.2fr 1fr",
                  }}
                >
                  <div className="text-text_primary font-body1 truncate text-xs sm:text-sm md:text-base">
                    {formatAmount(withdraw.amount, withdraw.wallet_type)}
                  </div>
                  <div className="text-text_primary font-body1 truncate text-xs sm:text-sm md:text-base">
                    {formatAmount(withdraw.fee, withdraw.wallet_type)}
                  </div>
                  <div className="text-text_primary font-body1 truncate text-xs sm:text-sm md:text-base">
                    {formatAmount(
                      withdraw.payable || withdraw.amount,
                      withdraw.wallet_type
                    )}
                  </div>

                  <div className="text-text_primary font-body1 break-all text-xs sm:text-sm md:text-base">
                    {withdraw.address || "N/A"}
                  </div>
                  <div
                    className={`font-body1 truncate text-xs sm:text-sm md:text-base ${getStatusColor(
                      withdraw.status
                    )}`}
                  >
                    {getStatusText(withdraw.status)}
                  </div>
                  <div className="text-text_primary font-body1 text-xs sm:text-sm md:text-base break-all">
                    {formatDate(withdraw.createdAt)}
                  </div>
                  <div className="text-text_primary font-body1 text-xs sm:text-sm md:text-base break-all">
                    {withdraw.status === 0
                      ? "Pending"
                      : formatDate(withdraw.updatedAt)}
                  </div>
                  <div className="text-text_primary font-body1 truncate text-xs sm:text-sm md:text-base">
                    {withdraw.status === 0 ? (
                      <button
                        onClick={() => openCancelModal(withdraw._id)}
                        className="px-3 py-1 rounded-full text-white text-xs sm:text-sm bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 disabled:opacity-50"
                        disabled={
                          isCancelling && selectedWithdrawId === withdraw._id
                        }
                      >
                        {isCancelling && selectedWithdrawId === withdraw._id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    ) : (
                      <span className="text-text_secondary">-</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Pagination Info */}
      <div className="text-center text-text_secondary text-[10px] font-body1 mt-2">
        Showing {withdrawHistory.length} of {totalRows} withdraws
        {totalPages > 1 && (
          <span className="ml-2">
            (Page {currentPage} of {totalPages})
          </span>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-card_background rounded-[20px] p-6 md:p-8 max-w-md w-full mx-4 border border-gray_line">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-header text-text_primary mb-2">
                Cancel Withdrawal
              </h2>
              <p className="text-text_secondary text-sm font-body1">
                Enter your 6-digit 2FA code to cancel this request.
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-body1 text-text_secondary mb-2">
                6-Digit Code
              </label>
              <input
                type="text"
                value={twoFACode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setTwoFACode(value);
                }}
                className="w-full px-4 py-3 rounded-full  bg-input_background border border-input_border text-text_primary text-center text-lg font-body1 focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>
            {cancelError && (
              <div className="text-center text-red-500 text-sm font-semibold mb-4 font-body1">
                {cancelError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedWithdrawId("");
                  setTwoFACode("");
                  setCancelError("");
                }}
                className="flex-1 py-3 px-4 rounded-full border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body1"
              >
                Close
              </button>
              <button
                type="button"
                disabled={isCancelling || twoFACode.length !== 6}
                onClick={handleCancelWithdraw}
                className={`flex-1 py-3 px-4 rounded-full font-body1 text-white font-semibold text-sm bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end transition-opacity duration-300 ${
                  isCancelling || twoFACode.length !== 6
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
              >
                {isCancelling ? "Verifying..." : "Verify & Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawHistory;
