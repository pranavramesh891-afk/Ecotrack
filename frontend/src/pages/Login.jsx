import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      const username = email.split('@')[0];
      localStorage.setItem('ecoUser', username);
      navigate('/');
    }
  };

  return (
    <div className="glass-card login-card">
      <div className="text-center mb-8">
        <h1 className="nav-brand" style={{ fontSize: '2.5rem' }}>Eco<span>Track</span></h1>
        <p className="subtitle">Login to your account</p>
      </div>

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
        <button type="submit" className="primary-btn">Log In</button>
      </form>
    </div>
  );
}
