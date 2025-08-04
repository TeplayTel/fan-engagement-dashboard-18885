// PUBLIC_INTERFACE
/**
 * API service for making HTTP requests to the fan engagement backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
    return this.get('/reactions/emojis');
  }

  // PUBLIC_INTERFACE
  /**
   * Send an emoji reaction
   * @param {Object} reactionData - The reaction data to send
   * @returns {Promise} Response data
   */
  async sendReaction(reactionData) {
    return this.post('/reactions/emoji_reaction', reactionData);
  }

  // PUBLIC_INTERFACE
  /**
   * Send user emoji reaction with correct payload structure matching backend API
   * @param {Object} reactionData - Object containing match_id, emoji_type, user_id, timestamp
   * @returns {Promise} Response data
   */
  async sendUserEmojiReaction(reactionData) {
    // Transform frontend format to backend format
    const backendPayload = {
      match_id: parseInt(reactionData.eventId?.replace('live_match_', '') || '1'),
      emoji_type: this.mapEmojiIdToType(reactionData.emojiId),
      user_id: reactionData.userId,
      timestamp: reactionData.createdAt || new Date().toISOString()
    };
    return this.post('/reactions/emoji_reaction', backendPayload);
  }

  // PUBLIC_INTERFACE
  /**
   * Get all matches with optional filtering
   * @param {Object} filters - Optional filters (status, league, team, date_from, date_to, limit)
   * @returns {Promise} Response data with matches
   */
  async getMatches(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return this.get(`/matches/${queryString ? '?' + queryString : ''}`);
  }

  // PUBLIC_INTERFACE
  /**
   * Get match details by ID
   * @param {string|number} matchId - The ID of the match
   * @returns {Promise} Response data with match details
   */
  async getMatchDetails(matchId) {
    return this.get(`/matches/${matchId}`);
  }

  // PUBLIC_INTERFACE
  /**
   * Get live matches
   * @returns {Promise} Response data with live matches
   */
  async getLiveMatches() {
    return this.get('/matches/live/current');
  }

  // PUBLIC_INTERFACE
  /**
   * Get upcoming matches
   * @param {number} limit - Number of matches to return
   * @returns {Promise} Response data with upcoming matches
   */
  async getUpcomingMatches(limit = 5) {
    return this.get(`/matches/upcoming/next?limit=${limit}`);
  }

  // PUBLIC_INTERFACE
  /**
   * Get recent reactions for a match
   * @param {string|number} matchId - The match ID
   * @param {number} limit - Number of reactions to return
   * @returns {Promise} Response data with recent reactions
   */
  async getRecentReactions(matchId, limit = 10) {
    return this.get(`/reactions/match/${matchId}/recent?limit=${limit}`);
  }

  // PUBLIC_INTERFACE
  /**
   * Get global analytics
   * @returns {Promise} Response data with global analytics
   */
  async getGlobalAnalytics() {
    return this.get('/analytics/global');
  }

  // PUBLIC_INTERFACE
  /**
   * Get match-specific analytics
   * @param {string|number} matchId - The match ID
   * @returns {Promise} Response data with match analytics
   */
  async getMatchAnalytics(matchId) {
    return this.get(`/analytics/match/${matchId}`);
  }

  // PUBLIC_INTERFACE
  /**
   * Get analytics summary
   * @returns {Promise} Response data with analytics summary
   */
  async getAnalyticsSummary() {
    return this.get('/analytics/summary');
  }

  // PUBLIC_INTERFACE
  /**
   * Get basic engagement statistics for fans (fallback method)
   * @param {string} eventId - Optional event ID to filter statistics
   * @returns {Promise} Response data with engagement statistics
   */
  async getEngagementStats(eventId = null) {
    try {
      // Try to get match-specific analytics if eventId provided
      if (eventId) {
        const matchId = eventId.replace('live_match_', '').replace(/^0+/, '') || '1';
        return await this.getMatchAnalytics(matchId);
      }
      // Otherwise get global analytics
      return await this.getGlobalAnalytics();
    } catch (error) {
      console.warn('Failed to get engagement stats, falling back to summary:', error);
      return await this.getAnalyticsSummary();
    }
  }

  /**
   * Map emoji ID to backend emoji type enum
   * @private
   */
  mapEmojiIdToType(emojiId) {
    const emojiMap = {
      '1': '❤️',
      '2': '🔥',
      '3': '👏',
      '4': '👍',
      '5': '⚽',
      '6': '🎉',
      '7': '😠',
      '8': '😢'
    };
    return emojiMap[emojiId] || '❤️';
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
