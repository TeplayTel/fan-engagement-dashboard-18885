import React, { useState, useCallback } from 'react';
import './VideoOptionsFilter.css';

// PUBLIC_INTERFACE
/**
 * Modern video options filter component positioned below other matches
 * Features minimalistic dark theme design with accent highlights
 * @param {Array} options - Array of video option objects with id, label, icon
 * @param {String} selectedOption - Currently selected option ID
 * @param {Function} onOptionChange - Callback function when option selection changes
 * @param {String} className - Additional CSS classes
 */
const VideoOptionsFilter = ({ 
  options = [], 
  selectedOption = 'all_videos', 
  onOptionChange,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle option selection with animation
  const handleOptionSelect = useCallback((option) => {
    if (option.id === selectedOption || isAnimating) return;
    
    setIsAnimating(true);
    if (onOptionChange) {
      onOptionChange(option.id);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [selectedOption, isAnimating, onOptionChange]);

  return (
    <div className={`video-options-filter ${className}`}>
      <div className="video-options-header">
        <div className="options-title">
          <span className="title-icon">🎬</span>
          <h3 className="title-text">Video Options</h3>
        </div>
        <div className="options-count">
          {options.length} options
        </div>
      </div>
      
      <div className="video-options-container">
        {options.map((option, index) => {
          const isSelected = selectedOption === option.id;
          
          return (
            <button
              key={option.id}
              className={`video-option ${isSelected ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
              onClick={() => handleOptionSelect(option)}
              aria-selected={isSelected}
              aria-label={`Select ${option.label} video option`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {option.icon && (
                <span className="option-icon" aria-hidden="true">
                  {option.icon}
                </span>
              )}
              <span className="option-label">
                {option.label}
              </span>
              {isSelected && (
                <span className="option-indicator" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(VideoOptionsFilter);
