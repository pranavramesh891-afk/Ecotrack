import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

export default function RecyclingCenters() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/recycling`)
      .then(res => res.json())
      .then(json => {
        if (json) setCenters(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Recycling error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p className="loading-text">Finding nearby centers…</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <p className="page-title">Recycle Centers</p>
      <p className="page-subtitle">Drop off your packaging at these verified locations.</p>

      {centers.length > 0 ? (
        <div className="centers-list">
          {centers.map(center => (
            <div
              key={center.id}
              className="center-card"
              onClick={() => navigate(`/center/${center.id}`)}
              id={`center-${center.id}`}
            >
              <div className="center-card-icon">🏭</div>
              <div className="center-card-info">
                <div className="center-card-name">{center.name}</div>
                <div className="center-card-sub">✓ Verified Partner</div>
              </div>
              <div className="distance-badge">{center.distance}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <p className="empty-text">No recycling centers found nearby.<br />Check back soon!</p>
        </div>
      )}
    </div>
  );
}
