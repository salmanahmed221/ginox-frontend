import React from 'react';
import { Link } from 'react-router-dom';

const ConnectWallet = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center py-10 px-4 bg-[url('/assets/images/signin-bg.svg')] bg-cover bg-center">
      {/* Back Button */}
      <div className="absolute top-10 left-4 md:left-10">
        <Link to="/signin" className="flex items-center text-white hover:opacity-80 transition-opacity text-base">
          <img
            className="w-5 h-5 mr-2"
            src="/assets/images/arrow-left.png"
          />
          Back
        </Link>
      </div>

      <div className="flex flex-col items-center w-full max-w-[1200px] mx-auto pt-16 md:pt-20">
        {/* Logo and Main Title */}
        <div className="flex flex-col items-center mb-10">
          <img src="/assets/images/logo.png" alt="Ginox Logo" className="h-24 mb-6" />
          <h1 className="text-3xl font-heading text-white tracking-widest text-center">
            CONNECT WALLET
          </h1>
        </div>

        <div className="w-full max-w-lg bg-[#FFFFFF05] rounded-[20px] shadow-2xl p-10 mx-auto border border-gray_line">
          {/* Wallet Buttons */}
          <div className="space-y-4 mb-8">
            <button className="w-full flex items-center justify-between h-14 px-5 rounded-full text-white font-semibold text-lg  hover:opacity-90 transition-opacity duration-300" style={{background:' linear-gradient(90deg, #E37107 0%, #D2970C 100%)'}}>
              MetaMask
              <img src="/assets/images/image (18).png" alt="MetaMask icon" className="w-7 h-7" />
            </button>
            <button className="w-full flex items-center justify-between h-14 px-5 rounded-full text-white font-semibold text-lg hover:opacity-90 transition-opacity duration-300"  style={{background: 'linear-gradient(90deg, #1165C6 0%, #31A8E3 100%)'}}>
              Trust Wallet
              <img src="/assets/images/image (19).png" alt="Trust Wallet icon" className="w-7 h-7" />
            </button>
            <button className="w-full flex items-center justify-between h-14 px-5 rounded-full text-white font-semibold text-lg hover:opacity-90 transition-opacity duration-300" style={{background: 'linear-gradient(90deg, #303132 0%, #6E7276 100%)'}}>
              Coinbase Wallet
              <img src="/assets/images/image (20).png" alt="Coinbase Wallet icon" className="w-7 h-7" />
            </button>
          </div>

          {/* OR Separator */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray_line"></div>
            <span className="mx-4 text-text_secondary text-sm font-body">OR</span>
            <div className="flex-grow border-t border-gray_line"></div>
          </div>

          {/* Register With Heading */}
          <h2 className="text-center text-text_primary text-xl font-heading tracking-widest mt-8 mb-6">REGISTER WITH</h2>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Google */}
            <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body">
              <img src="/assets/images/google-icon.png" alt="Google icon" className="w-4 h-4 mr-2" />
              Google
            </button>
            {/* Github */}
            <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body">
              <img src="/assets/images/github.png" alt="Github icon" className="w-4 h-4 mr-2" />
              Github
            </button>
            {/* Gitlab */}
            <button className="flex items-center justify-center py-3 px-4 rounded-lg border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body">
              <img src="/assets/images/gitlab.png" alt="Gitlab icon" className="w-4 h-4 mr-2" />
              Gitlab
            </button>
          </div>
        </div>

        {/* Help Link */}
        <p className="text-center text-[#82DDB5] text-sm font-body mt-8 hover:opacity-80 transition-opacity">
          <Link to="/help-wallet" className="font-body text-[#82DDB5]">
            Need help creating a wallet?
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ConnectWallet; 