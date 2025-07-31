import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import useAuth from '../hooks/useAuth';

// PUBLIC_INTERFACE
function EmojiReactions() {
  /**
   * A responsive bar for displaying emoji reactions.
   * Emojis are fetched from the backend API and can be clicked to trigger animations.
   */
  const [flyingEmojis, setFlyingEmojis] = useState([]);
  const [availableEmojis, setAvailableEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null); // 'success' or 'error'
  const { isAuthenticated, getDemoToken, login, userToken } = useAuth();

  // Fallback emojis in case API fails
  const fallbackEmojis = [
    { id: 1, emoji: '❤️', name: 'heart' },
    { id: 2, emoji: '🔥', name: 'fire' },
    { id: 3, emoji: '😂', name: 'laugh' },
    { id: 4, emoji: '😮', name: 'wow' },
    { id: 5, emoji: '👍', name: 'thumbs_up' }
  ];

  // Effect to ensure user has a token for API calls
  useEffect(() => {
    if (!isAuthenticated) {
      // Auto-login with demo token for seamless experience
      const demoToken = getDemoToken(false);
      login(demoToken, false);
    }
  }, [isAuthenticated, getDemoToken, login]);

  // Effect to fetch emojis from API
  useEffect(() => {
    const fetchEmojis = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        
        const emojisData = await apiService.getEmojis();
        
        // Handle different possible response formats
        let emojis = [];
        if (Array.isArray(emojisData)) {
          emojis = emojisData;
        } else if (emojisData && emojisData.emojis && Array.isArray(emojisData.emojis)) {
          emojis = emojisData.emojis;
        } else if (emojisData && emojisData.data && Array.isArray(emojisData.data)) {
          emojis = emojisData.data;
        }

        // Ensure emojis have the expected structure
        const formattedEmojis = emojis.map((emoji, index) => ({
          id: emoji.id || index + 1,
          emoji: emoji.emoji || emoji.symbol || emoji,
          name: emoji.name || `emoji_${index + 1}`
        }));

        setAvailableEmojis(formattedEmojis.length > 0 ? formattedEmojis : fallbackEmojis);
      } catch (err) {
        console.warn('Failed to fetch emojis from API, using fallback:', err);
        setError('Failed to load emojis from server');
        setAvailableEmojis(fallbackEmojis);
      } finally {
        setLoading(false);
      }
    };

    fetchEmojis();

    // Set up periodic refresh to catch admin updates
    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        fetchEmojis();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  // Listen for custom events from admin dashboard for immediate updates
  useEffect(() => {
    const handleEmojiListUpdate = () => {
      // Refresh emoji list immediately when admin makes changes
      if (isAuthenticated) {
        setTimeout(async () => {
          try {
            const emojisData = await apiService.getEmojis();
            let emojis = [];
            if (Array.isArray(emojisData)) {
              emojis = emojisData;
            } else if (emojisData && emojisData.emojis && Array.isArray(emojisData.emojis)) {
              emojis = emojisData.emojis;
            } else if (emojisData && emojisData.data && Array.isArray(emojisData.data)) {
              emojis = emojisData.data;
            }

            const formattedEmojis = emojis.map((emoji, index) => ({
              id: emoji.id || index + 1,
              emoji: emoji.emoji || emoji.symbol || emoji,
              name: emoji.name || `emoji_${index + 1}`
            }));

            setAvailableEmojis(formattedEmojis.length > 0 ? formattedEmojis : fallbackEmojis);
          } catch (err) {
            console.warn('Failed to refresh emoji list:', err);
          }
        }, 1000);
      }
    };

    // Listen for custom events
    window.addEventListener('emojiListUpdated', handleEmojiListUpdate);
    
    return () => {
      window.removeEventListener('emojiListUpdated', handleEmojiListUpdate);
    };
  }, [isAuthenticated, fallbackEmojis]);

  const handleEmojiClick = async (emojiData) => {
    // Create flying animation immediately for responsiveness
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji: emojiData.emoji,
      left: `${Math.random() * 90 + 5}%`, // From 5% to 95%
    };

    setFlyingEmojis((currentEmojis) => [...currentEmojis, newEmoji]);

    // Clear any previous feedback
    setFeedbackMessage(null);
    setFeedbackType(null);

    // Send reaction to backend with correct payload structure
    try {
      const currentTime = new Date().toISOString();
      
      // Generate userId - use token info or anonymous identifier
      let userId;
      if (isAuthenticated && userToken) {
        // Extract user ID from token or use token as identifier
        userId = userToken.includes('demo_') ? userToken : `user_${userToken.substring(0, 8)}`;
      } else {
        // Generate anonymous user identifier
        userId = `anonymous_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      }

      // Payload structure for /fan-engagement/emoji/v1/userEmojiReaction endpoint
      const reactionPayload = {
        userId: userId,           // User identifier (authenticated user token or anonymous ID)
        eventId: "live_match_001", // Event/match identifier - could be made dynamic
        emojiId: emojiData.id.toString(), // String representation of emoji ID
        createdAt: currentTime    // ISO timestamp when reaction was created
      };
      
      // Send the reaction with proper error handling
      const response = await apiService.sendUserEmojiReaction(reactionPayload);
      
      // Show success feedback
      setFeedbackMessage('Reaction sent!');
      setFeedbackType('success');
      
      // Clear feedback after 2 seconds
      setTimeout(() => {
        setFeedbackMessage(null);
        setFeedbackType(null);
      }, 2000);
      
      console.log('Emoji reaction sent successfully:', response);
      
    } catch (err) {
      console.warn('Failed to send reaction to backend:', err);
      
      // Provide more specific error feedback based on error type
      let errorMessage = 'Failed to send reaction';
      
      if (err.message.includes('401')) {
        errorMessage = 'Authentication required';
      } else if (err.message.includes('403')) {
        errorMessage = 'Access denied';
      } else if (err.message.includes('404')) {
        errorMessage = 'Service unavailable';
      } else if (err.message.includes('500')) {
        errorMessage = 'Server error';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Connection failed';
      }
      
      // Show error feedback
      setFeedbackMessage(errorMessage);
      setFeedbackType('error');
      
      // Clear error feedback after 3 seconds
      setTimeout(() => {
        setFeedbackMessage(null);
        setFeedbackType(null);
      }, 3000);
    }
  };

  const handleAnimationEnd = (id) => {
    // Remove the emoji from state once its animation is complete
    setFlyingEmojis((currentEmojis) =>
      currentEmojis.filter((e) => e.id !== id)
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="emoji-reactions-bar">
        <div className="emoji-list">
          <span style={{ color: 'var(--secondary-text)' }}>Loading emojis...</span>
        </div>
        <div className="watching-counter">
          <span className="watching-count">2.1K</span>
          <span className="watching-text">watching</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flying-emoji-container">
        {flyingEmojis.map((item) => (
          <span
            key={item.id}
            className="flying-emoji"
            style={{ left: item.left }}
            onAnimationEnd={() => handleAnimationEnd(item.id)}
          >
            {item.emoji}
          </span>
        ))}
      </div>
      <div className="emoji-reactions-bar">
        <div className="emoji-list">
          {error && (
            <span 
              style={{ 
                color: 'var(--accent-red)', 
                fontSize: '0.8rem', 
                marginRight: '8px' 
              }}
              title={error}
            >
              ⚠️
            </span>
          )}
          {feedbackMessage && (
            <span 
              style={{ 
                color: feedbackType === 'success' ? '#28A745' : 'var(--accent-red)', 
                fontSize: '0.8rem', 
                marginRight: '8px',
                fontWeight: 'bold'
              }}
            >
              {feedbackType === 'success' ? '✓' : '✗'} {feedbackMessage}
            </span>
          )}
          {availableEmojis.map((emojiData) => (
            <span
              key={emojiData.id}
              className="emoji"
              onClick={() => handleEmojiClick(emojiData)}
              role="button"
              aria-label={`React with ${emojiData.name || emojiData.emoji}`}
              title={emojiData.name || emojiData.emoji}
            >
              {emojiData.emoji}
            </span>
          ))}
        </div>
        <div className="watching-counter">
          <span className="watching-count">2.1K</span>
          <span className="watching-text">watching</span>
        </div>
      </div>
    </>
  );
}

export default EmojiReactions;
