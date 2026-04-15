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
        if(json) setCenters(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Recycling error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="glass-card"><p>Finding nearby centers...</p></div>;

  return (
    <div className="glass-card">
      <h2 className="mb-2">Nearby Centers</h2>
      <p className="subtitle mb-6">Drop off your packaging at these verified locations.</p>

      {centers.length > 0 ? (
        <div className="centers-list">
          {centers.map(center => (
            <div 
              key={center.id} 
              className="center-card" 
              onClick={() => navigate(`/center/${center.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="center-info">
                <h4>{center.name}</h4>
                <p>Verified Partner</p>
              </div>
              <div className="distance-badge">{center.distance}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No centers found nearby.</p>
      )}
    </div>
  );
}
