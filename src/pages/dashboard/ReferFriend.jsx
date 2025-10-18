import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { SparklesCore } from "../../components/ui/sparkles";

const socialIcons = [
  { src: "/assets/images/wp.png", alt: "WhatsApp" },
  { src: "/assets/images/fb.png", alt: "Facebook" },
  { src: "/assets/images/tel.png", alt: "Telegram" },
  { src: "/assets/images/x.png", alt: "X" },
  { src: "/assets/images/discord.png", alt: "Discord" },
  { src: "/assets/images/link.png", alt: "Link" },
];

const ReferFriend = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Get user data from Redux store
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || "nu"; 

  const handleSuInvitationClick = () => {
    navigate("/su-invitation");
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
          <div className="h-[90vh] md:h-[80vh]  px-4 pt-10 pb-5 w-full flex flex-col items-center bg-[#06101A] border border-[#FFFFFF1A]  rounded-3xl text-text_primary relative">
            <Header title="REFER A FRIEND" />
            <div
              style={{
                background:
                  "linear-gradient(140.4deg, rgba(51, 160, 234, 0.7) 9.17%, rgba(10, 196, 136, 0.7) 83.83%)",
              }}
              className="w-full h-px  my-2"
            />

            {/* Illustration */}
            <img
              src="/assets/images/Hands_Share_Referral 2 1.png"
              alt="Refer Illustration"
              className="w-72 h-72 object-contain mb-8"
            />
            <div className=" text-base sm:text-3xl font-header tracking-widest text-center mb-4">
              REFER A FRIEND
            </div>
            <div className="text-[#FFFFFF99] text-center max-w-2xl mb-8  text-sm   md:text-base font-body1">
              Invite your friends to join Ginox and earn rewards together! Share
              your referral link and help others discover our amazing crypto
              platform while building your network.
            </div>

            {/* Conditional Button Rendering based on User Role */}
            {userRole === "SU" ? (
              // Show SU user button for Super Users
              <button
                className="w-60 sm:w-80 py-2 font-body1 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white  text-sm md:text-lg shadow-md flex items-center justify-center gap-2"
                onClick={handleSuInvitationClick}
              >
                <img src="/assets/images/telegram.png" alt="" />
                Refer a Friend SU user
              </button>
            ) : (
              // Show normal button for Normal Users
              <button
                className="w-60  py-2 font-body1 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white  ext-sm md:text-lg flex items-center justify-center gap-2"
                onClick={() => setShowModal(true)}
              >
                <img src="/assets/images/telegram.png" alt="" />
                Refer a Friend
              </button>
            )}
          </div>
          {/* Modal Overlay */}
          {/* {showModal && (
        <>
          <div className="fixed inset-0 rounded-3xl z-40" style={{ background: ' linear-gradient(110.8deg, #010510 -4.16%, #001016 49.91%, #010510 98.83%)' }} onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#232b36] rounded-2xl p-10 w-full max-w-lg relative flex flex-col items-center">
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white flex items-center justify-center text-2xl"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <img src="/assets/images/logo-text.png" alt="Ginox Logo" className="h-12 mb-6" />
              <div className="w-full mb-4">
                <div className="flex justify-between items-center bg-black rounded-lg px-4 py-2 mb-4">
                  <div className="text-xs text-text_secondary">Referral ID</div>
                  <span className="flex-1 truncate text-xs text-end text-gradient font-body">DHQ_15655456548</span>
                  <img src="/assets/images/copy-icon.png" alt="Copy" className="w-5 h-5 ml-2 cursor-pointer" />
                </div>
                <div className="flex justify-between items-center bg-black rounded-lg px-4 py-2 mb-4">
                  <div className="text-xs text-text_secondary">Referral Link</div>
                  <span className="flex-1 truncate text-xs text-end text-gradient font-body">DHQ_15655456548</span>
                  <img src="/assets/images/copy-icon.png" alt="Copy" className="w-5 h-5 ml-2 cursor-pointer" />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                {socialIcons.map((icon, idx) => (
                  <button key={idx} className="w-[58px] h-[58px] rounded-lg bg-[#232b36] flex items-center justify-center">
                    <img src={icon.src} alt={icon.alt} className="w-[58px] h-[58px]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )} */}
          <div className="w-full hidden md:flex">
            <Navbar />
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default ReferFriend;
