import { store } from '../store/store';
import { logout } from '../store/authSlice';
import CacheManager from './cacheManager';

/**
 * Session Manager - Handles session expiration and user feedback
 */
export class SessionManager {
  static sessionCheckInterval = null;
  static isLoginInProgress = false;

  /**
   * Handle session expiration with user feedback
   */
  static handleSessionExpiration() {
    // Don't show notification if user is currently trying to login
    if (this.isLoginInProgress) {
      console.log('🔐 Session validation during login, skipping notification...');
      return;
    }
    
    console.log('🔐 Session expired, logging out user...');
    
    // Show user-friendly notification
    this.showSessionExpiredNotification();
    
    // Clear all session data
    CacheManager.clearSessionData();
    
    // Dispatch logout action to clear Redux state
    store.dispatch(logout());
    
    // Redirect to sign-in page after a short delay to show notification
    setTimeout(() => {
      window.location.href = '/signin';
    }, 2000);
  }

  /**
   * Handle user not found (404) with user feedback
   */
  static handleUserNotFound() {
    // Don't show notification if user is currently trying to login
    if (this.isLoginInProgress) {
      console.log('🔐 User not found during login, skipping notification...');
      return;
    }
    
    console.log('🔐 User not found, logging out user...');
    
    // Show user-friendly notification
    this.showUserNotFoundNotification();
    
    // Clear all session data
    CacheManager.clearSessionData();
    
    // Dispatch logout action to clear Redux state
    store.dispatch(logout());
    
    // Redirect to sign-in page after a short delay to show notification
    setTimeout(() => {
      window.location.href = '/signin';
    }, 2000);
  }

  /**
   * Start periodic session validation
   */
  static startSessionValidation() {
    // Clear any existing interval
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    // Only start validation if user is properly authenticated
    const token = this.getCurrentToken();
    const user = store.getState().auth.user;
    
    if (!token || !user) {
      console.log('🔐 Cannot start session validation - missing token or user data');
      return;
    }

    console.log('🔐 Starting session validation with valid credentials');
    
    // Check session every 5 minutes
    this.sessionCheckInterval = setInterval(() => {
      this.validateSession();
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop periodic session validation
   */
  static stopSessionValidation() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  /**
   * Validate current session by making a lightweight API call
   */
  static async validateSession() {
    // Skip validation if login is in progress
    if (this.isLoginInProgress) {
      console.log('🔍 Skipping session validation - login in progress');
      return;
    }
    
    const token = this.getCurrentToken();
    const user = store.getState().auth.user;
    
    // Stop validation if no valid credentials
    if (!token || !user) {
      console.log('🔍 No valid credentials, stopping session validation');
      this.stopSessionValidation();
      return;
    }

    try {
      // Make a lightweight API call to validate session
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.log('🔍 Periodic session check detected expired session');
        this.handleSessionExpiration();
      } else if (response.status === 404) {
        console.log('🔍 Periodic session check detected user not found');
        this.handleUserNotFound();
      }
    } catch (error) {
      console.log('🔍 Session validation error:', error);
      // Don't logout on network errors, only on 401/404
    }
  }

  /**
   * Show user-friendly session expired notification
   */
  static showSessionExpiredNotification() {
    this.showNotification('Your session has expired. Please sign in again.', 'session-expired');
  }

  /**
   * Show user not found notification
   */
  static showUserNotFoundNotification() {
    this.showNotification('User not found. Please sign in again.', 'user-not-found');
  }

  /**
   * Generic notification display method
   */
  static showNotification(message, type) {
    // Remove any existing notification
    const existingNotification = document.getElementById(`${type}-notification`);
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = `${type}-notification`;
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
          <span>${message}</span>
        </div>
      </div>
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * Check if user session is valid
   */
  static isSessionValid() {
    const token = store.getState().auth.token;
    return !!token;
  }

  /**
   * Get current session token
   */
  static getCurrentToken() {
    return store.getState().auth.token;
  }

  /**
   * Set login progress state
   */
  static setLoginInProgress(inProgress) {
    this.isLoginInProgress = inProgress;
    console.log(`🔐 Login in progress: ${inProgress}`);
  }

  /**
   * Test function to simulate session expiration (for development/testing)
   */
  static testSessionExpiration() {
    console.log('🧪 Testing session expiration...');
    this.handleSessionExpiration();
  }
} 