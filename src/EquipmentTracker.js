import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";

export default function EquipmentTracker() {
  const [equipment, setEquipment] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    location: "",
    employee: "",
    notes: "",
  });

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

  // Handle adding or updating equipment
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { id, name, type, location, employee, notes } = formData;

    if (!id || !name || !type) {
      alert("ID, Name, and Type are required!");
      return;
    }

    try {
      await setDoc(doc(db, "equipment", id), {
        name,
        type,
        location,
        employee,
        notes,
      });
      alert("Equipment added/updated successfully!");
      window.location.reload(); // Refresh data after update
    } catch (error) {
      alert("Error updating equipment: " + error.message);
    }
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
      {Object.keys(groupedEquipment).map((type) => (
        <div key={type} id={type}>
          <h2 style={styles.sectionHeader}>{type}</h2>
          <div style={styles.list}>
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
        </div>
      ))}

      {/* Password-Protected Equipment Management Form */}
      <div style={styles.formContainer}>
        {!isAuthorized ? (
          <div>
            <h2>Enter Password to Manage Equipment</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.passwordInput}
            />
            <button
              onClick={() => {
                if (password === "Gogetter@6608") setIsAuthorized(true);
                else alert("Incorrect Password!");
              }}
              style={styles.toggleButton}
            >
              Submit
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <h2>Manage Equipment</h2>
            <input
              type="text"
              placeholder="Equipment ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={formData.employee}
              onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
            >
              <option value="">Unassigned</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <button type="submit" style={styles.toggleButton}>Save Equipment</button>
          </form>
        )}
      </div>
    </div>
  );
}
