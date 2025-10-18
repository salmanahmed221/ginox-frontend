import React, { useState } from 'react';
import ProductNavbar from '../../components/ProductNavbar';
import ProductFooter from '../../components/ProductFooter';
import { FaStar, FaChevronLeft, FaChevronRight, FaCheckCircle, FaSearch } from 'react-icons/fa';
// Placeholder icons/images for missing assets
const placeholder = '/assets/images/placeholder.png';

// Placeholder data for sliders and sections
const featuredProducts = [
  { img: '/assets/images/product-1.png', title: 'Enxu', desc: 'Crypto Hardware', },
  { img: '/assets/images/product-2.png', title: 'GaminFing', desc: 'Gaming Hardware', },
  { img: '/assets/images/product-3.png', title: 'MetaMask', desc: 'Wallet', },
];
const newArrivals = [
  { img: '/assets/images/product-1.png', title: 'BTC Wallet', price: '$350.00', rating: 4.5 },
  { img: '/assets/images/product-2.png', title: 'Crypto Guard', price: '$320.00', rating: 4.5 },
  { img: '/assets/images/product-3.png', title: 'ETH Staking', price: '$400.00', rating: 4.5 },
];
const mostPopular = [
  { img: '/assets/images/product-1.png', title: 'MetaMask', seller: 'MetaMask', price: '$350.00' },
];
const cryptohopper = [
  { img: '/assets/images/home-hero 1.png', title: 'Hopper License' },
  { img: '/assets/images/home-hero 1.png', title: 'Hopper Signal' },
  { img: '/assets/images/home-hero 1.png', title: 'Hopper Bundle' },
];
const trendingBots = [
  { name: 'Pionex', stats: ['0.05% fee', '18+ exchanges', '80+ bots'] },
  { name: 'Kryll', stats: ['0.016% fee', '10+ exchanges', '80+ bots'] },
];
const topRatedSellers = [
  { name: 'Pionex', rating: 4.5, price: '$350.00', fee: '0.05%' },
  { name: 'Kryll', rating: 4.5, price: '$320.00', fee: '0.016%' },
];
const stakingBoxes = [
  { name: 'BTC', price: '$350.00', change: '+2.5%' },
  { name: 'ETH', price: '$320.00', change: '+1.8%' },
];
const lotteryStatus = [
  { name: 'Rix Lottery', prize: '$5000' },
  { name: 'Killator', prize: 'x10,000' },
  { name: 'Buy Win', prize: 'ETH $5000' },
];

