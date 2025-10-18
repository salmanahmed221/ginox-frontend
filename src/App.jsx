import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/dashboard/auth/signin/SignIn";
import ForgotPassword from "./pages/dashboard/auth/signin/ForgotPassword";
import ConnectWallet from "./pages/dashboard/auth/connect-wallet/ConnectWallet";
import ProfileSetup from "./pages/dashboard/auth/profile-setup/ProfileSetup";
import TakeSelfie from "./pages/dashboard/auth/profile-setup/TakeSelfie";
import Register from "./pages/dashboard/auth/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/profile/Profile";
import "./index.css";
import ChangePassword from "./pages/dashboard/profile/ChangePassword";
import Wallets from "./pages/dashboard/wallets/Wallets";
import Team from "./pages/dashboard/Team";
import CreateVoucher from "./pages/dashboard/team/CreateVoucher";
import Income from "./pages/dashboard/Income";
import ReferFriend from "./pages/dashboard/ReferFriend";
import BuyingHistory from "./pages/dashboard/BuyingHistory";
import AccountStatements from "./pages/dashboard/AccountStatements";
import StakingProducts from "./pages/dashboard/StakingProducts";
import ProductPage from "./pages/products/ProductPage";
import ProductDetail from "./pages/products/ProductDetail";
import Market from "./pages/products/Market";
import CryptoBox from "./pages/products/CryptoBox";
import Company from "./pages/products/Company";
import Lottery from "./pages/products/Lottery";
import SignalChannel from "./pages/products/SignalChannel";
import ProductHome from "./pages/products/ProductHome";
import Games from "./pages/products/Games";
import CompanyAll from "./pages/company/All";
import ProductAll from "./pages/products/All";
import LotteryAll from "./pages/lottery/All";
import GinoxCompany from "./pages/products/GinoxCompany";
import IpvpnCompany from "./pages/products/IpvpnCompany";
import IpvpnSignalChannel from "./pages/products/IpvpnSignalChannel";
import BfmWallets from "./pages/dashboard/bfm-wallets/Wallets";
import ServicesAll from "./pages/products/ServicesAll";
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchProfile } from "./api/auth";
import {
  profileStart,
  profileSuccess,
  profileFailure,
  clearAllAppData,
} from "./store/authSlice";
import CacheManager from "./utils/cacheManager";
import { SessionManager } from "./utils/sessionManager";
import SuInvitation from "./pages/dashboard/suInvitaion/SuInvitaion";
import CryptoBoxLottery from "./pages/lottery/CryptoBoxLottery";
import AdminSignIn from "./pages/dashboard/auth/AdminSignIn";
import AuthCallback from "./pages/dashboard/auth/AuthCallback";
import SellVpn from "./pages/dashboard/vpn/SellVpn";
import SellOrCustomervpn from "./pages/dashboard/vpn/SellOrCustomervpn";
import CustomersList from "./pages/dashboard/vpn/CustomersList";
import SupportChat from "./pages/supportchat/SupportChat";
import CryptoBlunder1 from "./components/cryptoblunder/cryptoblunder1";
import SupportSignIn from "./pages/dashboard/auth/SupportSignIn";

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  // Load user profile on app initialization if token exists but user is null
  useEffect(() => {
    if (token && !user) {
      console.log(
        "App initialization: Token exists but user is null, fetching profile..."
      );
      dispatch(profileStart());
      fetchProfile(token)
        .then((response) => {
          console.log("App initialization profile response:", response);
          if (response.success && response.data) {
            console.log(
              "App initialization: Setting user profile:",
              response.data
            );
            dispatch(profileSuccess(response.data));
          } else {
            console.warn(
              "App initialization: Profile fetch failed:",
              response.message
            );
            dispatch(
              profileFailure(response.message || "Failed to fetch profile")
            );
          }
        })
        .catch((error) => {
          console.error("App initialization profile error:", error);
          dispatch(
            profileFailure(
              error.response?.data?.message || "Failed to fetch profile"
            )
          );
        });
    }
  }, [token, user, dispatch]);

  // Clear cache on first app visit (not for returning users with valid sessions)
  useEffect(() => {
    const isFirstVisit = !CacheManager.isReturningUser();
    const hasValidSession = token && user;

    if (isFirstVisit && !hasValidSession) {
      console.log("🧹 First time visitor detected, clearing all app data...");
      dispatch(clearAllAppData());
      CacheManager.markAsVisited();
    } else {
      console.log("👋 Returning user or valid session detected, keeping data");
    }
  }, []); // Only run once on mount

  // Start/stop session validation based on authentication status
  useEffect(() => {
    if (token && user) {
      console.log("🔐 Starting session validation for authenticated user");
      SessionManager.startSessionValidation();
    } else {
      console.log("🔐 Stopping session validation - user not authenticated");
      SessionManager.stopSessionValidation();
    }

    // Cleanup on unmount
    return () => {
      SessionManager.stopSessionValidation();
    };
  }, [token, user]);

  return (
    <div
      className="min-h-screen w-screen bg-dark_background font-body1  text-text_primary"
      style={{ overflowX: "hidden", overflowY: "hidden" }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cryptobulk" element={<CryptoBlunder1 />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/admin-signin" element={<AdminSignIn />} />
          <Route path="/support-signin" element={<SupportSignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/crypto-box-lottery" element={<CryptoBoxLottery />} />
          <Route path="/lottery" element={<Lottery />} />
          <Route path="/supportchat" element={<SupportChat />} />

          <Route path="/services-all" element={<ServicesAll />} />
          <Route path="/signal-channel" element={<SignalChannel />} />
          <Route path="/ipvpn-company" element={<IpvpnCompany />} />
          <Route path="/lottery-all" element={<LotteryAll />} />
          <Route path="/company" element={<Company />} />
          <Route path="/games" element={<Games />} />
          <Route path="/crypto-box" element={<CryptoBox />} />
          <Route path="/ipvpn" element={<IpvpnSignalChannel />} />

          <Route path="/company-all" element={<CompanyAll />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/connect-wallet" element={<ConnectWallet />} />
                  <Route path="/profile" element={<Profile />} />

                  <Route path="/profile-setup" element={<ProfileSetup />} />
                  <Route
                    path="/profile-setup/take-selfie"
                    element={<TakeSelfie />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/wallets" element={<Wallets />} />
                  <Route path="/bfm-wallets" element={<BfmWallets />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/create-voucher" element={<CreateVoucher />} />
                  <Route path="/income" element={<Income />} />
                  <Route path="/refer" element={<ReferFriend />} />

                  <Route path="/buying-history" element={<BuyingHistory />} />
                  <Route
                    path="/account-statements"
                    element={<AccountStatements />}
                  />
                  <Route
                    path="/staking-products"
                    element={<StakingProducts />}
                  />
                  <Route
                    path="/product-directories"
                    element={<ProductPage />}
                  />
                  <Route path="/product-detail" element={<ProductDetail />} />
                  <Route path="/market" element={<Market />} />

                  <Route path="/ginox-company" element={<GinoxCompany />} />

                  <Route path="/product-all" element={<ProductAll />} />

                  <Route path="/su-invitation" element={<SuInvitation />} />
                  <Route
                    path="/sell-customer-vpn"
                    element={<SellOrCustomervpn />}
                  />

                  {/* VPN Routes */}
                  <Route path="/vpn/sell" element={<SellVpn />} />
                  <Route path="/vpn/customers" element={<CustomersList />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
