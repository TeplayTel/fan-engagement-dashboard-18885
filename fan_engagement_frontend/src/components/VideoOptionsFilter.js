import React from 'react';
import './VideoOptionsFilter.css';

// PUBLIC_INTERFACE
/**
 * Simple video options filter component
 * Basic filter functionality with minimal styling
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
  // Handle option selection
  const handleOptionSelect = (option) => {
    if (onOptionChange) {
      onOptionChange(option.id);
    }
  };

  return (
    <div className={`video-options-filter ${className}`}>
      <div className="video-options-header">
        <h3 className="options-title">Video Options</h3>
      </div>
      
      <div className="video-options-container">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          
          return (
            <button
              key={option.id}
              className={`video-option ${isSelected ? 'active' : ''}`}
              onClick={() => handleOptionSelect(option)}
              aria-selected={isSelected}
              aria-label={`Select ${option.label} video option`}
            >
              {option.icon && (
                <span className="option-icon">
                  {option.icon}
                </span>
              )}
              <span className="option-label">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VideoOptionsFilter;
