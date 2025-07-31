import React from 'react';

// Emojis - this could come from an API in the future
const availableEmojis = ['❤️', '🔥', '😂', '😮', '👍'];

// PUBLIC_INTERFACE
function EmojiReactions() {
  /**
   * A responsive bar for displaying emoji reactions.
   * Emojis can be clicked to trigger an animation.
   */

  const handleEmojiClick = (emoji, event) => {
    // Animation logic will be added in a later step.
    console.log(`Emoji clicked: ${emoji}`);
  };

  return (
    <div className="emoji-reactions-bar">
      <div className="emoji-list">
        {availableEmojis.map((emoji) => (
          <span
            key={emoji}
            className="emoji"
            onClick={(e) => handleEmojiClick(emoji, e)}
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
  );
}

export default EmojiReactions;
