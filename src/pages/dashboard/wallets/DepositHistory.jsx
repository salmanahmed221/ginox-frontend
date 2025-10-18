import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../../api/axiosConfig";


const DepositHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const [depositHistory, setDepositHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("/financials/gusd/deposit/history?page=1&pageSize=10&status=null", {
        headers: { token },
      })
      .then((res) => {
        if (
          res.data &&
          res.data.success &&
          res.data.data &&
          Array.isArray(res.data.data.data)
        ) {
          setDepositHistory(res.data.data.data);
        } else {
          setDepositHistory([]);
        }
      })
      .catch(() => setDepositHistory([]))
      .finally(() => setLoading(false));
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      {/* Deposit History Table */}
    
      <div className="w-full bg-[#11161f] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a] overflow-x-auto mt-2">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 text-center bg-black text-white font-body1 text-[10px] p-2">
            <div className="truncate">Transaction ID</div>
            <div className="truncate">Amount</div>
            <div className="truncate">Currency</div>
            <div className="truncate">Method</div>
            <div className="truncate">Status</div>
            <div className="truncate">Date</div>
          </div>
          <div className="divide-y divide-[#222b3a] md:h-[70px] h-[200px] overflow-y-auto">
            {loading ? (
              <div className="text-center text-white py-4 text-[10px]">
                Loading...
              </div>
            ) : depositHistory.length === 0 ? (
              <div className="text-center text-white py-4 text-[10px]">
                No deposit history found.
              </div>
            ) : (
              depositHistory.map((deposit, index) => (
                <div
                  key={deposit._id}
                  className={`grid grid-cols-6 items-center text-center p-2  ${
                    index % 2 === 0 ? "bg-[#FFFFFF1A]" : "bg-[#11161f]"
                  }`}
                >
                  <div className="text-text_primary font-body1 truncate text-[10px]">
                    {deposit.tranx_id.substring(0, 16)}...
                  </div>
                  <div className="text-text_primary font-body1 truncate text-[10px]">
                    {deposit.amount} {deposit.currency_code}
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <img
                      src="/assets/images/gusd-logo.png"
                      alt={deposit.currency_code}
                      className="w-3 h-3 rounded-full"
                    />
                    <span className="text-gradient truncate text-[10px] font-header">
                      {deposit.currency_code}
                    </span>
                  </div>
                  <div className="text-text_primary font-body1 truncate text-[10px]">
                    {deposit.method}
                  </div>
                  <div
                    className={`font-body1 truncate text-[10px] ${
                      deposit.status ? "text-help_link_green" : "text-[#FF6B6B]"
                    }`}
                  >
                    {deposit.status ? "Completed" : "Pending"}
                  </div>
                  <div className="text-text_primary font-body1 truncate text-[10px]">
                    {formatDate(deposit.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Pagination Info */}
      <div className=" text-center text-text_secondary text-[10px] font-body1 mt-2">
        Showing {depositHistory.length} of {depositHistory.length} deposits
      </div>
      {/* <div className="w-full bg-[#11161f] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a] overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 text-center bg-black text-white font-body1 px-2 sm:px-6 py-4 text-xs sm:text-sm md:text-base">
            <div className="truncate">Transaction ID</div>
            <div className="truncate">Amount</div>
            <div className="truncate">Currency</div>
            <div className="truncate">Method</div>
            <div className="truncate">Status</div>
            <div className="truncate">Date</div>
          </div>
          <div className="divide-y divide-[#222b3a] max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="text-center text-white py-8">Loading...</div>
            ) : depositHistory.length === 0 ? (
              <div className="text-center text-white py-8">
                No deposit history found.
              </div>
            ) : (
              depositHistory.map((deposit, index) => (
                <div
                  key={deposit._id}
                  className={`grid grid-cols-6 items-center text-center  px-2 sm:px-6 py-4 ${
                    index % 2 === 0 ? "bg-[#FFFFFF1A]" : "bg-[#11161f]"
                  }`}
                >
                  <div className="text-text_primary font-body1 truncate text-xs sm:text-sm md:text-base">
                    {deposit.tranx_id.substring(0, 16)}...
                  </div>
                  <div className="text-text_primary font-body1 truncate text-xs sm:text-sm md:text-base">
                    {deposit.amount} {deposit.currency_code}
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src="/assets/images/gusd-logo.png"
                      alt={deposit.currency_code}
                      className="w-4 h-4 md:w-6 md:h-6 rounded-full"
                    />
                    <span className="text-gradient truncate text-xs md:text-base font-header">
                      {deposit.currency_code}
                    </span>
                  </div>
                  <div className="text-text_primary font-body1 truncate text-xs sm:text-sm md:text-base">
                    {deposit.method}
                  </div>
                  <div
                    className={`font-body1 truncate text-xs sm:text-sm md:text-base ${
                      deposit.status ? "text-help_link_green" : "text-[#FF6B6B]"
                    }`}
                  >
                    {deposit.status ? "Completed" : "Pending"}
                  </div>
                  <div className="text-text_primary font-body1 truncate text-xs sm:text-sm md:text-base">
                    {formatDate(deposit.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div> */}
      {/* Pagination Info */}
      {/* <div className="mt-4 text-center text-text_secondary text-sm font-body1">
        Showing {depositHistory.length} of {depositHistory.length} deposits
      </div> */}
    </div>
  );
};

export default DepositHistory;
