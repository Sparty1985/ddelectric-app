import React, { useState } from 'react';

const initialEquipment = [
  { id: "DT2", name: "Dump Trailer", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "DC1", name: "LPX210", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "DC2", name: "Tilt Deck", type: "Trailer", location: "1407 Warehouse", assignedTo: "" },
  { id: "DC3", name: "Tilt Deck", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "DW1", name: "Pole Trailer", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "FT1", name: "Pintle Deckover", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "FT2", name: "Wallace Flatbed", type: "Trailer", location: "Inactive", assignedTo: "" },
  { id: "LB1", name: "RGN Lowboy", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "TR1", name: "Atlas Box Trailer", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "TR2", name: "Doo Box Trailer", type: "Trailer", location: "Mine Property", assignedTo: "" },
  { id: "PU4", name: "F150", type: "Vehicle", location: "Shop", assignedTo: "Nathan Sumner" },
  { id: "PU5", name: "F150", type: "Vehicle", location: "Shop", assignedTo: "Tommy Reyling" },
  { id: "PU6", name: "Canyon", type: "Vehicle", location: "Shop", assignedTo: "Spare ELD" },
  { id: "PU7", name: "Silverado", type: "Vehicle", location: "Shop", assignedTo: "James Horseman" }
];

const locations = [
  "Shop", "ESL", "Dragon’s Breath", "1407 Warehouse", "Blue Hole", 
  "Local Solar", "M Class", "Mach", "DTM"
];

const employees = [
  "Houston Ellis", "Bob Hathaway", "Nathan Sumner", "Tim Serles", 
  "James Horseman", "Peyton Lane", "Matthew Bailey", "Nick Baird", 
  "Mitchell Barnett", "Garrett Bebout", "Michael Bennett", "Lisa Berry", 
  "Jacob Blackman", "Luke Bosler", "Israel Burtis", "Kaleb Clayton", 
  "Jamie Colbert", "Chaythian Coleman", "Caleb Coston", "Riley Cross", 
  "Tyler Cummins", "James Curry", "Cameron Damico", "Blane Davis", 
  "Adrian Fulton", "Ben Goben", "Kevin Gulley", "Jeffrey Hathaway", 
  "Ryan Heady", "Nolan Henson", "Jeremiah Horseman", "Jeremy Jackson", 
  "Nicholas Johnson", "John Jones", "Tobey Kragness", "Peyton Lane", 
  "Davy Martin", "Samuel Martin", "Josiah McCormick", "Daniel 'Steve' McGhee",
  "Kyle Melvin", "Brandon Milligan", "Caleb Moss", "Caleb Murray", 
  "Brandon Norris", "Domarion Nunez", "Brigette Owens", "Jennifer Patrick", 
  "Chad Patton", "Roger Peek", "Robert 'Bobby' Ragsdale", "Jamia Rasmussen", 
  "Tommy Reyling", "Caleb Rice", "Kevin Rice", "Nicholas Riggs", 
  "Justin Roberts", "Justin Robinson", "Kevin Robinson III", "Brandyn Roe", 
  "Christian Rogers", "Michael Rogers", "Michael 'Mike' Rogers", "Jheric Rush", 
  "Matt Russell", "Nathan Sanderson", "Benjamin Scott", "Paul Seagraves", 
  "Colton Sisk", "Jerry Stacy", "Caleb Stein", "Tyler Straube", 
  "William 'Bill' Taylor", "Jerry Thomas", "Trenton Thorpe", "Doug Uhls", 
  "Dallas Varble", "Grant Vickery", "Darla Martin"
];

export default function EquipmentTracker() {
  const [equipment, setEquipment] = useState(initialEquipment);

  const updateEquipment = (id, field, value) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq))
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Equipment Tracking</h1>
      <div style={styles.grid}>
        {equipment.map((eq) => (
          <div key={eq.id} style={styles.card}>
            <h2 style={styles.cardTitle}>{eq.name} ({eq.type})</h2>
            <p>ID: {eq.id}</p>
            
            <label>Location:</label>
            <select
              value={eq.location}
              onChange={(e) => updateEquipment(eq.id, "location", e.target.value)}
              style={styles.select}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <label>Assigned To:</label>
            <select
              value={eq.assignedTo}
              onChange={(e) => updateEquipment(eq.id, "assignedTo", e.target.value)}
              style={styles.select}
            >
              <option value="">Unassigned</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: 'auto'
  },
  header: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  select: {
    marginTop: '5px',
    padding: '5px',
    fontSize: '14px'
  }
};
