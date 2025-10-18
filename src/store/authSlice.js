import { createSlice } from '@reduxjs/toolkit';
import CacheManager from '../utils/cacheManager';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
  twoFAEnabled: false, // Track 2FA status
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      // Set 2FA status based on login response
      if (action.payload.twoFAEnabled !== undefined) {
        state.twoFAEnabled = action.payload.twoFAEnabled;
      }
      // Save fresh auth data to localStorage
      CacheManager.saveAuthToken(action.payload.token, action.payload.user);
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.error = null;
    },
    registerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    profileStart(state) {
      state.profileLoading = true;
      state.profileError = null;
    },
    profileSuccess(state, action) {
      state.profileLoading = false;
      state.user = action.payload;
      state.profileError = null;
      // Update 2FA status from profile data if available
      if (action.payload.twoFAEnabled !== undefined) {
        state.twoFAEnabled = action.payload.twoFAEnabled;
      }
    },
    profileFailure(state, action) {
      state.profileLoading = false;
      state.profileError = action.payload;
    },
    setUserProfile(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.profileLoading = false;
      state.profileError = null;
      state.twoFAEnabled = false;
      // Clear all cache and storage on logout
      CacheManager.clearSessionData();
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setTwoFAStatus(state, action) {
      state.twoFAEnabled = action.payload;
    },
    clearCacheForLogin(state) {
      // Clear cache and prepare for fresh login
      CacheManager.prepareForFreshLogin();
      // Stop any ongoing session validation
      // Note: We import SessionManager inside the function to avoid circular dependency
      import('../utils/sessionManager').then(({ SessionManager }) => {
        SessionManager.stopSessionValidation();
        SessionManager.setLoginInProgress(false);
      });
    },
    clearAllAppData(state) {
      // Clear all app data when user first visits
      CacheManager.clearAllAppData();
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  profileStart,
  profileSuccess,
  profileFailure,
  setUserProfile,
  logout,
  setError,
  setTwoFAStatus,
  clearCacheForLogin,
  clearAllAppData,
} = authSlice.actions;

export default authSlice.reducer; 