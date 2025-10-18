import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDirectReferralList } from "../../../api/auth";
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

const TeamDirectReferralList = () => {
  const token = useSelector((state) => state.auth.token);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchDirectReferralList(token);
        setTableData(res.data || []);
      } catch (err) {
        setError("Failed to load referral list");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  return (
    <div className="w-full ">
      <div className="flex  flex-col gap-3 justify-between">
        {/* <div className=" text-[10px] font-header  tracking-widest">
          DIRECT REFERRAL LIST
        </div> */}
        <div className=" flex items-center relative rounded-lg mt-2 bg-black border w-fit border-[#222b3a]">
          <img
            src="/assets/images/search-icon.png"
            className="w-4 h-4  ml-2   z-20"
          />
          <input
            className="  pl-2   py-0.5   placeholder:text-[10px]    rounded-lg  bg-black text-white font-body1 outline-none  placeholder-text_secondary"
            placeholder="Search wallet / ref. link..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-[#151c26] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a] mt-2">
        <div className="flex font-body1 items-center justify-between text-left bg-black text-white text-[10px] p-2">
          <div>Name</div>
          <div>Surname</div>
          <div>Role</div>
          <div>Username</div>
        </div>
        <div className="divide-y divide-[#222b3a]  overflow-y-auto md:h-auto h-[130px]">
          {loading && (
            <div className="text-white text-center  font-body1 text-[10px]">
              Loading...
            </div>
          )}
          {error && <div className="text-red-500  font-body1">{error}</div>}
          {!loading && !error && tableData.length === 0 && (
            <div className="text-white text-center text-[10px] font-body1">
              No referrals found.
            </div>
          )}
          {tableData.map((row, idx) => (
            <div
              key={row._id || idx}
              className="flex font-body1 items-center justify-between  text-[10px] p-2  bg-[#232b36]"
            >
              <div>{row.name}</div>
              <div>{row.surname}</div>
              <div>{row.role}</div>
              <div>{row.username}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDirectReferralList;
