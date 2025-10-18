import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import axios from "../../api/axiosConfig";
import { SparklesCore } from "../../components/ui/sparkles";

const Income = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [summaryData, setSummaryData] = useState({ totalIncome: 0 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "/financials/gusd/deposit/history?page=1&pageSize=10&status=null",
          { headers: { token } }
        );
        const apiData = res.data?.data?.data || [];
        setTableData(apiData);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    // Fetch dashboard stats for total income
    const fetchStats = async () => {
      try {
        const res = await axios.get("/user/dashboard-stats", {
          headers: { token },
        });
        const totalIncome = res.data?.data?.totalIncome ?? 0;
        setSummaryData({ totalIncome });
      } catch (err) {
        setSummaryData({ totalIncome: 0 });
      }
    };
    fetchStats();
  }, [token]);

  const summary = [
    {
      label: "Total Income",
      value: `$ ${Number(summaryData.totalIncome).toFixed(2)}`,
    },
    { label: "Income From Each Level", value: "$ 0" },
    { label: "Income From Each Product/Service", value: "$ 0" },
    { label: "Income From Direct Sales", value: "$ 0" },
  ];

  // Remove the old full-screen loading return
  // Always render the main page structure

  {
    /* {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#06101A]/60 backdrop-blur-[6px] transition-all duration-300">
          <div className="flex flex-col items-center justify-center">
            <svg className="animate-spin mb-6" width="60" height="60" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" stroke="url(#gradientStroke)" strokeWidth="5" fill="none" strokeDasharray="31.4 31.4" />
              <defs>
                <linearGradient id="gradientStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="9.17%" stopColor="#33A0EA" />
                  <stop offset="83.83%" stopColor="#0AC488" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-2xl font-heading2 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent">Loading Dashboard...</span>
          </div>
        </div>
      )} */
  }
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
            <Header title="INCOME" />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />

            <div className="relative overflow-y-auto pt-6 px-4 sm:px-6 md:p-10 w-full element">
              <div className=" grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4  mb-8">
                {summary.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-2 rounded-3xl p-8 flex flex-col items-start "
                    style={{
                      background:
                        " linear-gradient(140.4deg, rgba(51, 160, 234, 0.2) 9.17%, rgba(10, 196, 136, 0.2) 83.83%)",
                    }}
                  >
                    <div className="text-md sm:text-2xl font-body1 text-white">
                      {item.value}
                    </div>
                    <div className="text-base mt-5 font-body1 text-text_secondary ">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full bg-[#151c26] rounded-2xl shadow-lg border border-[#222b3a] overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-4 text-left bg-black font-body1 text-white text-base px-6 py-4 rounded-t-2xl">
                    <div>#</div>
                    <div>Tranx ID</div>
                    <div>Amount</div>
                    <div>Date</div>
                  </div>
                  <div className="divide-y divide-[#222b3a] h-[30vh] overflow-y-auto">
                    {loading ? (
                      <div className="text-center py-8 col-span-4 font-body1">
                        Loading...
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 col-span-4 text-red-500 font-body1">
                        {error}
                      </div>
                    ) : (
                      tableData.map((row, idx) => (
                        <div
                          key={row._id || idx}
                          className="grid grid-cols-4 items-center px-6 font-body1 py-4 bg-[#232b36]"
                        >
                          <div>{idx + 1}</div>
                          <div>{row.tranx_id}</div>
                          <div>{row.amount}</div>
                          <div>{new Date(row.createdAt).toLocaleString()}</div>
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

export default Income;
