import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import axios from "../../api/axiosConfig";
import { SparklesCore } from "../../components/ui/sparkles";

const summaryData = [
  {
    label: "Total Participants",
    value: "$0",
    unit: "USDT",
    icon: "/assets/images/account-stat-1.png",
  },
  {
    label: "Total Withdrawals",
    value: "$0",
    unit: "USDT",
    icon: "/assets/images/account-stat-1.png",
  },
  {
    label: "Trade Income",
    value: "$0",
    unit: "USDT",
    icon: "/assets/images/account-stat-2.png",
  },
  {
    label: "Referral Income",
    value: "$0",
    unit: "USDT",
    icon: "/assets/images/account-stat-3.png",
  },
];

const AccountStatements = () => {
  const [date, setDate] = useState("");
  const [account, setAccount] = useState("");
  const [type, setType] = useState("Deposit");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    setLoading(true);
    let apiUrl = "";
    let params = {};
    if (type === "Deposit") {
      apiUrl = "/financials/gusd/deposit/history";
      params = { page: 1, pageSize: 50, status: null };
    } else if (type === "Withdraw") {
      apiUrl = "/financials/gusd/withdraw/history";
      params = { pageSize: 50, order: "asc", status: "pending" };
    } else if (type === "Expense") {
      apiUrl = "/financials/gusd/expense-history";
      params = { page: 1, pageSize: 50, order: "asc" };
    }
    // Add date filter if set
    if (date) {
      params.startDate = date;
      params.endDate = date;
    }
    axios
      .get(apiUrl + "?" + new URLSearchParams(params).toString(), {
        headers: { token },
      })
      .then((res) => {
        setTableData(res.data?.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, [type, date, token]);


  return (
    <div className="bg-[#010510] flex flex-col items-center justify-center  h-screen w-full      relative ">
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
          <div className=" h-[90vh] md:h-[80vh]  px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header title="ACCOUNT STATEMENTS" />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />

            <div className="grid grid-cols-1 sm:grid-cols-4  gap-0 sm:gap-4 mt-2  w-full border-b border-[#FFFFFF1A] pb-8">
              {/* Date Input */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-black text-xs border font-body1 border-[#2ec7b8] rounded-lg px-4 py-2 text-white w-full"
              />
              {/* Account Input */}
              <div className="col-span-2 my-4 sm:my-0 flex items-center border border-[#2ec7b8] rounded-lg px-4 py-2 bg-transparent w-full">
                <span className="text-white mr-2 text-xs font-body1">Account</span>
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="bg-black w-full text-xs outline-none  text-white"
                />
                <button className="ml-2">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12h.01M12 12h.01M9 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
              {/* Deposit/Withdraw Dropdown */}
              <div className="flex items-center border border-[#2ec7b8] rounded-lg px-4 py-2 bg-black w-full">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-black text-white text-xs font-body1 outline-none w-full"
                >
                  <option value="Deposit">Deposit</option>
                  <option value="Withdraw">Withdraw</option>
                  <option value="Expense">Expenses</option>
                </select>
              </div>
            </div>
            <div className="w-full overflow-y-auto element pt-6 lg:p-10">
              <div className="flex flex-col w-full ">
                <p className="text-white text-sm  sm:text-2xl font-header">
                  Summary
                </p>
                <div className="mb-10 flex pt-8 flex-col md:flex-row gap-4 lg:gap-8 w-full ">
                  {summaryData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex-1  bg-[#FFFFFF1A] rounded-2xl px-3 py-4 flex items-center gap-2 sm:gap-4 shadow-lg border border-[#22304a]"
                    >
                      <img
                        src={item.icon}
                        alt="icon"
                        className="w-10 h-10 mt-[-27px]"
                      />
                      <div>
                        <div className="text-sm sm:text-base font-body1 text-white mb-1">
                          {item.label}
                        </div>
                        <div className="text-xs sm:text-xl font-body1 text-gradient">
                          {item.value}{" "}
                          <span className="text-xs sm:text-lg text-white font-body1">
                            {item.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Deposit Table */}
              <div className="mb-8 text-xs sm:text-2xl text-start w-full tracking-widest font-header text-white">
                {type.toUpperCase()}
              </div>
              <div
                className="w-full rounded-2xl bg-[#FFFFFF1A] overflow-x-auto"
                style={{ borderRadius: "1.5rem" }}
              >
                <div className="min-w-[800px]">
                  <div
                    className="grid text-center font-body1"
                    style={{
                      gridTemplateColumns: "0.5fr 2fr 2fr 1.5fr 1.5fr 1.5fr ",
                    }}
                  >
                    <div className="py-5 px-2 sm:px-6 bg-black text-white text-base md:text-lg tracking-widest border-b border-[#232b36] first:rounded-tl-2xl">
                      #
                    </div>
                    <div className="py-5 px-2 sm:px-6 bg-black text-white text-base md:text-lg tracking-widest border-b border-[#232b36]">
                      Date & Time
                    </div>
                    <div className="py-5 px-2 sm:px-6 bg-black text-white text-base md:text-lg tracking-widest border-b border-[#232b36]">
                      Description
                    </div>
                    <div className="py-5 px-2 sm:px-6 bg-black text-white text-base md:text-lg tracking-widest border-b border-[#232b36]">
                      Amount
                    </div>
                    <div className="py-5 px-2 sm:px-6 bg-black text-white text-base md:text-lg tracking-widest border-b border-[#232b36]">
                      Currency
                    </div>
                    <div className="py-5 px-2 sm:px-6 bg-black text-white text-base md:text-lg tracking-widest border-b border-[#232b36] last:rounded-tr-2xl">
                      Status
                    </div>
                  </div>
                  <div className="h-[30vh] overflow-y-auto element">
                    {loading ? (
                      <div className="text-center py-8 font-body1">Loading...</div>
                    ) : tableData.length === 0 ? (
                      <div className="text-center py-8 text-white font-body1">
                        No data available
                      </div>
                    ) : (
                      tableData.map((row, idx) => (
                        <div
                          key={row._id || idx}
                          className="grid text-center font-body1"
                          style={{
                            gridTemplateColumns:
                              "0.5fr 2fr 2fr 1.5fr 1.5fr 1.5fr",
                          }}
                        >
                          <div className="py-5 px-2 sm:px-6 text-white text-sm border-b border-[#232b36] tracking-widest">
                            {idx + 1}
                          </div>
                          <div className="py-5 px-2 sm:px-6 text-white text-sm border-b border-[#232b36] tracking-widest">
                            {new Date(row.createdAt).toLocaleString()}
                          </div>
                          <div className="py-5 px-2 sm:px-6 text-white text-sm border-b border-[#232b36] tracking-widest">
                            {type === "Deposit"
                              ? row.deposit_type || "-"
                              : type === "Expense" 
                              ? (row.message || "-").replace(/(\d+\s+\w+)\s+with transaction id [^\s]+ has been deducted from your \w+ wallet to purchase (.+)/, "$1 has been deducted to purchase $2")
                              : row.method || "-"}
                          </div>
                          <div className="py-5 px-2 sm:px-6 text-white text-sm border-b border-[#232b36] tracking-widest">
                            {row.amount}
                          </div>
                          <div className="py-5 px-2 sm:px-6 text-white text-sm border-b border-[#232b36] tracking-widest">
                            {type === "Deposit"
                              ? row.currency_code || "-"
                              : row.wallet_type || "-"}
                          </div>
                          <div className="py-5 px-2 sm:px-6 text-white text-sm border-b border-[#232b36] tracking-widest flex items-center">
                            <span className="px-4 sm:px-6 py-1 font-body1 rounded-full bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab text-white text-base border border-[#FFFFFF33]">
                              {type === "Deposit"
                                ? row.status === true
                                  ? "Success"
                                  : "Pending"
                                : type === "Expense"
                                ? row.tranx_type || "-"
                                : row.status === 0
                                ? "Pending"
                                : row.status === 1
                                ? "Success"
                                : "Failed"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
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

export default AccountStatements;
