import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import React from "react";
import { BsPersonFill } from "react-icons/bs";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export const GradientChevronRight = ({ size = 18, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={`transition-all duration-300 ${className}`}
    >
      <defs>
        <linearGradient id="gradientStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="9.17%" stopColor="#33A0EA" />
          <stop offset="83.83%" stopColor="#0AC488" />
        </linearGradient>
      </defs>

      {/* Default white path */}
      <path
        d="M9 18L15 12L9 6"
        className="stroke-white group-hover:opacity-0 transition-opacity duration-300"
      />

      {/* Gradient path on hover */}
      <path
        d="M9 18L15 12L9 6"
        stroke="url(#gradientStroke)"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </svg>
  );
};

export const GradientChevronDown = ({
  size = 18,
  className = "",
  isOpen = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={`transition-all duration-300 ${className}`}
    >
      <defs>
        <linearGradient id="gradientChevronStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="9.17%" stopColor="#33A0EA" />
          <stop offset="83.83%" stopColor="#0AC488" />
        </linearGradient>
      </defs>

      {/* Default white path */}
      <path
        d="M6 9L12 15L18 9"
        className={`stroke-white group-hover:opacity-0 transition-opacity duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      />

      {/* Gradient path on hover */}
      <path
        d="M6 9L12 15L18 9"
        stroke="url(#gradientChevronStroke)"
        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      />
    </svg>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [securityDropdownOpen, setSecurityDropdownOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const profileLoading = useSelector((state) => state.auth.profileLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debug logging
  console.log("Navigation - Token:", token ? "Present" : "None");
  console.log("Navigation - User:", user);
  console.log("Navigation - User Role:", user?.role);
  console.log("Navigation - Profile Loading:", profileLoading);

  const servicesRef = useRef();
  const profileDropdownRef = useRef();
  const mobileProfileDropdownRef = useRef();
  const securityDropdownRef = useRef();

  // Function to determine if user is new (same logic as Navbar.jsx)
  const isNewUser = () => {
    if (!user) return true;
    // API returns either "NU" or "SU" roles
    const isNew = user.role === "NU";
    console.log("Navigation - isNewUser:", isNew, "for role:", user.role);
    return isNew;
  };

  useEffect(() => {
    if (!servicesOpen) return;
    function handleClickOutside(event) {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [servicesOpen]);

  useEffect(() => {
    if (!profileDropdownOpen) return;
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        mobileProfileDropdownRef.current &&
        !mobileProfileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  useEffect(() => {
    if (!securityDropdownOpen) return;
    function handleClickOutside(event) {
      if (
        securityDropdownRef.current &&
        !securityDropdownRef.current.contains(event.target)
      ) {
        setSecurityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [securityDropdownOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    setSecurityDropdownOpen(false);
    setIsOpen(false);
    navigate("/");
  };

  // Navigation items - same for both NU and SU users
  const getNavigationItems = () => {
    const navigationItems = [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "/assets/images/nav1.png",
      },
      { label: "Wallets", path: "/wallets", icon: "/assets/images/nav3.png" },
      { label: "Profile", path: "/profile", icon: "/assets/images/nav2.png" },
      { label: "Affiliates", path: "/refer", icon: "/assets/images/nav7.png" },
      {
        label: "Security",
        hasDropdown: true,
        icon: "/assets/images/nav8.png",
        subItems: [
          { label: "Google Authenticator", path: "/profile?tab=googleAuth" },
          { label: "E-Pin", path: "/profile?tab=epin" },
          { label: "Last Logins", path: "/profile?tab=lastLogins" },
        ],
      },
    ];

    console.log(
      "Navigation - Final navigation items:",
      navigationItems.map((item) => item.label)
    );
    return navigationItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="w-full bg-[#010510] z-[999] border-b border-white/10">
      <div className="flex items-center justify-between mx-auto px-6 p-4">
        {/* Logo */}
        <div className="w-[124px] lg:w-[134px] h-[39px]">
          <Link to={"/"}>
            <img src="./logo.svg" alt="logo" className="w-[134px] h-[39px]" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center  md:text-xs lg:text-[16px] md:space-x-4 lg:space-x-10 text-white/70">
          <li className="cursor-pointer">
            <Link className="text-white font-body1" to={"/services-all"}>
              Services
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link className="text-white font-body1" to={"/company-all"}>
              {" "}
              Crypto Box
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link className="text-white font-body1" to={"/lottery-all"}>
              Lottery
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link className="text-white font-body1" to={"/games"}>
              Games
            </Link>
          </li>
        </ul>

        {/* Search + Button */}
        <div className=" flex items-center justify-center space-x-4 lg:space-x-10">
          <div className="flex md:hidden">
            <Search className="w-5   h-5   md:w-5 md:h-5" />
          </div>
          <div className=" hidden md:flex border border-white/10 w-[200px] h-[35px] lg:w-[255px] lg:h-[46px] px-2 items-center rounded-full bg-[#FFFFFF0D]">
            <div className="flex w-10 items-center justify-center">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <input
              type="text"
              className="w-full pl-1  text-sm h-full text-[#DEE2E6] outline-none bg-transparent font-body1"
              placeholder="Search"
            />
          </div>

          {/* Desktop Profile Icon with Dropdown */}
          {token && (
            <div className="relative hidden md:block" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#232A3E] hover:bg-gradient-to-r hover:from-[#33A0EA] hover:to-[#0AC488] transition-colors"
                style={{ marginLeft: "8px" }}
              >
                <BsPersonFill className="text-white h-6 w-6" />
              </button>

              {/* Desktop Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#232A3E] rounded-lg shadow-lg border border-white/10 py-2 z-50">
                  {navigationItems.map((item, index) => (
                    <div key={index}>
                      {item.hasDropdown ? (
                        <div className="relative" ref={securityDropdownRef}>
                          <button
                            onClick={() =>
                              setSecurityDropdownOpen(!securityDropdownOpen)
                            }
                            className="group
                            flex items-center w-full px-4 py-2 text-sm  rounded-md justify-between
                              text-white transition-all duration-300"
                          >
                            <div className="flex items-center">
                              {/* <img
                                src={item.icon}
                                alt={item.label}
                                className="w-5 h-5 mr-3"
                              /> */}
                              <p
                                className=" group-hover:text-transparent 
                              group-hover:bg-clip-text font-body1 group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300"
                              >
                                {item.label}
                              </p>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform  group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] ${
                                securityDropdownOpen
                                  ? "rotate-180 text-white"
                                  : "rotate-0 text-white"
                              }`}
                            />
                          </button>

                          {/* Security Sub-dropdown */}
                          {securityDropdownOpen && (
                            <div className="ml-8 mt-1 border-l border-white/10 pl-2">
                              {item.subItems.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  to={subItem.path}
                                  className="block px-4 py-2 font-body1 text-sm text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-[#33A0EA] hover:to-[#0AC488] hover:text-transparent hover:bg-clip-text transition-all duration-300"
                                  onClick={() => {
                                    setSecurityDropdownOpen(false);
                                    setProfileDropdownOpen(false);
                                  }}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className="flex items-center px-4 py-2 text-sm font-body1 text-white hover:bg-gradient-to-r hover:from-[#33A0EA] hover:to-[#0AC488] hover:text-transparent hover:bg-clip-text transition-all duration-300"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <img
                            src={item.icon}
                            alt={item.label}
                            className="w-5 h-5 mr-3"
                          />
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 font-body1 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <img
                        src="/assets/images/logout.png"
                        alt="Logout"
                        className="w-5 h-5 mr-3"
                      />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Desktop Login Button */}
          {!token && (
            <Link
              to={"/signin"}
              className="w-[90px] h-[35px] lg:w-[117px] lg:h-[44px] text-[#fff] hidden md:flex items-center rounded-full justify-center space-x-0.5 text-sm"
              style={{
                background:
                  "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
              }}
            >
              <BsPersonFill className="text-white h-5 w-5" />
              <p className="font-body1">Log in</p>
            </Link>
          )}

          {/* Mobile Profile Icon with Dropdown */}
          {token && (
            <div className="relative md:hidden" ref={mobileProfileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#232A3E] hover:bg-gradient-to-r hover:from-[#33A0EA] hover:to-[#0AC488] transition-colors font-body1"
                style={{ marginRight: "8px" }}
              >
                <BsPersonFill className="text-white h-6 w-6" />
              </button>

              {/* Mobile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#232A3E] rounded-lg shadow-lg border border-white/10 py-2 z-50 font-body1">
                  {navigationItems.map((item, index) => (
                    <div key={index}>
                      {item.hasDropdown ? (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setSecurityDropdownOpen(!securityDropdownOpen)
                            }
                            className="group flex items-center justify-between w-full px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-[#33A0EA] hover:to-[#0AC488] hover:text-transparent hover:bg-clip-text transition-all duration-300 font-body1"
                          >
                            <div className="flex items-center">
                              <img
                                src={item.icon}
                                alt={item.label}
                                className="w-5 h-5 mr-3"
                              />
                              <p className="group-hover:text-transparent font-body1 group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300">
                                {item.label}
                              </p>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] ${
                                securityDropdownOpen
                                  ? "rotate-180 text-white"
                                  : "rotate-0 text-white"
                              }`}
                            />
                          </button>

                          {/* Security Sub-dropdown */}
                          {securityDropdownOpen && (
                            <div className="ml-8 mt-1 border-l border-white/10 pl-2">
                              {item.subItems.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  to={subItem.path}
                                  className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-[#33A0EA] hover:to-[#0AC488] hover:text-transparent hover:bg-clip-text transition-all duration-300 font-body1"
                                  onClick={() => {
                                    setSecurityDropdownOpen(false);
                                    setProfileDropdownOpen(false);
                                  }}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-[#33A0EA] hover:to-[#0AC488] hover:text-transparent hover:bg-clip-text transition-all duration-300 font-body1"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <img
                            src={item.icon}
                            alt={item.label}
                            className="w-5 h-5 mr-3"
                          />
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 font-body1 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <img
                        src="/assets/images/logout.png"
                        alt="Logout"
                        className="w-5 h-5 mr-3"
                      />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Icon */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 bg-[#010510] h-screen flex flex-col  ">
          <div className="w-full h-[2px] bg-[#FFFFFF1A]" />
          <div className="flex flex-col justify-between h-[90vh] ">
            <div className="flex flex-col mt-4 space-y-3 items-center w-full ">
              <div
                onClick={() => {
                  navigate("/services-all");
                  setIsOpen(false);
                }}
                className="group flex w-full items-center bg-[#03131d] py-3 px-3 rounded-md justify-between text-white hover:bg-[linear-gradient(140.4deg,rgba(51,160,234,0.2),rgba(10,196,136,0.2))] transition-colors duration-300"
              >
                <Link
                  className="text-white font-heading"
                  to={"/services-all"}
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-xs uppercase font-body1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300 ">
                    Services
                  </p>
                </Link>

                <GradientChevronRight />
              </div>
              <div
                onClick={() => {
                  navigate("/company-all");
                  setIsOpen(false);
                }}
                className="group flex w-full items-center bg-[#03131d] py-3 px-3 rounded-md justify-between text-white hover:bg-[linear-gradient(140.4deg,rgba(51,160,234,0.2),rgba(10,196,136,0.2))] transition-colors duration-300"
              >
                <Link
                  className="text-white font-heading"
                  to={"/company-all"}
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-xs uppercase font-body1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300">
                    Crypto Box
                  </p>
                </Link>

                <GradientChevronRight />
              </div>
              <div
                onClick={() => {
                  navigate("/games");
                  setIsOpen(false);
                }}
                className="group flex w-full items-center bg-[#03131d] py-3 px-3 rounded-md justify-between text-white hover:bg-[linear-gradient(140.4deg,rgba(51,160,234,0.2),rgba(10,196,136,0.2))] transition-colors duration-300"
              >
                <Link
                  className="text-white font-heading"
                  to={"/games"}
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-xs uppercase font-body1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300">
                    Games
                  </p>
                </Link>

                <GradientChevronRight />
              </div>
              <div
                onClick={() => {
                  navigate("/lottery-all");
                  setIsOpen(false);
                }}
                className="group flex w-full items-center bg-[#03131d] py-3 px-3 rounded-md justify-between text-white hover:bg-[linear-gradient(140.4deg,rgba(51,160,234,0.2),rgba(10,196,136,0.2))] transition-colors duration-300"
              >
                <Link
                  className="text-white font-heading"
                  to={"/lottery-all"}
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-xs uppercase font-body1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300">
                    Lottery
                  </p>
                </Link>

                <GradientChevronRight />
              </div>

              {!token && (
                <Link
                  to={"/signin"}
                  className="w-[219px] h-[36px] text-white text-center  flex items-center rounded-full justify-center  mt-6 space-x-1 text-sm"
                  style={{
                    background:
                      "linear-gradient(140.4deg, #33A0EA 9.17%, #0AC488 83.83%)",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  <BsPersonFill className="text-white h-5 w-5" />
                  <p className=" text-xs font-body1">Log in</p>
                </Link>
              )}

              {/* Services Dropdown Mobile */}
            </div>

            <div className="flex flex-col space-y-5">
              <div className="w-full h-[2px] bg-[#FFFFFF1A]" />
              <div className="flex items-center justify-center space-x-3">
                <p className="octa text-xs text-[#DEE2E6]">
                  Terms & Conditions
                </p>

                <div className="bg-[#FFFFFF1A] w-[2px] h-full" />
                <p className="octa text-xs text-[#DEE2E6]">Privacy Policy</p>
              </div>

              <div className=" flex w-full items-center text-center  ">
                <p className="text-xs uppercase octa  w-full text-transparent bg-clip-text bg-[linear-gradient(140.4deg,#33A0EA,#0AC488)] transition-all duration-300">
                  @2025 - Copyright Ginox
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
