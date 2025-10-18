import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileSetup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleNextClick = () => {
    // Here you would handle the submission of the uploaded ID
    navigate('/profile-setup/take-selfie');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center py-10 px-4 bg-[url('/assets/images/signin-bg.svg')] bg-cover bg-center">
      {/* Back Button */}
      <div className="absolute top-10 left-4 md:left-10">
        <Link to="/connect-wallet" className="flex items-center text-text_secondary hover:opacity-80 transition-opacity text-base">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </Link>
      </div>

      <div className="flex flex-col items-center w-full max-w-[1200px] mx-auto pt-16 md:pt-20">
        {/* Logo and Main Title */}
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/images/logo.png" alt="Ginox Logo" className="h-24 mb-4" />
          <h1 className="text-3xl font-heading text-text_primary tracking-widest text-center mb-2">
            PROFILE SETUP
          </h1>
          <p className="text-base font-body text-center bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end bg-clip-text text-transparent opacity-70">
            Verify Your Identity To Unlock Full Access.
          </p>
        </div>

        <div className="w-full max-w-lg bg-[#FFFFFF05] rounded-[20px] shadow-2xl p-10 mx-auto border border-gray_line">
          <label htmlFor="upload-id" className="block text-sm font-body text-text_secondary mb-4">Upload ID</label>
          <div
            className={`w-full h-55 flex flex-col items-center bg-[#FFFFFF14] justify-center border-2 border-dashed rounded-[15px] p-2 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-link_color' : 'border-gray_line'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadButtonClick}
          >
            <input
              type="file"
              id="upload-id"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Uploaded ID" className="max-h-full max-w-full object-contain" />
            ) : (
              <>
                <div className=" flex items-center justify-center mb-4">
                  <img
                    className="w-[91px] h-[91px]" 
                    src='/assets/images/profile-plus.png'
                  />
                </div>
                <p className="text-lg font-semibold mb-2 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end bg-clip-text text-transparent">Upload File</p>
                <p className="text-white text-sm font-body">Drag & Drop</p>
              </>
            )}
          </div>
          <p className="text-xs font-body mt-4 flex items-center bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end bg-clip-text text-transparent">
            <svg className="w-4 h-4 mr-2" style={{ color: '#4ADE80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Passport, Driver's license, etc.
          </p>
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="w-fit max-w-md py-3 px-4 rounded-full text-white font-semibold mt-10
                     bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end
                     hover:opacity-90 transition-opacity duration-300"
          onClick={handleNextClick}
        >
          Next
          <img
            className="w-5 h-5 ml-2 inline-block"
            src="/assets/images/arrow-icon.png"
            />
        </button>

      </div>
    </div>
  );
};

export default ProfileSetup; 