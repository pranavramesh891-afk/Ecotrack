import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to log in');
      const username = data?.user?.name || email?.split('@')[0] || 'User';
      localStorage.setItem('ecoToken', data?.token || 'mockToken');
      localStorage.setItem('ecoUser', username);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card animate-fade-up">
      <div className="auth-logo">
        <div className="auth-logo-icon">🌿</div>
        <h1>Eco<span>Track</span></h1>
        <p>Track packaging waste. Promote recycling.</p>
      </div>

      {error && <div className="status-msg status-error mb-4">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" className="primary-btn" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? 'Logging In…' : 'Log In →'}
        </button>
      </form>

      <div className="auth-divider" />

      <p className="text-center subtitle">
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
          Sign up free
        </Link>
      </p>
    </div>
  );
}
