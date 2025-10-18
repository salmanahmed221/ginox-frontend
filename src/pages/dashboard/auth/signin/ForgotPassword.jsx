import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../../api/axiosConfig";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let errs = {};
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError("");
    setApiMessage("");
    try {
      const response = await axios.post("/auth/reset-password", {
        email: formData.email,
      });
      if (response.data && response.data.success) {
        setApiMessage(
          response.data.message || "Check your Email for new Password"
        );
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setApiError(response.data.message || "Failed to send reset email");
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center py-10 px-4 bg-[url('/assets/images/signin-bg.svg')] bg-cover bg-center">
        <div className="flex flex-col items-center w-full max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center mb-6 md:mb-10">
            <img
              src="/assets/images/logo.png"
              alt="Ginox Logo"
              className="h-16 md:h-24 mb-4 md:mb-6"
            />
            <h1 className="text-2xl md:text-2xl font-heading text-text_primary tracking-wider text-center">
              CHECK YOUR EMAIL
            </h1>
          </div>
          <div className="w-full max-w-lg bg-card_background rounded-[20px] shadow-2xl p-6 md:p-10 mx-auto border border-gray_line">
            <div className="text-center mb-8">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-heading text-text_primary mb-4">
                Password Reset Email Sent
              </h2>
              <p className="text-text_secondary text-sm font-body mb-6">
                {apiMessage}
              </p>
            </div>
          </div>
          <div className="w-full max-w-lg mx-auto flex flex-row justify-between items-center mt-6">
            <div className="flex flex-wrap gap-4 md:gap-6 text-text_secondary text-sm font-body">
              <Link
                to="/terms"
                className="text-[#64748B] hover:opacity-80 transition-opacity"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-[#64748B] hover:opacity-80 transition-opacity"
              >
                Privacy
              </Link>
              <Link
                to="/docs"
                className="text-[#64748B] hover:opacity-80 transition-opacity"
              >
                Docs
              </Link>
              <Link
                to="/help"
                className="text-[#64748B] hover:opacity-80 transition-opacity"
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
              <select className="bg-transparent border-none text-text_secondary text-sm font-body focus:outline-none">
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center py-10 px-4 bg-[url('/assets/images/signin-bg.svg')] bg-cover bg-center">
      <div className="flex flex-col items-center w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center mb-6 md:mb-10">
          <img
            src="/assets/images/logo.png"
            alt="Ginox Logo"
            className="h-16 md:h-24 mb-4 md:mb-6"
          />
          <h1 className="text-2xl md:text-2xl font-heading text-text_primary tracking-wider text-center">
            FORGOT PASSWORD
          </h1>
        </div>
        <div className="w-full max-w-lg bg-card_background rounded-[20px] shadow-2xl p-6 md:p-10 mx-auto border border-gray_line">
          {error && (
            <div className="w-full text-center text-red-500 text-sm font-semibold mb-4">
              {error}
            </div>
          )}
          {apiError && (
            <div className="w-full text-center text-red-500 text-sm font-semibold mb-4">
              {apiError}
            </div>
          )}
          <div className="text-center mb-8">
            <h2 className="text-xl font-heading text-text_primary mb-4">
              Reset Your Password
            </h2>
            <p className="text-text_secondary text-sm font-body">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-body text-text_secondary mb-2"
              >
                Email Address
              </label>
              <div className="relative flex flex-col">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 pl-10 rounded-full bg-input_background border border-input_border text-text_primary placeholder-text_secondary focus:outline-none focus:ring-1 focus:ring-link_color focus:border-link_color"
                    placeholder="Enter your email address"
                    required
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text_secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1 ml-3">
                    {errors.email}
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-full text-white font-semibold mb-6
                         bg-gradient-to-r from-btn_gradient_start to-btn_gradient_end
                         hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center">
              <Link
                to="/signin"
                className="text-text_secondary text-sm font-body hover:opacity-80 transition-opacity"
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>
        </div>
        <div className="w-full max-w-lg mx-auto flex flex-row justify-between items-center mt-6">
          <div className="flex flex-wrap gap-4 md:gap-6 text-text_secondary text-sm font-body">
            <Link
              to="/terms"
              className="text-[#64748B] hover:opacity-80 transition-opacity"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-[#64748B] hover:opacity-80 transition-opacity"
            >
              Privacy
            </Link>
            <Link
              to="/docs"
              className="text-[#64748B] hover:opacity-80 transition-opacity"
            >
              Docs
            </Link>
            <Link
              to="/help"
              className="text-[#64748B] hover:opacity-80 transition-opacity"
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
            <select className="bg-transparent border-none text-text_secondary text-sm font-body focus:outline-none">
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
