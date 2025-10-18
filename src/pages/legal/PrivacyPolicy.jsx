import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowRoundUp } from "react-icons/io";

const PrivacyPolicy = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-[#0e1b20] text-white relative">
      {/* Header Section */}
      <div className="w-full pt-20 pb-10">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="flex items-center space-x-4 mb-8">
            <Link 
              to="/" 
              className="text-[#82DDB5] hover:text-white transition-colors text-sm font-body1"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-white text-sm font-body1">Privacy Policy</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-header text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 font-body1 text-sm sm:text-base max-w-2xl">
            <strong>Effective Date: 11th July, 2025</strong><br />
            This Privacy Policy describes how Ginox ("we", "us", or "our") collects, uses, and protects your personal information.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full pb-20">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="bg-[#82DDB51A] border border-[#82DDB5] rounded-3xl p-8 sm:p-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  1. Information We Collect
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Account details: email address, username, password</li>
                  <li>Wallet addresses</li>
                  <li>Activity logs and device info (e.g., IP address, browser type)</li>
                  <li>Cookies and analytics data</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  2. Use of Information
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed mb-3">
                  We use your data to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Provide and improve our services</li>
                  <li>Facilitate transactions</li>
                  <li>Detect and prevent fraud</li>
                  <li>Communicate important platform updates</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  3. Data Security
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  We implement industry-standard security measures to protect your data. However, no online platform is 100% secure, and you use Ginox at your own risk.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  4. Third-Party Access
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed mb-3">
                  We do not sell or share your data with third-party marketers. Data may be shared with service providers or legal authorities when:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Required by law</li>
                  <li>Necessary to protect users or the platform</li>
                  <li>Processing data on our behalf (e.g., analytics, cloud services)</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  5. Cookies and Tracking
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed mb-3">
                  We use cookies to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Store preferences</li>
                  <li>Analyze platform usage</li>
                  <li>Improve your experience</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  6. Your Rights
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed mb-3">
                  You may:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Access or update your data</li>
                  <li>Request deletion of your account</li>
                  <li>Opt-out of promotional communications</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  7. Children's Privacy
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  Ginox is not intended for individuals under 18. We do not knowingly collect data from children.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  8. Crypto-Specific Risk Disclosure
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>All user activity involving crypto assets carries financial risk.</li>
                  <li>Ginox does not take custody of user funds or guarantee the value of any token.</li>
                  <li>Users are responsible for understanding the nature of blockchain technology and its risks, including price volatility, network congestion, and protocol bugs.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  9. Changes to Policy
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  We may update this Privacy Policy. Your continued use of the platform means you accept these changes.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  10. Contact
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Email: support@ginox.io</li>
                  <li>Address: Cluster C, JLT, Dubai</li>
                </ul>
              </div>

              <div className="pt-8 border-t border-[#82DDB5]">
                <p className="text-gray-400 font-body1 text-sm">
                  Last updated: 11th July, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 h-[50px] w-[50px] rounded-full p-[2px] cursor-pointer z-40"
        style={{
          background: "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
        }}
      >
        <div className="flex bg-[#0e1b20] items-center h-full w-full justify-center rounded-full">
          <IoIosArrowRoundUp className="text-white text-2xl" />
        </div>
      </button>

      {/* Background Effects */}
      <div className="bg-[#0ac09329] w-[192px] h-[192px] rounded-full blur-[100px] absolute top-20 right-10" />
      <div className="bg-[#0ac09329] w-[192px] h-[192px] rounded-full blur-[100px] absolute bottom-20 left-10" />
    </div>
  );
};

export default PrivacyPolicy; 