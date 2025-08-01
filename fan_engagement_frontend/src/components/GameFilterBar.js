import React, { useState, useRef, useEffect, useCallback } from 'react';
import './GameFilterBar.css';

// PUBLIC_INTERFACE
/**
 * Modern game filter bar component positioned above the match player
 * Features smooth animations, dark colorful theme, and minimalistic design
 * @param {Array} filters - Array of filter objects with id, label, icon, and category
 * @param {Object} selectedFilters - Object containing selected filter IDs by category
 * @param {Function} onFilterChange - Callback function when filter selection changes
 * @param {String} className - Additional CSS classes
 */
const GameFilterBar = ({ 
  filters = [], 
  selectedFilters = {}, 
  onFilterChange,
  className = ''
}) => {
  const scrollContainerRef = useRef(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  // Check scroll position to show/hide gradients
  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftGradient(scrollLeft > 10);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!isScrolling) {
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 150);
    }
    checkScrollPosition();
  }, [isScrolling, checkScrollPosition]);

  // Handle mouse wheel for horizontal scrolling
  const handleWheel = useCallback((e) => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollWidth > clientWidth) {
        e.preventDefault();
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    }
  }, []);

  // Handle filter selection
  const handleFilterSelect = useCallback((filter) => {
    if (onFilterChange) {
      onFilterChange(filter.category, filter.id);
    }
  }, [onFilterChange]);

  // Initialize scroll position check
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', handleScroll, { passive: true });
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      const resizeObserver = new ResizeObserver(checkScrollPosition);
      resizeObserver.observe(container);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('wheel', handleWheel);
        resizeObserver.disconnect();
      };
    }
  }, [handleScroll, handleWheel, checkScrollPosition]);

  return (
    <div className={`game-filter-bar ${className}`}>
      {/* Left gradient overlay */}
      <div 
        className={`filter-gradient filter-gradient-left ${showLeftGradient ? 'visible' : ''}`}
        aria-hidden="true"
      />
      
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className={`filter-scroll-container ${isScrolling ? 'scrolling' : ''}`}
        role="tablist"
        aria-label="Game filter options"
      >
        <div className="filter-chips-container">
          {filters.map((filter, index) => {
            const isSelected = selectedFilters[filter.category] === filter.id;
            
            return (
              <button
                key={`${filter.category}-${filter.id}`}
                data-filter-id={filter.id}
                className={`filter-chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleFilterSelect(filter)}
                role="tab"
                aria-selected={isSelected}
                aria-label={`Filter by ${filter.label}`}
                style={{
                  animationDelay: `${index * 0.08}s`
                }}
              >
                {filter.icon && (
                  <span className="filter-chip-icon" aria-hidden="true">
                    {filter.icon}
                  </span>
                )}
                <span className="filter-chip-label">
                  {filter.label}
                </span>
                {isSelected && (
                  <span 
                    className="filter-chip-indicator" 
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Right gradient overlay */}
      <div 
        className={`filter-gradient filter-gradient-right ${showRightGradient ? 'visible' : ''}`}
        aria-hidden="true"
      />
    </div>
  );
};

export default React.memo(GameFilterBar);
