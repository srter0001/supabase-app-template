import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './Navbar.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">APP</div>
        <button className="navbar-button" onClick={handleAuthClick}>
          {isLoggedIn ? 'Terminal' : 'Login'}
        </button>
      </div>
    </nav>
  );
}
