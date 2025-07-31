import React, { useState, useRef, useEffect } from 'react';

// PUBLIC_INTERFACE
function VideoPlayer({ videoUrl, children }) {
  /**
   * VideoPlayer component for embedding live match streams with hover-controlled emoji overlay.
   * It also serves as a container for overlay elements like emoji reactions.
   * @param {string} videoUrl - The URL of the video to embed.
   * @param {React.ReactNode} children - Components to overlay on the video.
   */
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const containerRef = useRef(null);
  const touchTimeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Detect if device supports touch
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

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

  return (
    <div 
      ref={containerRef}
      className="video-player-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      <iframe
        src={videoUrl}
        title="Live Match Stream"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ pointerEvents: 'auto' }}
      ></iframe>
      
      {/* Hover overlay container for emoji reactions */}
      <div 
        className={`emoji-overlay-container ${isHovered ? 'visible' : 'hidden'}`}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: isHovered ? 'auto' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
          zIndex: 20
        }}
      >
        {children}
      </div>
      
      {/* Mobile tap indicator */}
      {isTouchDevice && (
        <div 
          className="mobile-tap-indicator"
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
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 10
          }}
        >
          Tap for emoji reactions
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
