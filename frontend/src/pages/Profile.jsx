import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const username = localStorage.getItem('ecoUser') || 'User';
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('ecoUser');
    localStorage.removeItem('ecoToken');
    navigate('/login');
  };

  const menuItems = [
    { icon: '🌍', label: 'My Impact Summary',  sub: 'See your full environmental contribution' },
    { icon: '🔔', label: 'Notifications',        sub: 'Manage your alerts and reminders' },
    { icon: '🔒', label: 'Privacy & Security',   sub: 'Manage your account security' },
    { icon: '❓', label: 'Help & Support',        sub: 'FAQ and contact us' },
    { icon: 'ℹ️',  label: 'About EcoTrack',       sub: 'Version 1.0.0 · Built with 💚' },
  ];

  return (
    <div className="animate-fade-up">
      {/* Profile Hero */}
      <div className="welcome-banner" style={{ marginBottom: '20px' }}>
        <div className="welcome-text">
          <h2>{username}</h2>
          <p>EcoTrack Member</p>
          <span className="chip" style={{ marginTop: '8px', display: 'inline-flex' }}>🌿 Eco Warrior</span>
        </div>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'white',
            border: '2px solid rgba(255,255,255,0.4)',
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
      </div>

      {/* Stats row */}
      <div
        className="card mb-4"
        style={{ background: 'var(--bg)' }}
      >
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center', gap: '8px' }}>
            {[
              { icon: '📦', label: 'Total Logs', value: '—' },
              { icon: '🌳', label: 'Trees Saved', value: '—' },
              { icon: '🏅', label: 'Badges', value: '1' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="card mb-4">
        {menuItems.map((item, idx) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              borderBottom: idx < menuItems.length - 1 ? '1px solid var(--border-light)' : 'none',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div
              style={{
                width: 40, height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: '1px' }}>{item.sub}</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>›</span>
          </div>
        ))}
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        id="profile-logout-btn"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          border: '1.5px solid #fecaca',
          fontSize: '0.95rem',
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: 'pointer',
          transition: 'var(--transition)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--danger-light)'; }}
      >
        🚪 Logout
      </button>
    </div>
  );
}
