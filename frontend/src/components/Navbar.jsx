import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/',          label: 'Home',    icon: '🏠' },
  { to: '/log',       label: 'Log',     icon: '➕' },
  { to: '/recycling', label: 'Recycle', icon: '♻️' },
  { to: '/profile',   label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem('ecoUser') || 'User';
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('ecoUser');
    localStorage.removeItem('ecoToken');
    navigate('/login');
  };

  return (
    <>
      {/* Top Header */}
      <header className="top-header">
        <Link to="/" className="header-brand">
          <div className="brand-icon">🌿</div>
          Eco<span>Track</span>
        </Link>
        <div className="header-actions">
          <div
            className="header-avatar"
            title={username}
            onClick={() => navigate('/profile')}
          >
            {initial}
          </div>
          <button className="header-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
