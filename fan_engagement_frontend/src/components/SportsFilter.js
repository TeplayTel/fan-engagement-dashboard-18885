import React from 'react';

const filterOptions = [
  { id: 'all', label: 'All Sports', icon: '⚽', count: 3 },
  { id: 'live', label: 'Live', icon: '🔴', count: 2 },
  { id: 'premier league', label: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 1 },
  { id: 'la liga', label: 'La Liga', icon: '🇪🇸', count: 1 },
  { id: 'serie a', label: 'Serie A', icon: '🇮🇹', count: 1 },
  { id: 'champions league', label: 'Champions League', icon: '🏆', count: 0 }
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
