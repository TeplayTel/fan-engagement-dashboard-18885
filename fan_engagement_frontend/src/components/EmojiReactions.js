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
  const { isAuthenticated, getDemoToken, login } = useAuth();

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
  }, [isAuthenticated]);

  const handleEmojiClick = async (emojiData) => {
    // Create flying animation
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji: emojiData.emoji,
      left: `${Math.random() * 90 + 5}%`, // From 5% to 95%
    };

    setFlyingEmojis((currentEmojis) => [...currentEmojis, newEmoji]);

    // Send reaction to backend (optional, non-blocking)
    try {
      const reactionData = {
        emoji_id: emojiData.id,
        emoji: emojiData.emoji,
        timestamp: new Date().toISOString(),
      };
      
      // Fire and forget - don't block the UI animation
      apiService.sendReaction(reactionData).catch(err => {
        console.warn('Failed to send reaction to backend:', err);
      });
    } catch (err) {
      console.warn('Error preparing reaction data:', err);
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
