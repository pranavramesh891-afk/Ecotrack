import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'https://ecotrack-lqqx.onrender.com/api';

export default function Dashboard() {
  const [data, setData] = useState({ totalWaste: 0, plastic: 0, cardboard: 0, paper: 0 });
  const [activity, setActivity] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const username = localStorage.getItem('ecoUser') || 'User';
  const token = localStorage.getItem('ecoToken');

  useEffect(() => {
    if(!token) {
       setLoading(false);
       return;
    }
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/dashboard`, { headers }).then(res => res.json()).catch(() => null),
      fetch(`${API_URL}/waste`, { headers }).then(res => res.json()).catch(() => null),
      fetch(`${API_URL}/trend`, { headers }).then(res => res.json()).catch(() => null)
    ])
    .then(([dashData, wasteData, trendRes]) => {
      if(dashData && dashData.totalWaste !== undefined) setData(dashData);
      if(wasteData && Array.isArray(wasteData)) setActivity(wasteData);
      if(trendRes && Array.isArray(trendRes)) setTrendData(trendRes);
      
      setLoading(false);
    })
    .catch(err => {
      console.error("Dashboard error:", err);
      setLoading(false);
    });
  }, [token]);

  // Derived Logic (Safe null-checks enforced deeply)
  const safeTotalWaste = data?.totalWaste || 0;
  const savedCO2 = (safeTotalWaste * 0.5).toFixed(1);
  const treesSaved = Math.floor(savedCO2 / 10) || 0; 
  
  let topMaterial = 'Plastic';
  let topEmoji = '♻️';
  
  if ((data?.cardboard || 0) > (data?.plastic || 0) && (data?.cardboard || 0) > (data?.paper || 0)) {
    topMaterial = 'Cardboard';
    topEmoji = '📦';
  } else if ((data?.paper || 0) > (data?.plastic || 0) && (data?.paper || 0) > (data?.cardboard || 0)) {
    topMaterial = 'Paper';
    topEmoji = '📄';
  }

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const entriesThisWeek = activity?.filter(a => new Date(a?.createdAt) > oneWeekAgo)?.length || 0;

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const timeDiff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <p>Loading your sustainability stats...</p>
      </div>
    );
  }

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
          <div className="value">{safeTotalWaste}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">♻️</span>
            <h3>Plastic</h3>
          </div>
          <div className="value">{data?.plastic || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📦</span>
            <h3>Cardboard</h3>
          </div>
          <div className="value">{data?.cardboard || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📄</span>
            <h3>Paper</h3>
          </div>
          <div className="value">{data?.paper || 0}</div>
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
        
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(activity || []).slice(0, 4).map((item, i) => (
              <div key={item?._id || i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>Logged {item?.type} from {item?.platform}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{formatTimeAgo(item?.createdAt)}</span>
              </div>
            ))}
            {(!activity || activity.length === 0) && <p style={{color: 'var(--text-secondary)'}}>No recent activity.</p>}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>🌱 Impact Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span style={{ fontSize: '2rem' }}>🌍</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--accent-color)', fontSize: '1.1rem' }}>You saved {savedCO2}kg CO₂</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Equal to {treesSaved} trees planted! 🌳</span>
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Top material:</span>
              <strong style={{ float: 'right', color: 'var(--text-primary)' }}>{topMaterial} {topEmoji}</strong>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total entries this week:</span>
              <strong style={{ float: 'right', color: 'var(--text-primary)' }}>{entriesThisWeek} 📈</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
