import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { fetchWithAuth } from '../utils/api';

// Animated number counter
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const end = value;
    const duration = 900;
    const step = Math.ceil(end / (duration / 30));
    ref.current = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(ref.current);
      } else {
        setDisplay(start);
      }
    }, 30);
    return () => clearInterval(ref.current);
  }, [value]);

  return <span>{display}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState({ totalWaste: 0, plastic: 0, cardboard: 0, paper: 0 });
  const [activity, setActivity] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem('ecoUser') || 'User';
  const token = localStorage.getItem('ecoToken');

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetchWithAuth('/dashboard').then(r => r ? r.json() : null).catch(() => null),
      fetchWithAuth('/waste').then(r => r ? r.json() : null).catch(() => null),
      fetchWithAuth('/trend').then(r => r ? r.json() : null).catch(() => null)
    ]).then(([dashData, wasteData, trendRes]) => {
      if (dashData && dashData.totalWaste !== undefined) setData(dashData);
      if (wasteData && Array.isArray(wasteData)) setActivity(wasteData);
      if (trendRes && Array.isArray(trendRes)) setTrendData(trendRes);
      setLoading(false);
    }).catch(err => {
      console.error('Dashboard error:', err);
      setLoading(false);
    });
  }, [token]);

  const safeTotalWaste = data?.totalWaste || 0;
  const savedCO2 = (safeTotalWaste * 0.5).toFixed(1);
  const treesSaved = Math.floor(savedCO2 / 10) || 0;

  let topMaterial = 'Plastic';
  let topEmoji = '♻️';
  if ((data?.cardboard || 0) > (data?.plastic || 0) && (data?.cardboard || 0) > (data?.paper || 0)) {
    topMaterial = 'Cardboard'; topEmoji = '📦';
  } else if ((data?.paper || 0) > (data?.plastic || 0) && (data?.paper || 0) > (data?.cardboard || 0)) {
    topMaterial = 'Paper'; topEmoji = '📄';
  }

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const entriesThisWeek = activity?.filter(a => new Date(a?.createdAt) > oneWeekAgo)?.length || 0;

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const materialIcon = (type) => {
    if (!type) return '📦';
    const t = type.toLowerCase();
    if (t === 'plastic') return '♻️';
    if (t === 'cardboard') return '📦';
    if (t === 'paper') return '📄';
    return '🗑️';
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p className="loading-text">Loading your sustainability stats…</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Hi, {username}! 👋</h2>
          <p>Here's your environmental impact</p>
        </div>
        <div className="welcome-emoji">🌍</div>
      </div>

      {/* Stats Grid */}
      <p className="section-title mb-3">Your Impact</p>
      <div className="dashboard-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon-wrap">📊</div>
          <div className="stat-label">Total Waste</div>
          <div className="stat-value"><AnimatedNumber value={safeTotalWaste} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">♻️</div>
          <div className="stat-label">Plastic</div>
          <div className="stat-value"><AnimatedNumber value={data?.plastic || 0} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">📦</div>
          <div className="stat-label">Cardboard</div>
          <div className="stat-value"><AnimatedNumber value={data?.cardboard || 0} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">📄</div>
          <div className="stat-label">Paper</div>
          <div className="stat-value"><AnimatedNumber value={data?.paper || 0} /></div>
        </div>
      </div>

      {/* CO2 Insight */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="section-header">
            <p className="section-title">🌱 Impact Insights</p>
          </div>
          <div className="co2-highlight">
            <span className="co2-icon">🌍</span>
            <div className="co2-text">
              <strong>You saved {savedCO2}kg CO₂</strong>
              <span>Equal to {treesSaved} trees planted! 🌳</span>
            </div>
          </div>
          <div className="insight-row">
            <span className="insight-label">Top Material</span>
            <span className="insight-value">{topMaterial} {topEmoji}</span>
          </div>
          <div className="insight-row">
            <span className="insight-label">Logs this week</span>
            <span className="insight-value">{entriesThisWeek} 📈</span>
          </div>
        </div>
      </div>

      {/* Waste Trend Chart */}
      <div className="card mb-4">
        <div className="card-body">
          <p className="section-title mb-3">📉 Waste Trend</p>
          <div className="chart-container" style={{ width: '100%', minHeight: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="plastic" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="cardboard" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="paper" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-body">
          <p className="section-title mb-3">🕐 Recent Activity</p>
          {activity && activity.length > 0 ? (
            <div>
              {activity.slice(0, 4).map((item, i) => (
                <div key={item?._id || i} className="activity-item">
                  <div className="activity-dot">{materialIcon(item?.type)}</div>
                  <div className="activity-info">
                    <div className="activity-title">Logged {item?.type} from {item?.platform}</div>
                    <div className="activity-sub">{item?.platform}</div>
                  </div>
                  <span className="activity-time">{formatTimeAgo(item?.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-text">No recent activity yet.<br />Start logging your waste!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
