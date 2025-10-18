import React from "react";
import ProductNavbar from "../../components/ProductNavbar";
import ProductFooter from "../../components/ProductFooter";
import Navigation from "../../components/navigation";
import Footer from "../../components/footers";
export default function Games() {
  return (
    <div className="min-h-screen w-screen bg-[#010510] font-['Octa Brain','Avalont-Regular','sans-serif'] flex flex-col">
      <Navigation />
      <div
        className="flex-1 w-full flex flex-col items-center justify-center relative"
        style={{ minHeight: "60vh" }}
      >
        <img
          src="/assets/images/galaxy.png"
          alt="Galaxy Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h1
            className="text-white text-4xl md:text-8xl font-body1 tracking-widest text-center"
            style={{ letterSpacing: "0.15em" }}
          >
            COMING SOON
          </h1>
        </div>
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
