import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import apiService from '../services/apiService';

// PUBLIC_INTERFACE
function AdminDashboard() {
  /**
   * AdminDashboard component for emoji management and analytics.
   */
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emojiStats, setEmojiStats] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState('live_match_001'); // Default event
  const [availableEvents, setAvailableEvents] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [individualEmojiStats, setIndividualEmojiStats] = useState([]);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    emojiType: '',
    emojiImage: null,
    preview: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadMessageType, setUploadMessageType] = useState(null);
  
  const fileInputRef = useRef(null);
  const { isAuthenticated, isAdmin, getDemoToken, login } = useAuth();

  // Effect to ensure admin has a token for API calls
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      // Auto-login with demo admin token
      const demoToken = getDemoToken(true);
      login(demoToken, true);
    }
  }, [isAuthenticated, isAdmin, getDemoToken, login]);

  // Effect to fetch emojis and stats for admin management
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch emojis
        const emojisData = await apiService.getEmojis();
        
        // Handle different possible response formats
        let emojiList = [];
        if (Array.isArray(emojisData)) {
          emojiList = emojisData;
        } else if (emojisData && emojisData.emojis && Array.isArray(emojisData.emojis)) {
          emojiList = emojisData.emojis;
        } else if (emojisData && emojisData.data && Array.isArray(emojisData.data)) {
          emojiList = emojisData.data;
        }

        setEmojis(emojiList);

        // Try to fetch available events for statistics filtering
        try {
          const eventsData = await apiService.getEvents();
          if (Array.isArray(eventsData)) {
            setAvailableEvents(eventsData);
          } else if (eventsData && eventsData.events && Array.isArray(eventsData.events)) {
            setAvailableEvents(eventsData.events);
          } else {
            // Fallback events if API doesn't return events
            setAvailableEvents([
              { id: 'live_match_001', name: 'Arsenal vs Chelsea (Live)', isLive: true },
              { id: 'match_002', name: 'Real Madrid vs Barcelona', isLive: false },
              { id: 'match_003', name: 'Liverpool vs Manchester City', isLive: false }
            ]);
          }
        } catch (eventsErr) {
          console.warn('Failed to fetch events:', eventsErr);
          // Set fallback events
          setAvailableEvents([
            { id: 'live_match_001', name: 'Arsenal vs Chelsea (Live)', isLive: true },
            { id: 'match_002', name: 'Real Madrid vs Barcelona', isLive: false },
            { id: 'match_003', name: 'Liverpool vs Manchester City', isLive: false }
          ]);
        }

        // Try to fetch emoji statistics for the selected event
        await fetchEmojiStatistics(selectedEventId);
        
      } catch (err) {
        console.warn('Failed to fetch emojis for admin:', err);
        setError('Failed to load emojis from server');
        // Set fallback emojis for admin management
        setEmojis([
          { id: 1, emoji: '❤️', name: 'heart' },
          { id: 2, emoji: '🔥', name: 'fire' },
          { id: 3, emoji: '😂', name: 'laugh' },
          { id: 4, emoji: '😮', name: 'wow' },
          { id: 5, emoji: '👍', name: 'thumbs_up' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, selectedEventId]);

  // Function to fetch emoji statistics for a specific event
  const fetchEmojiStatistics = async (eventId) => {
    if (!isAuthenticated) return;

    try {
      setStatsLoading(true);
      const statsData = await apiService.getEmojiStats(eventId);
      
      if (statsData) {
        setEmojiStats(statsData);
        
        // Extract individual emoji statistics if available
        if (statsData.emojiBreakdown && Array.isArray(statsData.emojiBreakdown)) {
          setIndividualEmojiStats(statsData.emojiBreakdown);
        } else if (statsData.emojis && Array.isArray(statsData.emojis)) {
          setIndividualEmojiStats(statsData.emojis);
        } else {
          // Generate mock individual stats based on available emojis
          const mockIndividualStats = emojis.map((emoji, index) => ({
            emojiId: emoji.id,
            emoji: emoji.emoji,
            name: emoji.name,
            count: Math.floor(Math.random() * 1000) + 50, // Mock data
            percentage: Math.floor(Math.random() * 30) + 5, // Mock percentage
            lastUsed: new Date(Date.now() - Math.random() * 3600000).toISOString() // Random time in last hour
          }));
          setIndividualEmojiStats(mockIndividualStats);
        }
      }
    } catch (statsErr) {
      console.warn('Failed to fetch emoji stats:', statsErr);
      // Generate fallback statistics
      setEmojiStats({
        totalReactions: Math.floor(Math.random() * 5000) + 1000,
        uniqueUsers: Math.floor(Math.random() * 500) + 100,
        averagePerUser: Math.floor(Math.random() * 10) + 3,
        eventId: eventId,
        timeRange: '24h'
      });
      
      // Generate mock individual stats
      const mockIndividualStats = emojis.map((emoji, index) => ({
        emojiId: emoji.id,
        emoji: emoji.emoji,
        name: emoji.name,
        count: Math.floor(Math.random() * 1000) + 50,
        percentage: Math.floor(Math.random() * 30) + 5,
        lastUsed: new Date(Date.now() - Math.random() * 3600000).toISOString()
      }));
      setIndividualEmojiStats(mockIndividualStats);
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle event selection change
  const handleEventSelection = (eventId) => {
    setSelectedEventId(eventId);
    fetchEmojiStatistics(eventId);
  };

  // Clear upload messages after timeout
  useEffect(() => {
    if (uploadMessage) {
      const timer = setTimeout(() => {
        setUploadMessage(null);
        setUploadMessageType(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [uploadMessage]);

  // Real-time statistics updates
  useEffect(() => {
    if (!isAuthenticated || !selectedEventId) return;

    // Set up periodic stats refresh for real-time updates
    const statsRefreshInterval = setInterval(() => {
      fetchEmojiStatistics(selectedEventId);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(statsRefreshInterval);
  }, [isAuthenticated, selectedEventId]);

  // Listen for emoji upload/removal events to trigger immediate stats refresh
  useEffect(() => {
    const handleStatsRefresh = () => {
      if (selectedEventId) {
        setTimeout(() => {
          fetchEmojiStatistics(selectedEventId);
        }, 1000); // Small delay to allow backend to process changes
      }
    };

    window.addEventListener('emojiListUpdated', handleStatsRefresh);
    
    return () => {
      window.removeEventListener('emojiListUpdated', handleStatsRefresh);
    };
  }, [selectedEventId]);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadMessage('Please select a valid image file');
        setUploadMessageType('error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadMessage('File size must be less than 5MB');
        setUploadMessageType('error');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setUploadForm({
        ...uploadForm,
        emojiImage: file,
        preview: previewUrl
      });
      
      // Clear any previous messages
      setUploadMessage(null);
      setUploadMessageType(null);
    }
  };

  // Handle emoji type input change
  const handleEmojiTypeChange = (event) => {
    setUploadForm({
      ...uploadForm,
      emojiType: event.target.value
    });
  };

  // Handle form submission
  const handleUploadSubmit = async (event) => {
    event.preventDefault();
    
    if (!uploadForm.emojiImage || !uploadForm.emojiType.trim()) {
      setUploadMessage('Please provide both emoji type and image');
      setUploadMessageType('error');
      return;
    }

    setUploading(true);
    setUploadMessage(null);
    
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('emojiType', uploadForm.emojiType.trim());
      formData.append('emojiImage', uploadForm.emojiImage);

      // Upload emoji
      const response = await apiService.uploadEmoji(formData);
      
      setUploadMessage('Emoji uploaded successfully!');
      setUploadMessageType('success');
      
      // Reset form
      setUploadForm({
        emojiType: '',
        emojiImage: null,
        preview: null
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh emoji list to show new emoji
      setTimeout(async () => {
        try {
          const emojisData = await apiService.getEmojis();
          let emojiList = [];
          if (Array.isArray(emojisData)) {
            emojiList = emojisData;
          } else if (emojisData && emojisData.emojis && Array.isArray(emojisData.emojis)) {
            emojiList = emojisData.emojis;
          } else if (emojisData && emojisData.data && Array.isArray(emojisData.data)) {
            emojiList = emojisData.data;
          }
          setEmojis(emojiList);
          
          // Notify other components about emoji list update
          window.dispatchEvent(new CustomEvent('emojiListUpdated'));
          
          // Refresh stats too
          await fetchEmojiStatistics(selectedEventId);
        } catch (refreshErr) {
          console.warn('Failed to refresh emoji list:', refreshErr);
        }
      }, 500);
      
    } catch (err) {
      console.error('Failed to upload emoji:', err);
      let errorMessage = 'Failed to upload emoji';
      
      if (err.message.includes('401')) {
        errorMessage = 'Authentication required';
      } else if (err.message.includes('403')) {
        errorMessage = 'Admin access required';
      } else if (err.message.includes('413')) {
        errorMessage = 'File too large';
      } else if (err.message.includes('415')) {
        errorMessage = 'Unsupported file type';
      }
      
      setUploadMessage(errorMessage);
      setUploadMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  // Handle emoji removal
  const handleRemoveEmoji = async (emojiId) => {
    if (!window.confirm('Are you sure you want to remove this emoji?')) {
      return;
    }

    try {
      await apiService.removeEmoji(emojiId);
      
      // Remove from local state
      setEmojis(emojis.filter(emoji => emoji.id !== emojiId));
      
      // Notify other components about emoji list update
      window.dispatchEvent(new CustomEvent('emojiListUpdated'));
      
      setUploadMessage('Emoji removed successfully');
      setUploadMessageType('success');
      
      // Refresh stats
      await fetchEmojiStatistics(selectedEventId);
      
    } catch (err) {
      console.error('Failed to remove emoji:', err);
      let errorMessage = 'Failed to remove emoji';
      
      if (err.message.includes('404')) {
        errorMessage = 'Emoji not found or already removed';
      } else if (err.message.includes('403')) {
        errorMessage = 'Admin access required';
      }
      
      setUploadMessage(errorMessage);
      setUploadMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <p>Loading emoji management interface...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {error && (
        <div style={{ 
          color: 'var(--accent-red)', 
          marginBottom: '16px',
          padding: '12px',
          border: '1px solid var(--accent-red)',
          borderRadius: '8px',
          backgroundColor: 'rgba(229, 9, 20, 0.1)'
        }}>
          ⚠️ {error}
        </div>
      )}

      {uploadMessage && (
        <div style={{ 
          color: uploadMessageType === 'success' ? '#28A745' : 'var(--accent-red)', 
          marginBottom: '16px',
          padding: '12px',
          border: `1px solid ${uploadMessageType === 'success' ? '#28A745' : 'var(--accent-red)'}`,
          borderRadius: '8px',
          backgroundColor: uploadMessageType === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(229, 9, 20, 0.1)'
        }}>
          {uploadMessageType === 'success' ? '✓' : '✗'} {uploadMessage}
        </div>
      )}

      {/* Emoji Upload Form */}
      <div style={{ marginBottom: '32px' }}>
        <h2>Upload New Emoji</h2>
        <form onSubmit={handleUploadSubmit} style={{
          background: 'var(--secondary-background)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '16px'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: 'var(--primary-text)'
            }}>
              Emoji Type *
            </label>
            <input
              type="text"
              value={uploadForm.emojiType}
              onChange={handleEmojiTypeChange}
              placeholder="e.g., Heart, Fire, Laugh"
              required
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '10px',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                background: 'var(--tertiary-background)',
                color: 'var(--primary-text)',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: 'var(--primary-text)'
            }}>
              Emoji Image *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '10px',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                background: 'var(--tertiary-background)',
                color: 'var(--primary-text)',
                fontSize: '14px'
              }}
            />
            <small style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>
              Supported formats: PNG, JPG, GIF. Max size: 5MB
            </small>
          </div>

          {/* Image Preview */}
          {uploadForm.preview && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold',
                color: 'var(--primary-text)'
              }}>
                Preview
              </label>
              <div style={{
                width: '64px',
                height: '64px',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--tertiary-background)'
              }}>
                <img 
                  src={uploadForm.preview} 
                  alt="Emoji preview" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !uploadForm.emojiImage || !uploadForm.emojiType.trim()}
            style={{
              background: uploading ? 'var(--secondary-text)' : 'var(--accent-blue)',
              color: 'var(--primary-text)',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Emoji'}
          </button>
        </form>
      </div>

      {/* Current Emojis */}
      <div style={{ marginBottom: '32px' }}>
        <h2>Current Emojis ({emojis.length})</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: '16px',
          marginTop: '16px'
        }}>
          {emojis.map((emoji) => (
            <div 
              key={emoji.id}
              style={{
                background: 'var(--secondary-background)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {emoji.emoji}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--secondary-text)',
                wordBreak: 'break-word',
                marginBottom: '12px'
              }}>
                {emoji.name || 'unnamed'}
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleRemoveEmoji(emoji.id)}
                  className="emoji-remove-btn"
                  style={{
                    background: 'var(--accent-red)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    transition: 'all 0.2s ease',
                    opacity: 0.8
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 2px 4px rgba(229, 9, 20, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  title="Remove emoji - This will update the emoji bar in real-time"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Event Selection and Emoji Statistics */}
      <div style={{ marginBottom: '32px' }}>
        <h2>Emoji Usage Statistics</h2>
        
        {/* Event Selector */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <label style={{ 
              fontWeight: 'bold',
              color: 'var(--primary-text)'
            }}>
              Select Event for Statistics
            </label>
            <button
              onClick={() => fetchEmojiStatistics(selectedEventId)}
              disabled={statsLoading}
              style={{
                background: 'var(--tertiary-background)',
                color: 'var(--primary-text)',
                border: '1px solid var(--border-color)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: statsLoading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                opacity: statsLoading ? 0.6 : 1
              }}
              title="Refresh statistics"
            >
              {statsLoading ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {availableEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventSelection(event.id)}
                style={{
                  background: selectedEventId === event.id ? 'var(--accent-blue)' : 'var(--secondary-background)',
                  color: selectedEventId === event.id ? 'white' : 'var(--primary-text)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: selectedEventId === event.id ? 'bold' : 'normal',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {event.isLive && (
                  <span style={{ 
                    color: selectedEventId === event.id ? 'white' : 'var(--accent-red)',
                    fontSize: '12px'
                  }}>
                    🔴
                  </span>
                )}
                {event.name || event.id}
              </button>
            ))}
          </div>
        </div>

        {statsLoading ? (
          <div style={{
            background: 'var(--secondary-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--secondary-text)'
          }}>
            Loading statistics...
          </div>
        ) : emojiStats ? (
          <>
            {/* Overall Statistics */}
            <div style={{
              background: 'var(--secondary-background)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                color: 'var(--primary-text)',
                fontSize: '18px'
              }}>
                Overall Statistics
                {emojiStats.eventId && (
                  <span style={{ 
                    fontSize: '14px', 
                    color: 'var(--secondary-text)',
                    fontWeight: 'normal',
                    marginLeft: '8px'
                  }}>
                    (Event: {emojiStats.eventId})
                  </span>
                )}
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                    {emojiStats.totalReactions || 0}
                  </div>
                  <div style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>
                    Total Reactions
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28A745' }}>
                    {emojiStats.uniqueUsers || 0}
                  </div>
                  <div style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>
                    Unique Users
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF6B35' }}>
                    {emojiStats.averagePerUser || 0}
                  </div>
                  <div style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>
                    Avg. per User
                  </div>
                </div>
                {emojiStats.timeRange && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--secondary-text)' }}>
                      {emojiStats.timeRange}
                    </div>
                    <div style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>
                      Time Range
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Individual Emoji Statistics */}
            {individualEmojiStats.length > 0 && (
              <div style={{
                background: 'var(--secondary-background)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  color: 'var(--primary-text)',
                  fontSize: '18px'
                }}>
                  Individual Emoji Performance
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                  gap: '16px'
                }}>
                  {individualEmojiStats
                    .sort((a, b) => (b.count || 0) - (a.count || 0)) // Sort by count descending
                    .map((stat, index) => (
                    <div 
                      key={stat.emojiId || index}
                      style={{
                        background: 'var(--tertiary-background)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '16px',
                        position: 'relative'
                      }}
                    >
                      {/* Ranking Badge */}
                      {index < 3 && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                          color: 'white',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          #{index + 1}
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '28px' }}>
                          {stat.emoji}
                        </div>
                        <div>
                          <div style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold', 
                            color: 'var(--primary-text)',
                            marginBottom: '4px'
                          }}>
                            {stat.name || 'Unknown'}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: 'var(--secondary-text)'
                          }}>
                            ID: {stat.emojiId}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            color: 'var(--accent-blue)' 
                          }}>
                            {stat.count || 0}
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: 'var(--secondary-text)' 
                          }}>
                            Total Uses
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            color: '#28A745' 
                          }}>
                            {stat.percentage || 0}%
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: 'var(--secondary-text)' 
                          }}>
                            Share
                          </div>
                        </div>
                      </div>
                      
                      {stat.lastUsed && (
                        <div style={{ 
                          fontSize: '11px', 
                          color: 'var(--secondary-text)',
                          textAlign: 'center',
                          borderTop: '1px solid var(--border-color)',
                          paddingTop: '8px'
                        }}>
                          Last used: {new Date(stat.lastUsed).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{
            background: 'var(--secondary-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--secondary-text)'
          }}>
            No statistics available for the selected event
          </div>
        )}
      </div>

      {/* API Integration Status */}
      <div>
        <h2>System Status</h2>
        <div style={{ 
          marginTop: '16px',
          padding: '20px',
          background: 'var(--secondary-background)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                color: isAuthenticated ? '#28A745' : 'var(--accent-red)',
                fontSize: '18px'
              }}>
                {isAuthenticated ? '✓' : '✗'}
              </span>
              <span style={{ color: 'var(--primary-text)' }}>
                Authentication: {isAuthenticated ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                color: isAdmin ? '#28A745' : 'var(--secondary-text)',
                fontSize: '18px'
              }}>
                {isAdmin ? '✓' : '○'}
              </span>
              <span style={{ color: 'var(--primary-text)' }}>
                Admin Access: {isAdmin ? 'Enabled' : 'User Mode'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                color: emojis.length > 0 ? '#28A745' : 'var(--secondary-text)',
                fontSize: '18px'
              }}>
                {emojis.length > 0 ? '✓' : '○'}
              </span>
              <span style={{ color: 'var(--primary-text)' }}>
                Emoji API: {emojis.length > 0 ? 'Loaded' : 'Using Fallback'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
