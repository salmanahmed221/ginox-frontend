import React, { useState } from 'react';
import ProductNavbar from '../../components/ProductNavbar';
import ProductFooter from '../../components/ProductFooter';
import { FaStar, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';

const productImages = [
  '/assets/images/product-1.png',
  '/assets/images/product-2.png',
  '/assets/images/product-3.png',
  '/assets/images/product-1.png',
  '/assets/images/product-2.png',
];

const otherProducts = [
  { img: '/assets/images/product-1.png', name: 'Quantum Cats' },
  { img: '/assets/images/product-2.png', name: 'Lunatics' },
  { img: '/assets/images/product-3.png', name: 'NodeMonkes' },
  { img: '/assets/images/product-2.png', name: 'Lunatics' },
  { img: '/assets/images/product-1.png', name: 'Runestone' },
  { img: '/assets/images/product-2.png', name: 'Lunatics' },
  { img: '/assets/images/product-3.png', name: 'Airhead' },
  { img: '/assets/images/product-1.png', name: 'Quantum Cats' },
];

const relatedProducts = [
  { img: '/assets/images/cat-image.png', name: 'Quantum Cats' },
  { img: '/assets/images/cat-image.png', name: 'Quantum Cats' },
  { img: '/assets/images/cat-image.png', name: 'Quantum Cats' },
  { img: '/assets/images/cat-image.png', name: 'Quantum Cats' },
  { img: '/assets/images/cat-image.png', name: 'NFT' },
  { img: '/assets/images/cat-image.png', name: 'NFT' },
];

export default function ProductDetail() {
  const [mainIdx, setMainIdx] = useState(0);
  const [qty, setQty] = useState(2);

  return (
    <div className="min-h-screen w-screen bg-[#0B101B] flex flex-col">
      <ProductNavbar />
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-2 md:px-8 pt-8 pb-2 flex flex-col gap-10">
        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Slider */}
          <div className="flex flex-row gap-4 w-full max-w-md">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-2 justify-center">
              {productImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="thumb"
                  className={`w-14 h-14 rounded-xl object-cover border-2 ${mainIdx === idx ? 'border-[#F6E7C1]' : 'border-transparent'} cursor-pointer transition`} 
                  onClick={() => setMainIdx(idx)}
                />
              ))}
            </div>
            {/* Main Image with arrows */}
            <div className="relative rounded-2xl overflow-hidden flex items-center justify-center aspect-square w-full max-w-xs">
              <img src={productImages[mainIdx]} alt="Product" className="object-contain w-4/5 h-4/5" />
              <button onClick={() => setMainIdx((mainIdx - 1 + productImages.length) % productImages.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#fff]/70 hover:bg-[#fff]/90 text-[#111624] rounded-full p-2 shadow-md"><FaChevronLeft /></button>
              <button onClick={() => setMainIdx((mainIdx + 1) % productImages.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#fff]/70 hover:bg-[#fff]/90 text-[#111624] rounded-full p-2 shadow-md"><FaChevronRight /></button>
            </div>
          </div>
          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-white text-3xl font-bold mb-2">Crypto Hardware Wallet</h2>
            <p className="text-[#A3AED0] text-base mb-4 max-w-xl">Cryptocurrency Prices Have Fluctuated Widely So Far This Year, Leaving Some Investors With Notable Gains And Others With Losses.</p>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[#FF7A00] text-2xl font-bold">$350.00</span>
              <select className="bg-[#111624] border border-[#232A3E] text-white rounded px-2 py-1 text-sm">
                <option>USD</option>
                <option>ETH</option>
              </select>
            </div>
            <div className="border-t border-[#232A3E] py-4">
              <div className="text-white font-semibold mb-2">Technical specifications</div>
              <ul className="text-[#A3AED0] text-sm list-disc pl-5">
                <li>Supports multiple</li>
                <li>Cryptocurrencies Features a secure Product</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-8 items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">Reviews</span>
                <span className="flex items-center gap-1 text-yellow-400 font-semibold text-base">4.5 <FaStar /></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">Sigmatech</span>
                <FaCheckCircle className="text-blue-500" />
                <span className="text-[#A3AED0] text-xs">Verified Purchase</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white font-semibold">Quantity selector</span>
              <div className="flex items-center gap-2 bg-[#111624] border border-[#232A3E] rounded-full px-3 py-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-white text-xl px-2">-</button>
                <span className="text-[#A3AED0] text-lg w-8 text-center">{qty.toString().padStart(2, '0')}</span>
                <button onClick={() => setQty(q => q + 1)} className="text-white text-xl px-2">+</button>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-[#256DFA] hover:bg-[#1A6AFF] text-white font-semibold py-3 rounded-lg transition">Add to Cart</button>
              <button className="flex-1 bg-[#FF7A00] hover:bg-[#FF9900] text-white font-semibold py-3 rounded-lg transition">Buy Now</button>
            </div>
          </div>
        </div>
        {/* Seller Information */}
        <div className="bg-[#111624] border border-[#232A3E] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <img src="/assets/images/profile-girl.png" alt="Seller" className="w-12 h-12 rounded-full border-2 border-[#1A6AFF] object-cover" />
            <div className="flex flex-col">
              <span className="text-white font-semibold">Sigmatech</span>
              <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">4.5 <FaStar /></span>
            </div>
            <span className="text-[#A3AED0] text-sm ml-4">Publisher : July 19, 2019</span>
          </div>
          <div className="text-[#A3AED0] text-sm mb-2">Cryptocurrency Prices Have Fluctuated Widely So Far This Year, Leaving Some Investors With Notable Gains And Others With Losses.</div>
          {/* Other Products Slider */}
          <div className="mt-2">
            <div className="text-white font-semibold mb-2">Other Product</div>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
              {otherProducts.map((p, i) => (
                <div key={i} className="flex flex-col items-center min-w-[80px]">
                  <img src={p.img} alt={p.name} className="w-14 h-14 rounded-xl object-cover mb-1" />
                  <span className="text-[#A3AED0] text-xs text-center truncate w-16">{p.name}</span>
                </div>
              ))}
              <button className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#232A3E] text-white"><FaChevronRight /></button>
            </div>
          </div>
        </div>
        {/* Related Products Slider */}
        <div className="mt-2">
          <div className="text-white font-semibold mb-2">Related Products</div>
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-2">
            {relatedProducts.map((p, i) => (
              <div key={i} className="flex flex-col items-center min-w-[120px]">
                <div className="w-24 h-24 rounded-2xl bg-[#181F32] flex items-center justify-center mb-2 border-2 border-transparent hover:border-[#1A6AFF] transition">
                  <img src={p.img} alt={p.name} className="w-16 h-16 object-contain" />
                </div>
                <span className="text-[#A3AED0] text-xs text-center truncate w-24">{p.name}</span>
              </div>
            ))}
            <button className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#232A3E] text-white"><FaChevronLeft /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#232A3E] text-white"><FaChevronRight /></button>
          </div>
        </div>
      </div>
      <ProductFooter />
    </div>
  );
} 