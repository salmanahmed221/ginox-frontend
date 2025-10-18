import React, { useState } from 'react';

const navLinks = [
  { label: 'Hardware', dropdown: ['Wallets', 'Devices', 'Accessories'] },
  { label: 'Software', dropdown: ['Apps', 'Tools', 'Updates'] },
  { label: 'Staking', dropdown: ['ETH', 'BTC', 'USDT'] },
  { label: 'Games', dropdown: ['Lottery', 'Arcade', 'Casino'] },
  { label: 'Lottery', dropdown: ['Draws', 'Tickets', 'Winners'] },
];

export default function ProductNavbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Close profile dropdown on outside click
  React.useEffect(() => {
    if (!profileOpen) return;
    function handle(e) {
      if (!e.target.closest('.profile-dropdown-parent')) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [profileOpen]);

  return (
    <nav className="w-full bg-[#0B101B] border-b border-[#232A3E] px-4 md:px-12 py-3 flex items-center justify-between z-20 relative">
      <img src="/assets/images/gradient-logo.png" alt="Ginox Logo" className="h-8" />
      <div className="flex-1 flex justify-center">
        <ul className="flex gap-6 text-white text-sm font-medium relative">
          {navLinks.map((link, idx) => (
            <li
              key={link.label}
              className="relative group flex flex-col items-center"
              onMouseEnter={() => setOpenDropdown(idx)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <span className="hover:text-[#1A6AFF] cursor-pointer px-3 py-1 rounded transition-colors duration-150">{link.label}</span>
              {/* Dropdown */}
              {openDropdown === idx && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 min-w-[160px] bg-[#111624] border border-[#232A3E] rounded-xl shadow-xl py-3 px-4 flex flex-col gap-2 z-30" style={{background: 'linear-gradient(180deg, #111624 80%, #1A6AFF 120%)'}}>
                  {link.dropdown.map((item) => (
                    <span key={item} className="text-white text-sm px-2 py-1 rounded hover:bg-[#232A3E] cursor-pointer transition">{item}</span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-gradient-to-r from-[#1A6AFF] to-[#00F0FF] text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md">Wallet Connect</button>
        <div className="relative profile-dropdown-parent">
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1A6AFF] cursor-pointer"
            onClick={() => setProfileOpen((v) => !v)}
            tabIndex={0}
            onBlur={() => setTimeout(() => setProfileOpen(false), 150)}
          >
            <img src="/assets/images/profile-girl.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          {profileOpen && (
            <div className="absolute right-0 mt-3 min-w-[180px] bg-[#111624] border border-[#232A3E] rounded-xl shadow-xl py-3 px-4 flex flex-col gap-2 z-40" style={{background: 'linear-gradient(180deg, #111624 80%, #1A6AFF 120%)'}}>
              <span className="text-white text-sm px-2 py-2 rounded hover:bg-[#232A3E] cursor-pointer transition">Profile</span>
              <span className="text-white text-sm px-2 py-2 rounded hover:bg-[#232A3E] cursor-pointer transition">Settings</span>
              <span className="text-white text-sm px-2 py-2 rounded hover:bg-[#232A3E] cursor-pointer transition">Logout</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 