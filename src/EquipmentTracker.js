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
  { id: "TR3", name: "Orange Deckover", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "TR4", name: "8.5X24CH-7000", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "TR5", name: "SM714TA22", type: "Trailer", location: "Unknown", assignedTo: "" },
  { id: "TR6", name: "JV7X14TE2", type: "Trailer", location: "Warehouse", assignedTo: "" },
  { id: "VT1", name: "VX50-800", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "DT1", name: "Dump Trailer", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "TR7", name: "XLSE Gray Cargo", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "RT13", name: "I-85 Reel Trailer", type: "Trailer", location: "Shop", assignedTo: "" },
  { id: "AT01", name: "KAF400-A UTV", type: "Powered", location: "Unknown", assignedTo: "" },
  { id: "DE01", name: "800A Boom Lift", type: "Powered", location: "Shop", assignedTo: "" },
  { id: "DE02", name: "MLT3060KV Light Tower", type: "Trailer", location: "Belleville", assignedTo: "" },
  { id: "DE03", name: "GTH-636 Telehandler", type: "Powered", location: "Shop", assignedTo: "" },
  { id: "DE04", name: "TX427 Mini Compact Track Loader", type: "Powered", location: "Shop", assignedTo: "" },
  { id: "DE05", name: "MP25-8E1 Generator", type: "Powered", location: "Shop", assignedTo: "" },
  { id: "DA01", name: "D4H3 Harley Rake", type: "Powered", location: "Shop", assignedTo: "" },
  { id: "DE06", name: "PD10 Pile Driver", type: "Powered", location: "Shop", assignedTo: "" },
  { id: "DE07", name: "Concrete Mixer", type: "Powered", location: "Unknown", assignedTo: "" },
  { id: "AT02", name: "KAF820 Side X Side UTV", type: "Powered", location: "Unknown", assignedTo: "" },
  { id: "DE08", name: "SV40 Mini Excavator", type: "Powered", location: "Unknown", assignedTo: "" },
  { id: "DE09", name: "ViO25 Mini Excavator", type: "Powered", location: "Unknown", assignedTo: "" },
  { id: "PU4", name: "F150", type: "Vehicle", location: "Shop", assignedTo: "Nathan Sumner" },
  { id: "PU5", name: "F150", type: "Vehicle", location: "Shop", assignedTo: "Tommy Reyling" },
  { id: "PU6", name: "Canyon", type: "Vehicle", location: "Shop", assignedTo: "Spare ELD" },
  { id: "PU7", name: "Silverado", type: "Vehicle", location: "Shop", assignedTo: "James Horseman" },
  { id: "PU10", name: "Silverado", type: "Vehicle", location: "Unknown", assignedTo: "Davy Martin" },
  { id: "PU11", name: "Silverado", type: "Vehicle", location: "Unknown", assignedTo: "Unknown" },
  { id: "PU13", name: "F250", type: "Vehicle", location: "Unknown", assignedTo: "Brandon Norris" },
  { id: "PU14", name: "F150", type: "Vehicle", location: "Unknown", assignedTo: "Spare HBG" },
  { id: "PU15", name: "F150", type: "Vehicle", location: "Unknown", assignedTo: "ESG" },
  { id: "PU16", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Kevin Rice" },
  { id: "PU17", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Jacob Blackman" },
  { id: "PU18", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Michael Rogers" },
  { id: "PU19", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Ryan Heady" },
  { id: "PU20", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Doug Uhls" },
  { id: "PU21", name: "F150", type: "Vehicle", location: "Unknown", assignedTo: "Dave Martin" },
  { id: "PV1", name: "E350 Van", type: "Vehicle", location: "Unknown", assignedTo: "Eldorado" },
  { id: "TT1", name: "Semi Tractor", type: "CMV", location: "Unknown", assignedTo: "" },
  { id: "TT2", name: "Semi Tractor", type: "CMV", location: "Unknown", assignedTo: "" },
  { id: "ST2", name: "Silverado", type: "Vehicle", location: "Unknown", assignedTo: "Shop Truck" },
  { id: "ST3", name: "F350 Van", type: "Vehicle", location: "Unknown", assignedTo: "" },
  { id: "ST4", name: "Ram 4500", type: "Vehicle", location: "Unknown", assignedTo: "Steve McGhee-old" },
  { id: "ST5", name: "Ram 2500", type: "Vehicle", location: "Unknown", assignedTo: "" },
  { id: "ST6", name: "Ram 5500", type: "Vehicle", location: "Unknown", assignedTo: "" },
  { id: "ST7", name: "Silverado", type: "Vehicle", location: "Unknown", assignedTo: "" },
  { id: "ST8", name: "Ram 3500", type: "Vehicle", location: "Unknown", assignedTo: "" },
  { id: "ST9", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "" },
  { id: "ST10", name: "Semi Tractor", type: "CMV", location: "Unknown", assignedTo: "" },
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
      <h1 style={styles.header}>Equipment Tracker</h1>
      <div style={styles.list}>
        {equipment.map((eq) => (
          <div key={eq.id} style={styles.item}>
            <div style={styles.itemHeader}>
              <span style={styles.itemName}>{eq.name} ({eq.type})</span>
              <span style={styles.itemID}>ID: {eq.id}</span>
            </div>
            <div style={styles.selectContainer}>
              <select
                value={eq.location}
                onChange={(e) => updateEquipment(eq.id, "location", e.target.value)}
                style={styles.select}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
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
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles optimized for mobile readability
const styles = {
  container: {
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: 'auto',
  },
  header: {
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  itemID: {
    fontSize: '12px',
    color: '#666',
  },
  selectContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
  },
  select: {
    flex: 1,
    padding: '6px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
};
