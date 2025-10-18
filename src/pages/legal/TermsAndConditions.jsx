import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowRoundUp } from "react-icons/io";

const TermsAndConditions = () => {
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
            <span className="text-white text-sm font-body1">Terms & Conditions</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold font-header text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-400 font-body1 text-sm sm:text-base max-w-2xl">
            <strong>Effective Date: 11th July, 2025</strong><br />
            Welcome to Ginox — a crypto marketplace platform. Please read these terms and conditions carefully before using our services.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full pb-20">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="bg-[#82DDB51A] border border-[#82DDB5] rounded-3xl p-8 sm:p-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  These Terms and Conditions ("Terms") govern your access to and use of our website, services, and applications (collectively, the "Platform"). By accessing or using Ginox, you agree to be bound by these Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  1. Eligibility
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  To use Ginox, you must be at least 18 years old and have the legal capacity to enter into these Terms. You are responsible for ensuring that your use of the platform complies with local laws and regulations.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  2. Account Registration
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Users must register for an account to access certain features.</li>
                  <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                  <li>Ginox reserves the right to suspend or terminate accounts suspected of fraud, abuse, or violation of these Terms.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  3. Crypto Asset Usage Disclaimer
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Ginox does not guarantee any investment returns.</li>
                  <li>Cryptocurrency markets are highly volatile and speculative. By using this platform, you acknowledge the risks involved in transacting with or holding crypto assets.</li>
                  <li>Most crypto tokens listed or used on Ginox are third-party tokens, and their performance, price, or availability may depend on external factors, including regulatory changes and third-party protocols.</li>
                  <li>Ginox has no control over these tokens or any regulatory decisions that may impact them.</li>
                  <li>Users are advised to conduct their own due diligence and seek independent financial advice.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  4. Deposits and Transactions
                </h2>
                <ul className="list-disc pl-6 space-y-2  text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>All deposits must be in supported cryptocurrencies.</li>
                  <li>Ginox is not liable for incorrect wallet addresses or failed blockchain confirmations.</li>
                  <li>We do not allow fiat currency deposits or withdrawals.</li>
                  <li>No refunds for completed crypto transactions.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  5. User Responsibilities
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Users must not use the platform for unlawful, harmful, or fraudulent activities.</li>
                  <li>Users agree not to upload malicious code, attempt to hack the platform, or disrupt service in any way.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  6. Platform Availability
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Ginox may undergo updates, maintenance, or unexpected downtime.</li>
                  <li>We make no guarantee of uninterrupted access to the platform.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  7. Intellectual Property
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  All content on the platform (logo, UI, code, etc.) is the property of Ginox and may not be used or reproduced without permission.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed mb-3">
                  Ginox shall not be held liable for any losses, damages, or expenses arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  <li>Market fluctuations</li>
                  <li>Regulatory changes</li>
                  <li>Technical failures</li>
                  <li>Third-party actions</li>
                  <li>Delisting of tokens or features</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  9. Amendments
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  We may update these Terms at any time. Continued use after any update constitutes acceptance of the revised Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  10. Governing Law
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed">
                  These Terms shall be governed by the laws of Dubai, UAE. Disputes shall be resolved under the exclusive jurisdiction of the courts in that region.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-4xl font-bold font-header text-[#82DDB5] mb-4">
                  11. Contact
                </h2>
                <p className="text-gray-300 font-body1 text-sm sm:text-base leading-relaxed mb-3">
                  For any questions:
                </p>
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

export default TermsAndConditions; 