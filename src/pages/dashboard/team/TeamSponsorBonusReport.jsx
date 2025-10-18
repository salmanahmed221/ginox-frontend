import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchSponsorBonusReport } from "../../../api/auth";
import Header from "../../../components/Header";

const TeamSponsorBonusReport = () => {
  const token = useSelector((state) => state.auth.token);
  const [levels, setLevels] = useState([1, 2, 3, 4, 5, 6]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchSponsorBonusReport(token);
        setReportData(res.data || []);
        // If API returns levels, update levels array
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLevels(res.data.map((l) => l.level));
        }
      } catch (err) {
        setError("Failed to load sponsor bonus report");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const getLevelData = (level) =>
    reportData.find((l) => l.level === level) || {};

  return (
    <div className="w-full">
      <div className=" text-[10px]  mb-2.5  font-header  tracking-widest">
        SPONSOR BONUS REPORT
      </div>
      <div className="flex justify-center w-full rounded-lg">
        <table className="border-collapse   w-full border border-[#22304a] ">
          {/* Table Header */}
          <thead>
            <tr>
              <th className="border border-[#22304a] text-[8px] text-white font-body1  bg-[#1a2332]">
                
              </th>
              {levels.map((level) => (
                <th
                  key={level}
                  className="border border-[#22304a] text-[9px] text-white font-body1 bg-[#1a2332]"
                >
                  Level {level}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {/* Members Row */}
            <tr>
              <td className="border border-[#22304a] px-2 py-[5px] text-[10px] text-text_secondary font-body1 bg-[#0f1419]">
                Members
              </td>
              {levels.map((level) => {
                const data = getLevelData(level);
                return (
                  <td
                    key={level}
                    className="border border-[#22304a] px-2 py-[5px] text-[10px] text-white font-body1 text-center"
                  >
                    {data.members !== undefined ? data.members : "0"}
                  </td>
                );
              })}
            </tr>
            
            {/* Total Sale Row */}
            <tr>
              <td className="border border-[#22304a] px-2 py-[5px] text-[10px] text-text_secondary font-body1 bg-[#0f1419]">
                Total Sale
              </td>
              {levels.map((level) => {
                const data = getLevelData(level);
                return (
                  <td
                    key={level}
                    className="border border-[#22304a] px-2 py-[5px] text-[10px] text-white font-body1 text-center"
                  >
                    {data.sale !== undefined
                      ? Number(data.sale).toFixed(2)
                      : "0.00"}
                  </td>
                );
              })}
            </tr>
            
            {/* Total Income Row */}
            <tr>
              <td className="border border-[#22304a] px-2 py-[5px] text-[10px] text-text_secondary font-body1 bg-[#0f1419]">
                Total Income
              </td>
              {levels.map((level) => {
                const data = getLevelData(level);
                return (
                  <td
                    key={level}
                    className="border border-[#22304a] px-2 py-[5px] text-[10px] text-white font-body1 text-center"
                  >
                    {data.income !== undefined ? data.income : "0"}
                  </td>
                );
              })}
            </tr>
            
            {/* Total SU Row */}
            <tr>
              <td className="border border-[#22304a] px-2 py-[5px] text-[10px] text-text_secondary font-body1 bg-[#0f1419]">
                Total SU
              </td>
              {levels.map((level) => {
                const data = getLevelData(level);
                return (
                  <td
                    key={level}
                    className="border border-[#22304a] px-2 py-[5px] text-[10px] text-white font-body1 text-center"
                  >
                    {data.su !== undefined ? data.su : "0"}
                  </td>
                );
              })}
            </tr>
            
            {/* Total NV Row */}
            <tr>
              <td className="border border-[#22304a] px-2 py-[5px] text-[10px] text-text_secondary font-body1 bg-[#0f1419]">
                Total NV
              </td>
              {levels.map((level) => {
                const data = getLevelData(level);
                return (
                  <td
                    key={level}
                    className="border border-[#22304a] px-2 py-[5px] text-[10px] text-white font-body1 text-center"
                  >
                    {data.nv !== undefined ? data.nv : "0"}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamSponsorBonusReport;
