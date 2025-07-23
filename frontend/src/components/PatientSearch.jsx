import React, { useState } from 'react';
import axios from 'axios';

export default function PatientSearch() {
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [radius, setRadius] = useState(5);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/doctors/nearby?longitude=${longitude}&latitude=${latitude}&radius=${radius}`
    );
    setResults(res.data);
  };

  return (
    <div>
      <h2>Search Doctors</h2>
      <input
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />
      <input
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <input
        placeholder="Radius (km)"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {results.map((doc) => (
          <li key={doc._id}>{doc.name} — {doc.address}</li>
        ))}
      </ul>
    </div>
  );
}