export default function Market() {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  return (
    <div className="min-h-screen w-screen bg-[#070E1A] flex flex-col font-sans overflow-x-hidden">
      {/* Header/Navbar */}
      <ProductNavbar />
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center text-center pt-10 pb-16 bg-gradient-to-b from-[#1A6AFF]/20 via-[#0B101B] to-[#070E1A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0" style={{background:'radial-gradient(ellipse at 50% 0%, #1A6AFF33 0%, #0B101B 80%)'}} />
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <img src="/assets/images/gradient-logo.png" alt="Ginox Logo" className="h-8 md:h-10 mb-6" />
          <h1 className="text-white text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">Discover the Future of Crypto & Digital Products.</h1>
          <p className="text-[#A3AED0] text-base md:text-lg max-w-2xl mx-auto mb-6">Buy, sell, and explore the best in crypto, NFTs, trading bots, and more. All in one secure, innovative marketplace.</p>
          <button className="flex bg-gradient-to-r from-[#00000080] to-[#0A7CFF] text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg mb-6"><img src="/assets/images/star-icon.png" alt="" />Welcome to Ginox</button>
        </div>
      </section>
      {/* Featured Product Slider */}
      <section className="w-full max-w-6xl mx-auto -mt-20 z-10 relative flex flex-col items-center">
        <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-2 w-full justify-center">
          {cryptohopper.map((images,i) => (
            <div key={i} className={`flex-1 min-w-[320px] max-w-[400px] bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg transition ring-2 ${i===featuredIdx?'ring-[#1A6AFF]':'ring-transparent'}`}>
              <img src={images.img} alt="Featured" className=" mx-auto mb-4 rounded-xl object-cover bg-[#232A3E]" />
              <div className="text-white text-xl font-bold mb-2">Product {i+1}</div>
              <div className="text-[#A3AED0] text-sm mb-2">Category</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {[0,1,2].map(i => (
            <button key={i} className={`w-3 h-3 rounded-full ${i===featuredIdx?'bg-[#1A6AFF]':'bg-[#232A3E]'}`} onClick={()=>setFeaturedIdx(i)} />
          ))}
        </div>
      </section>
      {/* New Arrivals */}
      <section className="w-full max-w-7xl mx-auto mt-16 mb-12 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">New Arrivals</h2>
        <p className="text-[#A3AED0] text-base mb-6">Check out the latest additions to our marketplace.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {newArrivals.map((images,i) => (
            <div key={i} className="bg-[#101624] border border-[#232A3E] rounded-2xl p-7 flex flex-col items-center shadow-lg">
              <img src={images.img} alt="New Arrival" className=" mb-4 rounded-xl object-cover bg-[#232A3E]" />
              <div className="text-white text-lg font-bold mb-1">Product {i}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold text-base">4.5 <svg width='16' height='16' fill='currentColor' className='inline'><polygon points='8,2 10,6 14,6 11,9 12,13 8,11 4,13 5,9 2,6 6,6'/></svg></span>
              </div>
              <div className="text-[#FF7A00] text-lg font-bold mb-2">$350.00</div>
              <button className="w-full bg-gradient-to-r from-[#1A6AFF] to-[#00F0FF] text-white font-semibold py-2 rounded-lg mt-auto">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
      {/* Most Popular Products */}
      <section className="w-full max-w-5xl mx-auto mb-12 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Most Popular Products</h2>
        <p className="text-[#A3AED0] text-base mb-6">Featured Companies</p>
        <div className="flex items-center">
              <img width={'100%'} src={'/assets/images/crypto-signals.png'} alt="Popular" className=" mb-4 rounded-xl object-cover bg-[#232A3E]" />
        </div>
      </section>
      {/* Seller Highlight */}
      <section className="w-full max-w-3xl mx-auto mb-12 flex flex-col md:flex-row gap-8 items-center bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg px-4">
        <img src={placeholder} alt="MetaMask" className="w-32 h-32 rounded-full object-cover border-4 border-[#F6E7C1] mb-4 md:mb-0" />
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="text-white text-xl font-bold mb-2">MetaMask</div>
          <div className="text-[#A3AED0] text-base mb-2 text-center md:text-left">MetaMask is a crypto wallet & gateway to blockchain apps. Secure, trusted, and easy to use.</div>
          <button className="bg-gradient-to-r from-[#1A6AFF] to-[#00F0FF] text-white font-semibold py-2 px-6 rounded-lg mb-2">View Seller</button>
        </div>
      </section>
      {/* Cryptohopper & MEXC */}
      <section className="w-full max-w-5xl mx-auto mb-12 flex flex-col md:flex-row gap-8 items-center px-4">
        <div className="flex-1 bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg flex flex-col items-center">
          <h3 className="text-white text-lg font-bold mb-4">CRYPTOHOPPER</h3>
          <div className="flex gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex flex-col items-center">
                <img src={placeholder} alt="Hopper" className="w-16 h-16 rounded-xl object-cover mb-2 bg-[#232A3E]" />
                <span className="text-[#A3AED0] text-xs text-center">Hopper {i}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg flex flex-col items-center">
          <img src={placeholder} alt="MEXC" className="w-24 h-24 rounded-xl object-cover mb-2 bg-[#232A3E]" />
          <span className="text-white text-lg font-bold">MEXC</span>
        </div>
      </section>
      {/* Signal Channels with tree/lines */}
      <section className="w-full max-w-4xl mx-auto mb-16 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-6">Signal Channels</h2>
        <div className="flex flex-col items-center relative">
          {/* Tree/lines SVG */}
          <svg width="320" height="120" viewBox="0 0 320 120" fill="none" className="absolute left-1/2 -translate-x-1/2 top-8 z-0 hidden md:block">
            <path d="M160 0 v40 M160 40 h-100 v60 M160 40 h100 v60" stroke="#1A6AFF" strokeWidth="2" strokeDasharray="6 6" />
          </svg>
          <div className="bg-[#232A3E] rounded-full px-8 py-2 text-white font-semibold mb-8 z-10 relative">Predator</div>
          <div className="flex flex-col md:flex-row gap-8 items-center w-full z-10 relative">
            <div className="bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg min-w-[220px] flex-1">
              <div className="text-white font-bold mb-2">Signal 1</div>
              <div className="text-[#A3AED0] text-sm">Details about signal 1...</div>
            </div>
            <div className="bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg min-w-[220px] flex-1">
              <div className="text-white font-bold mb-2">Signal 2</div>
              <div className="text-[#A3AED0] text-sm">Details about signal 2...</div>
            </div>
          </div>
        </div>
      </section>
      {/* Trending Bots */}
      <section className="w-full max-w-5xl mx-auto mb-12 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Trending Bots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2].map(i => (
            <div key={i} className="bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg flex flex-col gap-2">
              <div className="text-white text-lg font-bold mb-2">Bot {i}</div>
              <ul className="text-[#A3AED0] text-sm list-disc pl-5">
                <li>0.05% fee</li>
                <li>18+ exchanges</li>
                <li>80+ bots</li>
              </ul>
            </div>
          ))}
        </div>
      </section>
      {/* Top Rated Sellers */}
      <section className="w-full max-w-5xl mx-auto mb-12 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Top-rated Sellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2].map(i => (
            <div key={i} className="bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg flex flex-col gap-2">
              <div className="text-white text-lg font-bold mb-2">Seller {i}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold text-base">4.5 <svg width='16' height='16' fill='currentColor' className='inline'><polygon points='8,2 10,6 14,6 11,9 12,13 8,11 4,13 5,9 2,6 6,6'/></svg></span>
                <span className="text-[#FF7A00] text-lg font-bold">$350.00</span>
                <span className="text-[#A3AED0] text-sm">Fee: 0.05%</span>
              </div>
              <button className="w-full bg-gradient-to-r from-[#1A6AFF] to-[#00F0FF] text-white font-semibold py-2 rounded-lg mt-auto">View Seller</button>
            </div>
          ))}
        </div>
      </section>
      {/* Current Active Staking Boxes */}
      <section className="w-full max-w-5xl mx-auto mb-12 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Current Active Staking Boxes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2].map(i => (
            <div key={i} className="bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg flex flex-col gap-2">
              <div className="text-white text-lg font-bold mb-2">Box {i}</div>
              <div className="text-[#FF7A00] text-lg font-bold">$350.00</div>
              <div className="text-[#A3AED0] text-sm">Change: +2.5%</div>
            </div>
          ))}
        </div>
      </section>
      {/* Ginox Game Section */}
      <section className="w-full max-w-5xl mx-auto mb-12 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Ginox Game</h2>
        <div className="flex gap-8 items-center flex-wrap justify-center">
          {[1,2].map(i => (
            <div key={i} className="flex-1 bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg flex flex-col items-center min-w-[220px] max-w-[320px]">
              <img src={placeholder} alt="Game" className="w-24 h-24 mb-2 bg-[#232A3E] rounded-xl" />
              <span className="text-white text-lg font-bold">Game {i}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Today's Lottery Status */}
      <section className="w-full max-w-5xl mx-auto mb-12 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Today's Lottery Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#101624] border border-[#232A3E] rounded-2xl p-7 shadow-lg flex flex-col items-center">
              <img src={placeholder} alt="Lottery" className="w-16 h-16 mb-2 bg-[#232A3E] rounded-xl" />
              <span className="text-white text-lg font-bold mb-1">Lottery {i}</span>
              <span className="text-[#FF7A00] text-lg font-bold mb-2">$5000</span>
              <button className="w-full bg-gradient-to-r from-[#1A6AFF] to-[#00F0FF] text-white font-semibold py-2 rounded-lg mt-auto">Join Now</button>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <ProductFooter />
    </div>
  );
} 