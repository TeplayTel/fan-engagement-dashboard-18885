import React, { useState, useRef, useEffect } from 'react';

// PUBLIC_INTERFACE
function VideoPlayer({ videoUrl, children, currentMatch }) {
  /**
   * VideoPlayer component with optimized overlay positioning for sleek emoji bar.
   * Ensures emoji bar never obscures video player controls.
   * Now supports dynamic video URL changes when matches are switched.
   * @param {string} videoUrl - The URL of the video to embed.
   * @param {React.ReactNode} children - Components to overlay on the video.
   * @param {object} currentMatch - The currently active match object.
   */
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrl || 'https://www.youtube.com/embed/fSNya223rHQ?autoplay=1&mute=1');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const containerRef = useRef(null);
  const touchTimeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const iframeRef = useRef(null);

  // Detect if device supports touch
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Handle video URL changes from match switching
  useEffect(() => {
    if (videoUrl !== currentVideoUrl) {
      setIsVideoLoading(true);
      setCurrentVideoUrl(videoUrl);
      
      // Simulate loading delay for video switching
      const loadingTimer = setTimeout(() => {
        setIsVideoLoading(false);
      }, 1000);
      
      return () => clearTimeout(loadingTimer);
    }
  }, [videoUrl, currentVideoUrl]);

  // Listen for video change events from Dashboard
  useEffect(() => {
    const handleVideoChange = (event) => {
      const { videoUrl: newVideoUrl } = event.detail;
      if (newVideoUrl && newVideoUrl !== currentVideoUrl) {
        setIsVideoLoading(true);
        setCurrentVideoUrl(newVideoUrl);
        
        // Simulate loading delay
        setTimeout(() => {
          setIsVideoLoading(false);
        }, 1000);
      }
    };

    window.addEventListener('videoChanged', handleVideoChange);
    return () => window.removeEventListener('videoChanged', handleVideoChange);
  }, [currentVideoUrl]);

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      clearTimeout(hoverTimeoutRef.current);
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 300); // Small delay to prevent flickering
    }
  };

  const handleTouchStart = (e) => {
    if (isTouchDevice) {
      e.preventDefault();
      clearTimeout(touchTimeoutRef.current);
      setTouchActive(true);
      setIsHovered(true);
      
      // Auto-hide after 4 seconds on mobile
      touchTimeoutRef.current = setTimeout(() => {
        setTouchActive(false);
        setIsHovered(false);
      }, 4000);
    }
  };

  const handleTouchEnd = () => {
    if (isTouchDevice && !touchActive) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 1000);
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeout(touchTimeoutRef.current);
      clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const getMatchTitle = () => {
    if (currentMatch) {
      return `${currentMatch.home.name} vs ${currentMatch.away.name} - ${currentMatch.league}`;
    }
    return 'Live Match Stream';
  };

  return (
    <div 
      ref={containerRef}
      className="video-player-container-sleek"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      {/* Video Loading Overlay */}
      {isVideoLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          color: 'white',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: 'var(--space-md)'
          }}></div>
          <div style={{
            fontSize: '1rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Switching to {currentMatch ? `${currentMatch.home.name} vs ${currentMatch.away.name}` : 'new match'}...
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={currentVideoUrl}
        title={getMatchTitle()}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ 
          pointerEvents: 'auto',
          opacity: isVideoLoading ? 0.3 : 1,
          transition: 'opacity 0.3s ease'
        }}
      ></iframe>
      
      {/* Sleek overlay container - positioned to avoid video controls */}
      <div 
        className={`emoji-overlay-container-sleek ${isHovered && !isVideoLoading ? 'visible' : 'hidden'}`}
        style={{
          position: 'absolute',
          bottom: '60px', // Positioned above typical video controls
          left: '50%',
          width: '90%',
          maxWidth: '600px',
          pointerEvents: (isHovered && !isVideoLoading) ? 'auto' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: (isHovered && !isVideoLoading) ? 1 : 0,
          transform: (isHovered && !isVideoLoading) ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
          zIndex: 20
        }}
      >
        {children}
      </div>
      
      {/* Mobile tap indicator */}
      {isTouchDevice && !isVideoLoading && (
        <div 
          className="mobile-tap-indicator-sleek"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            opacity: isHovered ? 0 : 0.6,
            transition: 'opacity 0.3s ease',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 10
          }}
        >
          Tap for reactions
        </div>
      )}

      {/* Live Indicator - Top Left */}
      {currentMatch && currentMatch.status === 'live' && !isVideoLoading && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: '#e53e3e',
          borderRadius: '12px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 10,
          transition: 'opacity 0.3s ease',
          opacity: isHovered ? 0.7 : 1
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            background: 'white',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <span style={{
            fontSize: '10px',
            fontWeight: '600',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            LIVE
          </span>
        </div>
      )}

      {/* Team Badges - Bottom Left and Right */}
      {currentMatch && !isVideoLoading && (
        <>
          {/* Home Team Badge - Bottom Left */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
            transition: 'opacity 0.3s ease',
            opacity: isHovered ? 0.8 : 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentMatch.home.logo ? 'rgba(255, 255, 255, 0.9)' : 'linear-gradient(135deg, #e53e3e 0%, #ff6b7a 100%)',
              border: '2px solid #e53e3e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden'
            }}>
              {currentMatch.home.logo ? (
                <img 
                  src={currentMatch.home.logo} 
                  alt={currentMatch.home.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  {currentMatch.home.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '500',
              maxWidth: '80px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentMatch.home.name}
            </div>
          </div>

          {/* Away Team Badge - Bottom Right */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
            transition: 'opacity 0.3s ease',
            opacity: isHovered ? 0.8 : 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentMatch.away.logo ? 'rgba(255, 255, 255, 0.9)' : 'linear-gradient(135deg, #3182ce 0%, #63b3ed 100%)',
              border: '2px solid #3182ce',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden'
            }}>
              {currentMatch.away.logo ? (
                <img 
                  src={currentMatch.away.logo} 
                  alt={currentMatch.away.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  {currentMatch.away.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '500',
              maxWidth: '80px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentMatch.away.name}
            </div>
          </div>

          {/* Score Display - Bottom Center */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '20px',
            padding: '8px 16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            zIndex: 10,
            transition: 'opacity 0.3s ease',
            opacity: isHovered ? 0.8 : 1
          }}>
            {currentMatch.time && (
              <div style={{
                fontSize: '10px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {currentMatch.time}
              </div>
            )}
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '0.5px'
            }}>
              {currentMatch.score}
            </div>
          </div>
        </>
      )}

      {/* League info overlay for context */}
      {currentMatch && !isVideoLoading && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '10px',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          opacity: isHovered ? 0.7 : 0.9,
          transition: 'opacity 0.3s ease',
          zIndex: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {currentMatch.league}
        </div>
      )}

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}

export default VideoPlayer;
