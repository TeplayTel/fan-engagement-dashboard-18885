import React, { useState, useRef, useEffect, useCallback } from 'react';
import './NetflixStyleFilterBar.css';

// PUBLIC_INTERFACE
/**
 * Netflix-style horizontally scrollable filter bar component
 * Features smooth scrolling, chip/pill design, and responsive behavior
 * @param {Array} filters - Array of filter objects with id, label, icon, and category
 * @param {Object} selectedFilters - Object containing selected filter IDs by category
 * @param {Function} onFilterChange - Callback function when filter selection changes
 * @param {String} className - Additional CSS classes
 */
const NetflixStyleFilterBar = ({ 
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
      // Only handle horizontal scrolling if there's overflow
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

  // Smooth scroll to show active filter
  const scrollToActiveFilter = useCallback((filterId) => {
    if (scrollContainerRef.current) {
      const filterElement = scrollContainerRef.current.querySelector(`[data-filter-id="${filterId}"]`);
      if (filterElement) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const filterRect = filterElement.getBoundingClientRect();
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        
        // Calculate if filter is not fully visible
        if (filterRect.left < containerRect.left || filterRect.right > containerRect.right) {
          const targetScrollLeft = scrollLeft + filterRect.left - containerRect.left - 20;
          scrollContainerRef.current.scrollTo({
            left: Math.max(0, targetScrollLeft),
            behavior: 'smooth'
          });
        }
      }
    }
  }, []);

  // Initialize scroll position check
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', handleScroll, { passive: true });
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      // Check on resize
      const resizeObserver = new ResizeObserver(checkScrollPosition);
      resizeObserver.observe(container);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('wheel', handleWheel);
        resizeObserver.disconnect();
      };
    }
  }, [handleScroll, handleWheel, checkScrollPosition]);

  // Scroll to active filter when selection changes
  useEffect(() => {
    Object.values(selectedFilters).forEach(filterId => {
      if (filterId && filterId !== 'all_status' && filterId !== 'all_sports') {
        scrollToActiveFilter(filterId);
      }
    });
  }, [selectedFilters, scrollToActiveFilter]);

  return (
    <div className={`netflix-filter-bar ${className}`}>
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
        aria-label="Filter options"
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
                  animationDelay: `${index * 0.05}s`
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

export default React.memo(NetflixStyleFilterBar);
