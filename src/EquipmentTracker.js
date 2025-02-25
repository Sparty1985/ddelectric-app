import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc, setDoc, addDoc } from "firebase/firestore";

export default function EquipmentTracker() {
  const [equipment, setEquipment] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    location: "",
    assignedTo: "",
    notes: "",
  });

  const [newLocation, setNewLocation] = useState("");
  const [newEmployee, setNewEmployee] = useState("");

  // Fetch data from Firebase
  useEffect(() => {
    async function fetchData() {
      const eqSnapshot = await getDocs(collection(db, "equipment"));
      const eqList = eqSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          type: data.type || "Uncategorized",
          location: data.location || "",
          assignedTo: data.assignedTo || "",
          notes: data.notes || "",
        };
      });
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

  // Update Equipment
  const updateEquipment = async (id, field, value) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq))
    );
    await updateDoc(doc(db, "equipment", id), { [field]: value });
  };

  // Handle form changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add/Edit Equipment in Firebase
  const handleSaveEquipment = async () => {
    if (!formData.id) {
      alert("Equipment ID is required!");
      return;
    }

    const docRef = doc(db, "equipment", formData.id);
    await setDoc(docRef, formData, { merge: true });

    setShowForm(false);
    setAuthenticated(false);
    setFormData({ id: "", name: "", type: "", location: "", assignedTo: "", notes: "" });
    alert("Equipment saved successfully!");
    window.location.reload();
  };

  // Add new location to Firebase
  const handleAddLocation = async () => {
    if (!newLocation) return;
    await addDoc(collection(db, "locations"), { name: newLocation });
    setNewLocation("");
    alert("Location added!");
    window.location.reload();
  };

  // Add new employee to Firebase
  const handleAddEmployee = async () => {
    if (!newEmployee) return;
    await addDoc(collection(db, "employees"), { name: newEmployee });
    setNewEmployee("");
    alert("Employee added!");
    window.location.reload();
  };

  // Search Filter
  const filteredEquipment = equipment.filter((eq) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      eq.id.toLowerCase().includes(searchLower) ||
      (eq.name && eq.name.toLowerCase().includes(searchLower)) ||
      (eq.location && eq.location.toLowerCase().includes(searchLower)) ||
      (eq.assignedTo && eq.assignedTo.toLowerCase().includes(searchLower)) ||
      (eq.notes && eq.notes.toLowerCase().includes(searchLower)) ||
      (eq.type && eq.type.toLowerCase().includes(searchLower))
    );
  });

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

      {/* Toggle View Mode */}
      <button
        onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
        style={styles.toggleButton}
      >
        {viewMode === "list" ? "Switch to Grid View" : "Switch to List View"}
      </button>

      {/* Render Equipment */}
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
                  <th>Notes</th>
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
    value={eq.assignedTo}
    onChange={(e) => updateEquipment(eq.id, "assignedTo", e.target.value)}
    style={styles.select}
  >
    <option value="">Unassigned</option>
    {employees.map((emp) => (
      <option key={emp} value={emp}>{emp}</option>
    ))}
  </select>
</td>
<td>{eq.notes}</td>                 
    </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.grid}>
  {groupedEquipment[type].map((eq) => (
    <div key={eq.id} style={styles.card}>
      <h2 style={styles.cardTitle}>{eq.name}</h2>
      <span style={styles.equipmentID}>{eq.id}</span>

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
        value={eq.assignedTo}
        onChange={(e) => updateEquipment(eq.id, "assignedTo", e.target.value)}
        style={styles.select}
      >
        <option value="">Unassigned</option>
        {employees.map((emp) => (
          <option key={emp} value={emp}>{emp}</option>
        ))}
      </select>

      <label>Notes:</label>
      <textarea
        value={eq.notes}
        onChange={(e) => updateEquipment(eq.id, "notes", e.target.value)}
        style={styles.textarea}
      />
    </div>
  ))}
</div>
          )}
        </div>
      ))}

      {/* Add/Edit Button */}
      <button
        onClick={() => setShowForm(true)}
        style={styles.editButton}
      >
        Add/Edit Equipment
      </button>

      {/* Password Prompt */}
      {showForm && !authenticated && (
        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setAuthenticated(password === "Gogetter@6608")}>
            Submit
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {authenticated && (
        <div style={styles.formContainer}>
          <input name="id" placeholder="ID" value={formData.id} onChange={handleFormChange} />
          <input name="name" placeholder="Name" value={formData.name} onChange={handleFormChange} />
          <input name="type" placeholder="Type" value={formData.type} onChange={handleFormChange} />
          <input name="location" placeholder="Location" value={formData.location} onChange={handleFormChange} />
          <input name="assignedTo" placeholder="Employee" value={formData.assignedTo} onChange={handleFormChange} />
          <input name="notes" placeholder="Notes" value={formData.notes} onChange={handleFormChange} />
          <button onClick={handleSaveEquipment}>Save Equipment</button>
        </div>
      )}
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
  textarea: {
  width: "100%",
  height: "60px",
  fontSize: "14px",
  border: "1px solid black",
  borderRadius: "6px",
  padding: "6px",
},
};
