import React, { useState } from "react";
import axios from "axios";

export default function PatientSearch() {
  const [placeName, setPlaceName] = useState("");
  const [radius, setRadius] = useState(5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!placeName.trim()) {
      setError("Please enter a place name.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/doctors/nearby?placeName=${encodeURIComponent(
          placeName
        )}&radius=${radius}`
      );

      if (res.data.length === 0) {
        setError(`No doctors found near "${placeName}".`);
      } else {
        setResults(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>🔍 Search Doctors by Place Name</h2>
      <input
        placeholder="Enter area (e.g., JP Nagar)"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
      />
      <input
        placeholder="Radius in km"
        type="number"
        min="1"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
      />
      <button onClick={handleSearch} disabled={loading} style={{ width: "100%" }}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      <ul style={{ marginTop: "1rem" }}>
        {results.map((doc) => (
          <li key={doc._id}>
            <strong>{doc.name}</strong> — {doc.address}
          </li>
        ))}
      </ul>
    </div>
  );
}
