import React from "react";
import Header from "../../../components/Header";
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

const stats = [];

const payouts = [];

const TeamPromotionReport = () => (
  <div className="w-full  ">
    {/* <div className=" text-[10px]  font-header  tracking-widest">
      PROMOTION REPORT
    </div> */}

    {/* Banner */}
    {/* <div
      className="w-full rounded-2xl p-1.5 flex  mt-2 items-center justify-between "
      style={{
        background: "linear-gradient(91.86deg, #E8BFE6 0.29%, #A191CE 97.17%)",
      }}
    >
      <div>
        <div className=" md:text-[10px] font-header text-black mb-1">
          OVER $38,000,000
        </div>
        <div className="md:text-[8px] text-[10px] font-header text-black mb-1">
          IN EARNINGS PAID TO GINOX TRADERS
        </div>
        <div className="md:text-[7px] text-[9px]  font-body1 text-black ">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </div>
        <button
          className=" flex md:text-[8px] gap-1  text-[10px] py-1 px-2 items-center justify-center rounded-full text-white font-body1"
          style={{
            background:
              "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
          }}
        >
          Start Trading
          <img src="/assets/images/arrow-icon.png" className="md:h-3 md:w-3 h-4 w-4" alt="" />
        </button>
      </div>
      <img
        src="/assets/images/promotion-report.png"
        alt="Banner"
        className="w-20 h-20 object-contain  hidden md:flex "
      />
    </div> */}
    <div>
      <div className="flex flex-wrap gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex-1 min-w-[220px] bg-[#232b36] rounded-2xl px-3 py-3 flex items-center gap-4 shadow-lg border border-[#22304a]"
          >
            <img src={stat.icon} alt="icon" className="w-10 h-10" />
            <div>
              <div className="text-sm font-heading2 text-gradient">
                {stat.value}
              </div>
              <div className="text-base  mt-2 text-[#fff]  mb-1">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="text-base  sm:text-2xl font-header text-white mb-7">
        Latest Payouts
      </div> */}
      {/* Table */}
      <div className="w-full bg-[#151c26] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a] mt-2">
        <div className="flex font-body1 items-center justify-between text-left bg-black text-white text-[10px] p-2">
          <div>#</div>
          <div>Date</div>
          <div>Account Size</div>
          <div>Market</div>
          <div>Amount</div>
        </div>
        <div className="divide-y divide-[#222b3a] overflow-y-auto md:h-auto h-[130px]">
          {payouts.map((row, idx) => (
            <div
              key={idx}
              className="flex font-body1 items-center justify-between text-[10px] p-2 bg-[#232b36]"
            >
              <div>{idx + 1}</div>
              <div>{row.date}</div>
              <div>{row.size}</div>
              <div>{row.market}</div>
              <div>{row.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default TeamPromotionReport;
