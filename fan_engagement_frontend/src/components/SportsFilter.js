import React from 'react';

// PUBLIC_INTERFACE
function SportsFilter() {
  /**
   * SportsFilter component for filtering matches by sport.
   */
  return (
    <div className="sports-filter-bar">
      <button className="filter-btn active">All Sports</button>
      <button className="filter-btn">Soccer</button>
      <button className="filter-btn">Basketball</button>
      <button className="filter-btn">Tennis</button>
      <button className="filter-btn">Cricket</button>
    </div>
  );
}

export default SportsFilter;
