import React, { useState, useEffect } from 'react';
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
  const { isAuthenticated, isAdmin, getDemoToken, login } = useAuth();

  // Effect to ensure admin has a token for API calls
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      // Auto-login with demo admin token
      const demoToken = getDemoToken(true);
      login(demoToken, true);
    }
  }, [isAuthenticated, isAdmin, getDemoToken, login]);

  // Effect to fetch emojis for admin management
  useEffect(() => {
    const fetchEmojis = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        
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

    fetchEmojis();
  }, [isAuthenticated]);

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
          padding: '8px',
          border: '1px solid var(--accent-red)',
          borderRadius: '4px',
          backgroundColor: 'rgba(233, 121, 65, 0.1)'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <h2>Current Emojis ({emojis.length})</h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px',
          marginTop: '16px'
        }}>
          {emojis.map((emoji) => (
            <div 
              key={emoji.id}
              style={{
                background: 'var(--secondary-background)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
                minWidth: '80px'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                {emoji.emoji}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--secondary-text)',
                wordBreak: 'break-word'
              }}>
                {emoji.name || 'unnamed'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Analytics & Management</h2>
        <p style={{ color: 'var(--secondary-text)' }}>
          Emoji upload, removal, and global analytics features will be available here.
          The system is now connected to the backend API with {isAdmin ? 'admin' : 'user'} authorization.
        </p>
        
        <div style={{ 
          marginTop: '16px',
          padding: '12px',
          background: 'var(--secondary-background)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h3>API Integration Status</h3>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li style={{ color: isAuthenticated ? 'var(--stat-green)' : 'var(--accent-red)' }}>
              Authentication: {isAuthenticated ? '✓ Connected' : '✗ Not Connected'}
            </li>
            <li style={{ color: isAdmin ? 'var(--stat-green)' : 'var(--secondary-text)' }}>
              Admin Access: {isAdmin ? '✓ Enabled' : '○ User Mode'}
            </li>
            <li style={{ color: emojis.length > 0 ? 'var(--stat-green)' : 'var(--secondary-text)' }}>
              Emoji API: {emojis.length > 0 ? '✓ Loaded' : '○ Using Fallback'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
