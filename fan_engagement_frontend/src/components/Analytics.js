import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
function Analytics({ currentMatch }) {
  /**
   * Enhanced Analytics component with real-time statistics and modern design.
   * Now displays analytics specific to the currently active match.
   * @param {object} currentMatch - The currently active match object
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

  // Update analytics when current match changes
  useEffect(() => {
    if (currentMatch) {
      setLoading(true);
      
      // Generate match-specific analytics data
      const generateMatchStats = (match) => {
        const baseReactions = Math.floor(Math.random() * 10000) + 5000;
        const baseViewers = Math.floor(Math.random() * 3000) + 1000;
        
        // Generate match-specific moments based on team names
        const generateMoments = (match) => {
          const moments = [
            { time: '12\'', event: `Goal by ${match.home.name}`, reactions: Math.floor(Math.random() * 2000) + 800 },
            { time: '34\'', event: 'Yellow Card', reactions: Math.floor(Math.random() * 800) + 200 },
            { time: '67\'', event: `Goal by ${match.away.name}`, reactions: Math.floor(Math.random() * 2500) + 1000 },
          ];
          
          if (match.status === 'live') {
            moments.push({ 
              time: match.time, 
              event: `Current play - ${match.status}`, 
              reactions: Math.floor(Math.random() * 500) + 100 
            });
          }
          
          return moments.sort((a, b) => parseInt(a.time) - parseInt(b.time));
        };

        return {
          totalReactions: baseReactions,
          uniqueViewers: baseViewers,
          peakViewers: baseViewers + Math.floor(Math.random() * 1000) + 500,
          engagementRate: Math.floor(Math.random() * 25) + 65,
          topEmoji: ['🔥', '❤️', '⚽', '🎉', '😮'][Math.floor(Math.random() * 5)],
          matchMoments: generateMoments(match)
        };
      };

      const timer = setTimeout(() => {
        setStats(generateMatchStats(currentMatch));
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentMatch]);

  // Listen for active match change events
  useEffect(() => {
    const handleActiveMatchChange = (event) => {
      const { matchInfo } = event.detail;
      if (matchInfo) {
        setLoading(true);
        
        // Refresh analytics for new match
        setTimeout(() => {
          const generateMatchStats = (match) => {
            const baseReactions = Math.floor(Math.random() * 10000) + 5000;
            const baseViewers = Math.floor(Math.random() * 3000) + 1000;
            
            const generateMoments = (match) => {
              const moments = [
                { time: '12\'', event: `Goal by ${match.home.name}`, reactions: Math.floor(Math.random() * 2000) + 800 },
                { time: '34\'', event: 'Yellow Card', reactions: Math.floor(Math.random() * 800) + 200 },
                { time: '67\'', event: `Goal by ${match.away.name}`, reactions: Math.floor(Math.random() * 2500) + 1000 },
              ];
              
              if (match.status === 'live') {
                moments.push({ 
                  time: match.time, 
                  event: `Current play - ${match.status}`, 
                  reactions: Math.floor(Math.random() * 500) + 100 
                });
              }
              
              return moments.sort((a, b) => parseInt(a.time) - parseInt(b.time));
            };

            return {
              totalReactions: baseReactions,
              uniqueViewers: baseViewers,
              peakViewers: baseViewers + Math.floor(Math.random() * 1000) + 500,
              engagementRate: Math.floor(Math.random() * 25) + 65,
              topEmoji: ['🔥', '❤️', '⚽', '🎉', '😮'][Math.floor(Math.random() * 5)],
              matchMoments: generateMoments(match)
            };
          };

          setStats(generateMatchStats(matchInfo));
          setLoading(false);
        }, 800);
      }
    };

    window.addEventListener('activeMatchChanged', handleActiveMatchChange);
    return () => window.removeEventListener('activeMatchChanged', handleActiveMatchChange);
  }, []);

  // Simulate real-time updates (only for live matches)
  useEffect(() => {
    if (!currentMatch || currentMatch.status !== 'live') return;

    const updateInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalReactions: prev.totalReactions + Math.floor(Math.random() * 15) + 1,
        uniqueViewers: Math.max(100, prev.uniqueViewers + Math.floor(Math.random() * 6) - 2),
        engagementRate: Math.max(40, Math.min(95, prev.engagementRate + (Math.random() - 0.5) * 3))
      }));
    }, 5000);

    return () => clearInterval(updateInterval);
  }, [currentMatch]);

  // Initial load effect
  useEffect(() => {
    if (!currentMatch) {
      // Default stats when no match is selected
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

      return () => clearTimeout(timer);
    }
  }, [currentMatch]);

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
      {/* Header with improved spacing and layout */}
      <div style={{ 
        marginBottom: 'var(--space-lg)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-md)',
          gap: 'var(--space-sm)'
        }}>
          <h2 style={{ 
            margin: 0, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-sm)',
            fontSize: '1.125rem',
            fontWeight: '700'
          }}>
            <span>📊</span>
            Analytics
          </h2>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: currentMatch?.status === 'live' ? 'var(--accent-green)' : 'var(--secondary-text)',
            animation: currentMatch?.status === 'live' ? 'pulse-subtle 2s ease-in-out infinite' : 'none',
            flexShrink: 0
          }} title={currentMatch?.status === 'live' ? 'Live data' : 'Historical data'} />
        </div>
        
        {/* Match Information Card - Neat and Compact */}
        {currentMatch && (
          <div style={{
            background: 'var(--tertiary-background)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-md)'
          }}>
            {/* League Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-sm)'
            }}>
              <div style={{
                background: 'var(--accent-blue)',
                color: 'white',
                padding: 'var(--space-xs) var(--space-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {currentMatch.league}
              </div>
              {currentMatch.status === 'live' && (
                <div style={{
                  background: 'var(--accent-red)',
                  color: 'white',
                  padding: 'var(--space-xs) var(--space-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  animation: 'pulse-glow 2s ease-in-out infinite alternate'
                }}>
                  <span style={{ fontSize: '0.6rem' }}>🔴</span>
                  LIVE
                </div>
              )}
            </div>
            
            {/* Teams Display - Compact */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-sm)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                flex: 1,
                minWidth: 0
              }}>
                <img 
                  src={currentMatch.home.logo} 
                  alt={currentMatch.home.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}
                />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {currentMatch.home.name}
                </span>
              </div>
              
              <div style={{
                background: 'var(--glass-background)',
                padding: 'var(--space-xs) var(--space-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: '700',
                color: 'var(--primary-text)',
                flexShrink: 0
              }}>
                {currentMatch.score}
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                flex: 1,
                minWidth: 0,
                justifyContent: 'flex-end'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {currentMatch.away.name}
                </span>
                <img 
                  src={currentMatch.away.logo} 
                  alt={currentMatch.away.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}
                />
              </div>
            </div>
            
            {/* Match Time */}
            {currentMatch.status === 'live' && (
              <div style={{
                textAlign: 'center',
                marginTop: 'var(--space-sm)',
                padding: 'var(--space-xs)',
                background: 'var(--glass-background)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--secondary-text)',
                fontWeight: '600'
              }}>
                {currentMatch.time}
              </div>
            )}
          </div>
        )}
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
