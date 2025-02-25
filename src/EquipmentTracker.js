import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";

export default function EquipmentTracker() {
  const [equipment, setEquipment] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch equipment, locations, and employees from Firebase
  useEffect(() => {
    async function fetchData() {
      const eqSnapshot = await getDocs(collection(db, "equipment"));
      const eqList = eqSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipment(eqList);

      const locSnapshot = await getDocs(collection(db, "locations"));
      const locList = locSnapshot.docs.map((doc) => doc.data().name);
      setLocations(locList);

      const empSnapshot = await getDocs(collection(db, "employees"));
      const empList = empSnapshot.docs.map((doc) => doc.data().name);
      setEmployees(empList);
    }
    fetchData();
  }, []);

  const updateEquipment = async (id, field, value) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq))
    );
    await updateDoc(doc(db, "equipment", id), { [field]: value });
  };

  // Filter equipment based on search input
  const filteredEquipment = equipment.filter((eq) =>
    eq.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group equipment by type
  const groupedEquipment = filteredEquipment.reduce((acc, eq) => {
    const type = eq.type || "Uncategorized";
    if (!acc[type]) acc[type] = [];
    acc[type].push(eq);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Equipment Tracker</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search equipment..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />

      {/* View Toggle Button */}
      <button
        onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
        style={styles.toggleButton}
      >
        {viewMode === "list" ? "Switch to Grid View" : "Switch to List View"}
      </button>

      {/* Render Equipment by Type */}
      {Object.keys(groupedEquipment).map((type) => (
        <div key={type} id={type} style={styles.section}>
          <h2 style={styles.sectionHeader}>{type}</h2>

          {viewMode === "list" ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Employee</th>
                </tr>
              </thead>
              <tbody>
                {groupedEquipment[type].map((eq) => (
                  <tr key={eq.id}>
                    <td>{eq.id}</td>
                    <td>{eq.name}</td>
                    <td>
                      <select
                        value={eq.location}
                        onChange={(e) => updateEquipment(eq.id, "location", e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={eq.employee}
                        onChange={(e) => updateEquipment(eq.id, "employee", e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Unassigned</option>
                        {employees.map((emp) => (
                          <option key={emp} value={emp}>{emp}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.grid}>
              {groupedEquipment[type].map((eq) => (
                <div key={eq.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h2 style={styles.cardTitle}>{eq.name}</h2>
                    <span style={styles.equipmentID}>{eq.id}</span>
                  </div>
                  <label>Location:</label>
                  <select
                    value={eq.location}
                    onChange={(e) => updateEquipment(eq.id, "location", e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <label>Employee:</label>
                  <select
                    value={eq.employee}
                    onChange={(e) => updateEquipment(eq.id, "employee", e.target.value)}
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
          )}
        </div>
      ))}
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1000px",
    margin: "auto",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid black",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  toggleButton: {
    display: "block",
    margin: "10px auto",
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#E67E22",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  section: {
    marginBottom: "40px",
  },
  sectionHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "30px",
    paddingBottom: "5px",
    borderBottom: "2px solid black",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid black",
    marginTop: "10px",
    textAlign: "center",
  },
  tableCell: {
    border: "1px solid black",
    padding: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid black",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  equipmentID: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "gray",
  },
  select: {
    width: "100%",
    fontSize: "14px",
    border: "1px solid black",
    padding: "6px",
  },
};

