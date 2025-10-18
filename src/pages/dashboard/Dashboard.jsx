import React, { useRef, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfile } from "../../store/authSlice";
import axios from "../../api/axiosConfig";
import { SparklesCore } from "../../components/ui/sparkles";
import { getReceivedSuRequests, fetchProfile } from "../../api/auth";
import { motion } from "framer-motion";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight } from "lucide-react";

const data = [
  { name: "2Jan", uv: 4000, pv: 2400, amt: 200, x: 1500, y: 2000 },
  { name: "3Jan", uv: 3000, pv: 1398, amt: 2210, x: 1200, y: 1800 },
  { name: "4Jan", uv: 2000, pv: 800, amt: 2290, x: 1800, y: 1600 },
  { name: "5Jan", uv: 2780, pv: 3008, amt: 1000, x: 1300, y: 2200 },
  { name: "6Jan", uv: 1890, pv: 4800, amt: 2181, x: 1600, y: 2100 },
  { name: "7Jan", uv: 2390, pv: 3800, amt: 2500, x: 1700, y: 1300 },
  { name: "8Jan", uv: 3490, pv: 4300, amt: 2100, x: 1400, y: 1900 },
];

const AnimatedSVG = () => {
  const sharedTransition = {
    duration: 4,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut",
  };

  return (
    <div className="w-full mx-auto">
      <svg
        width="359"
        height="185"
        viewBox="0 0 359 185"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={sharedTransition}
          d="M2.57959 70.2837L20.4707 66.8902C26.1962 65.8042 31.5325 63.2224 35.9375 59.4071V59.4071C51.9382 45.5485 76.6625 50.11 86.6644 68.766L107.042 106.776C113.311 118.468 125.503 125.766 138.77 125.766H159.364C167.08 125.766 174.592 123.286 180.792 118.694L215.235 93.1801C224.811 86.0875 237.275 84.1923 248.525 88.1185L269.015 95.2692C271.312 96.0707 273.684 96.6374 276.095 96.9605L289.619 98.7728C302.441 100.491 315.2 95.1974 323.039 84.906L357.421 39.7687"
          stroke="url(#paint0_linear_5352_77729)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.path
          d="M1 53.5538C36.449 57.5608 104.259 84.1314 142.621 117.821C175.788 146.949 237.736 117.358 251.074 94.241C263.884 79.1376 277.608 42.9204 320.568 26.2759C363.528 9.6313 357.245 12.5084 352.156 14.666"
          stroke="white"
          strokeOpacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={sharedTransition}
        />
        <line
          x1="1"
          y1="94.2031"
          x2="359"
          y2="94.2031"
          stroke="white"
          strokeOpacity="0.4"
          strokeDasharray="6 6"
        />
        <motion.path
          d="M214.747 87.666C217.733 87.666 220.065 89.9526 220.065 92.666C220.065 95.3795 217.733 97.666 214.747 97.666C211.761 97.6659 209.429 95.3794 209.429 92.666C209.429 89.9527 211.761 87.6662 214.747 87.666Z"
          fill="#3A86FF"
          stroke="white"
          strokeWidth="2"
          animate={{ scale: [1, 1.4, 1] }}
          transition={sharedTransition}
          style={{ transformOrigin: "center" }}
        />
        <motion.path
          animate={{ scale: [1, 1.4, 1] }}
          transition={sharedTransition}
          style={{ transformOrigin: "center" }}
          d="M99.9761 88.666C102.962 88.666 105.294 90.9526 105.294 93.666C105.294 96.3795 102.962 98.666 99.9761 98.666C96.9901 98.6659 94.6587 96.3794 94.6587 93.666C94.6587 90.9527 96.9901 88.6662 99.9761 88.666Z"
          fill="#3A86FF"
          stroke="white"
          strokeWidth="2"
        />
        <g filter="url(#filter0_f_5352_77729)">
          <rect
            x="92.606"
            y="50.3174"
            width="143.2"
            height="84.1475"
            fill="url(#paint1_linear_5352_77729)"
          />
        </g>

        <defs>
          <filter
            id="filter0_f_5352_77729"
            x="42.606"
            y="0.317383"
            width="243.2"
            height="184.147"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="25"
              result="effect1_foregroundBlur_5352_77729"
            />
          </filter>
          <linearGradient
            id="paint0_linear_5352_77729"
            x1="1.00018"
            y1="79.0683"
            x2="359"
            y2="79.0683"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3A86FF" />
            <stop offset="0.233617" stopColor="white" />
            <stop offset="0.454807" stopColor="#3A86FF" />
            <stop offset="0.846154" stopColor="white" />
            <stop offset="0.9375" stopColor="#3A86FF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_5352_77729"
            x1="164.206"
            y1="50.3174"
            x2="164.206"
            y2="134.465"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3A86FF" stopOpacity="0.15" />
            <stop offset="1" stopColor="#3A86FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
const AnimatedSVG2 = () => {
  const sharedTransition = {
    duration: 4,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut",
  };

  return (
    <div className="w-full mx-auto">
      <svg
        width="380"
        height="191"
        viewBox="0 0 380 191"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={sharedTransition}
          d="M2 35L29.9813 78.1733C36.6585 88.4758 50.9422 90.4143 60.1237 82.264V82.264C70.5762 72.9855 87.0761 76.9763 92.133 90.006L103.241 118.629C109.465 134.665 131.405 136.54 140.26 121.792L141.38 119.926C148.35 108.316 164.826 107.374 173.074 118.114V118.114C178.217 124.81 187.129 127.362 195.037 124.402L211.456 118.255C213.982 117.31 216.393 116.084 218.645 114.6L277.524 75.7975C281.993 72.8522 287.062 70.9405 292.363 70.2017L302.563 68.7799C315.685 66.9511 328.75 72.4764 336.577 83.1646L373 132.898"
          stroke="url(#paint0_linear_5352_77827)"
          stroke-width="3"
          stroke-linecap="round"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={sharedTransition}
          d="M2 54.5087C38.9792 59.0754 109.952 87.7881 150.158 124.095C184.969 155.532 232.039 134.81 245.992 109.779C259.394 93.425 251.72 70.7298 296.663 52.7075C341.606 34.6852 381.849 112.449 376.525 114.785"
          stroke="white"
          stroke-opacity="0.2"
        />
        <line
          y1="97.5"
          x2="380"
          y2="97.5"
          stroke="white"
          stroke-opacity="0.4"
          stroke-dasharray="6 6"
        />
        <motion.path
          animate={{ scale: [1, 1.4, 1] }}
          transition={sharedTransition}
          style={{ transformOrigin: "center" }}
          d="M246.317 92C249.303 92 251.636 94.2866 251.636 97C251.636 99.7134 249.303 102 246.317 102C243.331 102 241 99.7134 241 97C241 94.2866 243.331 92.0001 246.317 92Z"
          fill="#0AC488"
          stroke="white"
          stroke-width="2"
        />
        <motion.path
          animate={{ scale: [1, 1.4, 1] }}
          transition={sharedTransition}
          style={{ transformOrigin: "center" }}
          d="M95.3174 92C98.3035 92 100.636 94.2866 100.636 97C100.636 99.7134 98.3035 102 95.3174 102C92.3314 102 90 99.7134 90 97C90 94.2866 92.3314 92.0001 95.3174 92Z"
          fill="#0AC488"
          stroke="white"
          stroke-width="2"
        />
        <g filter="url(#filter0_f_5352_77827)">
          <rect
            x="108"
            y="50"
            width="135.828"
            height="91"
            fill="url(#paint1_linear_5352_77827)"
          />
        </g>

        <defs>
          <filter
            id="filter0_f_5352_77827"
            x="58"
            y="0"
            width="235.828"
            height="191"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="25"
              result="effect1_foregroundBlur_5352_77827"
            />
          </filter>
          <linearGradient
            id="paint0_linear_5352_77827"
            x1="0.900741"
            y1="90.2245"
            x2="374.649"
            y2="90.2245"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#0AC488" />
            <stop offset="0.233617" stop-color="white" />
            <stop offset="0.454807" stop-color="#0AC488" />
            <stop offset="0.846154" stop-color="white" />
            <stop offset="0.9375" stop-color="#0AC488" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_5352_77827"
            x1="175.914"
            y1="50"
            x2="175.914"
            y2="141"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#0AC488" stop-opacity="0.15" />
            <stop offset="1" stop-color="#0AC488" stop-opacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const ArrowDown = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed left-1/2 bottom-14 z-50 transform -translate-x-1/2 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] p-3 rounded-full shadow-lg hover:scale-110 transition"
    style={{ boxShadow: "0 4px 24px 0 rgba(51,160,234,0.2)" }}
    aria-label="Scroll Down"
  >
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5v14M19 12l-7 7-7-7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const ArrowUp = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed left-1/2 bottom-14 z-50 transform -translate-x-1/2 bg-gradient-to-r from-[#33A0EA] to-[#0AC488] p-3 rounded-full shadow-lg hover:scale-110 transition"
    style={{ boxShadow: "0 4px 24px 0 rgba(51,160,234,0.2)" }}
    aria-label="Scroll Up"
  >
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 19V5M5 12l7-7 7 7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const groupColors = ["#E0B7DC", "#0AAA3A", "#D8534C", "#0AABA6", "#F7C224"];

const Dashboard = () => {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Debug: Log user data to check role
  useEffect(() => {
    console.log("User data in Dashboard:", user);
    console.log("User role:", user?.role);
    console.log("Token:", token);
  }, [user, token]);

  // If user is null but we have a token, fetch profile explicitly
  useEffect(() => {
    if (!user && token) {
      console.log("User is null but we have token, fetching profile...");
      fetchProfile(token)
        .then((profileRes) => {
          console.log("Explicit profile fetch response:", profileRes);
          if (profileRes && profileRes.success && profileRes.data) {
            console.log(
              "Setting user profile from explicit fetch:",
              profileRes.data
            );
            dispatch(setUserProfile(profileRes.data));
          }
        })
        .catch((err) => {
          console.error("Explicit profile fetch error:", err);
        });
    }
  }, [user, token, dispatch]);
  // State for API data
  const [stats, setStats] = useState({
    username: "",
    role: "",
    bfm: 0,
    gusd: 0,
    totalBalance: 0,
    bfmPrice: 0,
    totalIncome: 0,
    pendingIncome: 0,
    totalWithdrawn: 0,
    products: 0,
    signalChannels: 0,
    IPVPN: 0,
    totalStakingBoxes: 0,
    totalStakingAmount: 0,
    totalReferrals: 0,
    hasActiveLicense: false,
  });
  const [barChartData, setBarChartData] = useState([]);
  const [bfmPrice, setBfmPrice] = useState("$0.00");
  const [bfmPriceRaw, setBfmPriceRaw] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0); // 0: first two, 1: second two
  const [receivedSuRequests, setReceivedSuRequests] = useState([]);
  const [groupSalesData, setGroupSalesData] = useState([]);
  const [groupSalesLoading, setGroupSalesLoading] = useState(false);

  // Dummy Data for BFM and EUSD Sparkline Charts
  const bfmData = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  const eusdData = [
    { name: "Page A", uv: 2400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 1398, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 9800, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 3908, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 4800, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 3800, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 4300, pv: 4300, amt: 2100 },
  ];

  // Dummy Data for Line Chart
  const lineChartData = [
    { name: "18:00", BFM: 65, EUSD: 38 },
    { name: "19:00", BFM: 58, EUSD: 45 },
    { name: "20:00", BFM: 68, EUSD: 22 },
    { name: "21:00", BFM: 52, EUSD: 30 },
    { name: "22:00", BFM: 75, EUSD: 42 },
  ];

  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const [atTop, setAtTop] = useState(true);

  // Always lock scroll on body and html
  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   document.documentElement.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = '';
  //     document.documentElement.style.overflow = '';
  //   };
  // }, []);
  const fetchBfmPrice = async () => {
    try {
      const response = await axios.get("/financials/bfm-price", {
        headers: { apikey: import.meta.env.VITE_API_KEY },
      });

      if (response.data.success) {
        // Format the price with dollar sign and proper formatting
        const price =
          response.data.data?.bfmPrice || response.data.bfmPrice || 0;
        const rawPrice = parseFloat(price) || 0;
        const formattedPrice = `$${rawPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
        setBfmPrice(formattedPrice);
        setBfmPriceRaw(rawPrice);
      } else {
        console.error("Failed to fetch BFM price:", response.data.message);
        setBfmPrice("$0.00");
        setBfmPriceRaw(0);
      }
    } catch (error) {
      console.error("Error fetching BFM price:", error);
      setBfmPrice("$0.00");
      setBfmPriceRaw(0);
    }
  };

  useEffect(() => {
    fetchBfmPrice();
  }, []);

  // Scroll handlers
  const handleArrowDown = () => {
    if (secondSectionRef.current) {
      window.scrollTo({
        top: secondSectionRef.current.offsetTop,
        behavior: "smooth",
      });
      // After scroll, show up arrow
      setTimeout(() => setAtTop(false), 600);
    }
  };
  const handleArrowUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setAtTop(true), 600);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("/user/dashboard-stats", { headers: { token } })
      .then((res) => {
        if (res.data && res.data.success) {
          setStats({
            username: res.data.data.username ?? "",
            role: res.data.data.role ?? "",
            bfm: res.data.data.bfm ?? 0,
            gusd: res.data.data.gusd ?? 0,
            totalBalance: res.data.data.totalBalance ?? 0,
            bfmPrice: res.data.data.bfmPrice ?? 0,
            totalIncome: res.data.data.totalIncome ?? 0,
            pendingIncome: res.data.data.pendingIncome ?? 0,
            totalWithdrawn: res.data.data.totalWithdrawn ?? 0,
            products: res.data.data.products ?? 0,
            signalChannels: res.data.data.signalChannels ?? 0,
            IPVPN: res.data.data.IPVPN ?? 0,
            totalStakingBoxes: res.data.data.totalStakingBoxes ?? 0,
            totalStakingAmount: res.data.data.totalStakingAmount ?? 0,
            totalReferrals: res.data.data.totalReferrals ?? 0,
            hasActiveLicense: res.data.data.hasActiveLicense ?? false,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // Fetch income and withdrawal chart data along with received su requests and profile
    Promise.all([
      axios.get("/user/charts/income?type=monthly&income_type=", {
        headers: { token },
      }),
      axios.get("/user/charts/withdraw?type=yearly&wallet_type=BFM", {
        headers: { token },
      }),
      getReceivedSuRequests(token).catch((err) => {
        console.error("Error fetching SU requests:", err);
        return { success: false, data: [] };
      }),
      fetchProfile(token).catch((err) => {
        console.error("Error fetching profile:", err);
        return { success: false, data: null };
      }),
    ])
      .then(([incomeRes, withdrawRes, suRequestsRes, profileRes]) => {
        console.log("All API calls completed");
        console.log("Profile API response:", profileRes);
        let incomeData = incomeRes.data?.data || [];
        let withdrawData = withdrawRes.data?.data || [];
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const incomeMap = {};
        incomeData.forEach((item) => {
          if (item._id && item._id.day && item._id.month) {
            const key = `${String(item._id.day).padStart(2, "0")} ${
              months[item._id.month - 1]
            }`;
            incomeMap[key] = item.totalAmount;
          }
        });
        const withdrawMap = {};
        withdrawData.forEach((item) => {
          if (item._id && item._id.day && item._id.month) {
            const key = `${String(item._id.day).padStart(2, "0")} ${
              months[item._id.month - 1]
            }`;
            withdrawMap[key] = item.totalAmount;
          }
        });
        const allKeys = Array.from(
          new Set([...Object.keys(incomeMap), ...Object.keys(withdrawMap)])
        ).sort();
        const keys = allKeys.length
          ? allKeys
          : ["03 Jan", "10 Jan", "17 Jan", "24 Jan", "31 Jan"];
        const chartData = keys.map((name) => ({
          name,
          income: incomeMap[name] ?? 0,
          withdrawal: withdrawMap[name] ?? 0,
        }));
        setBarChartData(chartData);

        // Handle received su requests data
        if (suRequestsRes && suRequestsRes.success) {
          setReceivedSuRequests(suRequestsRes.data || []);
        } else {
          setReceivedSuRequests([]);
        }

        // Handle profile data and update Redux store
        if (profileRes && profileRes.success && profileRes.data) {
          console.log("Profile API Response:", profileRes);
          console.log("Profile data loaded:", profileRes.data);
          console.log("User role from profile:", profileRes.data.role);
          dispatch(setUserProfile(profileRes.data));
        } else {
          console.error("Profile API failed:", profileRes);
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setBarChartData([
          { name: "03 Jan", income: 0, withdrawal: 0 },
          { name: "10 Jan", income: 0, withdrawal: 0 },
          { name: "17 Jan", income: 0, withdrawal: 0 },
          { name: "24 Jan", income: 0, withdrawal: 0 },
          { name: "31 Jan", income: 0, withdrawal: 0 },
        ]);
        setReceivedSuRequests([]); // Set empty array in case of error
      });
  }, [token]);

  useEffect(() => {
    if (user?.role === "SU") {
      setGroupSalesLoading(true);
      setGroupSalesData([]); // Show empty chart immediately
      axios
        .get("/financials/sales-chart?role=SU", { headers: { token } })
        .then((res) => {
          if (
            res.data &&
            res.data.success &&
            Array.isArray(res.data.data.sales)
          ) {
            // Each array in sales is a group: group1, group2, ...
            const salesArrays = res.data.data.sales;
            // Only process if we have actual sales data
            if (
              salesArrays.length > 0 &&
              salesArrays.some((group) => group.length > 0)
            ) {
              // Limit to max 5 groups, combine excess groups
              const maxGroups = 5;
              const limitedSalesArrays = salesArrays.slice(0, maxGroups);

              // If more than 5 groups, combine the excess into the 5th group
              if (salesArrays.length > maxGroups) {
                const excessGroups = salesArrays.slice(maxGroups);
                // Combine excess groups into the 5th group
                limitedSalesArrays[maxGroups - 1] = limitedSalesArrays[
                  maxGroups - 1
                ].map((item, idx) => ({
                  ...item,
                  amount:
                    item.amount +
                    excessGroups.reduce(
                      (sum, groupArr) => sum + (groupArr[idx]?.amount ?? 0),
                      0
                    ),
                }));
              }

              // Assume all arrays have the same dates in the same order
              const chartRows = limitedSalesArrays[0].map((item, idx) => {
                const row = { date: item.date };
                limitedSalesArrays.forEach((groupArr, gIdx) => {
                  row[`group${gIdx + 1}`] = groupArr[idx]?.amount ?? 0;
                });
                return row;
              });
              setGroupSalesData(chartRows);
            } else {
              // Explicitly set empty data when no sales data exists
              setGroupSalesData([]);
            }
          } else {
            // Explicitly set empty data when API response is not successful
            setGroupSalesData([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching sales chart data:", error);
          // Explicitly set empty data when API call fails
          setGroupSalesData([]);
        })
        .finally(() => setGroupSalesLoading(false));
    }
  }, [user, token]);

  // Loading overlay (replace with blur overlay)
  // --- SLIDER LAYOUT ---
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

      <div className="w-full  max-w-[1100px] items-center justify-center px-4   ">
        <div className="relative z-50 w-full ">
          <div className=" h-[90vh] md:h-[80vh]  px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />

            <div className="relative  overflow-y-auto h-full  element  w-full mt-2">
              <div className="flex  flex-col md:flex-row    ">
                <div className=" w-[97%]">
                  <h2 className="text-sm lg:text-xl font-body1 mb-2 ">
                    Balance Details
                  </h2>
                  <p className="text-2xl lg:text-3xl font-body1 text-gradient">
                    $ {stats.totalBalance.toFixed(2)}{" "}
                  </p>
                  <div className="flex lg:space-x-4">
                    <div className=" bg-transparent rounded-lg p-2 sm:p-3 flex-1 ">
                      <div className="flex items-center">
                        <div className="p-3 border border-[#FFFFFF33] bg-[#FFFFFF1A] rounded-lg mr-3">
                          <img
                            src="/assets/images/Group (1).png"
                            className="w-4 h-4 text-white"
                          />
                        </div>
                        <div>
                          <p className="text-2xl sm:text-2xl font-semibold font-body1 text-gradient">
                            $ {stats.totalIncome.toFixed(2)}
                          </p>
                          <p className="text-sm text-text_secondary mt-1 font-body1">
                            Income
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center mt-3">
                        <Link
                          to={"/wallets"}
                          className="flex-1 py-2 text-center rounded-full text-white font-body1 font-semibold bg-blue-600 hover:opacity-90 transition-opacity"
                        >
                          Deposit
                        </Link>
                      </div>
                    </div>

                    <div className="bg-transparent rounded-lg py-2 sm:p-3 flex-1 ">
                      <div className="flex items-center">
                        <div className="p-3 border border-[#FFFFFF33] bg-[#FFFFFF1A] rounded-lg mr-3">
                          <img
                            src="/assets/images/Group (2).png"
                            className="w-4 h-4 text-white"
                          />
                        </div>
                        <div>
                          <p className="text-2xl sm:text-2xl font-semibold font-body1 text-gradient">
                            $ {stats.totalWithdrawn.toFixed(2)}
                          </p>
                          <p className="text-sm text-text_secondary font-body1 mt-1">
                            Expense
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center mt-2">
                        <Link
                          to={"/wallets"}
                          className="flex-1 py-2 text-center rounded-full font-body1 text-white font-semibold bg-orange-600 hover:opacity-90 transition-opacity"
                        >
                          Withdraw
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3  md:gap-1 lg:gap-2 w-full place-items-center sm:place-items-start  ">
                  <div
                    className="rounded-[20px] p-4 flex flex-col justify-between  relative overflow-hidden   w-full  max-w-[315px] h-[102px]  sm:h-[85px]"
                    style={{
                      backgroundImage: "url('./greenboxleft.svg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <Link
                      to={"/staking-products"}
                      state={{ initialTab: 2, services: 1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-body1 text-xs lg:text-base">
                          Total Staking Boxes
                        </span>
                        <span className="w-5 h-5 p-1 flex items-center justify-center rounded-full bg-white">
                          <ArrowUpRight className="text-black w-10 h-10" />
                        </span>
                      </div>
                      <div className="text-white font-body1  text-2xl sm:text-2xl ">
                        {stats.totalStakingBoxes}
                      </div>
                    </Link>
                  </div>

                  <div
                    className="rounded-[20px] p-4 px6 flex flex-col justify-between  relative overflow-hidden w-full  max-w-[315px] h-[102px]  sm:h-[85px]"
                    style={{
                      backgroundImage: "url('./greenboxright.svg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {" "}
                    <Link
                      to={"/staking-products"}
                      state={{ initialTab: 2, services: 4 }}
                      className=" pl-3"
                    >
                      <div className="flex items-center justify-between ">
                        <span className="text-white font-body1 text-xs lg:text-base">
                          Total Lotteries
                        </span>
                        <span className="w-5 h-5 p-1 flex items-center justify-center rounded-full bg-white">
                          <ArrowUpRight className="text-black w-10 h-10" />
                        </span>
                      </div>
                      <div className="text-white font-body1 text-2xl sm:text-2xl mb-2">
                        0
                      </div>
                    </Link>
                  </div>

                  <div
                    className="rounded-[20px] p-4 px6 flex flex-col justify-between  relative overflow-hidden w-full  max-w-[315px] h-[102px]  sm:h-[85px]"
                    style={{
                      backgroundImage: "url('./bottomrightbox.svg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {" "}
                    <Link
                      to={"/staking-products"}
                      state={{ initialTab: 2, services: 3 }}
                    >
                      <div className="flex items-center justify-between ">
                        <span className="text-white font-body1 text-xs lg:text-[14px]">
                          Total Signal Channels
                        </span>
                        <span className="w-5 h-5 p-1 flex items-center justify-center rounded-full bg-white mr-2">
                          <ArrowUpRight className="text-black w-10 h-10" />
                        </span>
                      </div>
                      <div className="text-white font-body1 text-2xl sm:text-2xl mb-2">
                        {stats.signalChannels}
                      </div>
                    </Link>
                  </div>
                  <div
                    className="rounded-[20px] p-4 px6 flex flex-col justify-between  relative overflow-hidden w-full  max-w-[315px] h-[102px]  sm:h-[85px]"
                    style={{
                      backgroundImage: "url('./topleftbox.svg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {" "}
                    <Link
                      to={"/staking-products"}
                      state={{ initialTab: 2 }}
                      className="pl-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-body1 text-xs lg:text-base">
                          Total Services
                        </span>
                        <span className="w-5 h-5 p-1 flex items-center justify-center rounded-full bg-white">
                          <ArrowUpRight className="text-black w-10 h-10" />
                        </span>
                      </div>
                      <div className="text-white font-body1 text-2xl sm:text-2xl mb-2">
                        {stats.IPVPN + stats.signalChannels}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <div className=" flex   md:flex-row flex-col gap-2 mt-3 ">
                <div className="grid sm:grid-cols-4 w-full  gap-2">
                  {user?.role === "SU" ? (
                    <Link to={"/income"}>
                      <div
                        className="   p-3  h-[92px] w-full  flex space-x-4 items-center justify-center "
                        style={{
                          backgroundImage: "url('./rightgreenbox.svg')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <div className="bg-[#FFFFFF1A] p-2 w-12 rounded-xl  flex">
                          <img
                            src="/assets/images/Group (3).png"
                            alt="EUSD Logo"
                            className="w-8 h-8 mr-2"
                          />
                        </div>
                        <div className="flex items-center space-x-2 ">
                          <div>
                            <p className="text-sm sm:text-base text-white mb-2 font-body1">
                              Weekly Income
                            </p>
                            <p className="text-2xl sm:text-2xl font-body1 text-white">
                              ${stats.totalIncome.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : null}

                  <Link to={"/refer"}>
                    <div
                      className="   p-3  h-[92px] w-full  flex space-x-4 items-center justify-center "
                      style={{
                        backgroundImage: "url('./bottomgreenbox.svg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="bg-[#FFFFFF1A] p-2 w-12 rounded-xl  flex">
                        <img
                          src="/assets/images/Frame.png"
                          alt="EUSD Logo"
                          className="w-8 h-8 mr-2"
                        />
                      </div>
                      <div className="flex items-center space-x-2 ">
                        <div>
                          <p className="text-sm sm:text-base font-body1 text-white mb-2">
                            Total Referrals
                          </p>
                          <p className="text-2xl sm:text-2xl font-body1 text-white">
                            {stats.totalReferrals}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to={"/wallets"}>
                    <div
                      className="   p-3  h-[92px] w-full  flex space-x-4 items-center justify-center "
                      style={{
                        backgroundImage: "url('./topgreenbox.svg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="bg-[#FFFFFF1A] p-2 w-12 rounded-xl  flex">
                        <img
                          src="/assets/images/Frame (1).png"
                          alt="EUSD Logo"
                          className="w-8 h-8 mr-2"
                        />
                      </div>
                      <div className="flex items-center space-x-2 ">
                        <div>
                          <p className="text-sm sm:text-base font-body1 text-white mb-2">
                            Withdrawn
                          </p>

                          <p className="text-2xl sm:text-2xl font-body1 text-white">
                            $0.00
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to={"/staking-products"} state={{ initialTab: 2 }}>
                    <div
                      className="   p-3  h-[92px] w-full  flex space-x-4 items-center justify-center "
                      style={{
                        backgroundImage: "url('./leftgreenbox.svg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="bg-[#FFFFFF1A] p-2 w-12 rounded-xl  flex">
                        <img
                          src="/assets/images/Frame (2).png"
                          alt="EUSD Logo"
                          className="w-8 h-8 mr-2"
                        />
                      </div>
                      <div className="flex items-center space-x-2 ">
                        <div>
                          <p className="text-sm sm:text-base font-body1 text-white mb-2">
                            Open Tickets
                          </p>

                          <p className="text-2xl sm:text-2xl font-body1 text-white">
                            0
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  user?.role === "SU" ? "md:grid-cols-2" : "md:grid-cols-1"
                } gap-4 mt-3 `}
              >
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-2 ">
                  <Link to={"/wallets"}>
                    <div className=" bg-[#FFFFFF1A]  h-full   border-[#FFFFFF1A] rounded-[24px] shadow-xl flex flex-col relative overflow-hidden">
                      <div className="grid ">
                        <div className="flex items-center  gap-2  mb-2 p-3 ">
                          <div className="w-8 h-8 bg-black rounded-full">
                            <img
                              src="/assets/images/bfm-logo.png"
                              alt="BFM Logo"
                              className="w-8 h-8"
                            />
                          </div>
                          <span className="text-2xl sm:text-3xl font-body1 text-gradient">
                            BFM
                          </span>
                        </div>
                        <div
                          className="w-full hidden sm:flex flex-col h-px"
                          style={{ background: "#FFFFFF1A" }}
                        ></div>
                        <div className="text-white text-2xl sm:text-2xl font-body1 mb-2  px-4 mt-5">
                          $ {(stats.bfm * bfmPriceRaw).toFixed(2)}
                          <span className="font-body1 text-[14px] sm:text-[14px] ml-3 text-gradient">
                            {stats.bfm} BFM
                          </span>
                        </div>
                        <div
                          className="  relative w-full flex flex-col items-center justify-center"
                          style={{ height: "200px" }}
                        >
                          <AnimatedSVG />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to={"/wallets"}>
                    <div className=" bg-[#FFFFFF1A]  h-full   border-[#FFFFFF1A] rounded-[24px] shadow-xl flex flex-col relative overflow-hidden">
                      <div className="grid ">
                        <div className="flex items-center  gap-2  mb-2 p-3 ">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center  justify-center">
                            <img
                              src="/assets/images/gusd-logo.png"
                              alt="EUSD Logo"
                              className="w-5 h-5"
                            />
                          </div>
                          <span className="text-2xl sm:text-3xl font-body1 text-gradient">
                            GUSD
                          </span>
                        </div>
                        <div
                          className="w-full hidden sm:flex flex-col h-px"
                          style={{ background: "#FFFFFF1A" }}
                        ></div>
                        <div className="text-white text-2xl sm:text-2xl font-body1 px-4 mt-5 ">
                          $ {(stats.gusd * 1).toFixed(2)}
                          <span className="font-body1 text-[14px] sm:text-[14px] ml-3 text-gradient">
                            {stats.gusd} GUSD
                          </span>
                        </div>
                        <div
                          className="  relative w-full flex flex-col items-center justify-center"
                          style={{ height: "200px" }}
                        >
                          <AnimatedSVG2 />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {user?.role === "SU" && (
                  <div className="bg-[#FFFFFF0F]  rounded-[20px] shadow-2xl  text-xs   p-2">
                    <div className="w-full flex justify-between items-center px-2">
                      <p className="text-base font-body1">Group Sales</p>
                      <p className="text-sm font-body1 text-gradient">
                        30 days
                      </p>
                    </div>
                    <div className="w-full flex items-end space-x-3 justify-end mt-2 px-2">
                      {user?.role === "SU" && groupSalesLoading ? (
                        // Show loading skeleton for legend
                        <>
                          <div className="flex items-center justify-center gap-2">
                            <div className="p-1 bg-gray-400 rounded-full animate-pulse" />
                            <p className="text-[10px] text-gray-400 font-body1 mt-1 animate-pulse">
                              Loading...
                            </p>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className="p-1 bg-gray-400 rounded-full animate-pulse" />
                            <p className="text-[10px] text-gray-400 font-body1 mt-1 animate-pulse">
                              Loading...
                            </p>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className="p-1 bg-gray-400 rounded-full animate-pulse" />
                            <p className="text-[10px] text-gray-400 font-body1 mt-1 animate-pulse">
                              Loading...
                            </p>
                          </div>
                        </>
                      ) : user?.role === "SU" && groupSalesData.length > 0 ? (
                        Object.keys(groupSalesData[0])
                          .filter((k) => k !== "date")
                          .map((groupKey, idx) => (
                            <div
                              className="flex items-center justify-center gap-2"
                              key={groupKey}
                            >
                              <div
                                className="p-1 rounded-full"
                                style={{
                                  background:
                                    groupColors[idx % groupColors.length],
                                }}
                              />
                              <p
                                className="text-[10px] font-body1 mt-1"
                                style={{
                                  color: groupColors[idx % groupColors.length],
                                }}
                              >
                                Group {idx + 1}
                              </p>
                            </div>
                          ))
                      ) : user?.role === "SU" && groupSalesData.length === 0 ? (
                        // Show "No data" message for SU users when there's no sales data
                        <div className="flex items-center justify-center">
                          <p className="text-[10px] text-gray-400 font-body1">
                            No sales data available
                          </p>
                        </div>
                      ) : (
                        // Show default groups only for non-SU users
                        <>
                          {Array.from({ length: 5 }, (_, idx) => (
                            <div
                              className="flex items-center justify-center gap-2 "
                              key={idx}
                            >
                              <div
                                className="p-1 rounded-full"
                                style={{
                                  background:
                                    groupColors[idx % groupColors.length],
                                }}
                              />
                              <p
                                className="text-[10px] font-body1 mt-1"
                                style={{
                                  color: groupColors[idx % groupColors.length],
                                }}
                              >
                                Group {idx + 1}
                              </p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    <div className="flex justify-center w-full items-center space-x-2 ">
                      <div
                        style={{
                          width: "100%",
                          height: 250,
                          borderRadius: 10,
                          position: "relative",
                        }}
                      >
                        {/* Loading overlay for SU users */}
                        {user?.role === "SU" && groupSalesLoading && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#06101A]/80 backdrop-blur-sm rounded-lg ">
                            <div className="flex flex-col items-center justify-center ">
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
                                  strokeWidth="4"
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
                              <span className="text-sm font-body1 text-white">
                                Loading Sales Data...
                              </span>
                            </div>
                          </div>
                        )}

                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={user?.role === "SU" ? groupSalesData : data}
                          >
                            <defs>
                              <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#E0B7DC"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#E0B7DC"
                                  stopOpacity={0.2}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorPv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#0AAA3A"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#0AAA3A"
                                  stopOpacity={0.2}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorAmt"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#D8534C"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#D8534C"
                                  stopOpacity={0.2}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorX"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#0AABA6"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#0AABA6"
                                  stopOpacity={0.2}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorY"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#F7C224"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#F7C224"
                                  stopOpacity={0.2}
                                />
                              </linearGradient>
                            </defs>

                            <CartesianGrid
                              stroke="#24344d"
                              strokeDasharray="3 3"
                            />

                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1a1f2e",
                                border: "none",
                              }}
                              labelStyle={{ color: "#fff" }}
                            />

                            {user?.role === "SU" ? (
                              <>
                                <XAxis dataKey="date" stroke="#ccc" />
                                <YAxis stroke="#ccc" />
                                {groupSalesData.length > 0 &&
                                  Object.keys(groupSalesData[0])
                                    .filter((k) => k !== "date")
                                    .map((groupKey, idx) => (
                                      <Area
                                        key={groupKey}
                                        type="monotone"
                                        dataKey={groupKey}
                                        stackId={null}
                                        stroke={
                                          groupColors[idx % groupColors.length]
                                        }
                                        fill={
                                          groupColors[idx % groupColors.length]
                                        }
                                        dot={{
                                          fill: groupColors[
                                            idx % groupColors.length
                                          ],
                                          strokeWidth: 2,
                                          r: 3,
                                        }}
                                      />
                                    ))}
                              </>
                            ) : (
                              <>
                                <Area
                                  type="monotone"
                                  dataKey="uv"
                                  stackId="1"
                                  stroke="#E0B7DC"
                                  fill="url(#colorUv)"
                                  dot={{
                                    fill: "#E0B7DC",
                                    strokeWidth: 2,
                                    r: 3,
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="pv"
                                  stackId="1"
                                  stroke="#0AAA3A"
                                  fill="url(#colorPv)"
                                  dot={{
                                    fill: "#0AAA3A",
                                    strokeWidth: 2,
                                    r: 3,
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="amt"
                                  stackId="1"
                                  stroke="#D8534C"
                                  fill="url(#colorAmt)"
                                  dot={{
                                    fill: "#D8534C",
                                    strokeWidth: 2,
                                    r: 3,
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="x"
                                  stackId="1"
                                  stroke="#0AABA6"
                                  fill="url(#colorX)"
                                  dot={{
                                    fill: "#0AABA6",
                                    strokeWidth: 2,
                                    r: 3,
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="y"
                                  stackId="1"
                                  stroke="#F7C224"
                                  fill="url(#colorY)"
                                  dot={{
                                    fill: "#F7C224",
                                    strokeWidth: 2,
                                    r: 3,
                                  }}
                                />
                              </>
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full hidden md:flex">
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;