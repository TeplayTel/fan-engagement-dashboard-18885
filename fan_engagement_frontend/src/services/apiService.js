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
        // Try to get error details from response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage += ` - ${errorData.detail}`;
          } else if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (parseError) {
          // If response body can't be parsed, use status text
          errorMessage += ` - ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
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

  // PUBLIC_INTERFACE
  /**
   * Upload emoji with multipart/form-data
   * @param {FormData} formData - FormData containing emojiType and emojiImage
   * @returns {Promise} Response data
   */
  async uploadEmoji(formData) {
    try {
      const headers = {};
      
      // Add authorization header if token is available
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      // Don't set Content-Type for multipart/form-data - let browser set it with boundary
      const response = await fetch(`${this.baseURL}/fan-engagement/emoji/v1/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        // Try to get error details from response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage += ` - ${errorData.detail}`;
          } else if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (parseError) {
          // If response body can't be parsed, use status text
          errorMessage += ` - ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API emoji upload failed:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get emoji usage statistics (admin only)
   * @param {string} eventId - Optional event ID to filter statistics
   * @returns {Promise} Response data with emoji statistics
   */
  async getEmojiStats(eventId = null) {
    const endpoint = eventId ? 
      `/fan-engagement/emoji/v1/stats?eventId=${encodeURIComponent(eventId)}` : 
      '/fan-engagement/emoji/v1/stats';
    return this.get(endpoint);
  }

  // PUBLIC_INTERFACE
  /**
   * Get list of available events for statistics filtering
   * @returns {Promise} Response data with available events
   */
  async getEvents() {
    return this.get('/fan-engagement/events/v1/list');
  }

  // PUBLIC_INTERFACE
  /**
   * Remove emoji (admin only)
   * @param {string} emojiId - The ID of the emoji to remove
   * @returns {Promise} Response data
   */
  async removeEmoji(emojiId) {
    try {
      const response = await fetch(`${this.baseURL}/fan-engagement/emoji/v1/remove/${emojiId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        // Try to get error details from response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage += ` - ${errorData.detail}`;
          } else if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (parseError) {
          // If response body can't be parsed, use status text
          errorMessage += ` - ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API emoji removal failed:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
