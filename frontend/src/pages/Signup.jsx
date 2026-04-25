import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to sign up');
      const username = data?.user?.name || name?.split(' ')[0] || 'User';
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
        <p>Join the green movement today.</p>
      </div>

      {error && <div className="status-msg status-error mb-4">{error}</div>}

      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="signup-name">Full Name</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" className="primary-btn" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? 'Creating Account…' : 'Create Account →'}
        </button>
      </form>

      <div className="auth-divider" />

      <p className="text-center subtitle">
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
