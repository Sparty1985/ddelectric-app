import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function EquipmentTracker() {
  const [equipment, setEquipment] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch equipment, locations, and employees from Firebase
  useEffect(() => {
    async function fetchData() {
      // Equipment Data
      const eqSnapshot = await getDocs(collection(db, "equipment"));
      const eqList = eqSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipment(eqList);

      // Locations Data
      const locSnapshot = await getDocs(collection(db, "locations"));
      const locList = locSnapshot.docs.map((doc) => doc.data().name);
      setLocations(locList);

      // Employees Data
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

      {/* Quick Links to Equipment Categories */}
      <div style={styles.categoryLinks}>
        {Object.keys(groupedEquipment).map((type) => (
          <a
            key={type}
            href={`#${type}`}
            style={styles.categoryLink}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(type)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {type}
          </a>
        ))}
      </div>

      <button
        onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
        style={styles.toggleButton}
      >
        {viewMode === "list" ? "Switch to Grid View" : "Switch to List View"}
      </button>

      {/* Render Equipment by Type */}
      {viewMode === "list"
        ? Object.keys(groupedEquipment).map((type) => (
            <div key={type} id={type}>
              <h2 style={styles.sectionHeader}>{type}</h2>
              <div style={styles.list}>
                {groupedEquipment[type].map((eq) => (
                  <div key={eq.id} style={styles.card}>
                    <h2 style={styles.cardTitle}>{eq.name}</h2>
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
            </div>
          ))
        : Object.keys(groupedEquipment).map((type) => (
            <div key={type} id={type}>
              <h2 style={styles.sectionHeader}>{type}</h2>
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
                      <td>{eq.location}</td>
                      <td>{eq.employee || "Unassigned"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: "10px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "900px",
    margin: "auto",
  },
  header: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  searchInput: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    border: "1px solid black",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  categoryLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "10px",
  },
  categoryLink: {
    padding: "8px",
    background: "#E67E22",
    color: "#FFF",
    borderRadius: "4px",
    textDecoration: "none",
    cursor: "pointer",
  },
  toggleButton: {
    display: "block",
    margin: "10px auto",
    padding: "8px 12px",
    fontSize: "14px",
    backgroundColor: "#E67E22",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  sectionHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "20px",
    paddingBottom: "5px",
    borderBottom: "2px solid black",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid black",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  select: {
    width: "100%",
    fontSize: "12px",
    border: "1px solid black",
    padding: "4px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid black",
  },
  tableCell: {
    border: "1px solid black",
    padding: "5px",
    textAlign: "center",
  },
};
