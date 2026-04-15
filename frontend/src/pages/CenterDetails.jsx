import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock data simulation based on ID
const generateMockData = (id) => {
  return {
    id: id,
    name: id % 2 === 0 ? "Green Path Recycling" : "Eco Hub Center",
    distance: "1.2 miles",
    rating: 4.5,
    isVerified: true,
    stats: {
      total: 120 + (id * 10),
      plastic: 50 + (id * 2),
      cardboard: 40 + (id * 3),
      paper: 30 + (id * 5)
    },
    history: [
      { id: 101, action: "Processed 5kg plastic", date: "Today" },
      { id: 102, action: "Received cardboard shipment", date: "Yesterday" },
      { id: 103, action: "Processed 10kg mixed paper", date: "2 Days Ago" }
    ],
    reviews: [
      { id: 201, user: "Alex M.", text: "Very clean and organized location.", stars: 5 },
      { id: 202, user: "Sam T.", text: "Quick service, in and out in 5 minutes.", stars: 4 },
      { id: 203, user: "Jamie L.", text: "Staff is helpful but sometimes a line in the afternoon.", stars: 4 }
    ]
  };
};

export default function CenterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = generateMockData(Number(id) || 1);

  const chartData = [
    { name: 'Plastic', value: data.stats.plastic, color: '#10b981' },
    { name: 'Cardboard', value: data.stats.cardboard, color: '#f59e0b' },
    { name: 'Paper', value: data.stats.paper, color: '#3b82f6' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button 
        className="nav-btn" 
        onClick={() => navigate('/recycling')}
        style={{ width: 'fit-content' }}
      >
        ← Back to Centers
      </button>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{data.name}</h2>
            {data.isVerified && <p style={{ color: 'var(--accent-color)', fontWeight: 600 }}>✓ Verified Partner</p>}
          </div>
          <div className="text-center">
            <div style={{ fontSize: '1.5rem' }}>⭐ {data.rating}</div>
            <p className="subtitle">{data.distance}</p>
          </div>
        </div>

        <h3 style={{ margin: '2rem 0 1rem', color: 'var(--text-secondary)' }}>Processing Stats</h3>
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-icon">📊</span>
              <h3>Total Waste</h3>
            </div>
            <div className="value">{data.stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-icon">♻️</span>
              <h3>Plastic</h3>
            </div>
            <div className="value">{data.stats.plastic}</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-icon">📦</span>
              <h3>Cardboard</h3>
            </div>
            <div className="value">{data.stats.cardboard}</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-icon">📄</span>
              <h3>Paper</h3>
            </div>
            <div className="value">{data.stats.paper}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Material Breakdown</h3>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.history.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 500 }}>{item.action}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>User Reviews</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {data.reviews.map(review => (
            <div key={review.id} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{review.user}</strong>
                <span>{Array(review.stars).fill('⭐').join('')}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
