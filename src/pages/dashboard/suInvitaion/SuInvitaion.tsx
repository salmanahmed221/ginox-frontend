import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import { CopyIcon, X } from "lucide-react";
import { useSelector } from "react-redux";
import {
  sendSuRequest,
  getReceivedSuRequests,
  getSentSuRequests,
} from "../../../api/auth";
import { SparklesCore } from "../../../components/ui/sparkles";

const SuInvitation = () => {
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);
  const [username, setUsername] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<any[]>([]);
  const [referralLink, setReferralLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const fetchReceived = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getReceivedSuRequests(token);
      if (res.success && Array.isArray(res.data)) {
        setReceivedRequests(res.data);
      } else {
        setReceivedRequests([]);
      }
    } catch {
      setReceivedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSent = async () => {
    if (!token) return;
    try {
      const res = await getSentSuRequests(token);
      if (res.success && Array.isArray(res.data)) {
        setSentRequests(res.data);
        setPendingRequests(res.data.filter((req: any) => req.status === "pending"));
        setApprovedRequests(res.data.filter((req: any) => req.status === "approved"));
      } else {
        setSentRequests([]);
        setPendingRequests([]);
        setApprovedRequests([]);
      }
    } catch {
      setSentRequests([]);
    }
  };

  useEffect(() => {
    fetchReceived();
    fetchSent();
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (user?.username) {
      const baseUrl = "https://ginox.io";
      const generatedLink = `${baseUrl}/register?ref=${user.username}`;
      setReferralLink(generatedLink);
    }
  }, [user]);

  const handleSend = async () => {
    if (!username.trim() || !token) return;
    setModalMessage("");
    setModalOpen(false);
    try {
      const res = await sendSuRequest(token, { username: username.trim() });
      setModalMessage(res.message || "Request sent.");
      setModalOpen(true);
      if (res.success) {
        setUsername("");
        fetchReceived();
        fetchSent();
      }
    } catch (err: any) {
      setModalMessage(err.response?.data?.message || "Failed to send request.");
      setModalOpen(true);
    }
  };

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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
          <div className=" h-[80vh]  px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header title="AFFILIATES" />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />

            {/* <div className="h-px w-full bg-[#FFFFFF1A] mt-6" /> */}

            <div className="flex flex-col w-full overflow-y-auto p-10">
              <div className="flex items-center w-full space-x-6">
                <p className="text-xl sm:text-2xl font-header">
                  Send Invitations
                </p>
                <div
                  className="rounded-md"
                  style={{
                    background:
                      " linear-gradient(140.4deg, rgba(51, 160, 234, 0.1) 9.17%, rgba(10, 196, 136, 0.1) 83.83%)",
                  }}
                >
                  <p className="flex items-center px-5 py-1.5 font-bold  text-gradient font-body1">
                    3/3
                  </p>
                </div>
              </div>
              <div className="h- w-full bg-[#FFFFFF1A] mt-6" />

              <div className="flex flex-col w-full border-t border-[#FFFFFF1A]  ">
                <div className="bg-[#FFFFFF08] border-[#FFFFFF0D] border rounded-2xl w-full mt-6 p-6 ">
                  <div className="flex flex-col w-full">
                    <p className="text-[10px] sm:text-lg font-body1">
                      Enter User ID
                    </p>
                    <div
                      className="w-full p-px rounded-xl flex items-center justify-between my-4"
                      style={{
                        background:
                          "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
                      }}
                    >
                      <div className="flex items-center justify-between w-full bg-black rounded-xl px-2">
                        <input
                          type="text"
                          placeholder=""
                          className="bg-black w-full py-3 rounded-xl ml-3 font-body1"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <button
                          style={{
                            background:
                              "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
                          }}
                          className=" w-[30%]  py-3 rounded-xl text-xs font-body1 text-white"
                          onClick={handleSend}
                        >
                          Send Request
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-[10px] sm:text-lg font-body1 mb-2">
                      Received SU Requests
                    </p>
                    {loading ? (
                      <div className="text-xs text-gray-400 font-body1">
                        Loading...
                      </div>
                    ) : receivedRequests.length === 0 ? (
                      <div className="text-xs text-gray-400 font-body1">
                        No received requests.
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {receivedRequests.map((req) => (
                          <li
                            key={req._id}
                            className="bg-[#222] rounded p-2 text-white text-xs flex justify-between items-center font-body1"
                          >
                            <span>
                              Sponsor: {req.sponsor} | Referral: {req.referral}{" "}
                              | Status: {req.status}
                            </span>
                            <span className="text-gray-400 text-[10px] font-body1">
                              {new Date(req.createdAt).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center w-full mt-4">
                  <div className="w-full h-px bg-[#FFFFFF1A]" />

                  <p className="text-xs sm:text-2xl  font-header text-white px-4">
                    OR
                  </p>

                  <div className="w-full h-px bg-[#FFFFFF1A]" />
                </div>

                {/* <div className="flex flex-col w-full mt-4">
                  <p className="text-[10px]  sm:text-lg font-body1">Referral ID</p>

                  <div
                    className="w-full p-px rounded-xl flex items-center justify-between mt-4"
                    style={{
                      background:
                        "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
                    }}
                  >
                    <div className="flex items-center justify-between w-full bg-black rounded-xl px-2">
                      <input
                        type="text"
                        placeholder="jDHO_15655456548"
                        className="bg-black w-full py-3 rounded-xl ml-3 font-body1"
                      />

                      <button className=" mr-3 py-3 rounded-xl text-xs font-body1 text-white">
                        <svg
                          width="20"
                          height="24"
                          viewBox="0 0 20 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.8747 21.5768C15.6338 22.1067 15.2454 22.5559 14.7559 22.8709C14.2665 23.1859 13.6967 23.3534 13.1147 23.3532H3.81189C3.41392 23.3533 3.01984 23.2749 2.65215 23.1227C2.28446 22.9704 1.95037 22.7472 1.66896 22.4658C1.38755 22.1844 1.16434 21.8503 1.01206 21.4826C0.85979 21.1149 0.781442 20.7208 0.781495 20.3228V6.75164C0.781159 6.16955 0.948517 5.5997 1.26355 5.11023C1.57858 4.62077 2.02795 4.23242 2.55789 3.99164V19.1608C2.55779 19.4782 2.6202 19.7924 2.74157 20.0856C2.86294 20.3789 3.04088 20.6453 3.26524 20.8697C3.4896 21.0942 3.75597 21.2722 4.04915 21.3937C4.34232 21.5151 4.65655 21.5776 4.97389 21.5776L15.8747 21.5768ZM11.6799 6.58804V0.648438H6.88429C6.48619 0.648437 6.09198 0.72689 5.72421 0.879312C5.35644 1.03173 5.0223 1.25514 4.74091 1.53675C4.45952 1.81837 4.23638 2.15268 4.08425 2.52057C3.93212 2.88846 3.85398 3.28273 3.85429 3.68084V18.1888C3.85461 18.7438 4.07529 19.2759 4.4678 19.6682C4.86032 20.0605 5.39255 20.2808 5.94749 20.2808H16.1875C16.5855 20.2808 16.9795 20.2025 17.3472 20.0502C17.7148 19.8979 18.0489 19.6747 18.3303 19.3933C18.6117 19.1119 18.8349 18.7778 18.9872 18.4101C19.1395 18.0425 19.2179 17.6484 19.2179 17.2504V8.41604H13.5063C13.0218 8.41561 12.5572 8.22283 12.2147 7.88006C11.8723 7.53729 11.6799 7.07258 11.6799 6.58804ZM12.7291 0.648438L19.2183 7.39164H13.6691C13.4198 7.39164 13.1807 7.2926 13.0044 7.11632C12.8281 6.94003 12.7291 6.70094 12.7291 6.45164V0.648438Z"
                            fill="#82DDB5"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div> */}

                <div className="flex flex-col w-full mt-8">
                  <p className="text-[10px]  sm:text-lg font-body1">
                    Referral Link
                  </p>

                  <div
                    className="w-full p-px rounded-xl flex items-center justify-between mt-4"
                    style={{
                      background:
                        "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
                    }}
                  >
                    <div className="flex items-center justify-between w-full bg-black rounded-xl px-2">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        placeholder="Generating referral link..."
                        className="bg-black w-full py-3 rounded-xl ml-3 font-body1 text-gray-300"
                      />

                      <button
                        onClick={handleCopyReferralLink}
                        className="mr-3 py-3 rounded-xl text-xs font-body text-white hover:opacity-80 transition-opacity"
                        disabled={!referralLink}
                      >
                        {copySuccess ? (
                          <div className="flex items-center gap-1">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20 6L9 17L4 12"
                                stroke="#0AC488"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-[#0AC488] text-xs">
                              Copied!
                            </span>
                          </div>
                        ) : (
                          <CopyIcon size={16} className="text-[#82DDB5]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {referralLink && (
                    <p className="text-xs text-gray-400 mt-2 font-body1">
                      Share this link to invite others. When they register using
                      this link, you'll automatically become their sponsor.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-[#FFFFFF08] border-[#FFFFFF0D] border rounded-2xl w-full mt-6 p-6 ">
                <p className="text-md sm:text-2xl font-header flex items-center gap-4">
                  Approved su Requests
                  <span
                    style={{
                      background:
                        "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
                    }}
                    className="text-[10px] sm:text-lg font-body1 text-white px-2 py-1.5 rounded-full"
                  >
                    {approvedRequests.length}
                  </span>
                </p>
                {approvedRequests.length === 0 ? (
                  <div className="text-xs text-gray-400 mt-4 font-body1">
                    No approved requests.
                  </div>
                ) : (
                  approvedRequests.map((req) => (
                    <div
                      key={req._id}
                      className="bg-[#FFFFFF08] w-full md:flex space-y-3 md:space-y-0 justify-between items-center mt-4 p-4 rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src="./UIimage.svg"
                          alt="/"
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex flex-col space-y-2">
                          <p className="text-[10px] sm:text-lg font-body1">
                            {req.referral}
                          </p>
                          <p className="text-sm font-body1">
                            Sent on{" "}
                            {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          className="rounded-full flex items-center px-6 py-2 space-x-2"
                          style={{
                            background:
                              "linear-gradient(140.4deg, rgba(51, 160, 234, 0.1) 9.17%, rgba(10, 196, 136, 0.1) 83.83%)",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 13L9 17L19 7"
                              stroke="#0AC488"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="text-sm font-body1 text-gradient">
                            {req.status}{" "}
                          </p>
                        </div>
                        {/* <div className="bg-[#82DDB5]/10 h-6 w-6 rounded-full flex items-center justify-center">
                          <X size={14} />
                        </div> */}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {pendingRequests.length > 0 && (
                <div className="bg-[#FFFFFF08] border-[#FFFFFF0D] border rounded-2xl w-full mt-6 p-6 ">
                  <p className="text-md sm:text-2xl font-header flex items-center gap-4">
                    Pending su Requests
                    <span
                      style={{
                        background:
                          "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
                      }}
                      className="text-[10px] sm:text-lg font-body1 text-white px-2 py-1.5 rounded-full"
                    >
                      {pendingRequests.length}
                    </span>
                  </p>
                  {pendingRequests.length === 0 ? (
                    <div className="text-xs text-gray-400 mt-4 font-body1">
                      No pending requests.
                    </div>
                  ) : (
                    pendingRequests.map((req) => (
                      <div
                        key={req._id}
                        className="bg-[#FFFFFF08] w-full md:flex space-y-3 md:space-y-0 justify-between items-center mt-4 p-4 rounded-xl"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src="./UIimage.svg"
                            alt="/"
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex flex-col space-y-2">
                            <p className="text-[10px] sm:text-lg font-body1">
                              {req.referral}
                            </p>
                            <p className="text-sm font-body1">
                              Sent on{" "}
                              {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className="rounded-full flex items-center px-6 py-2 space-x-2"
                            style={{
                              background:
                                "linear-gradient(140.4deg, rgba(51, 160, 234, 0.1) 9.17%, rgba(10, 196, 136, 0.1) 83.83%)",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_5622_14441)">
                                <path
                                  d="M9.49445 8.23642L7.54246 6.77244V3.79027C7.54246 3.49042 7.30009 3.24805 7.00023 3.24805C6.70038 3.24805 6.45801 3.49042 6.45801 3.79027V7.04358C6.45801 7.21437 6.53826 7.37542 6.6749 7.47736L8.84375 9.10401C8.93735 9.1745 9.05137 9.21257 9.16854 9.21246C9.33391 9.21246 9.49658 9.13816 9.60287 8.99502C9.78293 8.75587 9.73412 8.41591 9.49445 8.23642Z"
                                  fill="url(#paint0_linear_5622_14441)"
                                />
                                <path
                                  d="M7 0C3.13996 0 0 3.13996 0 7C0 10.86 3.13996 14 7 14C10.86 14 14 10.86 14 7C14 3.13996 10.86 0 7 0ZM7 12.9156C3.73857 12.9156 1.08443 10.2614 1.08443 7C1.08443 3.73857 3.73857 1.08443 7 1.08443C10.262 1.08443 12.9156 3.73857 12.9156 7C12.9156 10.2614 10.2614 12.9156 7 12.9156Z"
                                  fill="url(#paint1_linear_5622_14441)"
                                />
                              </g>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_5622_14441"
                                  x1="6.88097"
                                  y1="3.60591"
                                  x2="10.6205"
                                  y2="6.07205"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#33A0EA" />
                                  <stop offset="1" stopColor="#0AC488" />
                                </linearGradient>
                                <linearGradient
                                  id="paint1_linear_5622_14441"
                                  x1="1.82"
                                  y1="0.84"
                                  x2="11.2"
                                  y2="12.18"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#33A0EA" />
                                  <stop offset="1" stopColor="#0AC488" />
                                </linearGradient>
                                <clipPath id="clip0_5622_14441">
                                  <rect width="14" height="14" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            <p className="text-sm font-body1 text-gradient">
                              {req.status}{" "}
                            </p>
                          </div>
                          {/* <div className="bg-[#82DDB5]/10 h-6 w-6 rounded-full flex items-center justify-center">
                            <X size={14} />
                          </div> */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {/* Modal for response message */}
            {modalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-[#0e1b20] border border-[#82DDB5] rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-bold text-[#20E0B2] avalont`}>
                      SU Request
                    </h2>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="text-gray-400 hover:text-white text-2xl font-body1"
                    >
                      ×
                    </button>
                  </div>
                  <div className="py-4">
                    <p
                      className={`text-base text-[#20E0B2] font-semibold font-body1`}
                    >
                      {modalMessage}
                    </p>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="mt-4 px-6 py-2 font-body1 rounded-full bg-gradient-to-r from-[#33A0EA] to-[#0AC488] text-white font-semibold text-base shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default SuInvitation;
