import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TakeSelfie = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  const getVideo = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480 } });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Could not access camera. Please ensure it's connected and enabled.");
    }
  };

  const takePhoto = () => {
    const width = 480;
    const height = 480;

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  };

  const clearPhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  const handleSubmit = () => {
    // Here you would handle the submission of the captured selfie
    alert("Selfie submitted!");
    // You might navigate to another page or send the image to a server
  };

  useEffect(() => {
    getVideo();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]); // Re-run effect if stream changes, which should only happen once initially

  return (
    <div className="min-h-screen w-screen flex flex-col items-center py-10 px-4 bg-[url('/assets/images/signin-bg.svg')] bg-cover bg-center">
      {/* Back Button */}
      <div className="absolute top-10 left-4 md:left-10">
        <Link to="/profile-setup" className="flex items-center text-text_secondary hover:opacity-80 transition-opacity text-base">
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

        <div className="w-full max-w-lg bg-[#FFFFFF0A] rounded-[20px] shadow-2xl p-10 mx-auto border border-gray_line dotted-background">
          <label htmlFor="selfie-capture" className="block text-sm font-body text-text_secondary mb-4">Take a selfie</label>
          <div className="w-full relative overflow-hidden rounded-[15px] border-2 border-dashed border-gray_line h-72 flex items-center justify-center">
            <video ref={videoRef} onCanPlay={() => videoRef.current.play()} className={`absolute w-full h-full object-cover ${hasPhoto ? 'hidden' : ''}`} autoPlay playsInline></video>
            <canvas ref={photoRef} className={`absolute w-full h-full object-cover ${hasPhoto ? '' : 'hidden'}`}></canvas>

            {!hasPhoto && (
              <div className="absolute inset-0 flex bg-[#FFFFFF14] items-center justify-center pointer-events-none">
                  <img src="/assets/images/take-selfie.png" alt="" />
              </div>
            )}

            {!hasPhoto && (
              <button
                type="button"
                onClick={takePhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                
              </button>
            )}
            {hasPhoto && (
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-80 transition-opacity"
              >
                Retake
              </button>
            )}
          </div>
        </div>

        {/* Submit Documents Button */}
        <button
          type="button"
          className="w-fit max-w-md py-3 px-4 rounded-full text-white font-semibold mt-10
                     bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end
                     hover:opacity-90 transition-opacity duration-300"
          onClick={handleSubmit}
        >
          Submit Documents
          <img
            className="w-5 h-5 ml-2 inline-block"
            src="/assets/images/arrow-icon.png"
/>
        </button>

      </div>
    </div>
  );
};

export default TakeSelfie; 