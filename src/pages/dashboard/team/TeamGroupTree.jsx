import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGenealogyTree } from "../../../api/auth";
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

const TreeNode = ({ node }) => (
  <div className="flex flex-col items-center">
    <div className="bg-gradient-to-r font-body1 from-btn_gradient_start_tab to-btn_gradient_end_tab text-white px-2 py-2 rounded-lg mb-2 text-[10px]">
      {node.name}
    </div>
    <img
      src="/assets/images/dummy.png"
      alt={node.name}
      className="w-8 h-8 rounded-full border-2 border-btn_gradient_end"
    />
    {node.subordinates && node.subordinates.length > 0 && (
      <div
        className={`flex gap-4 mt-6 ${
          node.subordinates.length > 4 ? "flex-wrap justify-center" : ""
        }`}
      >
        {node.subordinates.map((sub, idx) => (
          <TreeNode key={sub.name + idx} node={sub} />
        ))}
      </div>
    )}
  </div>
);

const TeamGroupTree = () => {
  const token = useSelector((state) => state.auth.token);
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchGenealogyTree(token);
        setTreeData(res.data);
      } catch (err) {
        setError("Failed to load genealogy tree");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  return (
    <div className="w-full ">
      <div className="flex  md:flex-row flex-col  justify-between">
        <div className=" flex items-center  text-[10px]   ont-header tracking-widest">
          REFERRALS GENEALOGY
        </div>
        <div className=" flex  items-end md:mt-0 mt-3">
          <button className="w-fit px-4 font-body1 py-1  rounded-full bg-gradient-to-r from-btn_gradient_start_tab to-btn_gradient_end_tab border border-[#FFFFFF33] text-white  text-[8px] shadow-md">
            Group 1
          </button>
          <button className="w-fit px-4 py-1 font-body1 rounded-full bg-black text-white  text-[8px] border border-[#222b3a]">
            Group 2
          </button>
        </div>
      </div>
      <div>
         <div className=" mt-4">
                {/* Group Switcher */}
                <div className="flex gap-4">
                  <div className="ml-auto flex gap-2">
                    <button className="p-0.5  rounded-lg bg-[#FFFFFF33] text-white text-2xl flex items-center justify-center">
                      <img src="/assets/images/minus.png" alt="" />
                    </button>
                    <button className="p-0.5 rounded-lg bg-[#FFFFFF33] text-white text-2xl flex items-center justify-center">
                      <img src="/assets/images/plus.png" />
                    </button>
                  </div>
                </div>
                {/* Dynamic Tree */}
                <div className="flex flex-col items-center  overflow-x-auto mt-5 ">
                  {loading && (
                    <div className="text-white font-body1">Loading...</div>
                  )}
                  {error && (
                    <div className="text-red-500 font-body1">{error}</div>
                  )}
                  {treeData && <TreeNode node={treeData} />}
                </div>
              </div>
      </div>
    </div>
  );
};

export default TeamGroupTree;
