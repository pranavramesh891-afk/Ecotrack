import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ecoUser');
    navigate('/login');
  };

  return (
    <>
      <header>
        <Link to="/" className="nav-brand">Eco<span>Track</span></Link>
        <p className="subtitle">Track packaging waste. Promote recycling.</p>
      </header>

      <nav className="nav-container">
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/log" className={`nav-link ${location.pathname === '/log' ? 'active' : ''}`}>
            Log Waste
          </Link>
          <Link to="/recycling" className={`nav-link ${location.pathname === '/recycling' ? 'active' : ''}`}>
            Recycle
          </Link>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </>
  );
}
