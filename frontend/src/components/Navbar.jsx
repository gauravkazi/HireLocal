import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-black dark:border-white dark:bg-black flex items-center justify-between px-6 py-3">
      <Link to="/" className="text-black dark:text-white font-semibold">
        HireLocal
      </Link>

      <div className="flex items-center gap-4 text-sm text-black dark:text-white">
        <Link to="/services">Browse</Link>

        {user && user.role === 'customer' && (
          <Link to="/my-requests">My Requests</Link>
        )}

        {user && user.role === 'provider' && (
          <>
            <Link to="/my-services">My Services</Link>
            <Link to="/received-requests">Received Requests</Link>
            <Link to="/profile">My Profile</Link>
          </>
        )}

        {user && <Link to="/dashboard">Dashboard</Link>}

        {user && user.role === 'admin' && (
        <Link to="/activity-logs">Activity Logs</Link>
        )}

        <button
          onClick={toggleDarkMode}
          className="border border-black dark:border-white rounded-full p-1.5 flex items-center justify-center"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className="border border-black dark:border-white px-3 py-1 rounded text-xs"
          >
            Log out
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;