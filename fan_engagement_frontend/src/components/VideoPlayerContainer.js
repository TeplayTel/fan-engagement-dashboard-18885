import React, { useState } from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #000000;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const PlayPauseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-blue);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--accent-blue);
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.1s ease;
`;

const TimeDisplay = styled.div`
  font-size: var(--font-sm);
  color: white;
  font-weight: var(--font-medium);
  min-width: 80px;
`;

const VolumeControl = styled.div`
  width: 80px;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
`;

const VolumeFill = styled.div`
  height: 100%;
  background: white;
  border-radius: 2px;
  width: ${props => props.volume}%;
`;

const FullscreenButton = styled.button`
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

// PUBLIC_INTERFACE
const VideoPlayerContainer = ({ videoUrl = "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1" }) => {
  /**
   * Video player container with exact 16:9 aspect ratio and overlay controls
   * matching the design specification layout and styling.
   */
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(45);
  const [volume, setVolume] = useState(70);
  const [controlsVisible, setControlsVisible] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <VideoContainer
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
    >
      <VideoFrame
        src={videoUrl}
        title="Match Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      
      <ControlsOverlay visible={controlsVisible}>
        <PlayPauseButton onClick={togglePlayPause}>
          {isPlaying ? '⏸️' : '▶️'}
        </PlayPauseButton>
        
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        
        <TimeDisplay>
          {formatTime(Math.floor((progress / 100) * 5400))} / {formatTime(5400)}
        </TimeDisplay>
        
        <VolumeControl>
          <VolumeFill volume={volume} />
        </VolumeControl>
        
        <FullscreenButton>
          ⛶
        </FullscreenButton>
      </ControlsOverlay>
    </VideoContainer>
  );
};

export default VideoPlayerContainer;
