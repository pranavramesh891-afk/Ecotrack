import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const generateMockData = (id) => ({
  id,
  name: id % 2 === 0 ? 'Green Path Recycling' : 'Eco Hub Center',
  distance: '1.2 miles',
  rating: 4.5,
  isVerified: true,
  stats: {
    total: 120 + (id * 10),
    plastic: 50 + (id * 2),
    cardboard: 40 + (id * 3),
    paper: 30 + (id * 5)
  },
  history: [
    { id: 101, action: 'Processed 5kg plastic', date: 'Today' },
    { id: 102, action: 'Received cardboard shipment', date: 'Yesterday' },
    { id: 103, action: 'Processed 10kg mixed paper', date: '2 Days Ago' }
  ],
  reviews: [
    { id: 201, user: 'Alex M.', text: 'Very clean and organized location.', stars: 5 },
    { id: 202, user: 'Sam T.', text: 'Quick service, in and out in 5 minutes.', stars: 4 },
    { id: 203, user: 'Jamie L.', text: 'Staff is helpful but sometimes a line in the afternoon.', stars: 4 }
  ]
});

export default function CenterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = generateMockData(Number(id) || 1);

  const chartData = [
    { name: 'Plastic',  value: data.stats.plastic,   color: '#22c55e' },
    { name: 'Cardboard', value: data.stats.cardboard, color: '#f59e0b' },
    { name: 'Paper',    value: data.stats.paper,      color: '#3b82f6' }
  ];

  return (
    <div className="animate-fade-up">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/recycling')}>
        ← Back to Centers
      </button>

      {/* Hero */}
      <div className="center-hero">
        <h2>{data.name}</h2>
        <div className="center-hero-meta">
          {data.isVerified && (
            <span className="center-badge">✓ Verified</span>
          )}
          <span className="center-badge">⭐ {data.rating}</span>
          <span className="center-badge">📍 {data.distance}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <p className="section-title mb-3">Processing Stats</p>
      <div className="dashboard-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon-wrap">📊</div>
          <div className="stat-label">Total</div>
          <div className="stat-value">{data.stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">♻️</div>
          <div className="stat-label">Plastic</div>
          <div className="stat-value">{data.stats.plastic}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">📦</div>
          <div className="stat-label">Cardboard</div>
          <div className="stat-value">{data.stats.cardboard}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap">📄</div>
          <div className="stat-label">Paper</div>
          <div className="stat-value">{data.stats.paper}</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card mb-4">
        <div className="card-body">
          <p className="section-title mb-3">Material Breakdown</p>
          <div style={{ width: '100%', minHeight: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mb-4">
        <div className="card-body">
          <p className="section-title mb-3">🕐 Recent Activity</p>
          {data.history.map(item => (
            <div key={item.id} className="activity-item">
              <div className="activity-dot">♻️</div>
              <div className="activity-info">
                <div className="activity-title">{item.action}</div>
              </div>
              <span className="activity-time">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="card">
        <div className="card-body">
          <p className="section-title mb-3">⭐ User Reviews</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <span style={{ fontSize: '0.82rem' }}>
                    {Array(review.stars).fill('⭐').join('')}
                  </span>
                </div>
                <p className="review-text">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
