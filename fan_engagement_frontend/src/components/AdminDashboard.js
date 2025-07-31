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

        // Try to fetch emoji statistics
        try {
          const statsData = await apiService.getEmojiStats();
          setEmojiStats(statsData);
        } catch (statsErr) {
          console.warn('Failed to fetch emoji stats:', statsErr);
          // Stats are optional, don't show error for this
        }
        
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
  }, [isAuthenticated]);

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
          try {
            const statsData = await apiService.getEmojiStats();
            setEmojiStats(statsData);
          } catch (statsErr) {
            console.warn('Failed to refresh emoji stats:', statsErr);
          }
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
      try {
        const statsData = await apiService.getEmojiStats();
        setEmojiStats(statsData);
      } catch (statsErr) {
        console.warn('Failed to refresh emoji stats:', statsErr);
      }
      
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
                    right: '8px'
                  }}
                  title="Remove emoji"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emoji Statistics */}
      {emojiStats && (
        <div style={{ marginBottom: '32px' }}>
          <h2>Emoji Usage Statistics</h2>
          <div style={{
            background: 'var(--secondary-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '16px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                  {emojiStats.totalReactions || 0}
                </div>
                <div style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>
                  Total Reactions
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                  {emojiStats.uniqueUsers || 0}
                </div>
                <div style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>
                  Unique Users
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                  {emojiStats.averagePerUser || 0}
                </div>
                <div style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>
                  Avg. per User
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
