import { useState } from 'react';

const API_URL = 'http://localhost:5001/api';

export default function LogWaste() {
  const [platform, setPlatform] = useState('Amazon');
  const [material, setMaterial] = useState('plastic');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const detectRes = await fetch(`${API_URL}/detect`, { method: 'POST' });
      const detectData = await detectRes.json();
      const detectedMaterial = detectData.material || material;
      
      let location = { lat: 0, lng: 0 };
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
          });
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        } catch (geoError) {
          console.warn("Geolocation denied or timed out.");
        }
      }

      const wasteRes = await fetch(`${API_URL}/waste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: detectedMaterial, platform, location })
      });
      
      if (!wasteRes.ok) throw new Error("Failed to save waste.");
      
      setStatus({ type: 'success', msg: `Waste logged! AI detected: ${detectedMaterial}.` });
      setFileName('');

    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: 'An error occurred while saving.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2 className="mb-2">Log New Waste</h2>
      <p className="subtitle mb-6">Upload an image of your packaging to track it.</p>

      {status && (
        <div className={`status-msg ${status.type === 'success' ? 'status-success' : 'status-error'} mb-6`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)}>
            <option value="Amazon">Amazon</option>
            <option value="eBay">eBay</option>
            <option value="Walmart">Walmart</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Expected Material</label>
          <select value={material} onChange={e => setMaterial(e.target.value)}>
            <option value="plastic">Plastic</option>
            <option value="cardboard">Cardboard</option>
            <option value="paper">Paper</option>
          </select>
        </div>

        <div className="form-group">
          <label>Image Evidence</label>
          <label className="image-upload-wrapper">
            <p>{fileName ? `Selected: ${fileName}` : 'Click to select packaging image'}</p>
            <span style={{color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 600}}>
              {fileName ? 'Change File' : 'Browse Files'}
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Analyze & Save'}
        </button>
      </form>
    </div>
  );
}
