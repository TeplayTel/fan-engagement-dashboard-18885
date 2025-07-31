import React, { useState } from 'react';

// Emojis - this could come from an API in the future
const availableEmojis = ['❤️', '🔥', '😂', '😮', '👍'];

// PUBLIC_INTERFACE
function EmojiReactions() {
  /**
   * A responsive bar for displaying emoji reactions.
   * Emojis can be clicked to trigger an animation.
   */
  const [flyingEmojis, setFlyingEmojis] = useState([]);

  const handleEmojiClick = (emoji) => {
    // Create a new emoji object with a unique ID and random horizontal start position
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji: emoji,
      left: `${Math.random() * 90 + 5}%`, // From 5% to 95%
    };

    setFlyingEmojis((currentEmojis) => [...currentEmojis, newEmoji]);
  };

  const handleAnimationEnd = (id) => {
    // Remove the emoji from state once its animation is complete
    setFlyingEmojis((currentEmojis) =>
      currentEmojis.filter((e) => e.id !== id)
    );
  };

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
          {availableEmojis.map((emoji) => (
            <span
              key={emoji}
              className="emoji"
              onClick={() => handleEmojiClick(emoji)}
              role="button"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
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
