import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
function BottomAnalytics({ currentMatch }) {
  /**
   * Bottom analytics section with horizontal arrangement of charts and data visualizations.
   * Features charts with dark theme, blue/red accent colors, and data legends.
   * Height: 200-250px as per design specs.
   */
  
  const [chartData, setChartData] = useState({
    timeline: [],
    heatmap: [],
    comparison: {}
  });
  
  const [activeChart, setActiveChart] = useState('timeline');

  useEffect(() => {
    generateChartData();
  }, [currentMatch]);

  const generateChartData = () => {
    // Generate timeline data for match events
    const timeline = [];
    for (let i = 0; i <= 90; i += 5) {
      timeline.push({
        time: i,
        homeActivity: Math.random() * 100,
        awayActivity: Math.random() * 100,
        events: Math.random() > 0.8 ? ['goal', 'card', 'substitution'][Math.floor(Math.random() * 3)] : null
      });
    }

    // Generate comparison data for cricket
    const comparison = {
      runs: { home: 187, away: 156 },
      boundaries: { home: 18, away: 12 },
      strikeRate: { home: 148, away: 132 },
      wickets: { home: 3, away: 5 },
      extras: { home: 12, away: 8 }
    };

    setChartData({ timeline, comparison });
  };

  const charts = [
    { id: 'timeline', label: 'Match Timeline', icon: '📊' },
    { id: 'heatmap', label: 'Activity Heatmap', icon: '🔥' },
    { id: 'comparison', label: 'Team Comparison', icon: '⚖️' }
  ];

  const renderTimelineChart = () => (
    <div className="timeline-chart">
      <div className="chart-header">
        <h4>Match Activity Timeline</h4>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color home"></div>
            <span>{currentMatch?.home.name || 'Home'}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color away"></div>
            <span>{currentMatch?.away.name || 'Away'}</span>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-y-axis">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        
        <div className="chart-area">
          <div className="chart-grid">
            {[0, 25, 50, 75, 100].map(line => (
              <div key={line} className="grid-line" style={{ bottom: `${line}%` }}></div>
            ))}
          </div>
          
          <svg className="chart-svg" viewBox="0 0 400 120">
            {/* Home team line */}
            <polyline
              fill="none"
              stroke="var(--accent-blue)"
              strokeWidth="2"
              points={chartData.timeline.map((point, index) => 
                `${(index / chartData.timeline.length) * 400},${120 - (point.homeActivity * 1.2)}`
              ).join(' ')}
            />
            
            {/* Away team line */}
            <polyline
              fill="none"
              stroke="var(--accent-red)"
              strokeWidth="2"
              points={chartData.timeline.map((point, index) => 
                `${(index / chartData.timeline.length) * 400},${120 - (point.awayActivity * 1.2)}`
              ).join(' ')}
            />
            
            {/* Event markers */}
            {chartData.timeline.map((point, index) => (
              point.events && (
                <circle
                  key={index}
                  cx={(index / chartData.timeline.length) * 400}
                  cy={120 - (Math.max(point.homeActivity, point.awayActivity) * 1.2)}
                  r="3"
                  fill="var(--warning-orange)"
                  className="event-marker"
                />
              )
            ))}
          </svg>
        </div>
        
        <div className="chart-x-axis">
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>9</span>
          <span>12</span>
          <span>15</span>
          <span>18</span>
        </div>
      </div>
    </div>
  );

  const renderComparisonChart = () => (
    <div className="comparison-chart">
      <div className="chart-header">
        <h4>Team Performance Comparison</h4>
      </div>
      
      <div className="comparison-bars">
        {Object.entries(chartData.comparison).map(([stat, values]) => (
          <div key={stat} className="comparison-row">
            <div className="stat-label">{stat.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
            
            <div className="bar-container">
              <div className="bar-section home">
                <div className="bar-value">{values.home}</div>
                <div 
                  className="bar-fill home"
                  style={{ width: `${(values.home / (values.home + values.away)) * 100}%` }}
                ></div>
              </div>
              
              <div className="bar-section away">
                <div 
                  className="bar-fill away"
                  style={{ width: `${(values.away / (values.home + values.away)) * 100}%` }}
                ></div>
                <div className="bar-value">{values.away}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeatmapChart = () => (
    <div className="heatmap-chart">
      <div className="chart-header">
        <h4>Activity Heatmap</h4>
        <div className="heatmap-legend">
          <span>Low</span>
          <div className="heat-gradient"></div>
          <span>High</span>
        </div>
      </div>
      
      <div className="heatmap-grid">
        {Array.from({ length: 60 }, (_, i) => (
          <div 
            key={i}
            className="heat-cell"
            style={{ 
              backgroundColor: `rgba(0, 102, 255, ${Math.random() * 0.8 + 0.1})`,
              animationDelay: `${i * 0.01}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bottom-analytics">
      <div className="analytics-header">
        <h3>
          <span className="analytics-icon">📈</span>
          Live Analytics Dashboard
        </h3>
        
        <div className="chart-tabs">
          {charts.map(chart => (
            <button
              key={chart.id}
              className={`chart-tab ${activeChart === chart.id ? 'active' : ''}`}
              onClick={() => setActiveChart(chart.id)}
            >
              <span className="tab-icon">{chart.icon}</span>
              <span className="tab-label">{chart.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="analytics-content">
        {activeChart === 'timeline' && renderTimelineChart()}
        {activeChart === 'comparison' && renderComparisonChart()}
        {activeChart === 'heatmap' && renderHeatmapChart()}
      </div>
      
      <div className="analytics-footer">
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="stat-icon">👥</span>
            <span className="stat-text">2.1K viewers</span>
          </div>
          <div className="footer-stat">
            <span className="stat-icon">💬</span>
            <span className="stat-text">1.2K reactions</span>
          </div>
          <div className="footer-stat">
            <span className="stat-icon">⚡</span>
            <span className="stat-text">Live updating</span>
          </div>
        </div>
        
        <div className="data-source">
          <span>Data updated every 30 seconds</span>
        </div>
      </div>
    </div>
  );
}

export default BottomAnalytics;
