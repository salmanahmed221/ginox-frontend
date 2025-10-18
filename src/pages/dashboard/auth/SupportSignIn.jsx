import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../../../api/auth";
import {
  loginStart,
  loginSuccess,
  profileStart,
  profileSuccess,
  profileFailure,
} from "../../../store/authSlice";
import { InteractiveGridPattern } from "../../../components/magicui/interactive-grid-pattern";
import { SparklesCore } from "../../../components/ui/sparkles";

const SupportSignIn = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Initializing...");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const performSupportSignIn = async () => {
      try {
        setStatus("Reading parameters...");

        // Extract parameters from URL
        const name = searchParams.get("name");
        const username = searchParams.get("username");
        const email = searchParams.get("email");
        const token = searchParams.get("token");
        const role = searchParams.get("role");

        // Validate required parameters
        if (!token) {
          throw new Error("Token is required for support sign-in");
        }

        if (!email) {
          throw new Error("Email is required for support sign-in");
        }

        setStatus("Preparing user data...");

        // Create user object from parameters
        const userData = {
          name: name || "",
          username: username || email, // fallback to email if username not provided
          email: email,
          role: role || "user",
        };

        setStatus("Saving user details...");

        // Save user details to localStorage
        localStorage.setItem(
          "supportSignInData",
          JSON.stringify({
            token,
            user: userData,
            timestamp: new Date().toISOString(),
          })
        );

        setStatus("Authenticating with token...");

        // Start login process
        dispatch(loginStart());

        // Use the provided token to sign in
        dispatch(loginSuccess({ token, user: userData }));

        setStatus("Fetching user profile...");

        // Fetch detailed profile data using the token
        try {
          dispatch(profileStart());
          const profileResponse = await fetchProfile(token);

          if (profileResponse.success && profileResponse.data) {
            console.log("Support Sign-In - Profile data:", profileResponse.data);
            dispatch(profileSuccess(profileResponse.data));

            setStatus("Sign-in successful! Redirecting...");

            // Wait a moment to show success message, then redirect
            setTimeout(() => {
              navigate("/dashboard");
            }, 1500);
          } else {
            console.warn(
              "Support Sign-In - Profile fetch failed:",
              profileResponse.message
            );
            // Even if profile fetch fails, we can still proceed with basic user data
            setStatus("Sign-in completed! Redirecting...");
            setTimeout(() => {
              navigate("/dashboard");
            }, 1500);
          }
        } catch (profileError) {
          console.error("Support Sign-In - Profile fetch error:", profileError);
          // Still proceed even if profile fetch fails
          dispatch(
            profileFailure(
              profileError.response?.data?.message || "Failed to fetch profile"
            )
          );

          setStatus("Sign-in completed! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } catch (err) {
        console.error("Support Sign-In Error:", err);
        setError(err.message || "Failed to perform support sign-in");
        setStatus("Error occurred");
        setLoading(false);
      }
    };

    // Add a small delay to show the loading animation
    const timer = setTimeout(() => {
      performSupportSignIn();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center relative">
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

      <div className="flex flex-col items-center w-full max-w-[530px] mx-auto relative z-20">
        {/* Logo and Main Title */}
        <div className="flex flex-col items-center mb-6 md:mb-10">
          <img
            src="/assets/images/logo.png"
            alt="Ginox Logo"
            className="h-16 md:h-24 mb-4 md:mb-6"
          />
          <h1 className="text-2xl md:text-4xl font-header text-text_primary tracking-wider text-center">
            SUPPORT SIGN IN
          </h1>
          <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3 mt-4">
            <p className="text-orange-400 font-medium text-sm">
              You have 15 minutes access for this login
            </p>
          </div>
        </div>

        <div className="w-full max-w-lg bg-card_background rounded-[20px] shadow-2xl p-6 md:p-10 mx-auto border border-gray_line">
          {error ? (
            <div className="text-center">
              <div className="w-full text-center text-red-500 text-sm font-body1 mb-4">
                {error}
              </div>
              <button
                onClick={() => navigate("/signin")}
                className="w-full py-2 px-4 rounded-full text-white font-body1 bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <div className="text-center">
              {/* Loading Animation */}
              <div className="flex justify-center mb-6">
                <svg
                  className="animate-spin h-12 w-12 text-link_color"
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
              </div>

              {/* Status Text */}
              <div className="text-text_primary text-lg font-body1 mb-2">
                Processing Support Sign-In
              </div>
              <div className="text-text_secondary text-sm mb-6">{status}</div>

              {/* Progress Bar */}
              <div className="w-full bg-gray_line rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end h-2 rounded-full animate-pulse"></div>
              </div>

              <div className="text-text_secondary text-xs">
                Please wait while we authenticate your session...
              </div>
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="w-full max-w-lg mx-auto flex flex-row justify-center items-center mt-6">
          <div className="flex flex-wrap gap-4 md:gap-6 text-text_secondary text-sm font-body1">
            <button
              onClick={() => navigate("/signin")}
              className="text-[#64748B] hover:opacity-80 transition-opacity font-body1"
            >
              Regular Sign In
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-[#64748B] hover:opacity-80 transition-opacity font-body1"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSignIn;
