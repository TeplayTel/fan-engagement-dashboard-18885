// PUBLIC_INTERFACE
/**
 * WebSocket service for real-time communication with the fan engagement backend
 */

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnecting = false;
    this.baseUrl = process.env.REACT_APP_WS_URL || 'wss://vscode-internal-33385-beta.beta01.cloud.kavia.ai:3001';
  }

  // PUBLIC_INTERFACE
  /**
   * Connect to the WebSocket server
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    if (this.isConnecting) {
      console.log('WebSocket connection already in progress');
      return;
    }

    this.isConnecting = true;

    try {
      const wsUrl = `${this.baseUrl}/ws`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.isConnecting = false;
        this.emit('disconnected');
        
        // Attempt to reconnect unless it was a manual close
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.emit('error', error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  // PUBLIC_INTERFACE
  /**
   * Send a message to the WebSocket server
   * @param {Object} message - The message to send
   * @returns {boolean} True if message was sent successfully
   */
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket not connected, cannot send message:', message);
      return false;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Subscribe to real-time emoji reactions
   * @param {Function} callback - Callback function to handle reactions
   */
  subscribeToReactions(callback) {
    this.on('emoji_reaction', callback);
    
    // Send subscription message to backend
    this.send({
      type: 'subscribe',
      topic: 'emoji_reactions'
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Subscribe to match updates
   * @param {Function} callback - Callback function to handle match updates
   */
  subscribeToMatchUpdates(callback) {
    this.on('match_update', callback);
    
    // Send subscription message to backend
    this.send({
      type: 'subscribe',
      topic: 'match_updates'
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Subscribe to analytics updates
   * @param {Function} callback - Callback function to handle analytics updates
   */
  subscribeToAnalytics(callback) {
    this.on('analytics_update', callback);
    
    // Send subscription message to backend
    this.send({
      type: 'subscribe',
      topic: 'analytics'
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Subscribe to admin updates (emoji list changes, etc.)
   * @param {Function} callback - Callback function to handle admin updates
   */
  subscribeToAdminUpdates(callback) {
    this.on('admin_update', callback);
    
    // Send subscription message to backend
    this.send({
      type: 'subscribe',
      topic: 'admin_updates'
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // PUBLIC_INTERFACE
  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   * @private
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Handle incoming WebSocket messages
   * @private
   */
  handleMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case 'emoji_reaction':
        this.emit('emoji_reaction', payload);
        break;
      case 'match_update':
        this.emit('match_update', payload);
        break;
      case 'analytics_update':
        this.emit('analytics_update', payload);
        break;
      case 'admin_update':
        this.emit('admin_update', payload);
        break;
      case 'heartbeat':
        // Respond to heartbeat to keep connection alive
        this.send({ type: 'heartbeat_response' });
        break;
      default:
        console.log('Unknown WebSocket message type:', type);
    }
  }

  /**
   * Schedule reconnection attempt
   * @private
   */
  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling WebSocket reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect();
      }
    }, delay);
  }

  // PUBLIC_INTERFACE
  /**
   * Get current connection status
   * @returns {string} Connection status
   */
  getConnectionStatus() {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Check if WebSocket is connected
   * @returns {boolean} True if connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export default websocketService;
