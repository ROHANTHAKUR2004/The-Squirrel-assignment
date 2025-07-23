import React, { useState } from 'react';
import axios from 'axios';
import ReactMapGL, { Marker } from 'react-map-gl';

export default function DoctorForm() {
  const [viewport, setViewport] = useState({
    longitude: 77.5946,
    latitude: 12.9716,
    zoom: 12,
    width: "100%",
    height: 500
  });

  const [marker, setMarker] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleMapClick = (event) => {
    const [longitude, latitude] = event.lngLat;
    setMarker({ longitude, latitude });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!marker) {
      alert('Please drop a pin!');
      return;
    }
    await axios.post('http://localhost:5000/api/doctors', {
      name,
      address,
      longitude: marker.longitude,
      latitude: marker.latitude
    });
    alert('Doctor saved!');
  };

  return (
    <div>
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
        <button type="submit">Save</button>
      </form>

      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {marker && (
          <Marker longitude={marker.longitude} latitude={marker.latitude} />
        )}
      </ReactMapGL>
    </div>
  );
}
