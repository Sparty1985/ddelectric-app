import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function EquipmentTracker() {
  const [equipment, setEquipment] = useState([]);
  const [locations, setLocations] = useState([]);  // Fetch from Firebase
  const [employees, setEmployees] = useState([]);  // Fetch from Firebase
  const [viewMode, setViewMode] = useState("list");

  // 🔹 Fetch Equipment, Locations, and Employees from Firebase
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Equipment
        const equipmentSnapshot = await getDocs(collection(db, "equipment"));
        setEquipment(equipmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Locations
        const locationsSnapshot = await getDocs(collection(db, "locations"));
        setLocations(locationsSnapshot.docs.map(doc => doc.data().name));  // Ensure it's an array of names

        // Fetch Employees
        const employeesSnapshot = await getDocs(collection(db, "employees"));
        setEmployees(employeesSnapshot.docs.map(doc => doc.data().name));  // Ensure it's an array of names
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // 🔹 Update Firestore when changes are made
  const updateEquipment = async (id, field, value) => {
    setEquipment(prev =>
      prev.map(eq => (eq.id === id ? { ...eq, [field]: value } : eq))
    );
    const equipmentRef = doc(db, "equipment", id);
    await updateDoc(equipmentRef, { [field]: value });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Equipment Tracker</h1>
      <button onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")} style={styles.toggleButton}>
        {viewMode === "list" ? "Switch to Grid View" : "Switch to List View"}
      </button>

      {viewMode === "list" ? (
        <div style={styles.list}>
          {equipment.map(eq => (
            <div key={eq.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{eq.name} ({eq.type})</h2>

              {/* 🔹 Location Dropdown (Pulled from Firebase) */}
              <label>Location:</label>
              <select 
                value={eq.location} 
                onChange={(e) => updateEquipment(eq.id, "location", e.target.value)} 
                style={styles.select}
              >
                {locations.length > 0 ? (
                  locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))
                ) : (
                  <option value="">Loading...</option>
                )}
              </select>

              {/* 🔹 Assigned To Dropdown (Pulled from Firebase) */}
              <label>Assigned To:</label>
              <select 
                value={eq.assignedTo} 
                onChange={(e) => updateEquipment(eq.id, "assignedTo", e.target.value)} 
                style={styles.select}
              >
                <option value="">Unassigned</option>
                {employees.length > 0 ? (
                  employees.map(emp => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))
                ) : (
                  <option value="">Loading...</option>
                )}
              </select>

              <label>Notes:</label>
              <input
                type="text"
                value={eq.notes}
                onChange={(e) => updateEquipment(eq.id, "notes", e.target.value)}
                style={styles.notesInput}
                placeholder="Add notes..."
              />
            </div>
          ))}
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Location</th>
              <th>Assigned</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(eq => (
              <tr key={eq.id}>
                <td>{eq.id}</td>
                <td>{eq.name} ({eq.type})</td>
                <td>{eq.location}</td>
                <td>{eq.assignedTo || "Unassigned"}</td>
                <td>{eq.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 🔹 Styles
const styles = {
  container: { padding: "10px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "auto" },
  header: { textAlign: "center", fontSize: "22px", fontWeight: "bold", marginBottom: "10px" },
  toggleButton: { display: "block", margin: "10px auto", padding: "8px 12px", fontSize: "14px", backgroundColor: "#E67E22", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  card: { backgroundColor: "#FFFFFF", padding: "10px", borderRadius: "6px", border: "1px solid black", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column" },
  select: { width: "100%", fontSize: "12px", border: "1px solid black", padding: "4px" },
  notesInput: { width: "100%", fontSize: "12px", border: "1px solid black", padding: "4px" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableCell: { border: "1px solid black", padding: "5px", textAlign: "center" },
};

