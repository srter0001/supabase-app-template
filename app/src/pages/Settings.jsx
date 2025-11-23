import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './Settings.css';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('FREE'); // Default to FREE
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('account');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }

    if (!newPassword) {
      setPasswordError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordError('Current password is incorrect');
        setPasswordLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    const getUserAndProfile = async () => {
      try {
        // 1. Get Auth Session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        } 
        
        setUser(session.user);

        // 2. Fetch User Profile Type from database
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUserType(profile.user_type);
        }

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserAndProfile();
  }, [navigate]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          <div className="sidebar-header">
            <h2>Settings</h2>
          </div>
          
          <nav className="settings-nav">
            {/* Account Settings */}
            <div className="nav-section">
              <div className="nav-section-title">ACCOUNT SETTINGS</div>
              <button
                className={`nav-item ${activeSection === 'account' ? 'active' : ''}`}
                onClick={() => setActiveSection('account')}
              >
                Account
              </button>
            </div>

            {/* Security */}
            <div className="nav-section">
              <div className="nav-section-title">SECURITY</div>
              <button
                className={`nav-item ${activeSection === 'password' ? 'active' : ''}`}
                onClick={() => setActiveSection('password')}
              >
                Password
              </button>
            </div>

            {/* Preferences */}
            <div className="nav-section">
              <div className="nav-section-title">PREFERENCES</div>
              <button
                className={`nav-item ${activeSection === 'theme' ? 'active' : ''}`}
                onClick={() => setActiveSection('theme')}
              >
                Theme
              </button>
            </div>

            {/* Danger Zone */}
            <div className="nav-section">
              <div className="nav-section-title">DANGER ZONE</div>
              <button
                className={`nav-item ${activeSection === 'logout' ? 'active' : ''}`}
                onClick={() => setActiveSection('logout')}
              >
                Logout
              </button>
              <button
                className={`nav-item ${activeSection === 'delete' ? 'active' : ''}`}
                onClick={() => setActiveSection('delete')}
              >
                Delete Account
              </button>
            </div>
          </nav>

          <div className="sidebar-footer">
            <Link to="/app" className="back-link">
              ← Back to App
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="settings-main">
          {/* Account Section */}
          {activeSection === 'account' && user && (
            <div>
              <h1>Account</h1>
              <div className="settings-section">
                <div className="settings-item">
                  <div className="item-content">
                    <label className="item-label">Account Plan</label>
                    {/* Inline styles removed and replaced with classes */}
                    <div className={`plan-badge ${userType === 'ACTIVE' ? 'premium' : 'free'}`}>
                      {userType}
                    </div>
                  </div>
                </div>
                <div className="settings-item">
                  <div className="item-content">
                    <label className="item-label">Email Address</label>
                    <p className="item-value">{user.email}</p>
                  </div>
                </div>
                <div className="settings-item">
                  <div className="item-content">
                    <label className="item-label">Account ID</label>
                    <p className="item-value">{user.id}</p>
                  </div>
                </div>
                <div className="settings-item">
                  <div className="item-content">
                    <label className="item-label">Member Since</label>
                    <p className="item-value">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Section */}
          {activeSection === 'password' && (
            <div>
              <h1>Password</h1>
              <div className="settings-section">
                <div className="settings-item">
                  <div className="item-content">
                    <label className="item-label">Change Password</label>
                    <p className="item-description">Update your password to keep your account secure</p>
                  </div>
                  <button className="settings-button" onClick={() => setShowPasswordModal(true)}>Change</button>
                </div>
              </div>
            </div>
          )}

          {/* Theme Section */}
          {activeSection === 'theme' && (
            <div>
              <h1>Theme</h1>
              <div className="settings-section">
                <div className="settings-item">
                  <div className="item-content">
                    <label className="item-label">Display Theme</label>
                    <p className="item-description">Choose your preferred display theme</p>
                  </div>
                  <select className="settings-select">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Logout Section */}
          {activeSection === 'logout' && (
            <div>
              <h1>Logout</h1>
              <div className="settings-section danger-section">
                <div className="settings-item">
                  <div className="item-content">
                    <label className="item-label">Sign Out</label>
                    <p className="item-description">Sign out from your current session</p>
                  </div>
                  <button className="settings-button danger-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Section */}
          {activeSection === 'delete' && (
            <div>
              <h1>Delete Account</h1>
              <div className="settings-section danger-section">
                <div className="settings-item">
                  <div className="item-content">
                    <label className="item-label">Permanently Delete Account</label>
                    <p className="item-description danger-text">This action cannot be undone. All your data will be permanently deleted.</p>
                  </div>
                  <button className="settings-button danger-button">Delete</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => !passwordLoading && setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={() => !passwordLoading && setShowPasswordModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleChangePassword} className="modal-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  disabled={passwordLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={passwordLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  disabled={passwordLoading}
                />
              </div>
              {passwordError && <div className="error-message">{passwordError}</div>}
              {passwordSuccess && <div className="success-message">Password changed successfully!</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-button cancel-button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-button submit-button"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}