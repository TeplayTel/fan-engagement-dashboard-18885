import React from 'react';

// PUBLIC_INTERFACE
function VideoPlayer({ videoUrl, children }) {
  /**
   * VideoPlayer component for embedding live match streams.
   * It also serves as a container for overlay elements like emoji reactions.
   * @param {string} videoUrl - The URL of the video to embed.
   * @param {React.ReactNode} children - Components to overlay on the video.
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
      {children}
    </div>
  );
}

export default VideoPlayer;
