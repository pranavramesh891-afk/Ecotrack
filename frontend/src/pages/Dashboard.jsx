import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:5001/api';

const trendData = [
  { name: 'Mon', plastic: 10, cardboard: 5, paper: 2 },
  { name: 'Tue', plastic: 15, cardboard: 8, paper: 4 },
  { name: 'Wed', plastic: 12, cardboard: 15, paper: 6 },
  { name: 'Thu', plastic: 20, cardboard: 10, paper: 8 },
  { name: 'Fri', plastic: 25, cardboard: 18, paper: 10 },
  { name: 'Sat', plastic: 18, cardboard: 22, paper: 15 },
  { name: 'Sun', plastic: 30, cardboard: 25, paper: 20 },
];

export default function Dashboard() {
  const [data, setData] = useState({ totalWaste: 0, plastic: 0, cardboard: 0, paper: 0 });
  const [loading, setLoading] = useState(true);
  
  const username = localStorage.getItem('ecoUser') || 'User';

  useEffect(() => {
    fetch(`${API_URL}/dashboard`)
      .then(res => res.json())
      .then(json => {
        if(json) setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="glass-card"><p>Loading dashboard...</p></div>;

  return (
    <div className="glass-card" style={{ padding: '2.5rem' }}>
      <div className="dashboard-header">
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>Welcome back, <span style={{color: 'var(--accent-color)'}}>{username}</span>!</h2>
          <p className="subtitle">Here is your environmental impact.</p>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <h3>Total Waste</h3>
          </div>
          <div className="value">{data.totalWaste}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">♻️</span>
            <h3>Plastic</h3>
          </div>
          <div className="value">{data.plastic}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📦</span>
            <h3>Cardboard</h3>
          </div>
          <div className="value">{data.cardboard}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📄</span>
            <h3>Paper</h3>
          </div>
          <div className="value">{data.paper}</div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Waste Trend</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="plastic" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="cardboard" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="paper" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 500 }}>Logged 2kg plastic packaging</span>
              <span style={{ color: 'var(--text-secondary)' }}>Today</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 500 }}>Visited Eco Hub Center</span>
              <span style={{ color: 'var(--text-secondary)' }}>Yesterday</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 500 }}>Logged 1.5kg cardboard box</span>
              <span style={{ color: 'var(--text-secondary)' }}>2 days ago</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 500 }}>Logged 0.5kg paper</span>
              <span style={{ color: 'var(--text-secondary)' }}>Last week</span>
            </div>
          </div>
        </div>

        {/* Impact Insights */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>🌱 Impact Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span style={{ fontSize: '2rem' }}>🌍</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--accent-color)', fontSize: '1.1rem' }}>You saved 3kg CO₂</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Equal to driving 12 miles less</span>
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Top material:</span>
              <strong style={{ float: 'right', color: 'var(--text-primary)' }}>Plastic ♻️</strong>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total entries this week:</span>
              <strong style={{ float: 'right', color: 'var(--text-primary)' }}>5 📈</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
