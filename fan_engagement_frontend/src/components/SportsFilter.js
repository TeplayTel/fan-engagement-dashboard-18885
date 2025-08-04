import React from 'react';

const filterOptions = [
  { id: 'all', label: 'All Cricket', icon: '🏏', count: 5 },
  { id: 'live', label: 'Live', icon: '🔴', count: 3 },
  { id: 't20 world cup', label: 'T20 World Cup', icon: '🏆', count: 1 },
  { id: 'ipl', label: 'IPL', icon: '🇮🇳', count: 1 },
  { id: 'odi', label: 'ODI Series', icon: '🌍', count: 1 },
  { id: 'test', label: 'Test Match', icon: '⚪', count: 1 },
  { id: 'big bash', label: 'Big Bash', icon: '🇦🇺', count: 1 }
];

// PUBLIC_INTERFACE
function SportsFilter({ selectedFilter = 'all', onFilterChange }) {
  /**
   * Enhanced SportsFilter component for filtering matches by sport or status.
   * @param {string} selectedFilter - Currently selected filter
   * @param {function} onFilterChange - Callback for filter changes
   */
  
  const handleFilterClick = (filterId) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  return (
    <div className="sports-filter-bar">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-sm)',
        color: 'var(--secondary-text)',
        fontSize: '0.875rem',
        fontWeight: '500'
      }}>
        <span>🔍</span>
        <span>Filter matches:</span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-sm)', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {filterOptions.map((option) => (
          <button 
            key={option.id}
            className={`filter-btn ${selectedFilter === option.id ? 'active' : ''}`}
            onClick={() => handleFilterClick(option.id)}
            aria-label={`Filter by ${option.label}`}
            title={`Show ${option.label.toLowerCase()} matches (${option.count} available)`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>{option.icon}</span>
            <span>{option.label}</span>
            {option.count > 0 && (
              <span style={{
                background: selectedFilter === option.id ? 'rgba(255, 255, 255, 0.2)' : 'var(--accent-blue)',
                color: 'white',
                fontSize: '0.75rem',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SportsFilter;
