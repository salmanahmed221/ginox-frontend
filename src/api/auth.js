import axiosInstance from "./axiosConfig";

export const register = async (data) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const login = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const fetchProfile = async (token) => {
  const response = await axiosInstance.get("/user/profile", {
    headers: { token },
  });
  return response.data;
};

export const getReceivedSuRequests = async (token) => {
  const response = await axiosInstance.get("/user/received-su-requests", {
    headers: { token },
  });
  return response.data;
};

export const approveSuRequest = async (token, requestData) => {
  const response = await axiosInstance.post(
    "/user/approve-su-request",
    requestData,
    {
      headers: { token },
    }
  );
  return response.data;
};

export const rejectSuRequest = async (token, requestData) => {
  const response = await axiosInstance.post(
    "/user/reject-su-request",
    requestData,
    {
      headers: { token },
    }
  );
  return response.data;
};

export const sendSuRequest = async (token, requestData) => {
  const response = await axiosInstance.post(
    "/user/send-su-request",
    requestData,
    {
      headers: { token },
    }
  );
  return response.data;
};

export const getSentSuRequests = async (token) => {
  const response = await axiosInstance.get("/user/sent-su-requests", {
    headers: { token },
  });
  return response.data;
};

export const fetchGenealogyTree = async (token) => {
  const response = await axiosInstance.get("/user/genealogy/direct", {
    headers: { token },
  });
  return response.data;
};

export const fetchDirectReferralList = async (token) => {
  const response = await axiosInstance.get("/user/referrals", {
    headers: { token },
  });
  return response.data;
};

export const fetchSponsorBonusReport = async (token) => {
  const response = await axiosInstance.get("/user/sponsor-bonus-report", {
    headers: { token },
  });
  return response.data;
};

export const checkActiveLicense = async (token) => {
  const response = await axiosInstance.get("/licenses/has-active-license", {
    headers: { token },
  });
  return response.data;
};

export const purchaseLicense = async (token, license) => {
  const response = await axiosInstance.post(
    "/licenses/purchase",
    { license },
    {
      headers: { token },
    }
  );
  return response.data;
};

export const getLotteryPageData = async (token) => {
  const response = await axiosInstance.get("/lottery/daily/page-data", {
    headers: { token },
  });
  return response.data;
};

export const getLotteryWinnerTickets = async (token) => {
  const response = await axiosInstance.get(
    "/lottery/winner-tickets?type=daily&status=pending&order=desc",
    {
      headers: { token },
    }
  );
  return response.data;
};

export const joinDailyLottery = async (token) => {
  const response = await axiosInstance.post(
    "/lottery/daily/join",
    {},
    {
      headers: { token },
    }
  );
  return response.data;
};

export const getCryptoBoxLotteryTickets = async () => {
  const response = await axiosInstance.get("/lottery/box/all-tickets", {
    headers: { apikey: import.meta.env.VITE_API_KEY },
  });
  return response.data;
};

export const purchaseCryptoBoxTickets = async (token, ticketNumbers) => {
  const response = await axiosInstance.post(
    "/lottery/box/purchase",
    { ticketNumbers },
    {
      headers: { token },
    }
  );
  return response.data;
};

export const joinCryptoBoxLottery = async (token, tickets) => {
  const response = await axiosInstance.post(
    "/lottery/box/join",
    { tickets },
    {
      headers: { token },
    }
  );
  return response.data;
};

export const getDashboardStats = async (token) => {
  const response = await axiosInstance.get("/user/dashboard-stats", {
    headers: { token },
  });
  return response.data;
};

export const getLotteryWinners = async () => {
  const response = await axiosInstance.get("/lottery/box/winners", {
    headers: {
      apikey: import.meta.env.VITE_API_KEY,
    },
  });
  return response.data;
};

export const getUserGroups = async (token, role = "") => {
  const response = await axiosInstance.get(`/user/groups?role=${role}`, {
    headers: { token },
  });
  return response.data;
};

export const getGroupDetails = async (token, groupId) => {
  const response = await axiosInstance.get(
    `/user/group-details?group=${groupId}`,
    {
      headers: { token },
    }
  );
  return response.data;
};

export const getTotalGroupsDetails = async (token) => {
  const response = await axiosInstance.get("/user/groups-details", {
    headers: { token },
  });
  return response.data;
};

export const getGroupLevelsDetails = async (token, groupId) => {
  const response = await axiosInstance.get(
    `/user/group-levels-details?group=${groupId}`,
    {
      headers: { token },
    }
  );
  return response.data;
};

export const getAllGroupsLevelsDetails = async (token) => {
  const response = await axiosInstance.get("/user/groups-levels-details", {
    headers: { token },
  });
  return response.data;
};
