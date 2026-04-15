import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'https://ecotrack-lqqx.onrender.com/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
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
      console.log("Login Response:", data);
      
      if (!res.ok) throw new Error(data.error || data.message || "Failed to log in");
      
      const username = data?.user?.name || email?.split('@')[0] || "User";
      localStorage.setItem('ecoToken', data?.token || "mockToken");
      localStorage.setItem('ecoUser', username);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card login-card">
      <div className="text-center mb-8">
        <h1 className="nav-brand" style={{ fontSize: '2.5rem' }}>Eco<span>Track</span></h1>
        <p className="subtitle">Login to your account</p>
      </div>

      {error && <div className="status-msg status-error mb-6">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com" 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            required 
          />
        </div>
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <p className="text-center" style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
      </p>
    </div>
  );
}
