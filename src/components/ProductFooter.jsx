import React from 'react';
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function ProductFooter() {
  return (
    <footer className="w-full bg-gradient-to-t from-[#0B101B] via-[#1A6AFF]/30 to-[#0B101B] border-t border-[#232A3E] mt-12 px-4 md:px-12 pt-12 pb-6 rounded-t-3xl relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(ellipse at 50% 0%, #1A6AFF33 0%, #0B101B 80%)'}} />
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-0 justify-between">
        <div className="flex-1 min-w-[220px]">
          <img src="/assets/images/gradient-logo.png" alt="Ginox Logo" className="h-8 mb-4" />
          <p className="text-[#A3AED0] text-sm mb-8 max-w-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
          <p className="text-[#A3AED0] text-xs">© 2025 — Copyright Ginox</p>
        </div>
        <div className="flex flex-1 justify-between gap-8">
          <div>
            <h4 className="text-white font-semibold mb-3">About</h4>
            <ul className="text-[#A3AED0] text-sm space-y-2">
              <li>Hardware</li>
              <li>Software</li>
              <li>Staking</li>
              <li>Games</li>
              <li>Lottery</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="text-[#A3AED0] text-sm space-y-2">
              <li>FAQs</li>
              <li>Help Center</li>
              <li>Submit a Request</li>
              <li>Firmware Update</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Social Media</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#111624] text-white hover:bg-[#1A6AFF] transition"><FaLinkedin /></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#111624] text-white hover:bg-[#1A6AFF] transition"><FaFacebook /></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#111624] text-white hover:bg-[#1A6AFF] transition"><FaTwitter /></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#111624] text-white hover:bg-[#1A6AFF] transition"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 border-t border-[#232A3E] pt-4 text-[#A3AED0] text-xs">
        <span>Terms & Conditions | Privacy Policy</span>
      </div>
    </footer>
  );
} 