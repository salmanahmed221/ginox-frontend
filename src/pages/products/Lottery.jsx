import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getLotteryPageData,
  getLotteryWinnerTickets,
  joinDailyLottery,
} from "../../api/auth";
import ProductNavbar from "../../components/ProductNavbar";
import ProductFooter from "../../components/ProductFooter";
import Navigation from "../../components/navigation";
import Footer from "../../components/footers";
const winners = [
  // placeholder, will be replaced by API data
];

export default function Lottery() {
  const token = useSelector((state) => state.auth.token);
  const [bannerData, setBannerData] = useState(null);
  const [winnerRows, setWinnerRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    Promise.all([getLotteryPageData(token), getLotteryWinnerTickets(token)])
      .then(([pageRes, winnersRes]) => {
        if (pageRes.success) {
          setBannerData(pageRes.data);
          setTimer(pageRes.data?.remainingTime);
        }
        if (winnersRes.success) {
          // Map API data to table row format
          setWinnerRows(
            (winnersRes.data?.data || []).map((row, idx) => ({
              winner: row.username,
              ticket: "Free",
              prize: row.amount?.toFixed ? row.amount.toFixed(2) : row.amount,
              time: row.createdAt,
              backgroundColor:
                idx % 2 === 1 ? "rgba(255, 255, 255, 0.05)" : "transparent",
            }))
          );
        }
      })
      .catch(() => setError("Failed to load lottery data"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleParticipate = async () => {
    if (!token) return;
    setModalMessage("");
    setModalSuccess(null);
    try {
      const res = await joinDailyLottery(token);
      if (res.success) {
        setModalMessage(
          res.data?.message || "Registered successfully for today's Lottery."
        );
        setModalSuccess(true);
      } else {
        setModalMessage(res.message || "Failed to register for the lottery.");
        setModalSuccess(false);
      }
      setModalOpen(true);
    } catch (err) {
      setModalMessage(
        err.response?.data?.message || "Failed to register for the lottery."
      );
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  // Timer display logic
  const timerString = timer
    ? `⏰ ${String(timer.hours).padStart(2, "0")}:${String(
        timer.minutes
      ).padStart(2, "0")}:${String(timer.seconds).padStart(2, "0")}`
    : "⏰ --:--:--";

  return (
    <div className="min-h-screen w-screen relative bg-[#010510] font-['Octa Brain','Avalont-Regular','sans-serif'] flex flex-col">
      <div className="backdrop-blur-xl absolute inset-0  z-50"></div>
      <div className="absolute inset-0 z-50 -top-24  flex items-center justify-center">
        <div className="text-gradient  rounded-2xl ">
          <h1 className="text-3xl sm:text-5xl font-bold text-center font-body1">
            Lottery will be starting soon, stay tuned
          </h1>
        </div>
      </div>
      <Navigation />
      {/* Banner Section */}
      <div className="w-full max-w-8xl mx-auto mt-6 md:mt-10 px-2 md:px-4">
        <div
          className="relative bg-gradient-to-br from-[#010510] to-[#001016] border border-[#232A3E] rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden"
          style={{ minHeight: "140px" }}
        >
          {/* Left Chest Image */}
          <img
            src="/assets/images/lottery-page-1.png"
            alt="Chest Left"
            className="hidden md:block absolute left-4 md:left-10 bottom-2 md:bottom-5 w-24 md:w-[356px] z-0 "
            style={{ maxWidth: "40%" }}
          />
          {/* Right Chest Image */}
          <img
            src="/assets/images/lottery-page-2.png"
            alt="Chest Right"
            className="hidden md:block absolute right-4 md:right-10 bottom-2 md:bottom-5 w-24 md:w-[356px] z-0"
            style={{ maxWidth: "40%" }}
          />
          <div className="relative z-10 w-full flex flex-col items-center gap-1 md:gap-2">
            <img
              src="/assets/images/free-lottery-2.png"
              className="block md:hidden mb-4"
              alt=""
            />
            <span className="hidden md:block px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-[#0B101B] text-[#20E0B2] text-xs font-semibold border border-[#232A3E] mb-1 md:mb-2">
              Free Entry
            </span>
            <h1 className="text-xs px-10 md:px-0 md:text-xl font-heading2 leading-[30px] md:leading-normal text-white tracking-widest text-center">
              DAILY FREE{" "}
              <span className="text-[#20E0B2] font-heading2">
                REWARDS LOTTERY
              </span>
            </h1>
            <p className="text-[#fff] text-xs md:text-base mt-1 md:mt-2 text-center">
              Join the free lottery and win{" "}
              <span className="text-[#0ABA43]">$5 Every Day</span>
            </p>
            <div className="flex flex-row md:flex-row items-center gap-2 md:gap-4 mt-4 md:mt-2">
              <button
                className="px-6 md:px-8 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-base md:text-lg shadow-md"
                onClick={handleParticipate}
              >
                Participate
              </button>
              <span className="px-6 md:px-8 py-1.5 md:py-2 rounded-full bg-[#D20A1B] text-[#fff] font-bold text-base md:text-lg border border-[#232A3E] ml-0 md:ml-2">
                {timerString}
              </span>
            </div>
            <div className="flex justify-center flex-wrap gap-2 md:gap-3 mt-2 md:mt-4">
              <span className="px-5 md:px-4 py-2 md:py-1 rounded bg-[#181F2F] text-[#fff] text-xs font-semibold border border-[#232A3E]">
                10:00 AM Daily
              </span>
              <span className="px-5 md:px-4 py-2 md:py-1 rounded bg-[#242E1D] text-[#fff] text-xs font-semibold border border-[#232A3E]">
                Must Be On Lottery Page During Results
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Winners Table */}
      <div className="w-full max-w-8xl mx-auto mt-8 md:mt-12 px-2 md:px-4">
        <div className="bg-gradient-to-br from-[#010510] to-[#001016] border border-[#232A3E] rounded-2xl shadow-2xl p-4 md:p-8 overflow-x-auto">
          <h2 className="text-white text-xs md:text-xl font-heading mb-3 md:mb-6 tracking-widest">
            DAILY FREE LOTTERY WINNERS
          </h2>
          <table className="w-full text-left rounded-2xl text-xs md:text-base">
            <thead>
              <tr className="text-[#fff] bg-[#161D32] rounded-2xl text-xs md:text-sm">
                <th className="py-2 md:py-3 px-2 md:px-4 font-normal">
                  Lottery
                </th>
                <th className="py-2 md:py-3 px-2 md:px-4 font-normal">
                  Winners
                </th>
                <th className="py-2 md:py-3 px-2 md:px-4 font-normal">
                  Ticket Price
                </th>
                <th className="py-2 md:py-3 px-2 md:px-4 font-normal">Prize</th>
              </tr>
            </thead>
            <tbody>
              {winnerRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-[#232A3E] text-white text-xs md:text-base"
                  style={{ backgroundColor: `${row.backgroundColor}` }}
                >
                  <td className="py-2 md:py-3 px-2 md:px-4">Free Lottery</td>
                  <td className="py-2 md:py-3 px-2 md:px-4">{row.winner}</td>
                  <td className="py-2 md:py-3 px-2 md:px-4">{row.ticket}</td>
                  <td className="py-2 md:py-3 px-2 md:px-4 flex items-center gap-1 md:gap-2">
                    <img
                      src="/assets/images/coin-icon.png"
                      alt="coin"
                      className="w-4 md:w-5 h-4 md:h-5 inline-block"
                    />
                    {row.prize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Footer */}
      <div className="">
        <Footer />
      </div>
      {/* Modal for Participate Result */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#0e1b20] border border-[#82DDB5] rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-xl font-bold ${
                  modalSuccess === true ? "text-[#20E0B2]" : "text-red-400"
                } avalont`}
              >
                {modalSuccess === true ? "Success" : "Error"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="py-4">
              <p
                className={`text-base ${
                  modalSuccess === true ? "text-[#20E0B2]" : "text-red-400"
                } font-semibold`}
              >
                {modalMessage}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-base shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
