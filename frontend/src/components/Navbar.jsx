import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="border-b border-black dark:border-white dark:bg-black relative">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="text-black dark:text-white font-semibold">
          HireLocal
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4 text-sm text-black dark:text-white">
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

          {user && user.role === 'admin' && (
            <Link to="/activity-logs">Activity Logs</Link>
          )}

          {user && <Link to="/dashboard">Dashboard</Link>}

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

        {/* Mobile: dark mode + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="border border-black dark:border-white rounded-full p-1.5 flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black dark:text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-black dark:border-white flex flex-col text-sm text-black dark:text-white">
          <Link to="/services" onClick={closeMenu} className="px-6 py-3 border-b border-black dark:border-white">
            Browse
          </Link>

          {user && user.role === 'customer' && (
            <Link to="/my-requests" onClick={closeMenu} className="px-6 py-3 border-b border-black dark:border-white">
              My Requests
            </Link>
          )}

          {user && user.role === 'provider' && (
            <>
              <Link to="/my-services" onClick={closeMenu} className="px-6 py-3 border-b border-black dark:border-white">
                My Services
              </Link>
              <Link to="/received-requests" onClick={closeMenu} className="px-6 py-3 border-b border-black dark:border-white">
                Received Requests
              </Link>
              <Link to="/profile" onClick={closeMenu} className="px-6 py-3 border-b border-black dark:border-white">
                My Profile
              </Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <Link to="/activity-logs" onClick={closeMenu} className="px-6 py-3 border-b border-black dark:border-white">
              Activity Logs
            </Link>
          )}

          {user && (
            <Link to="/dashboard" onClick={closeMenu} className="px-6 py-3 border-b border-black dark:border-white">
              Dashboard
            </Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="px-6 py-3 text-left">
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="px-6 py-3 border-b border-black dark:border-white">
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="px-6 py-3">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;