import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getUserGroups,
  getGroupDetails,
  getTotalGroupsDetails,
  getGroupLevelsDetails,
  getAllGroupsLevelsDetails,
} from "../../../api/auth";
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
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
const summaryCards = [
  {
    icon: "/assets/images/sale1.png",
    label: "Total Sale",
    value: "  ",
    valueClass: "text-[#20E0B2]",
  },
  // {
  //   icon: "/assets/images/sale2.png",
  //   label: "Active Groups",
  //   value: "0",
  //   valueClass: "text-[#20E0B2]",
  // },
  {
    icon: "/assets/images/sale3.png",
    label: "Total Participants",
    value: "0",
    valueClass: "text-[#20E0B2]",
  },
];

const tableData = [];

const statusClass = (status) =>
  status === "Active"
    ? "bg-[#0AC4884D] text-xs text-white py-2 px-4 py-1 rounded-full text-sm"
    : "bg-[#C40A0A4D] text-xs text-white py-2 px-4 py-1 rounded-full text-sm";

const TeamGroupSales = () => {
  const token = useSelector((state) => state.auth.token);
  const [groupsData, setGroupsData] = useState([]);
  const [groupsDetails, setGroupsDetails] = useState([]);
  const [totalGroupsData, setTotalGroupsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTotalSalesOnly, setShowTotalSalesOnly] = useState(false);
  const [totalSalesLoading, setTotalSalesLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [selectedGroupLoading, setSelectedGroupLoading] = useState(false);
  const [allGroupsData, setAllGroupsData] = useState(null);
  const [allGroupsLoading, setAllGroupsLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await getUserGroups(token);

        if (response && response.success && Array.isArray(response.data)) {
          setGroupsData(response.data);
        } else {
          setGroupsData([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to fetch groups");
        setGroupsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    const fetchAllGroupsDetails = async () => {
      if (!token || groupsData.length === 0) return;

      try {
        const groupDetailsPromises = groupsData.map((groupId) =>
          getGroupDetails(token, groupId)
        );

        const responses = await Promise.all(groupDetailsPromises);
        const validDetails = responses
          .filter((response) => response && response.success)
          .map((response) => response.data);

        setGroupsDetails(validDetails);
      } catch (err) {
        console.error("Error fetching groups details:", err);
      }
    };

    fetchAllGroupsDetails();
  }, [token, groupsData]);

  // Function to handle group selection and API call
  const handleGroupSelection = async (groupId, index) => {
    if (!token) return;

    try {
      // Clear total sales state when selecting a group
      setShowTotalSalesOnly(false);
      setTotalGroupsData(null);
      setShowDropdown(false);
      
      // Handle "All Groups" selection
      if (groupId === 'all') {
        setAllGroupsLoading(true);
        setSelectedGroupLoading(false);
        setSelectedGroupData(null);
        setSelectedGroup('All Groups');
        
        const response = await getAllGroupsLevelsDetails(token);
        if (response && response.success && response.data) {
          setAllGroupsData(response.data);
        }
        setAllGroupsLoading(false);
      } else {
        // Handle individual group selection
        setSelectedGroupLoading(true);
        setAllGroupsLoading(false);
        setAllGroupsData(null);
        setSelectedGroup(index + 1);
        
        const response = await getGroupLevelsDetails(token, groupId);
        if (response && response.success && response.data) {
          setSelectedGroupData(response.data);
        }
        setSelectedGroupLoading(false);
      }
    } catch (err) {
      console.error("Error fetching group details:", err);
      setSelectedGroupData(null);
      setAllGroupsData(null);
      setSelectedGroupLoading(false);
      setAllGroupsLoading(false);
    }
  };

  const handleGroupClick = async () => {
    if (!token) return;

    // If already showing total sales, just toggle back to groups
    if (showTotalSalesOnly) {
      setShowTotalSalesOnly(false);
      // Clear selected group data when going back to groups view
      setSelectedGroupData(null);
      setSelectedGroup(null);
      setAllGroupsData(null);
      return;
    }

    try {
      setTotalSalesLoading(true);
      // Clear selected group data and all groups data when showing total sales
      setSelectedGroupData(null);
      setSelectedGroup(null);
      setAllGroupsData(null);
      const response = await getTotalGroupsDetails(token);
      if (response && response.success && response.data) {
        setTotalGroupsData(response.data);
        setShowTotalSalesOnly(true);
      }
    } catch (err) {
      console.error("Error fetching total groups details:", err);
    } finally {
      setTotalSalesLoading(false);
    }
  };

  const renderGroups = () => {
    if (loading) {
      return (
        <div className="flex flex-col text-center text-text_secondary text-[10px] p-2 gap-1">
          <div className="truncate">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col text-center text-text_secondary text-[10px] p-2 gap-1">
          <div className="truncate text-red-400">Error loading groups</div>
        </div>
      );
    }

    if (groupsDetails.length === 0) {
      return (
        <div className="flex flex-col text-center text-text_secondary text-[10px] p-2 gap-1">
          <div className="truncate">Loading...</div>
        </div>
      );
    }

    // Priority 1: Show loading when fetching selected group data
    if (selectedGroupLoading) {
      return (
        <div className="overflow-x-auto flex mx-auto">
          <div className="flex flex-col text-center text-text_secondary text-[7px] p-2 gap-3.5">
            <div className="truncate text-white font-semibold">
              LOADING...
            </div>
          </div>
        </div>
      );
    }

    // Priority 1.5: Show loading when fetching all groups data
    if (allGroupsLoading) {
      return (
        <div className="overflow-x-auto flex mx-auto">
          <div className="flex flex-col text-center text-text_secondary text-[7px] p-2 gap-3.5">
            <div className="truncate text-white font-semibold">
              LOADING...
            </div>
          </div>
        </div>
      );
    }

    // Priority 2: Show loading when fetching total sales data
    if (totalSalesLoading) {
      return (
        <div className="overflow-x-auto flex mx-auto">
          <div className="flex flex-col text-center text-text_secondary text-[7px] p-2 gap-3.5">
            <div className="truncate text-white font-semibold">
              LOADING...
            </div>
          </div>
        </div>
      );
    }

    // Priority 3: Show selected group data if available
    if (selectedGroupData && selectedGroup && selectedGroup !== 'All Groups') {
      return (
        <div className="overflow-x-auto flex mx-auto">
          <div className="flex flex-col text-center text-text_secondary text-[9px] p-2 gap-3.5">
            <div className="truncate text-white font-semibold">
              GROUP {selectedGroup}
            </div>
            <div className="truncate text-[#20E0B2]">
              {selectedGroupData.totalSale?.toFixed(2) || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {selectedGroupData.totalUsers || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {selectedGroupData.nuUsers || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {selectedGroupData.suUsers || 0}
            </div>
          </div>
        </div>
      );
    }

    // Priority 3.5: Show all groups data if available
    if (allGroupsData && selectedGroup === 'All Groups') {
      return (
        <div className="overflow-x-auto flex mx-auto">
          <div className="flex flex-col text-center text-text_secondary text-[9px] p-2 gap-3.5">
            <div className="truncate text-white font-semibold">
              ALL GROUPS DETAILS
            </div>
            <div className="truncate text-[#20E0B2]">
              {allGroupsData.totalSale?.toFixed(2) || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {allGroupsData.totalUsers || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {allGroupsData.nuUsers || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {allGroupsData.suUsers || 0}
            </div>
          </div>
        </div>
      );
    }

    // Priority 4: Show total sales data if showTotalSalesOnly is true
    if (showTotalSalesOnly && totalGroupsData) {
      return (
        <div className="overflow-x-auto flex mx-auto">
          <div className="flex flex-col text-center text-text_secondary text-[9px] p-2 gap-3.5">
            <div className="truncate text-white font-semibold">
              TOTAL SALES
            </div>
            <div className="truncate text-[#20E0B2]">
              {totalGroupsData.totalSale.toFixed(2) || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {totalGroupsData.totalUsers || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {totalGroupsData.nuUsers || 0}
            </div>
            <div className="truncate text-[#20E0B2]">
              {totalGroupsData.suUsers || 0}
            </div>
          </div>
        </div>
      );
    }
    // Otherwise, show individual groups
    return groupsDetails.map((groupDetail, index) => (
      <div className="overflow-x-auto flex mx-auto" key={index}>
        <div className="flex flex-col text-center text-text_secondary text-[9px] p-2 gap-3.5">
          <div className="truncate text-white font-semibold">
            GROUP {index + 1}
          </div>
          <div className="truncate text-[#20E0B2]">
            {groupDetail.totalSale.toFixed(2) || 0}
          </div>
          <div className="truncate text-[#20E0B2]">
            {groupDetail.totalUsers || 0}
          </div>
          <div className="truncate text-[#20E0B2]">
            {groupDetail.nuUsers || 0}
          </div>
          <div className="truncate text-[#20E0B2]">
            {groupDetail.suUsers || 0}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full h-full ">
      <div className="flex justify-between  ">
        {/* Summary Cards */}

        <div className="   flex flex-col gap-1   items-center    ">
          {/* <img src={card.icon} alt="icon" className="w-4 h-4 sm:mb-1" /> */}
          <div className="flex-1 flex items-center  border border-gray-700 p-1  ">
            <div className="relative w-full dropdown-container">
              <div 
                className="text-[8px] text-white text-center cursor-pointer flex items-center justify-center gap-1"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {selectedGroup ? (selectedGroup === 'All Groups' ? 'All Groups' : `Group ${selectedGroup}`) : "Level"}
                <svg 
                  className={`w-2 h-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 w-16 overflow-y-auto">
                  {loading ? (
                    <div className=" text-[8px] text-gray-400 text-center">Loading...</div>
                  ) : groupsData.length > 0 ? (
                    <>
                      <div
                        className="p-1 text-[8px] text-white hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleGroupSelection('all', 'all')}
                      >
                        All Groups
                      </div>
                      {groupsData.map((groupId, index) => (
                        <div
                          key={groupId}
                          className="p-1 text-[8px] text-white hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleGroupSelection(groupId, index)}
                        >
                          Group {index + 1}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="px-2 py-1 text-[8px] text-gray-400 text-center">No groups found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" text-[8px]  font-header  tracking-widest flex items-center">
          GROUP Info
        </div>
        <div className="   flex flex-col gap-1 border border-gray-700 p-1   items-center  ">
          {/* <img src={card.icon} alt="icon" className="w-4 h-4 sm:" /> */}
          <div className="flex-1 flex items-center  ">
            <div>
              <div
                className="text-[8px] text-white  text-center cursor-pointer"
                onClick={handleGroupClick}
              >
                Total Sale
              </div>
              {/* <div
              className={`text-[8px] font-heading2 text-center text-gradient`}
            >
              $0
            </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="w-full relative  h-40  flex bg-[#151c26] rounded-2xl overflow-hidden shadow-lg border border-[#222b3a] mt-3 ">
        <div className="flex flex-col   border-r-[1px] border-white/30  text-start bg-black text-text_secondary text-[10px] p-2 gap-3">
          <div className="truncate"></div>

          <div className="truncate">Total Sales</div>
          <div className="truncate">Total Users</div>
          <div className="truncate">Total NU</div>
          <div className="truncate">Total Su</div>
        </div>
        {renderGroups()}

        <div className="absolute  gap-2 flex right-3 bottom-1">
          <IoIosArrowDropleft />
          <IoIosArrowDropright />
        </div>
      </div>
    </div>
  );
};

export default TeamGroupSales;
