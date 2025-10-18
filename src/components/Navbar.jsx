import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to determine if user is new
  // This can be customized based on your specific criteria
  const isNewUser = () => {
    if (!user) return true;

    // API returns either "NU" or "SU" roles
    return user.role === "NU";
  };

  // Function to check if current page is dashboard
  const isDashboardPage = () => {
    return location.pathname.startsWith("/dashboard");
  };

  return (
    <>
      <nav
        // className={` bg-black ${
        //   isDashboardPage()
        //     ? " max-w-[1000px] relative xl:max-w-[1150px]  -top-2  "
        //     : "max-w-[1178px] fixed bottom-0 "
        // } overflow-hidden mx-auto  left-0 right-0 p-2 sm:p-4 shadow-lg w-full z-50 flex flex-row flex-nowrap items-center rounded-b-2xl overflow-x-auto`}

        className=" mx-auto max-w-[1000px] relative xl:max-w-[990px]  -top-px  left-0 right-0 p-2 sm:p-4 shadow-lg w-full z-50 flex flex-row flex-nowrap items-center rounded-b-2xl "
        style={{
          background:
            "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
        }}
      >
        <div
          className={`flex items-center justify-between ${
            isNewUser() ? "  lg:px-16 lg:w-[60%]" : "pr-10  lg:w-[68%]"
          }`}
        >
          <Link to="/">
            <div className="flex items-center flex-shrink-0">
              <img
                src="/assets/images/logo-text.png"
                alt="Ginox Icon"
                className="h-6 sm:h-8 w-auto mr-2"
              />
            </div>
          </Link>

          {/* Navigation Icons */}
          <div className="flex flex-row flex-nowrap space-x-4 sm:space-x-6 ">
            <Link
              to="/dashboard"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <img
                className="w-6 h-6 sm:w-6 sm:h-6"
                src="/assets/images/nav1.png"
                alt=""
              />
            </Link>
            <Link
              to="/profile"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <img
                className="w-6 h-6 sm:w-6 sm:h-6"
                src="/assets/images/nav2.png"
                alt=""
              />
            </Link>

            <Link
              to="/wallets"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <img
                className="w-6 h-6 sm:w-6 sm:h-6"
                src="/assets/images/nav3.png"
                alt=""
              />
            </Link>
            {/* Hide /team for new users */}
            {!isNewUser() && (
              <Link
                to="/team"
                className="text-white hover:opacity-80 transition-opacity"
              >
                <img
                  className="w-6 h-6 sm:w-6 sm:h-6"
                  src="/assets/images/nav4.png"
                  alt=""
                />
              </Link>
            )}
            {/* Hide /income for new users */}
            {!isNewUser() && (
              <Link
                to="/income"
                className="text-white hover:opacity-80 transition-opacity"
              >
                <img
                  className="w-6 h-6 sm:w-6 sm:h-6"
                  src="/assets/images/nav5.png"
                  alt=""
                />
              </Link>
            )}
            {/* Hide /buying-history for new users */}
            {!isNewUser() && (
              <Link
                to="/buying-history"
                className="text-white hover:opacity-80 transition-opacity"
              >
                <img
                  className="w-6 h-6 sm:w-6 sm:h-6"
                  src="/assets/images/nav6.png"
                  alt=""
                />
              </Link>
            )}
            <Link
              to="/refer"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <img
                className="w-6 h-6 sm:w-6 sm:h-6"
                src="/assets/images/nav7.png"
                alt=""
              />
            </Link>
            {/* Hide /account-statements for new users */}
            {!isNewUser() && (
              <Link
                to="/account-statements"
                className="text-white hover:opacity-80 transition-opacity"
              >
                <img
                  className="w-6 h-6 sm:w-6 sm:h-6"
                  src="/assets/images/nav8.png"
                  alt=""
                />
              </Link>
            )}
            <Link
              to="/staking-products"
              state={{ initialTab: 2 }}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <img
                className="w-6 h-6 sm:w-6 sm:h-6"
                src="/assets/images/nav9.png"
                alt=""
              />
            </Link>
            {/* VPN Menu - Show for all users */}
            {/* {isNewUser() && (
              <>
                <Link
                  to="/vpn/sell"
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  <img
                    className="w-6 h-6 sm:w-6 sm:h-6"
                    src="/assets/images/vpn-icon.svg"
                    alt="VPN"
                  />
                </Link>

                <Link
                  to="/vpn/customers"
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  <img
                    className="w-6 h-6 sm:w-6 sm:h-6"
                    src="/assets/images/vpn-customers-icon.svg"
                    alt="VPN Customers"
                  />
                </Link>
              </>
            )} */}

            {/* VPN Menu - Show only for SU users */}
            {user && user.role === "SU" && (
              <div className="relative">
                <Link to="/sell-customer-vpn">
                  <button className="text-white hover:opacity-80 transition-opacity">
                    <img
                      className="w-6 h-6 sm:w-6 sm:h-6"
                      src="/assets/images/vpn-icon.svg"
                      alt="VPN"
                    />
                  </button>
                </Link>
                {/* Dropdown Menu */}
                {/* {showDropdown && (
                  <div className="absolute flex flex-col space-y-1 border  border-gray-700 bottom-full mb-2 left-1/2 transform  bg-[#010510] rounded-lg shadow-lg py-2 px-2 min-w-[150px] z-50">
                    <Link to="/vpn/sell">
                      <div className="text-white text-sm py-1 px-2 hover:bg-gray-900 rounded cursor-pointer font-body1">
                        Sell vpn
                      </div>
                    </Link>
                    <div className="h-px w-full bg-gray-800" />
                    <Link to="/vpn/customers">
                      <div className="text-white text-sm py-1 px-2 hover:bg-gray-900 rounded cursor-pointer font-body1">
                        Customer list
                      </div>
                    </Link>
                  </div>
                )} */}
              </div>
            )}
          </div>
        </div>

        <div className=" absolute lg:right-16 -right-7   rounded-b-3xl -top-4 lg:-top-7">
          <img
            src="/footerbar.svg"
            alt="/"
            className="w-[300px] h-10 lg:h-20"
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
