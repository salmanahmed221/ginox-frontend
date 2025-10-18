import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchProfile } from "../../../../api/auth";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  profileStart,
  profileSuccess,
  profileFailure,
  setError,
  clearCacheForLogin,
} from "../../../../store/authSlice";
import CacheManager from "../../../../utils/cacheManager";
import { SessionManager } from "../../../../utils/sessionManager";
import axios from "../../../../api/axiosConfig";
import { InteractiveGridPattern } from "../../../../components/magicui/interactive-grid-pattern";
import { SparklesCore } from "../../../../components/ui/sparkles";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [showEmail2FAModal, setShowEmail2FAModal] = useState(false);
  const [emailTwoFACode, setEmailTwoFACode] = useState("");
  const [isEmail2FALoading, setIsEmail2FALoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Clear error and cache when component mounts
  useEffect(() => {
    dispatch(setError(null));

    // Clear cache for fresh login attempt
    console.log("🧹 SignIn page: Clearing cache for fresh login...");
    dispatch(clearCacheForLogin());
  }, [dispatch]);

  // Google Login function - triggers Google One Tap or popup to get id_token
  const googleLogin = () => {
    // Set login in progress for Google login too
    SessionManager.setLoginInProgress(true);

    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      // Try One Tap first, fallback to popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap doesn't work, trigger popup
          const popupDiv = document.createElement("div");
          document.body.appendChild(popupDiv);

          window.google.accounts.id.renderButton(popupDiv, {
            theme: "outline",
            size: "large",
            width: 0,
          });

          // Programmatically click the button
          setTimeout(() => {
            const button = popupDiv.querySelector('div[role="button"]');
            if (button) {
              button.click();
            }
            document.body.removeChild(popupDiv);
          }, 100);
        }
      });
    } else {
      console.error("Google Identity Services not loaded");
      // Fallback: try to load Google Identity Services
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => {
        setTimeout(googleLogin, 500);
      };
      document.head.appendChild(script);
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
    if (error) {
      dispatch(setError(null));
    }
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
    if (error) {
      dispatch(setError(null));
    }
  };

  const validate = () => {
    let errs = {};

    // Email validation
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      errs.email = "Please enter a valid email address";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle 2FA verification
  const handle2FAVerification = async () => {
    if (!twoFACode.trim() || twoFACode.length !== 6) {
      dispatch(setError("Please enter a valid 6-digit code"));
      return;
    }

    setIs2FALoading(true);
    dispatch(setError(null));

    try {
      const response = await axios.post("/auth/login/2fa-verify", {
        tempToken: tempToken,
        code: twoFACode,
      });

      const data = response.data;
      console.log("2FA Verification Response:", data);

      if (data.success && data.token) {
        console.log("2FA verification successful");
        dispatch(
          loginSuccess({
            token: data.token,
            user: data.data || null,
            twoFAEnabled: true,
          })
        );

        // Fetch profile data after successful 2FA
        try {
          dispatch(profileStart());
          const profileResponse = await fetchProfile(data.token);
          console.log("Profile API Response after 2FA:", profileResponse);

          if (profileResponse.success && profileResponse.data) {
            console.log("Profile data after 2FA:", profileResponse.data);
            dispatch(profileSuccess(profileResponse.data));
          } else {
            console.warn(
              "Profile fetch failed after 2FA:",
              profileResponse.message
            );
            dispatch(
              profileFailure(
                profileResponse.message || "Failed to fetch profile"
              )
            );
          }
        } catch (profileError) {
          console.error("Profile fetch error after 2FA:", profileError);
          dispatch(
            profileFailure(
              profileError.response?.data?.message || "Failed to fetch profile"
            )
          );
        }

        setShow2FAModal(false);
        setTwoFACode("");
        setTempToken("");
        navigate("/dashboard");
      } else {
        dispatch(setError(data.message || "2FA verification failed"));
      }
    } catch (err) {
      console.error("2FA verification error:", err);
      dispatch(
        setError(err.response?.data?.message || "2FA verification failed")
      );
    } finally {
      setIs2FALoading(false);
      // Clear login progress when 2FA is complete
      SessionManager.setLoginInProgress(false);
    }
  };

  // Handle Email-based 2FA verification (new device/IP)
  const handleEmail2FAVerification = async () => {
    if (!emailTwoFACode.trim() || emailTwoFACode.length !== 6) {
      dispatch(setError("Please enter a valid 6-digit code"));
      return;
    }

    setIsEmail2FALoading(true);
    dispatch(setError(null));

    try {
      const response = await axios.post("/auth/login/email-2fa-verify", {
        tempToken: tempToken,
        code: emailTwoFACode,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      const data = response.data;
      console.log("Email 2FA Verification Response:", data);

      if (data.success && data.token) {
        dispatch(
          loginSuccess({
            token: data.token,
            user: data.data || null,
            // Email-based 2FA verification (403 flow) does not imply app 2FA is enabled
            // Set false so Profile shows 2FA as not set up yet
            twoFAEnabled: false,
          })
        );

        try {
          dispatch(profileStart());
          const profileResponse = await fetchProfile(data.token);
          if (profileResponse.success && profileResponse.data) {
            dispatch(profileSuccess(profileResponse.data));
          } else {
            dispatch(
              profileFailure(
                profileResponse.message || "Failed to fetch profile"
              )
            );
          }
        } catch (profileError) {
          console.error("Profile fetch error after email 2FA:", profileError);
          dispatch(
            profileFailure(
              profileError.response?.data?.message || "Failed to fetch profile"
            )
          );
        }

        setShowEmail2FAModal(false);
        setEmailTwoFACode("");
        setTempToken("");
        navigate("/dashboard");
      } else {
        dispatch(setError(data.message || "Verification failed"));
      }
    } catch (err) {
      console.error("Email 2FA verification error:", err);
      dispatch(setError(err.response?.data?.message || "Verification failed"));
    } finally {
      setIsEmail2FALoading(false);
      // Clear login progress when email 2FA is complete
      SessionManager.setLoginInProgress(false);
    }
  };

  const handleSignInClick = async () => {
    if (!validate()) return;

    // Set login in progress to prevent session validation interference
    SessionManager.setLoginInProgress(true);
    dispatch(loginStart());
    try {
      const data = {
        email: formData.email,
        password: formData.password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      const response = await login(data);
      console.log("Login API Response:", response);

      // Check if 2FA is required
      if (response.success && response.twoFARequired === true) {
        console.log("2FA required, showing modal");
        setTempToken(response.tempToken);
        setShow2FAModal(true);
        dispatch(
          loginSuccess({
            tempToken: response.tempToken,
            twoFAEnabled: true,
          })
        );
        return;
      }

      if (response.success && response.token) {
        console.log("Login successful, user data:", response.data);
        console.log("User role from login:", response.data?.role);
        dispatch(
          loginSuccess({
            token: response.token,
            user: response.data || null,
            twoFAEnabled: response.twoFARequired || false,
          })
        );

        // Now fetch detailed profile data
        try {
          dispatch(profileStart());
          const profileResponse = await fetchProfile(response.token);
          console.log("Profile API Response:", profileResponse);

          if (profileResponse.success && profileResponse.data) {
            console.log("Profile data:", profileResponse.data);
            console.log("User role from profile:", profileResponse.data?.role);
            dispatch(profileSuccess(profileResponse.data));
          } else {
            console.warn("Profile fetch failed:", profileResponse.message);
            dispatch(
              profileFailure(
                profileResponse.message || "Failed to fetch profile"
              )
            );
          }
        } catch (profileError) {
          console.error("Profile fetch error:", profileError);
          dispatch(
            profileFailure(
              profileError.response?.data?.message || "Failed to fetch profile"
            )
          );
        }

        navigate("/dashboard");
      } else {
        dispatch(loginFailure(response.message || "Login failed"));
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      // Show backend message for 401 (e.g., Invalid password) instead of generic login failed
      if (status === 401 && data?.message) {
        dispatch(loginFailure(data.message));
        return;
      }
      // Handle new device/IP email 2FA flow (403 with emailTwoFa)
      if (status === 403 && data?.emailTwoFa === true && data?.tempToken) {
        console.log("Email 2FA required due to new device/IP. Showing modal.");
        setTempToken(data.tempToken);
        setShowEmail2FAModal(true);
        dispatch(setError(null));
        // Ensure global loading is turned off so Sign In button is re-enabled
        dispatch(loginFailure(null));
        return;
      }
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    } finally {
      // Always clear login progress state when done
      SessionManager.setLoginInProgress(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log("=== GOOGLE AUTHENTICATION START ===");
      console.log("Complete Google Credential Response:", credentialResponse);
      console.log("ID Token:", credentialResponse.credential);

      const idToken = credentialResponse.credential;

      console.log("=== PREPARING API CALL ===");
      console.log("ID Token to send:", idToken);

      // Call your API with id_token and timezone
      const response = await axios.post("/auth/register-with-google", {
        id_token: idToken,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      const data = await response.data;

      console.log("=== BACKEND API RESPONSE ===");
      console.log("Complete Response:", response);
      console.log("Response Data:", data);
      console.log("Success Status:", data.success);
      console.log("Token:", data.token);
      console.log("User Data:", data.data);

      // Check if 2FA is required for Google login
      if (data.success && data.twoFARequired === true) {
        console.log("2FA required for Google login, showing modal");
        setTempToken(data.tempToken);
        setShow2FAModal(true);
        dispatch(loginSuccess({ tempToken: data.tempToken }));
        return;
      }

      if (data.success && data.token) {
        dispatch(
          loginSuccess({
            token: data.token,
            user: data.data || null,
            twoFAEnabled: data.twoFARequired || false,
          })
        );

        // Also fetch profile data for Google login
        try {
          console.log("=== FETCHING PROFILE DATA ===");
          dispatch(profileStart());
          const profileResponse = await fetchProfile(data.token);
          console.log("Google Profile API Response:", profileResponse);
          console.log("Profile Success:", profileResponse.success);
          console.log("Profile Data:", profileResponse.data);

          if (profileResponse.success && profileResponse.data) {
            console.log("Profile fetch successful, dispatching profile data");
            dispatch(profileSuccess(profileResponse.data));
          } else {
            console.warn(
              "Google Profile fetch failed:",
              profileResponse.message
            );
            dispatch(
              profileFailure(
                profileResponse.message || "Failed to fetch profile"
              )
            );
          }
        } catch (profileError) {
          console.error("Google Profile fetch error:", profileError);
          console.error("Profile Error Details:", profileError.response?.data);
          dispatch(
            profileFailure(
              profileError.response?.data?.message || "Failed to fetch profile"
            )
          );
        }

        console.log("=== GOOGLE LOGIN SUCCESS ===");
        console.log("Navigating to dashboard...");
        navigate("/dashboard");
      } else {
        console.error("=== GOOGLE LOGIN FAILED ===");
        console.error("Backend returned success: false");
        console.error("Message:", data.message);
        dispatch(loginFailure(data.message || "Google login failed"));
      }
    } catch (err) {
      console.error("=== GOOGLE LOGIN ERROR ===");
      console.error("Complete Error:", err);
      console.error("Error Message:", err.message);
      console.error("Error Response:", err.response?.data);
      console.error("Error Status:", err.response?.status);
      dispatch(loginFailure("Google login failed"));
    } finally {
      // Always clear login progress state when done
      SessionManager.setLoginInProgress(false);
    }
  };

  // Create different transitions for each path to animate one by one
  const createPathTransition = (delay = 0) => ({
    duration: 30, // Extremely slow animation
    repeat: Infinity,
    repeatType: "loop",
    ease: "linear",
    repeatDelay: 2,
    delay: delay,
  });

  return (
    <div className="min-h-screen  w-screen flex flex-col items-center justify-center  relative">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="06101A"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="absolute inset-0 opacity-50 w-screen h-screen z-0">
        <InteractiveGridPattern
          width={100}
          height={100}
          squares={[50, 30]}
          className="w-screen h-screen"
          squaresClassName="stroke-gray-400/20 fill-transparent hover:fill-gray-300/30"
        />
      </div>
      {/* bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end */}
      <div className="flex flex-col items-center w-full max-w-[530px] mx-auto relative z-20">
        {/* Logo and Main Title */}
        <div className="flex flex-col items-center mb-6 md:mb-5">
          <img
            src="/assets/images/logo.png"
            alt="Ginox Logo"
            className="h-16 md:h-24 mb-4 md:mb-2"
          />
          <h1 className="text-2xl md:text-3xl font-header text-text_primary tracking-wider text-center">
            SIGN IN TO GINOX
          </h1>
        </div>

        <div className="w-full max-w-lg  bg-card_background rounded-[20px] shadow-2xl p-6 md:p-10 mx-auto border border-gray_line">
          {error && (
            <div className="w-full text-center text-red-500 text-sm font-semibold mb-4">
              {error}
            </div>
          )}
          {/* Username or Email Input */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-body1 text-text_secondary mb-2"
            >
              Username or Email
            </label>
            <div className="relative flex flex-col">
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-2 pl-10 font-body1 rounded-full bg-input_background border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                  placeholder="Username or email"
                  required
                />
                <img
                  src="/assets/images/profile.png"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  alt="profile icon"
                />
              </div>
              {errors.email && (
                <div className="text-red-500 text-xs mt-1 ml-3 font-body1">
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-body1 text-text_secondary mb-2"
            >
              Password
              <Link
                to="/forgot-password"
                className="float-right font-body1 text-sm hover:opacity-80 transition-opacity bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text text-transparent"
              >
                Forgot Password?
              </Link>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 pl-10 pr-10 font-body1 rounded-full bg-input_background border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="Password"
                required
              />
              {errors.password && (
                <div className="text-red-500 text-xs mt-1 font-body1">
                  {errors.password}
                </div>
              )}
              <img
                src="/assets/images/lock.png"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                alt="lock icon"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 font-body1 text-text_secondary hover:text-link_color"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.052m1.026 1.026A3.945 3.945 0 0012 13.923a3.945 3.945 0 003.416-1.579m-3.416 1.579l-1.026 1.026m3.416-1.579c.642.642 1.57.994 2.585.994s1.943-.352 2.585-.994m-2.585.994l1.026-1.026m-1.026-1.026c.642-.642 1.57-.994 2.585-.994s1.943.352 2.585.994m-2.585-.994l1.026 1.026M19 12a10.045 10.045 0 01-3.563 2.572M12 4a9.948 9.948 0 014.24 1.157"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="button"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-full text-white font-semibold mb-6 flex font-body1 items-center justify-center
                       bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end
                       transition-opacity duration-300 ${
                         loading
                           ? "opacity-50 cursor-not-allowed"
                           : "hover:opacity-90"
                       }`}
            onClick={handleSignInClick}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* OR Separator */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray_line"></div>
            <span className="mx-4 text-text_secondary text-sm sm:text-lg font-header">
              OR
            </span>
            <div className="flex-grow border-t border-gray_line"></div>
          </div>
          <div className="text-center mb-4">
            <span className="mx-4 text-text_secondary text-sm sm:text-xl font-header">
              REGISTER WITH
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Google */}
            <button
              className="flex items-center  justify-center py-3 px-4 rounded-full border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body1"
              onClick={() => {
                googleLogin();
              }}
              type="button"
            >
              <img
                src="/assets/images/google-icon.png"
                alt="Google icon"
                className="w-4 h-4 mr-2"
              />
              Google
            </button>
            {/* Telegram */}
            <button className="flex items-center justify-center py-3 px-4 rounded-full border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body1">
              <img
                src="/assets/images/telegram.png"
                alt="Telegram icon"
                className="w-4 h-4 mr-2"
              />
              Telegram
            </button>
          </div>

          {/* Wallet Connect Button */}
          <div className="mb-8">
            <button
              className="w-full flex items-center justify-center py-3 px-4 rounded-full border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body1"
              onClick={() => {
                // Add wallet connect logic here
                console.log("Wallet connect clicked");
              }}
              type="button"
            >
              <img
                src="/walletconnect.svg"
                alt="WalletConnect icon"
                className="w-4 h-4 mr-2"
              />
              Connect Wallet
            </button>
          </div>

          {/* Register Now */}
          <p className="text-center text-text_secondary text-sm font-body1">
            New to Ginox?{"   "}
            <Link
              to="/register"
              className="bg-gradient-to-r from-[#33A0EA] to-[#0AC488] bg-clip-text font-body1 text-transparent font-semibold hover:opacity-80 transition-opacity"
            >
              Register now
            </Link>
          </p>
        </div>
        {/* Links and Language Select Row below the sign-in box */}
        <div className="w-full max-w-lg mx-auto flex flex-row justify-between items-center mt-6">
          <div className="flex flex-wrap gap-4 md:gap-6 text-text_secondary text-sm font-body1">
            <Link
              to="/terms"
              className="text-[#64748B] hover:opacity-80 transition-opacity font-body1"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-[#64748B] hover:opacity-80 transition-opacity font-body1"
            >
              Privacy
            </Link>
            <Link
              to="/docs"
              className="text-[#64748B] hover:opacity-80 transition-opacity font-body1"
            >
              Docs
            </Link>
            <Link
              to="/help"
              className="text-[#64748B] hover:opacity-80 transition-opacity font-body1"
            >
              Helps
            </Link>
          </div>
          <div className="flex items-center text-text_secondary text-sm font-body">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0112 15.111C14.485 14.004 16.917 13 19 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6c2.083 0 4.515 1.004 7 2.111z"
              />
            </svg>
            <select className="bg-transparent border-none text-text_secondary text-sm font-body1 focus:outline-none">
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2FA Verification Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-card_background rounded-[20px] p-6 md:p-8 max-w-md w-full mx-4 border border-gray_line">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-header text-text_primary mb-2">
                Two-Factor Authentication
              </h2>
              <p className="text-text_secondary text-sm font-body1">
                Please enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-header text-text_secondary mb-2">
                6-Digit Code
              </label>
              <input
                type="text"
                value={twoFACode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setTwoFACode(value);
                }}
                className="w-full px-4 py-3 font-body1 rounded-full bg-input_background border border-input_border text-text_primary text-center text-lg focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-center text-red-500 text-sm font-semibold mb-4 font-body1">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShow2FAModal(false);
                  setTwoFACode("");
                  setTempToken("");
                  dispatch(setError(null));
                  // Ensure Sign In button is enabled after cancel
                  dispatch(loginFailure(null));
                  // Clear login progress when cancelled
                  SessionManager.setLoginInProgress(false);
                }}
                className="flex-1 py-3 px-4 rounded-full font-body1 border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={is2FALoading || twoFACode.length !== 6}
                onClick={handle2FAVerification}
                className={`flex-1 py-3 px-4 rounded-full font-body1 text-white font-semibold text-sm
                           bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end
                           transition-opacity duration-300 ${
                             is2FALoading || twoFACode.length !== 6
                               ? "opacity-50 cursor-not-allowed"
                               : "hover:opacity-90"
                           }`}
              >
                {is2FALoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email 2FA Verification Modal (New device/IP) */}
      {showEmail2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-card_background rounded-[20px] p-6 md:p-8 max-w-md w-full mx-4 border border-gray_line">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-header text-text_primary mb-2">
                Verify Your Email
              </h2>
              <p className="text-text_secondary text-sm font-body1">
                New device or IP detected. Please enter the 6-digit code sent to
                your email.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-header text-text_secondary mb-2">
                6-Digit Code
              </label>
              <input
                type="text"
                value={emailTwoFACode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setEmailTwoFACode(value);
                }}
                className="w-full px-4  py-3 rounded-full bg-input_background border border-input_border text-text_primary text-center text-lg font-body1 focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-center text-red-500 text-sm font-semibold mb-4 font-body1">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowEmail2FAModal(false);
                  setEmailTwoFACode("");
                  setTempToken("");
                  dispatch(setError(null));
                  // Ensure Sign In button is enabled after cancel
                  dispatch(loginFailure(null));
                  // Clear login progress when cancelled
                  SessionManager.setLoginInProgress(false);
                }}
                className="flex-1 py-3 px-4 rounded-full font-body1 border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isEmail2FALoading || emailTwoFACode.length !== 6}
                onClick={handleEmail2FAVerification}
                className={`flex-1 py-3 px-4 rounded-full font-body1 text-white font-semibold text-sm
                           bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end
                           transition-opacity duration-300 ${
                             isEmail2FALoading || emailTwoFACode.length !== 6
                               ? "opacity-50 cursor-not-allowed"
                               : "hover:opacity-90"
                           }`}
              >
                {isEmail2FALoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
