import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

// PUBLIC_INTERFACE
/**
 * Custom hook for managing user authentication state
 * Simplified for fan-focused single-page experience
 * @returns {Object} Authentication state and methods
 */
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('fanEngagementToken');
    
    if (storedToken) {
      setUserToken(storedToken);
      setIsAuthenticated(true);
      apiService.setToken(storedToken);
    } else {
      // Auto-authenticate fans with a demo token for seamless experience
      const demoToken = getDemoToken();
      login(demoToken);
    }
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Login with a token
   * @param {string} token - The authentication token
   */
  const login = (token) => {
    setUserToken(token);
    setIsAuthenticated(true);
    
    localStorage.setItem('fanEngagementToken', token);
    
    apiService.setToken(token);
  };

  // PUBLIC_INTERFACE
  /**
   * Logout and clear authentication state
   */
  const logout = () => {
    setUserToken(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('fanEngagementToken');
    
    apiService.setToken(null);
  };

  // PUBLIC_INTERFACE
  /**
   * Get a demo token for fan users
   * @returns {string} Demo token for fan engagement
   */
  const getDemoToken = () => {
    // Generate a demo token for fan users
    const timestamp = Date.now();
    const userId = Math.floor(Math.random() * 10000);
    return `fan_${userId}_${timestamp}`;
  };

  return {
    isAuthenticated,
    userToken,
    login,
    logout,
    getDemoToken,
  };
}

export default useAuth;
