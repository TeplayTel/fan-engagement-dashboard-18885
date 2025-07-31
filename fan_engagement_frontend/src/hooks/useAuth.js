import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

// PUBLIC_INTERFACE
/**
 * Custom hook for managing authentication state
 * @returns {Object} Authentication state and methods
 */
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('fanEngagementToken');
    const storedUserType = localStorage.getItem('fanEngagementUserType');
    
    if (storedToken) {
      setUserToken(storedToken);
      setIsAuthenticated(true);
      setIsAdmin(storedUserType === 'admin');
      apiService.setToken(storedToken);
    }
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Login with a token
   * @param {string} token - The authentication token
   * @param {boolean} adminMode - Whether the user is an admin
   */
  const login = (token, adminMode = false) => {
    setUserToken(token);
    setIsAuthenticated(true);
    setIsAdmin(adminMode);
    
    localStorage.setItem('fanEngagementToken', token);
    localStorage.setItem('fanEngagementUserType', adminMode ? 'admin' : 'user');
    
    apiService.setToken(token);
  };

  // PUBLIC_INTERFACE
  /**
   * Logout and clear authentication state
   */
  const logout = () => {
    setUserToken(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    
    localStorage.removeItem('fanEngagementToken');
    localStorage.removeItem('fanEngagementUserType');
    
    apiService.setToken(null);
  };

  // PUBLIC_INTERFACE
  /**
   * Get a demo token for testing purposes
   * @param {boolean} adminMode - Whether to get an admin token
   * @returns {string} Demo token
   */
  const getDemoToken = (adminMode = false) => {
    // Generate a demo token for testing
    const timestamp = Date.now();
    const userType = adminMode ? 'admin' : 'user';
    return `demo_${userType}_${timestamp}`;
  };

  return {
    isAuthenticated,
    userToken,
    isAdmin,
    login,
    logout,
    getDemoToken,
  };
}

export default useAuth;
