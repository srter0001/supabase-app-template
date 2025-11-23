import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AppPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container-wide">
      <h1>Terminal</h1>
      {user && (
        <div className="user-info">
          <p><strong>Account Email:</strong> {user.email}</p>
          <div style={{ marginTop: '16px' }}>
            <Link to="/settings" style={{ textDecoration: 'none' }}>
              <button>Settings</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
