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
            { time: '3.2', event: `Six by ${match.home.name}`, reactions: Math.floor(Math.random() * 2000) + 800 },
            { time: '7.4', event: 'Wicket fallen', reactions: Math.floor(Math.random() * 2500) + 1000 },
            { time: '12.1', event: `Four by ${match.home.name}`, reactions: Math.floor(Math.random() * 1500) + 600 },
            { time: '14.5', event: 'Dropped catch', reactions: Math.floor(Math.random() * 800) + 200 },
          ];
          
          if (match.status === 'live') {
            moments.push({ 
              time: match.time, 
              event: `Current over - ${match.status}`, 
              reactions: Math.floor(Math.random() * 500) + 100 
            });
          }
          
          return moments.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
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
                { time: '3.2', event: `Six by ${match.home.name}`, reactions: Math.floor(Math.random() * 2000) + 800 },
                { time: '7.4', event: 'Wicket fallen', reactions: Math.floor(Math.random() * 2500) + 1000 },
                { time: '12.1', event: `Four by ${match.home.name}`, reactions: Math.floor(Math.random() * 1500) + 600 },
                { time: '14.5', event: 'Dropped catch', reactions: Math.floor(Math.random() * 800) + 200 },
              ];
              
              if (match.status === 'live') {
                moments.push({ 
                  time: match.time, 
                  event: `Current over - ${match.status}`, 
                  reactions: Math.floor(Math.random() * 500) + 100 
                });
              }
              
              return moments.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
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
            { time: '3.2', event: 'Six by India', reactions: 1247 },
            { time: '7.4', event: 'Wicket fallen', reactions: 2156 },
            { time: '12.1', event: 'Four by India', reactions: 891 },
            { time: '15.2', event: 'Current over - live', reactions: 523 }
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
        
        {/* Match Information Card - Compact and Responsive */}
        {currentMatch && (
          <div style={{
            background: 'var(--tertiary-background)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            {/* League Badge - Responsive */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-sm)',
              gap: 'var(--space-xs)',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: 'var(--accent-blue)',
                color: 'white',
                padding: 'var(--space-xs) var(--space-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '60%'
              }}>
                {currentMatch.league}
              </div>
              {currentMatch.status === 'live' && (
                <div style={{
                  background: 'var(--accent-red)',
                  color: 'white',
                  padding: 'var(--space-xs) var(--space-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  animation: 'pulse-glow 2s ease-in-out infinite alternate',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '0.6rem' }}>🔴</span>
                  LIVE
                </div>
              )}
            </div>
            
            {/* Teams Display - Vertical Stack for Narrow Space */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)',
              width: '100%'
            }}>
              {/* Home Team */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                width: '100%'
              }}>
                <img 
                  src={currentMatch.home.logo} 
                  alt={currentMatch.home.name}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}
                />
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}>
                  {currentMatch.home.name}
                </span>
              </div>
              
              {/* Score */}
              <div style={{
                textAlign: 'center',
                background: 'var(--glass-background)',
                padding: 'var(--space-xs)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'var(--primary-text)'
              }}>
                {currentMatch.score}
              </div>
              
              {/* Away Team */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                width: '100%'
              }}>
                <img 
                  src={currentMatch.away.logo} 
                  alt={currentMatch.away.name}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}
                />
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}>
                  {currentMatch.away.name}
                </span>
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
                fontSize: '0.7rem',
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
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-lg)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: 'var(--glass-background)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-sm)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--hover-border)';
          e.target.style.transform = 'translateY(-1px)';
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
            height: '2px',
            background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))'
          }} />
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <span>🎯</span>
            <span>Total Reactions</span>
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: 'var(--primary-text)',
            letterSpacing: '-0.025em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {formatNumber(stats.totalReactions)}
          </div>
        </div>

        <div style={{
          background: 'var(--glass-background)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-sm)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--hover-border)';
          e.target.style.transform = 'translateY(-1px)';
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
            height: '2px',
            background: 'linear-gradient(90deg, var(--accent-green), var(--accent-blue))'
          }} />
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <span>👥</span>
            <span>Active Viewers</span>
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: 'var(--primary-text)',
            letterSpacing: '-0.025em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {formatNumber(stats.uniqueViewers)}
          </div>
        </div>

        <div style={{
          background: 'var(--glass-background)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-sm)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--hover-border)';
          e.target.style.transform = 'translateY(-1px)';
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
            height: '2px',
            background: 'linear-gradient(90deg, var(--accent-orange), var(--accent-red))'
          }} />
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <span>📈</span>
            <span>Engagement Rate</span>
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: 'var(--primary-text)',
            letterSpacing: '-0.025em',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            overflow: 'hidden'
          }}>
            <span style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {stats.engagementRate.toFixed(1)}%
            </span>
            <span style={{ 
              fontSize: '0.7rem', 
              color: 'var(--accent-green)',
              fontWeight: '600',
              flexShrink: 0
            }}>
              +2.3%
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--glass-background)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-sm)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--hover-border)';
          e.target.style.transform = 'translateY(-1px)';
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
            height: '2px',
            background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-red))'
          }} />
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <span>🏆</span>
            <span>Top Emoji</span>
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: 'var(--primary-text)',
            letterSpacing: '-0.025em',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{stats.topEmoji}</span>
            <span style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>Fire</span>
          </div>
        </div>
      </div>

      {/* Match Moments - Compact */}
      <div style={{
        background: 'var(--glass-background)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-sm)',
        transition: 'all 0.3s ease',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          margin: '0 0 var(--space-sm) 0',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--primary-text)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          <span>⚡</span>
          <span>Key Moments</span>
        </h3>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xs)',
          width: '100%'
        }}>
          {stats.matchMoments.map((moment, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-xs)',
                padding: 'var(--space-xs)',
                background: 'var(--tertiary-background)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s ease',
                width: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden'
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-xs)'
              }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--accent-blue)',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {moment.time}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  fontSize: '0.7rem',
                  color: 'var(--secondary-text)',
                  fontWeight: '500',
                  flexShrink: 0
                }}>
                  <span>🎯</span>
                  <span>{formatNumber(moment.reactions)}</span>
                </div>
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--primary-text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}>
                {moment.event}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
