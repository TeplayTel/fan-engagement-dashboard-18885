// PUBLIC_INTERFACE
/**
 * API service for making HTTP requests to the fan engagement backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vscode-internal-33385-beta.beta01.cloud.kavia.ai:3001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // PUBLIC_INTERFACE
  /**
   * Set the authorization token for API requests
   * @param {string} token - The bearer token
   */
  setToken(token) {
    this.token = token;
  }

  // PUBLIC_INTERFACE
  /**
   * Get the authorization headers
   * @returns {Object} Headers object with authorization if token is set
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // PUBLIC_INTERFACE
  /**
   * Make a GET request to the API
   * @param {string} endpoint - The API endpoint
   * @returns {Promise} Response data
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Make a POST request to the API
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The request body data
   * @returns {Promise} Response data
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch the list of available emojis
   * @returns {Promise<Array>} Array of emoji objects
   */
  async getEmojis() {
    return this.get('/fan-engagement/emoji/v1/listEmojis');
  }

  // PUBLIC_INTERFACE
  /**
   * Send an emoji reaction
   * @param {Object} reactionData - The reaction data to send
   * @returns {Promise} Response data
   */
  async sendReaction(reactionData) {
    return this.post('/fan-engagement/emoji/v1/reaction', reactionData);
  }

  // PUBLIC_INTERFACE
  /**
   * Send user emoji reaction with correct payload structure
   * @param {Object} reactionData - Object containing userId, eventId, emojiId, createdAt
   * @returns {Promise} Response data
   */
  async sendUserEmojiReaction(reactionData) {
    return this.post('/fan-engagement/emoji/v1/userEmojiReaction', reactionData);
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
