import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../../api/auth";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  setError,
} from "../../../../store/authSlice";
import axios from "../../../../api/axiosConfig";
import { motion } from "framer-motion";
import { SparklesCore } from "../../../../components/ui/sparkles";
import { InteractiveGridPattern } from "../../../../components/magicui/interactive-grid-pattern";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [storedVerificationCode, setStoredVerificationCode] = useState(""); // Store verification code from API
  const [tempToken, setTempToken] = useState(""); // Store tempToken from API
  const [searchParams] = useSearchParams();
  const hasRefParam = searchParams.get("ref") !== null;

  // Clear error when component mounts
  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

  // Handle referral parameter from URL
  useEffect(() => {
    const referralId = searchParams.get("ref");
    if (referralId) {
      setForm((prevForm) => ({
        ...prevForm,
        sponsor_id: referralId,
      }));
    }
  }, [searchParams]);

  const totalSteps = hasRefParam ? 4 : 5; // Personal, Email, Verification, Welcome, Finish (skip sponsor step if ref exists)

  // Enhanced validation check for current step
  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      return (
        form.name &&
        form.name.trim().length >= 2 &&
        form.surname &&
        form.surname.trim().length >= 2
      );
    }

    if (currentStep === 2) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return (
        form.email &&
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) &&
        form.password &&
        passwordRegex.test(form.password)
      );
    }

    if (currentStep === 3) {
      // Validate verification code is 6 digits
      return (
        form.verificationCode &&
        form.verificationCode.trim().length === 6 &&
        /^\d{6}$/.test(form.verificationCode.trim())
      );
    }

    if (currentStep === 4) {
      // Step 4 is optional (sponsor ID), so it's always valid
      // But if ref param exists, this step should be skipped
      return true;
    }

    // When ref param exists, step 4 becomes the final step (terms)
    if (hasRefParam && currentStep === 4) {
      return form.termsAccepted;
    }

    if (currentStep === 5) {
      return form.termsAccepted;
    }

    return false;
  };

  // Enhanced handleNext function with better validation
  const handleNext = async () => {
    // Clear previous errors and messages
    setApiError("");
    setApiMessage("");

    // Step 2: Check if email exists before proceeding
    if (currentStep === 2) {
      if (!validateStep()) {
        setApiError(
          "Please fill in all required fields correctly before proceeding."
        );
        return;
      }
      if (!isCurrentStepValid()) {
        setApiError("Please complete all required fields before proceeding.");
        return;
      }
      try {
        const res = await axios.get(
          `/auth/email-exists?email=${encodeURIComponent(form.email)}`
        );
        if (res.data && res.data.exists === true) {
          setApiError("Email already exists.");
          return;
        }
        // If exists is false (even if success is false), proceed
        setCurrentStep(currentStep + 1);
      } catch (err) {
        // Handle 400 status with exists: true
        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data &&
          err.response.data.exists === true
        ) {
          setApiError("Email already exists.");
          return;
        }

        // If API returns a non-2xx but exists is false, proceed
        if (
          err.response &&
          err.response.data &&
          err.response.data.exists === false
        ) {
          setCurrentStep(currentStep + 1);
          return;
        }
        setApiError("Failed to check email existence. Please try again.");
      }
      return;
    }

    // Step 3: Verify the verification code is 6 digits
    if (currentStep === 3) {
      if (!validateStep()) {
        setApiError(
          "Please enter a valid 6-digit verification code before proceeding."
        );
        return;
      }
      if (!isCurrentStepValid()) {
        setApiError(
          "Please enter a valid 6-digit verification code to proceed."
        );
        return;
      }
      // If ref param exists, skip step 4 (sponsor) and go directly to step 5 (terms)
      if (hasRefParam) {
        setCurrentStep(5);
      } else {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    // Step 4: Sponsor check (only if sponsor_id is filled and Next is clicked)
    if (currentStep === 4) {
      if (isSponsorIdValid) {
        try {
          const res = await axios.get(
            `/auth/sponsor-exists?sponsor_id=${encodeURIComponent(
              form.sponsor_id
            )}`
          );
          if (res.data && res.data.exists === true) {
            setCurrentStep(currentStep + 1);

            return;
          }
          setApiError("Sponsor ID not exists.");

          return;
        } catch (err) {
          // If API returns a non-2xx but exists is true, proceed
          if (
            err.response &&
            err.response.data &&
            err.response.data.exists === true
          ) {
            setCurrentStep(currentStep + 1);

            return;
          }
          // If exists is false, show error
          if (
            err.response &&
            err.response.data &&
            err.response.data.exists === false
          ) {
            setApiError("Sponsor ID not exists.");

            return;
          }
          setApiError("Failed to check sponsor existence. Please try again.");
        }
        return;
      } else {
        // If sponsor is not filled, treat as skip
        setCurrentStep(currentStep + 1);
        return;
      }
    }

    // Validate current step for other steps
    if (!validateStep()) {
      setApiError(
        "Please fill in all required fields correctly before proceeding."
      );
      return;
    }

    // For other steps, proceed if validation passes
    if (isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    } else {
      setApiError("Please complete all required fields before proceeding.");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Clear stored verification code and tempToken when going back to step 2
      if (currentStep === 3) {
        setStoredVerificationCode("");
        setTempToken("");
        setForm({ ...form, verificationCode: "" });
      }

      // If we're on step 5 and ref param exists, go back to step 3 (skip step 4)
      if (currentStep === 5 && hasRefParam) {
        setCurrentStep(3);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Add state for form fields
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    sponsor_id: "",
    verificationCode: "",
    termsAccepted: false,
    timeZone: new Date(),
  });

  // Validation logic for each step
  const validateStep = () => {
    let stepErrors = {};

    if (currentStep === 1) {
      if (!form.name || form.name.trim().length < 2) {
        stepErrors.name = "Name is required (minimum 2 characters)";
      }
      if (!form.surname || form.surname.trim().length < 2) {
        stepErrors.surname = "Surname is required (minimum 2 characters)";
      }
    }

    if (currentStep === 2) {
      if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        stepErrors.email = "Valid email is required";
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!form.password || !passwordRegex.test(form.password)) {
        stepErrors.password =
          "Password must have at least 8 characters, 1 uppercase, 1 lowercase and 1 number";
      }
    }

    if (currentStep === 3) {
      if (!form.verificationCode || form.verificationCode.trim().length !== 6) {
        stepErrors.verificationCode =
          "Verification code must be exactly 6 digits";
      } else if (!/^\d{6}$/.test(form.verificationCode.trim())) {
        stepErrors.verificationCode =
          "Verification code must contain only numbers";
      }
    }

    if (currentStep === 5) {
      if (!form.termsAccepted) {
        stepErrors.terms =
          "You must accept the terms and conditions to proceed";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Real-time validation function
  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    if (fieldName === "name") {
      if (!value || value.trim().length < 2) {
        fieldErrors.name = "Name is required (minimum 2 characters)";
      } else {
        delete fieldErrors.name;
      }
    }

    if (fieldName === "surname") {
      if (!value || value.trim().length < 2) {
        fieldErrors.surname = "Surname is required (minimum 2 characters)";
      } else {
        delete fieldErrors.surname;
      }
    }

    if (fieldName === "email") {
      if (!value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        fieldErrors.email = "Valid email is required";
      } else {
        delete fieldErrors.email;
      }
    }

    if (fieldName === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!value || !passwordRegex.test(value)) {
        fieldErrors.password =
          "Password must have at least 8 characters, 1 uppercase, 1 lowercase and 1 number";
      } else {
        delete fieldErrors.password;
      }
    }

    if (fieldName === "verificationCode") {
      if (!value || value.trim().length !== 6) {
        fieldErrors.verificationCode =
          "Verification code must be exactly 6 digits";
      } else if (!/^\d{6}$/.test(value.trim())) {
        fieldErrors.verificationCode =
          "Verification code must contain only numbers";
      } else {
        delete fieldErrors.verificationCode;
      }
    }

    setErrors(fieldErrors);
  };

  // Enhanced sendVerificationCode function
  const sendVerificationCode = async () => {
    setApiMessage("");
    setApiError("");

    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setApiError(
        "Please enter a valid email address before sending verification code."
      );
      return;
    }

    try {
      const res = await axios.post("/auth/send-verification-code", {
        email: form.email,
      });
      const data = await res.data;
      if (data.success) {
        // Store the verification code from API response
        if (data.data && data.data.verificationCode) {
          setStoredVerificationCode(data.data.verificationCode);
        }
        // Store the tempToken from API response
        if (data.tempToken) {
          setTempToken(data.tempToken);
        }
        setApiMessage(
          "Verification code sent successfully! Please check your email."
        );
      } else {
        setApiError(
          data.message || "Failed to send verification code. Please try again."
        );
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Failed to send verification code. Please try again."
      );
    }
  };

  // Enhanced handleRegister function
  const handleRegister = async () => {
    setApiMessage("");
    setApiError("");

    // Final validation check
    if (!validateStep()) {
      setApiError(
        "Please accept the terms and conditions to complete registration."
      );
      return;
    }

    if (!form.termsAccepted) {
      setApiError(
        "You must accept the terms and conditions to create an account."
      );
      return;
    }

    // Check if tempToken is available
    if (!tempToken) {
      setApiError(
        "Verification token not found. Please send verification code again."
      );
      return;
    }

    try {
      // Prepare register payload with tempToken
      const registerPayload = {
        ...form,
        tempToken: tempToken,
        verificationCode: form.verificationCode,
      };

      const response = await register(registerPayload);
      if (response.success) {
        setApiMessage("Registration successful! Redirecting to sign in...");
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        setApiError(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Registration failed. Please check your information and try again."
      );
    }
  };

  // Google Login function - triggers Google One Tap or popup to get id_token
  const googleLogin = () => {
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

      if (data.success && data.token) {
        dispatch(
          registerSuccess({ token: data.token, user: data.data || null })
        );

        console.log("=== GOOGLE REGISTER SUCCESS ===");
        console.log("Navigating to home page...");
        navigate("/");
      } else {
        console.error("=== GOOGLE REGISTER FAILED ===");
        console.error("Backend returned success: false");
        console.error("Message:", data.message);
        dispatch(registerFailure(data.message || "Google register failed"));
      }
    } catch (err) {
      console.error("=== GOOGLE REGISTER ERROR ===");
      console.error("Complete Error:", err);
      console.error("Error Message:", err.message);
      console.error("Error Response:", err.response?.data);
      console.error("Error Status:", err.response?.status);
      dispatch(registerFailure("Google register failed"));
    }
  };

  // Helper to check valid sponsor ID (for demo, valid if length >= 3)
  const isSponsorIdValid =
    form.sponsor_id && form.sponsor_id.trim().length >= 3;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Input fields */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-body1 text-text_secondary mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 font-body1 rounded-full bg-input_background border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="Enter Your Name Here"
                required
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  validateField("name", e.target.value);
                }}
              />
              {errors.name && (
                <div className="text-red-500 text-xs mt-1 font-body1">
                  {errors.name}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="surname"
                className="block text-sm font-body1 text-text_secondary mb-2"
              >
                Surname
              </label>
              <input
                type="text"
                id="surname"
                className="w-full px-4 py-2 font-body1 rounded-full bg-input_background border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="Enter Your Surname"
                required
                value={form.surname}
                onChange={(e) => {
                  setForm({ ...form, surname: e.target.value });
                  validateField("surname", e.target.value);
                }}
              />
              {errors.surname && (
                <div className="text-red-500 text-xs mt-1 font-body1">
                  {errors.surname}
                </div>
              )}
            </div>
            {/* Navigation Buttons for step 1 */}
            {renderNavigationButtons()}
            {/* Register with section for step 1 */}
            <div className="mt-8">
              <div className="text-center mb-4">
                <span className="mx-4 text-text_secondary text-sm sm:text-xl font-header">
                  REGISTER WITH
                </span>
              </div>
              <div className="flex flex-row gap-4 justify-center">
                <button
                  className="w-full  flex items-center justify-center py-3 px-4 rounded-full border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body1"
                  onClick={() => googleLogin()}
                  type="button"
                >
                  <img
                    src="/assets/images/google-icon.png"
                    alt="Google icon"
                    className="w-4 h-4 mr-2"
                  />
                  Google
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Input fields */}
            <div className="mb-6">
              <label
                htmlFor="email-address"
                className="block text-sm font-body1 text-text_secondary mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email-address"
                className="w-full px-4 py-2 rounded-full font-body1 bg-input_background border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="Enter Your Email Here"
                required
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  validateField("email", e.target.value);
                }}
              />
              {errors.email && (
                <div className="text-red-500 text-xs mt-1 font-body1">
                  {errors.email}
                </div>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-body1 text-text_secondary mb-2"
              >
                Password
              </label>
              <input
                type="text"
                id="password"
                className="w-full px-4 py-2 font-body1 rounded-full bg-input_background border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="Enter Your Password Here"
                required
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  validateField("password", e.target.value);
                }}
              />
              {errors.password && (
                <div className="text-red-500 text-xs mt-1 font-body1">
                  {errors.password}
                </div>
              )}
            </div>
            {/* Navigation Buttons for step 2 */}
            {renderNavigationButtons()}
            {/* Register with section for step 2 */}
            <div className="mt-8">
              <div className="text-center mb-4">
                <span className="mx-4 text-text_secondary text-sm sm:text-xl font-header">
                  REGISTER WITH
                </span>
              </div>
              <div className="flex flex-row gap-4 justify-center">
                <button
                  className="w-full flex items-center justify-center py-3 px-4 rounded-full border border-input_border bg-input_background text-text_primary hover:bg-gray-700 transition-colors text-sm font-body1"
                  onClick={() => googleLogin()}
                  type="button"
                >
                  <img
                    src="/assets/images/google-icon.png"
                    alt="Google icon"
                    className="w-4 h-4 mr-2"
                  />
                  Google
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <label
                htmlFor="verification-code"
                className="block text-sm font-body1 text-text_secondary mb-2"
              >
                Email Verification Code
              </label>
              <input
                type="text"
                id="verification-code"
                className={`w-full px-4 py-2 font-body1 rounded-full bg-input_background border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color ${
                  form.verificationCode.trim().length === 6 &&
                  /^\d{6}$/.test(form.verificationCode.trim())
                    ? "border-green-500"
                    : "border-input_border"
                }`}
                placeholder="Enter 6-digit Verification Code"
                required
                value={form.verificationCode}
                onChange={(e) => {
                  setForm({ ...form, verificationCode: e.target.value });
                  validateField("verificationCode", e.target.value);
                }}
              />
              {errors.verificationCode && (
                <div className="text-red-500 text-xs mt-1 font-body1">
                  {errors.verificationCode}
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  className="text-sm font-body1 text-help_link_green hover:opacity-80 transition-opacity"
                >
                  {storedVerificationCode ? "Resend Code" : "Send Code"}
                </button>
              </div>
            </div>
            {/* Navigation Buttons for step 3 */}
            {renderNavigationButtons()}
          </div>
        );
      case 4:
        // If ref param exists, show terms step instead of sponsor step
        if (hasRefParam) {
          return (
            <div className="space-y-6">
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2"
                  checked={form.termsAccepted}
                  onChange={(e) =>
                    setForm({ ...form, termsAccepted: e.target.checked })
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-body1 text-text_secondary"
                >
                  Accept our{" "}
                  <Link
                    to="/terms"
                    className="bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end bg-clip-text text-transparent hover:opacity-80 transition-opacity font-body1"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end bg-clip-text text-transparent hover:opacity-80 transition-opacity font-body1"
                  >
                    Privacy Policy
                  </Link>{" "}
                  To Continue
                </label>
              </div>
              {errors.terms && (
                <div className="text-red-500 text-xs mt-1 mb-4">
                  {errors.terms}
                </div>
              )}
              <div className="mb-6 flex items-center">
                <input type="checkbox" id="marketing" className="mr-2" />
                <label
                  htmlFor="marketing"
                  className="text-sm font-body1 text-text_secondary"
                >
                  Clicking the unsubscribe link at the bottom of our Marketing
                  Emails{" "}
                </label>
              </div>
            </div>
          );
        }

        // Original sponsor step when no ref param
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <label
                htmlFor="sponsor-id"
                className="block text-sm font-body1 text-text_secondary mb-2"
              >
                Sponsor ID
              </label>
              <input
                type="text"
                id="sponsor-id"
                className="w-full px-4 py-2 font-body1 rounded-full bg-input_background border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                placeholder="Optional"
                value={form.sponsor_id}
                onChange={(e) =>
                  setForm({ ...form, sponsor_id: e.target.value })
                }
              />
            </div>
            {/* Buttons row: Previous, Next and Skip for sponsor step */}
            <div className="flex justify-between gap-4 mt-8">
              <button
                type="button"
                className="py-3 px-6 rounded-3xl font-body1 text-white font-semibold bg-[#000] border border-gray_line hover:opacity-90 transition-opacity duration-300 flex items-center"
                onClick={handlePrevious}
              >
                <img
                  className="w-6 h-5 mr-2"
                  src="/assets/images/previous-icon.png"
                />
                Previous
              </button>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`py-3 px-6 rounded-3xl font-body1 text-white font-semibold bg-[#000] border border-gray_line hover:opacity-90 transition-opacity duration-300 flex items-center ${
                    !isSponsorIdValid ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleNext}
                  disabled={isSponsorIdValid}
                >
                  Skip
                </button>
                <button
                  type="button"
                  className={`py-3 px-6 rounded-3xl font-body1 text-white font-semibold bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity duration-300 flex items-center ${
                    isSponsorIdValid ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleNext}
                  disabled={!isSponsorIdValid}
                >
                  Next
                  <img
                    className="w-6 h-5 ml-2"
                    src="/assets/images/next-icon.png"
                  />
                </button>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                checked={form.termsAccepted}
                onChange={(e) =>
                  setForm({ ...form, termsAccepted: e.target.checked })
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-body1 text-text_secondary"
              >
                Accept our{" "}
                <Link
                  to="/terms"
                  className="bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end bg-clip-text text-transparent hover:opacity-80 transition-opacity font-body1"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end bg-clip-text text-transparent hover:opacity-80 transition-opacity font-body1"
                >
                  Privacy Policy
                </Link>{" "}
                To Continue
              </label>
            </div>
            {errors.terms && (
              <div className="text-red-500 text-xs mt-1 mb-4">
                {errors.terms}
              </div>
            )}
            <div className="mb-6 flex items-center">
              <input type="checkbox" id="marketing" className="mr-2" />
              <label
                htmlFor="marketing"
                className="text-sm font-body1 text-text_secondary"
              >
                Clicking the unsubscribe link at the bottom of our Marketing
                Emails{" "}
              </label>
            </div>
            {/* <p className="text-xs font-body text-text_secondary ml-6">Clicking the unsubscribe link at the bottom of our Marketing Emails</p> */}
          </div>
        );
      default:
        return null;
    }
  };

  const stepNames = hasRefParam
    ? ["Personal", "Email", "Verification", "Finish"]
    : ["Personal", "Email", "Verification", "Welcome", "Finish"];

  // Navigation Buttons (except for sponsor step, handled above)
  const renderNavigationButtons = () => {
    if (currentStep === 4 && !hasRefParam) return null; // handled in sponsor step when no ref param
    if (currentStep === 5 || (currentStep === 4 && hasRefParam)) {
      return (
        <div className="flex justify-between mt-10">
          <button
            type="button"
            className="py-3 px-6 rounded-3xl font-body1 text-white font-semibold bg-[#000] border border-gray_line hover:opacity-90 transition-opacity duration-300 flex items-center"
            onClick={handlePrevious}
          >
            <img
              className="w-6 h-5 mr-2"
              src="/assets/images/previous-icon.png"
            />
            Previous
          </button>
          <button
            type="button"
            className={`py-3 px-6 rounded-3xl font-body1 text-white font-semibold bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity duration-300 flex items-center ${
              form.termsAccepted ? "" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleRegister}
            disabled={!form.termsAccepted}
          >
            Finish
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
        </div>
      );
    }
    return (
      <div className="flex justify-between mt-10">
        {currentStep > 1 && (
          <button
            type="button"
            className="py-3 px-6 rounded-3xl font-body1 text-white font-semibold bg-[#000] border border-gray_line hover:opacity-90 transition-opacity duration-300 flex items-center"
            onClick={handlePrevious}
          >
            <img
              className="w-6 h-5 mr-2"
              src="/assets/images/previous-icon.png"
            />
            Previous
          </button>
        )}
        <button
          type="button"
          className={`py-3 px-6 font-body1 rounded-3xl text-white font-semibold bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end hover:opacity-90 transition-opacity duration-300 flex items-center ml-auto ${
            isCurrentStepValid() ? "" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
        >
          Next
          <img className="w-6 h-5 ml-2" src="/assets/images/next-icon.png" />
        </button>
      </div>
    );
  };

  const createPathTransition = (delay = 0) => ({
    duration: 30, // Extremely slow animation
    repeat: Infinity,
    repeatType: "loop",
    ease: "linear",
    repeatDelay: 2,
    delay: delay,
  });
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center  relative">
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
      {/* Back Button */}
      <div className="absolute top-10 left-4 md:left-10 ">
        <Link
          to="/signin"
          className="flex items-center font-body1 text-text_secondary hover:opacity-80 transition-opacity text-base"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back
        </Link>
      </div>

      <div className="flex flex-col relative z-20 items-center w-full max-w-[1200px] mx-auto pt-16 md:pt-20">
        {/* Logo and Main Title */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/assets/images/logo.png"
            alt="Ginox Logo"
            className="h-24 mb-4"
          />
          <h1 className="text-xl md:text-3xl font-header text-text_primary tracking-widest text-center">
            CREATE NEW ACCOUNT
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center w-full max-w-lg mb-10 relative">
          {stepNames.map((name, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1 z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2`}
                >
                  {/* Use filled icon for completed steps, default for current/future */}
                  <img
                    src={
                      index < currentStep
                        ? `/assets/images/regsiter${index + 1}-filled.png`
                        : `/assets/images/register${index + 1}.png`
                    }
                    alt={name}
                    className={`w-30 h-30 object-contain ${
                      index < currentStep ? "opacity-100" : "opacity-50"
                    }`}
                  />
                </div>
                <p
                  className={`text-sm font-body1 ${
                    index < currentStep
                      ? "text-btn_gradient_start"
                      : "text-text_secondary"
                  }`}
                >
                  {name}
                </p>
              </div>
              {index < stepNames.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-[-30px] z-0
                              ${
                                index < currentStep - 1
                                  ? "bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end"
                                  : "bg-gray_line"
                              }
                              `}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="w-full max-w-lg bg-card_background rounded-[20px] shadow-2xl p-10 mx-auto border border-gray_line dotted-background">
          {apiError && (
            <div className="w-full text-center text-red-500 text-sm font-semibold mb-4 font-body1">
              {apiError}
            </div>
          )}
          {apiMessage && (
            <div className="w-full text-center text-green-500 text-sm font-semibold mb-4 font-body1">
              {apiMessage}
            </div>
          )}
          {renderStepContent()}
          {/* Only render navigation buttons for steps other than 1, 2, 3, and 4 (since 1, 2, and 3 now render them after input fields, and 4 has its own when no ref param) */}
          {![1, 2, 3].includes(currentStep) &&
            !(currentStep === 4 && !hasRefParam) &&
            renderNavigationButtons()}
        </div>
      </div>
    </div>
  );
};

export default Register;
