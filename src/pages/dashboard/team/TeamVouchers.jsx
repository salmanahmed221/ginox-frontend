import React from "react";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

const vouchers = [];

const TeamVouchers = () => (
  <div className="w-full ">
    <div className="flex justify-between">
      <div className=" text-[10px] font-header flex items-center  tracking-widest">
        VOUCHERS
      </div>
      <Link
        to={"/create-voucher"}
        className="  ml-auto py-1 px-2 font-body1 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white text-[10px] shadow-md"
      >
        + Create Voucher
      </Link>
    </div>
    <div className="flex gap-8">
      {vouchers.map((voucher, idx) => (
        <div
          key={idx}
          className=" rounded-2xl pl-6 flex flex-col items-start shadow-lg border border-[#22304a] min-w-[340px] relative"
        >
          <div
            className="absolute left-0 top-0 h-full w-16 flex flex-col items-center justify-center z-10"
            style={{ background: 'url("/assets/images/Subtract.png")' }}
          >
            <span className="text-white font-body1 text-lg rotate-[-90deg] whitespace-nowrap">
              DISCOUNT
            </span>
          </div>
          <div className="pl-20 py-5 bg-white w-full">
            <div className="text-lg font-normal font-body1 text-black mb-2">
              {voucher.desc}
            </div>
            <img
              className="absolute top-5 right-4"
              src="/assets/images/voucher-logo.png"
              alt=""
            />
            <div className="text-base font-body1 text-black mb-2">{voucher.code}</div>
            <div className="text-sm font-body1 text-black ">{voucher.terms}</div>
            <div className="text-xs font-body1 text-gradient mt-2 cursor-pointer mb-5">
              *Terms & conditions
            </div>
            <button className="px-14 py-2 w-max rounded-full bg-[#000]   text-sm font-body1">
              {voucher.btn}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TeamVouchers;
