import React, { useState } from 'react';
import ProductNavbar from '../../components/ProductNavbar';
import ProductFooter from '../../components/ProductFooter';
import { FaStar, FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';

const products = [
  {
    id: 1,
    title: 'Crypto Hardware Wallet',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-1.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 2,
    title: 'ETH Staking',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-2.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 3,
    title: 'Crypto Hardware Wallet',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-3.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 4,
    title: 'ETH Staking',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-1.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 5,
    title: 'Crypto Hardware Wallet',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-2.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 6,
    title: 'ETH Staking',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-1.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 7,
    title: 'Crypto Hardware Wallet',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-3.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 8,
    title: 'ETH Staking',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-2.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 9,
    title: 'Crypto Hardware Wallet',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-1.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 10,
    title: 'ETH Staking',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-3.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 11,
    title: 'Crypto Hardware Wallet',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-3.png',
    brand: 'Sigmatech',
    verified: true,
  },
  {
    id: 12,
    title: 'ETH Staking',
    desc: 'As Well As Other Valuable Cryptocurrencies, Will Be At The Heart Of The Reserve.',
    price: '$350.00',
    eth: '0.1 ETH',
    rating: 4.5,
    img: '/assets/images/product-2.png',
    brand: 'Sigmatech',
    verified: true,
  },
];

const priceFilters = [
  '$200 - $300',
  '$200 - $300',
  '$200 - $300',
  '$200 - $300',
  '$200 - $300',
  '$200 - $300',
];

export default function ProductPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [openRatings, setOpenRatings] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B101B] flex flex-col">
      <ProductNavbar />
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-2 md:px-8 pt-6 pb-2 flex flex-col">
        {/* Filters and Products */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className={`transition-all duration-300 ${showFilters ? 'w-full md:w-[270px]' : 'w-0 md:w-0'} overflow-hidden`}> 
            <div className="bg-[#111624] rounded-2xl p-6 text-white min-w-[220px] max-w-[270px]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold">Price</span>
                <button className="md:hidden" onClick={() => setShowFilters(false)}>
                  Hide Filters
                </button>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                {priceFilters.map((p, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-blue-500" />
                    <span className="text-sm">{p}</span>
                  </label>
                ))}
              </div>
              <div className="border-t border-[#232A3E] pt-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenRatings(v => !v)}>
                  <span className="font-semibold">Ratings</span>
                  {openRatings ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openRatings && (
                  <div className="mt-2 flex flex-col gap-2">
                    {[5,4,3,2,1].map(r => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-blue-500" />
                        <span className="flex items-center text-sm">{r} <FaStar className="ml-1 text-yellow-400" /></span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-[#232A3E] pt-4 mt-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenVerification(v => !v)}>
                  <span className="font-semibold">verification level</span>
                  {openVerification ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openVerification && (
                  <div className="mt-2 flex flex-col gap-2">
                    {[1,2,3].map(lvl => (
                      <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-blue-500" />
                        <span className="text-sm">Level {lvl}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <button className="bg-[#111624] rounded-full px-5 py-2 text-white flex items-center gap-2" onClick={() => setShowFilters(v => !v)}>
                {/* Filter Icon SVG */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17V13.414a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" /></svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <div className="flex-1 flex items-center bg-[#111624] rounded-full px-4 py-2">
                <input className="flex-1 bg-transparent outline-none text-white placeholder:text-[#6B7280]" placeholder="Search" />
              </div>
              <button className="bg-[#111624] rounded-full px-5 py-2 text-white flex items-center gap-2">
                Trending
              </button>
            </div>
            {/* Filter Chips */}
            <div className="flex gap-3 mb-6">
              {['All', 'Price', 'Ratings', 'verification level'].map((chip, i) => (
                <button key={chip} className={`px-5 py-2 rounded-full text-white text-sm font-medium ${i === 0 ? 'bg-gradient-to-r from-[#1A6AFF] to-[#00F0FF]' : 'bg-[#111624]'}`}>{chip}</button>
              ))}
            </div>
            {/* Product Cards Grid */}
            <div className={`grid gap-6 ${showFilters ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3'}`}>
              {products.map(product => (
                <div key={product.id} className="bg-[#111624] rounded-2xl p-4 flex flex-col shadow-lg border border-[#232A3E]">
                  <img src={product.img} alt={product.title} className="rounded-xl h-32 w-full object-cover mb-4" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-base">{product.title}</span>
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">{product.rating} <FaStar /> <FaStar /> <FaStar /> <FaStar /></span>
                  </div>
                  <div className="text-[#6B7280] text-xs mb-2">{product.desc}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-bold text-lg">{product.price}</span>
                    <span className="text-[#FF5C5C] font-semibold text-sm">{product.eth}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-white text-sm font-medium">{product.brand}</span>
                    {product.verified && <FaCheckCircle className="text-blue-500" />}
                  </div>
                  <button className=" flex justify-center w-full bg-gradient-to-r from-[#1A6AFF] to-[#00F0FF] text-white font-semibold py-2 rounded-lg mt-auto">Add to Cart <img className="ml-2 w-4 h-4" src="/assets/images/arrow-icon.png" alt="" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ProductFooter />
    </div>
  );
} 