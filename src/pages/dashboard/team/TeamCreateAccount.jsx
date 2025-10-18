import React from 'react';
import Header from '../../../components/Header';

const TeamCreateAccount = () => (
  <div className="w-full mb-10">
    <div className="mb-8 text-md font-heading2  tracking-widest">CREATE NEW ACCOUNT</div>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div>
        <label className="block text-xs text-white font-heading2  mb-2">FULL NAME</label>
        <input className="w-full bg-black text-white rounded-lg px-4 py-3 font-body outline-none mb-6" placeholder="Full name" />
        <label className="block text-xs text-white font-heading2  mb-2">MOBILE NUMBER</label>
        <input className="w-full bg-black text-white rounded-lg px-4 py-3 font-body outline-none mb-6" placeholder="AC number" />
        <label className="block text-xs text-white font-heading2  mb-2">SELECT COUNTRY</label>
        <input className="w-full bg-black text-white rounded-lg px-4 py-3 font-body outline-none mb-6" placeholder="Passport / ID number" />
        <label className="block text-xs text-white font-heading2  mb-2">REFERRAL CODE</label>
        <input className="w-full bg-black text-white rounded-lg px-4 py-3 font-body outline-none" placeholder="Registration Date" />
      </div>
      <div>
        <label className="block text-xs text-white font-heading2  mb-2">EMAIL ADDRESS</label>
        <input className="w-full bg-black text-white rounded-lg px-4 py-3 font-body outline-none mb-6" placeholder="Surname" />
        <label className="block text-xs text-white font-heading2  mb-2">PASSWORD</label>
        <input className="w-full bg-black text-white rounded-lg px-4 py-3 font-body outline-none mb-6" placeholder="Country" />
        <label className="block text-xs text-white font-heading2  mb-2">MOBILE NUMBER</label>
        <input className="w-full bg-black text-white rounded-lg px-4 py-3 font-body outline-none" placeholder="Mobile Number" />
      </div>
    </form>
    <button className="w-60 py-2 rounded-full bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end text-white  text-lg shadow-md mx-auto block">Create Account</button>
  </div>
);

export default TeamCreateAccount; 