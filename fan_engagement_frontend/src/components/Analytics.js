import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
function Analytics() {
  /**
   * Enhanced Analytics component with real-time statistics and modern design.
   */
  const [stats, setStats] = useState({
    totalReactions: 0,
    uniqueViewers: 0,
    peakViewers: 0,
    engagementRate: 0,
    topEmoji: '❤️',
    matchMoments: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      setStats({
        totalReactions: 12847,
        uniqueViewers: 2147,
        peakViewers: 3521,
        engagementRate: 68.5,
        topEmoji: '🔥',
        matchMoments: [
          { time: '12\'', event: 'Goal by Arsenal', reactions: 1247 },
          { time: '34\'', event: 'Yellow Card', reactions: 523 },
          { time: '67\'', event: 'Goal by Chelsea', reactions: 1891 },
          { time: '88\'', event: 'Goal by Arsenal', reactions: 2156 }
        ]
      });
      setLoading(false);
    }, 1000);

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalReactions: prev.totalReactions + Math.floor(Math.random() * 15),
        uniqueViewers: prev.uniqueViewers + Math.floor(Math.random() * 3) - 1,
        engagementRate: Math.max(60, Math.min(85, prev.engagementRate + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(updateInterval);
    };
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="analytics-section">
        <h2>Analytics</h2>
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i}
              style={{
                height: '80px',
                background: 'var(--tertiary-background)',
                borderRadius: 'var(--radius-md)',
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-section">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 'var(--space-lg)'
      }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span>📊</span>
          Live Analytics
        </h2>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--accent-green)',
          animation: 'pulse-subtle 2s ease-in-out infinite'
        }} title="Live data" />
      </div>

      {/* Key Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-lg)'
      }}>
        <div style={{
          background: 'var(--glass-background)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--hover-border)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.transform = 'translateY(0)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))'
          }} />
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)'
          }}>
            <span>🎯</span>
            Total Reactions
          </div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700',
            color: 'var(--primary-text)',
            letterSpacing: '-0.025em'
          }}>
            {formatNumber(stats.totalReactions)}
          </div>
        </div>

        <div style={{
          background: 'var(--glass-background)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--hover-border)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.transform = 'translateY(0)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--accent-green), var(--accent-blue))'
          }} />
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)'
          }}>
            <span>👥</span>
            Active Viewers
          </div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700',
            color: 'var(--primary-text)',
            letterSpacing: '-0.025em'
          }}>
            {formatNumber(stats.uniqueViewers)}
          </div>
        </div>

        <div style={{
          background: 'var(--glass-background)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--hover-border)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.transform = 'translateY(0)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--accent-orange), var(--accent-red))'
          }} />
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)'
          }}>
            <span>📈</span>
            Engagement Rate
          </div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700',
            color: 'var(--primary-text)',
            letterSpacing: '-0.025em',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)'
          }}>
            {stats.engagementRate.toFixed(1)}%
            <span style={{ 
              fontSize: '0.875rem', 
              color: 'var(--accent-green)',
              fontWeight: '600'
            }}>
              +2.3%
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--glass-background)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--hover-border)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.transform = 'translateY(0)';
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-red))'
          }} />
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)'
          }}>
            <span>🏆</span>
            Top Emoji
          </div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700',
            color: 'var(--primary-text)',
            letterSpacing: '-0.025em',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}>
            <span style={{ fontSize: '2rem' }}>{stats.topEmoji}</span>
            <span>Fire</span>
          </div>
        </div>
      </div>

      {/* Match Moments */}
      <div style={{
        background: 'var(--glass-background)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        transition: 'all 0.3s ease'
      }}>
        <h3 style={{ 
          margin: '0 0 var(--space-md) 0',
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--primary-text)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)'
        }}>
          <span>⚡</span>
          Key Moments
        </h3>
        
        <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
          {stats.matchMoments.map((moment, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-sm)',
                background: 'var(--tertiary-background)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--secondary-background)';
                e.target.style.borderColor = 'var(--hover-border)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--tertiary-background)';
                e.target.style.borderColor = 'var(--border-color)';
              }}
            >
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent-blue)',
                  fontWeight: '600',
                  marginRight: 'var(--space-sm)'
                }}>
                  {moment.time}
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  color: 'var(--primary-text)'
                }}>
                  {moment.event}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                fontSize: '0.875rem',
                color: 'var(--secondary-text)',
                fontWeight: '500'
              }}>
                <span>🎯</span>
                <span>{formatNumber(moment.reactions)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
