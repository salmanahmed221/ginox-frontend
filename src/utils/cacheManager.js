/**
 * Cache and localStorage management utility
 * Handles clearing and managing browser storage
 */

export class CacheManager {
  /**
   * Clear all localStorage data
   */
  static clearLocalStorage() {
    try {
      localStorage.clear();
      console.log("✅ LocalStorage cleared");
    } catch (error) {
      console.error("❌ Error clearing localStorage:", error);
    }
  }

  /**
   * Clear all sessionStorage data
   */
  static clearSessionStorage() {
    try {
      sessionStorage.clear();
      console.log("✅ SessionStorage cleared");
    } catch (error) {
      console.error("❌ Error clearing sessionStorage:", error);
    }
  }

  /**
   * Clear all cookies
   */
  static clearAllCookies() {
    try {
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Clear for current domain
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        
        // Clear for current domain and subdomain
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        
        // Clear for parent domain (if subdomain)
        const domain = window.location.hostname.split('.').slice(-2).join('.');
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`;
      });
      console.log("✅ All cookies cleared");
    } catch (error) {
      console.error("❌ Error clearing cookies:", error);
    }
  }

  /**
   * Clear browser cache (service worker and cache API)
   */
  static async clearBrowserCache() {
    try {
      // Clear service worker caches
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
        console.log("✅ Service workers cleared");
      }

      // Clear cache storage
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log("✅ Browser cache cleared");
      }
    } catch (error) {
      console.error("❌ Error clearing browser cache:", error);
    }
  }

  /**
   * Clear IndexedDB data
   */
  static async clearIndexedDB() {
    try {
      if ('indexedDB' in window) {
        // Get all databases (this is a newer API, fallback if not supported)
        if (indexedDB.databases) {
          const databases = await indexedDB.databases();
          await Promise.all(
            databases.map(db => {
              const deleteReq = indexedDB.deleteDatabase(db.name);
              return new Promise((resolve, reject) => {
                deleteReq.onsuccess = () => resolve();
                deleteReq.onerror = () => reject(deleteReq.error);
              });
            })
          );
        }
        console.log("✅ IndexedDB cleared");
      }
    } catch (error) {
      console.error("❌ Error clearing IndexedDB:", error);
    }
  }

  /**
   * Clear all application data completely
   */
  static async clearAllAppData() {
    console.log("🧹 Starting complete app data cleanup...");
    
    // Clear all storage types
    this.clearLocalStorage();
    this.clearSessionStorage();
    this.clearAllCookies();
    
    // Clear browser cache and IndexedDB (async operations)
    await Promise.all([
      this.clearBrowserCache(),
      this.clearIndexedDB()
    ]);

    console.log("🎉 Complete app data cleanup finished");
  }

  /**
   * Clear only user session data (for logout)
   */
  static clearSessionData() {
    console.log("🧹 Clearing user session data...");
    
    // Clear specific auth-related data
    this.clearLocalStorage();
    this.clearSessionStorage();
    
    // Clear auth-related cookies only
    const authCookies = ['token', 'refreshToken', 'user', 'auth', 'session'];
    authCookies.forEach(cookieName => {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
    
    console.log("✅ User session data cleared");
  }

  /**
   * Prepare clean storage for fresh login
   */
  static prepareForFreshLogin() {
    console.log("🔄 Preparing storage for fresh login...");
    this.clearSessionData();
  }

  /**
   * Save token to localStorage securely
   */
  static saveAuthToken(token, user = null) {
    try {
      if (token) {
        localStorage.setItem('authToken', token);
        console.log("✅ Auth token saved to localStorage");
      }
      
      if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
        console.log("✅ User data saved to localStorage");
      }
    } catch (error) {
      console.error("❌ Error saving auth data:", error);
    }
  }

  /**
   * Get auth token from localStorage
   */
  static getAuthToken() {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error("❌ Error getting auth token:", error);
      return null;
    }
  }

  /**
   * Remove specific auth data
   */
  static removeAuthData() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('persist:auth'); // Redux persist key
      console.log("✅ Auth data removed from localStorage");
    } catch (error) {
      console.error("❌ Error removing auth data:", error);
    }
  }

  /**
   * Check if user is returning (has visited before)
   */
  static isReturningUser() {
    try {
      return localStorage.getItem('hasVisitedBefore') === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Mark user as having visited before
   */
  static markAsVisited() {
    try {
      localStorage.setItem('hasVisitedBefore', 'true');
    } catch (error) {
      console.error("❌ Error marking user as visited:", error);
    }
  }
}

export default CacheManager;