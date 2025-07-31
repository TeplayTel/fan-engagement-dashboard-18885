import React from 'react';

// PUBLIC_INTERFACE
function VideoPlayer({ videoUrl }) {
  /**
   * VideoPlayer component for embedding live match streams.
   * @param {string} videoUrl - The URL of the video to embed.
   */
  return (
    <div className="video-player-container">
      <iframe
        src={videoUrl}
        title="Live Match Stream"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default VideoPlayer;
