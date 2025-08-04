import React, { useState } from 'react';
import './GameFilterBar.css';

// PUBLIC_INTERFACE
/**
 * Simple game filter bar component
 * Basic filter functionality with minimal styling
 * @param {Array} filters - Array of filter objects with id, label, and category
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
  // Handle filter selection
  const handleFilterSelect = (filter) => {
    if (onFilterChange) {
      onFilterChange(filter.category, filter.id);
    }
  };

  return (
    <div className={`game-filter-bar ${className}`}>
      <div className="filter-container">
        {filters.map((filter) => {
          const isSelected = selectedFilters[filter.category] === filter.id;
          
          return (
            <button
              key={`${filter.category}-${filter.id}`}
              className={`filter-button ${isSelected ? 'active' : ''}`}
              onClick={() => handleFilterSelect(filter)}
              aria-selected={isSelected}
              aria-label={`Filter by ${filter.label}`}
            >
              {filter.icon && (
                <span className="filter-icon">
                  {filter.icon}
                </span>
              )}
              <span className="filter-label">
                {filter.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameFilterBar;
