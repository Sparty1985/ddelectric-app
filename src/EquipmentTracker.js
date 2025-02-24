import React, { useState, useEffect } from 'react';
import { getProcoreEquipment, updateProcoreEquipment } from './procoreAPI'; // Procore API helpers

function EquipmentTracker() {
  const [equipment, setEquipment] = useState([]);
  const locations = ['Shop', 'ESL', 'Dragon’s Breath', '1407 Warehouse', 'Blue Hole', 'Local Solar', 'M Class', 'Mach', 'DTM'];

  // Fetch Equipment from Procore
  useEffect(() => {
    async function fetchEquipment() {
      const procoreEquipment = await getProcoreEquipment();
      setEquipment(procoreEquipment);
    }
    fetchEquipment();
  }, []);

  // Update Equipment in Procore
  const updateEquipment = async (id, field, value) => {
    setEquipment(prev => prev.map(eq => (eq.id === id ? { ...eq, [field]: value } : eq)));
    await updateProcoreEquipment(id, { [field]: value });
  };

  return (
    <div style={styles.container}>
      <h2>Equipment Tracker</h2>
      {equipment.map(eq => (
        <div key={eq.id} style={styles.card}>
          <h3>{eq.name}</h3>
          <p>ID: {eq.id}</p>

          <label>Location:</label>
          <select value={eq.location || ''} onChange={e => updateEquipment(eq.id, 'location', e.target.value)}>
            <option value=''>-- Select a Location --</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <label>Assigned To:</label>
          <input type="text" value={eq.assignedTo || ''} onChange={e => updateEquipment(eq.id, 'assignedTo', e.target.value)} />
        </div>
      ))}
    </div>
  );
}

// Styling
const styles = {
  container: { padding: '2rem' },
  card: {    
    background: '#fff',
    padding: '1rem'
  }
};
