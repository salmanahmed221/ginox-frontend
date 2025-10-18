import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SupportChat = () => {
  const location = useLocation();

  useEffect(() => {
    // Function to completely disable Tawk.to
    const disableTawk = () => {
      // Hide existing Tawk widget if present
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }

      // Remove all Tawk elements
      const removeTawkElements = () => {
        const selectors = [
          'iframe[src*="tawk.to"]',
          "#tawkchat-minified",
          "#tawkchat-maximized", 
          "#tawkchat-container",
          '[id*="tawk"]',
          '[class*="tawk"]',
          '[data-tawk-to]'
        ];

        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.remove();
          });
        });
      };

      // Add CSS to completely hide Tawk
      const hideStyle = document.createElement("style");
      hideStyle.id = "tawk-support-page-hide";
      hideStyle.textContent = `
        iframe[src*="tawk.to"], 
        iframe[src*="embed.tawk.to"],
        #tawkchat-minified,
        #tawkchat-maximized,
        #tawkchat-container,
        [id*="tawk"], 
        [class*="tawk"],
        [data-tawk-to] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: fixed !important;
          left: -99999px !important;
          top: -99999px !important;
          width: 0 !important;
          height: 0 !important;
          z-index: -99999 !important;
        }
      `;
      document.head.appendChild(hideStyle);

      // Continuously remove Tawk elements
      removeTawkElements();
      const interval = setInterval(removeTawkElements, 200);

      return interval;
    };

    // Function to initialize Crisp
    const initializeCrisp = () => {
      // Remove any existing Crisp
      if (window.$crisp) {
        window.$crisp = [];
      }
      
      // Remove existing Crisp script
      const existingCrispScript = document.querySelector('script[src*="client.crisp.chat"]');
      if (existingCrispScript) {
        existingCrispScript.remove();
      }

      // Initialize new Crisp
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "fbcdbf6c-cde1-4818-baba-6cb287a96c78";

      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = 1;
      script.onload = () => {
        // Ensure Crisp is visible after load
        if (window.$crisp) {
          window.$crisp.push(["safe", true]);
        }
      };
      document.getElementsByTagName("head")[0].appendChild(script);

      return script;
    };

    // Disable Tawk and initialize Crisp
    const tawkInterval = disableTawk();
    const crispScript = initializeCrisp();

    // Cleanup function
    return () => {
      // Clear Tawk hiding interval
      if (tawkInterval) {
        clearInterval(tawkInterval);
      }

      // Remove Tawk hiding CSS
      const tawkHideStyle = document.getElementById("tawk-support-page-hide");
      if (tawkHideStyle) {
        tawkHideStyle.remove();
      }

      // Remove Crisp script
      if (crispScript && crispScript.parentNode) {
        crispScript.parentNode.removeChild(crispScript);
      }

      // Clean up Crisp
      if (window.$crisp) {
        window.$crisp = [];
        delete window.CRISP_WEBSITE_ID;
      }

      // Re-enable Tawk if it exists (for other pages)
      setTimeout(() => {
        if (window.Tawk_API && window.Tawk_API.showWidget) {
          window.Tawk_API.showWidget();
        }
      }, 500);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-dark_background text-text_primary flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">Support Chat</h1>
        <p className="text-lg mb-8 text-gray-300">
          Welcome to our support center! Our Crisp chat widget is now active below.
        </p>
        
       
      </div>
    </div>
  );
};

export default SupportChat;