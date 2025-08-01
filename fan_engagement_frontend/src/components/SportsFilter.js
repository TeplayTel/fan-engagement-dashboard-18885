import React from 'react';

// Sports type filter options
const sportsTypeFilters = [
  { id: 'all', label: 'All Sports', icon: '⚽', type: 'sports' },
  { id: 'football', label: 'Football', icon: '⚽', type: 'sports' },
  { id: 'basketball', label: 'Basketball', icon: '🏀', type: 'sports' },
  { id: 'tennis', label: 'Tennis', icon: '🎾', type: 'sports' },
  { id: 'baseball', label: 'Baseball', icon: '⚾', type: 'sports' }
];

// Status filters (for Other Matches section)
const statusFilters = [
  { id: 'all_status', label: 'All', icon: '📺', type: 'status' },
  { id: 'live', label: 'Live', icon: '🔴', type: 'status' },
  { id: 'recorded', label: 'Recorded', icon: '📹', type: 'status' }
];

// PUBLIC_INTERFACE
function SportsFilter({ selectedFilter = 'all', onFilterChange, showStatusFilter = false, selectedStatus = 'all_status', onStatusChange }) {
  /**
   * Enhanced SportsFilter component for filtering matches by sport type and status.
   * @param {string} selectedFilter - Currently selected sports filter
   * @param {function} onFilterChange - Callback for sports filter changes
   * @param {boolean} showStatusFilter - Whether to show live/recorded status filter
   * @param {string} selectedStatus - Currently selected status filter
   * @param {function} onStatusChange - Callback for status filter changes
   */
  
  const handleSportsFilterClick = (filterId) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  const handleStatusFilterClick = (statusId) => {
    if (onStatusChange) {
      onStatusChange(statusId);
    }
  };

  return (
    <div className="sports-filter-bar">
      {/* Sports Type Filter */}
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
        <span>Filter by sport:</span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-sm)', 
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: showStatusFilter ? 'var(--space-md)' : '0'
      }}>
        {sportsTypeFilters.map((option) => (
          <button 
            key={option.id}
            className={`filter-btn ${selectedFilter === option.id ? 'active' : ''}`}
            onClick={() => handleSportsFilterClick(option.id)}
            aria-label={`Filter by ${option.label}`}
            title={`Show ${option.label.toLowerCase()} matches`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Status Filter (Live/Recorded) - Only shown for Other Matches section */}
      {showStatusFilter && (
        <>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-sm)',
            color: 'var(--secondary-text)',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <span>📡</span>
            <span>Filter by status:</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-sm)', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {statusFilters.map((option) => (
              <button 
                key={option.id}
                className={`filter-btn ${selectedStatus === option.id ? 'active' : ''}`}
                onClick={() => handleStatusFilterClick(option.id)}
                aria-label={`Filter by ${option.label}`}
                title={`Show ${option.label.toLowerCase()} matches`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: '0.875rem' }}>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SportsFilter;
