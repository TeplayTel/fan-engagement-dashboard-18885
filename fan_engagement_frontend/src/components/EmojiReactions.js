import React, { useState, useEffect, useMemo } from 'react';
import apiService from '../services/apiService';
import websocketService from '../services/websocketService';
import useAuth from '../hooks/useAuth';

// Fallback emojis with enhanced variety - moved outside component to avoid dependency issues
const FALLBACK_EMOJIS = [
  { id: 1, emoji: '❤️', name: 'heart' },
  { id: 2, emoji: '🔥', name: 'fire' },
  { id: 3, emoji: '😂', name: 'laugh' },
  { id: 4, emoji: '😮', name: 'wow' },
  { id: 5, emoji: '👍', name: 'thumbs_up' },
  { id: 6, emoji: '⚽', name: 'soccer' },
  { id: 7, emoji: '🎉', name: 'celebration' },
  { id: 8, emoji: '😢', name: 'sad' }
];

// PUBLIC_INTERFACE
function EmojiReactions({ currentMatch }) {
  /**
   * A sleek, single-row emoji reactions bar that appears as a minimalist overlay.
   * Positioned to never obscure video player controls with modern aesthetics.
   * Now context-aware of the current match for better reaction tracking.
   * @param {object} currentMatch - The currently active match object
   */
  const [flyingEmojis, setFlyingEmojis] = useState([]);
  const [availableEmojis, setAvailableEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [recentClicks, setRecentClicks] = useState([]);
  const [viewerCount, setViewerCount] = useState(2100);
  const { isAuthenticated, getDemoToken, login, userToken } = useAuth();

  // Memoize fallback emojis to prevent re-renders
  const fallbackEmojis = useMemo(() => FALLBACK_EMOJIS, []);

  // Auto-login effect
  useEffect(() => {
    if (!isAuthenticated) {
      const demoToken = getDemoToken(false);
      login(demoToken, false);
    }
  }, [isAuthenticated, getDemoToken, login]);

  // Fetch emojis effect
  useEffect(() => {
    const fetchEmojis = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        
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
        console.warn('Failed to fetch emojis from API, using fallback:', err);
        setAvailableEmojis(fallbackEmojis);
      } finally {
        setLoading(false);
      }
    };

    fetchEmojis();

    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        fetchEmojis();
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  // Listen for admin updates via WebSocket and custom events
  useEffect(() => {
    const handleEmojiListUpdate = () => {
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

    // WebSocket subscription for admin updates
    const handleAdminUpdate = (adminData) => {
      console.log('Received admin update:', adminData);
      if (adminData.type === 'emoji_list_updated') {
        handleEmojiListUpdate();
      }
    };

    websocketService.subscribeToAdminUpdates(handleAdminUpdate);
    window.addEventListener('emojiListUpdated', handleEmojiListUpdate);
    
    // Subscribe to viewer count updates
    const handleViewerUpdate = (viewerData) => {
      if (viewerData.eventId === (currentMatch ? `live_match_${currentMatch.id.toString().padStart(3, '0')}` : "live_match_001")) {
        setViewerCount(viewerData.viewerCount || viewerData.count || viewerCount);
      }
    };

    websocketService.on('viewer_update', handleViewerUpdate);

    return () => {
      window.removeEventListener('emojiListUpdated', handleEmojiListUpdate);
      websocketService.off('admin_update', handleAdminUpdate);
      websocketService.off('viewer_update', handleViewerUpdate);
    };
  }, [isAuthenticated, fallbackEmojis, currentMatch, viewerCount]);

  const handleEmojiClick = async (emojiData) => {
    // Prevent spam clicking
    const now = Date.now();
    const recentClicksFiltered = recentClicks.filter(time => now - time < 1000);
    if (recentClicksFiltered.length >= 3) {
      setFeedbackMessage('Slow down! 🙂');
      setFeedbackType('warning');
      setTimeout(() => {
        setFeedbackMessage(null);
        setFeedbackType(null);
      }, 2000);
      return;
    }

    setRecentClicks([...recentClicksFiltered, now]);

    // Create enhanced flying animation
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji: emojiData.emoji,
      left: `${Math.random() * 80 + 10}%`,
      animationDelay: `${Math.random() * 0.5}s`,
      scale: 0.8 + Math.random() * 0.4,
      rotation: (Math.random() - 0.5) * 30
    };

    setFlyingEmojis((currentEmojis) => [...currentEmojis, newEmoji]);

    // Clear previous feedback
    setFeedbackMessage(null);
    setFeedbackType(null);

    // Send reaction to backend
    try {
      const currentTime = new Date().toISOString();
      
      let userId;
      if (isAuthenticated && userToken) {
        userId = userToken.includes('demo_') ? userToken : `user_${userToken.substring(0, 8)}`;
      } else {
        userId = `anonymous_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      }

      // Use current match ID or fallback to default
      const eventId = currentMatch ? `live_match_${currentMatch.id.toString().padStart(3, '0')}` : "live_match_001";
      
      const reactionPayload = {
        userId: userId,
        eventId: eventId,
        emojiId: emojiData.id.toString(),
        createdAt: currentTime
      };
      
      const response = await apiService.sendUserEmojiReaction(reactionPayload);
      
      setFeedbackMessage('✨ Sent!');
      setFeedbackType('success');
      
      setTimeout(() => {
        setFeedbackMessage(null);
        setFeedbackType(null);
      }, 1500);
      
      console.log('Emoji reaction sent successfully:', response);
      
    } catch (err) {
      console.warn('Failed to send reaction to backend:', err);
      
      let errorMessage = 'Failed to send';
      
      if (err.message.includes('401')) {
        errorMessage = 'Auth required';
      } else if (err.message.includes('403')) {
        errorMessage = 'Access denied';
      } else if (err.message.includes('404')) {
        errorMessage = 'Service unavailable';
      } else if (err.message.includes('500')) {
        errorMessage = 'Server error';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Connection failed';
      }
      
      setFeedbackMessage(errorMessage);
      setFeedbackType('error');
      
      setTimeout(() => {
        setFeedbackMessage(null);
        setFeedbackType(null);
      }, 2500);
    }
  };

  const handleAnimationEnd = (id) => {
    setFlyingEmojis((currentEmojis) =>
      currentEmojis.filter((e) => e.id !== id)
    );
  };

  if (loading) {
    return (
      <div className="emoji-reactions-bar-sleek">
        <div className="emoji-reactions-content-sleek">
          <div className="emoji-list-sleek">
            <div className="emoji-loading-sleek">
              <span className="loading-spinner">⏳</span>
              <span>Loading...</span>
            </div>
          </div>
          <div className="watching-counter-sleek">
            <span className="watching-count-sleek">{viewerCount >= 1000 ? `${(viewerCount / 1000).toFixed(1)}K` : viewerCount}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced flying emoji container */}
      <div className="flying-emoji-container-sleek">
        {flyingEmojis.map((item) => (
          <span
            key={item.id}
            className="flying-emoji-sleek"
            style={{ 
              left: item.left,
              animationDelay: item.animationDelay,
              '--emoji-scale': item.scale,
              '--emoji-rotation': `${item.rotation}deg`
            }}
            onAnimationEnd={() => handleAnimationEnd(item.id)}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Sleek single-row emoji bar */}
      <div className="emoji-reactions-bar-sleek">
        <div className="emoji-reactions-content-sleek">
          {/* Status feedback (minimal) */}
          {feedbackMessage && (
            <div className={`feedback-message-sleek ${feedbackType}`}>
              {feedbackMessage}
            </div>
          )}

          {/* Emoji list - single row, horizontal */}
          <div className="emoji-list-sleek">
            {availableEmojis.slice(0, 8).map((emojiData, index) => (
              <button
                key={emojiData.id}
                className="emoji-button-sleek"
                onClick={() => handleEmojiClick(emojiData)}
                aria-label={`React with ${emojiData.name || emojiData.emoji}`}
                title={emojiData.name || emojiData.emoji}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <span className="emoji-symbol-sleek">{emojiData.emoji}</span>
              </button>
            ))}
          </div>

          {/* Watching counter (compact) */}
          <div className="watching-counter-sleek">
            <span className="watching-count-sleek">{viewerCount >= 1000 ? `${(viewerCount / 1000).toFixed(1)}K` : viewerCount}</span>
            <div className="live-pulse-sleek"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmojiReactions;
