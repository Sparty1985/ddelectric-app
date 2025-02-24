import React, { useEffect, useState } from "react";
import axios from "axios";

const EquipmentTracker = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Configuration (Replace with Your Procore API Details)
  const PROCORE_API_URL = "https://api.procore.com/v1.0/equipment"; 
  const PROCORE_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"; // Replace with actual token
  const PROCORE_COMPANY_ID = "YOUR_COMPANY_ID"; // Replace with actual company ID

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(PROCORE_API_URL, {
        headers: {
          Authorization: `Bearer ${PROCORE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "Procore-Company-Id": PROCORE_COMPANY_ID,
        },
      });
      setEquipment(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      setError("Failed to load equipment data.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>D&D Electric Equipment Tracker</h1>

      {loading && <p>Loading equipment...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {equipment.map((item) => (
          <div key={item.id} style={styles.card}>
            <h2 style={styles.equipmentName}>{item.name}</h2>
            <p style={styles.equipmentInfo}>ID: {item.id}</p>
            <p style={styles.equipmentInfo}>Status: {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styling for UI
const styles = {
  container: { padding: "2rem", fontFamily: "Arial, sans-serif" },
  header: { textAlign: "center", color: "#0A1633" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#FFF",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  equipmentName: { fontSize: "1.2rem", fontWeight: "bold", color: "#0A1633" },
  equipmentInfo: { fontSize: "1rem", color: "#333" },
  error: { color: "red", textAlign: "center" },
};

// Export Component
export default EquipmentTracker;
