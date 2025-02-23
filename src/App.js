import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getWeatherData } from './weatherAPI'; // Weather API helper
import EquipmentTracker from './EquipmentTracker'; // Equipment Page
import { getProcoreEmployees, getProcoreActionItems } from './procoreAPI'; // Procore API helpers

function App() {
  const [weather, setWeather] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [actionItems, setActionItems] = useState([]);

  // Load Weather on App Start
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const data = await getWeatherData(latitude, longitude);
      setWeather(data);
    });
  }, []);

  // Load Employees from Procore
  useEffect(() => {
    async function fetchEmployees() {
      const procoreEmployees = await getProcoreEmployees();
      setEmployees(procoreEmployees);
    }
    fetchEmployees();
  }, []);

  // Load Open Action Plan Items from Procore
  useEffect(() => {
    async function fetchActionItems() {
      const procoreActions = await getProcoreActionItems();
      setActionItems(procoreActions);
    }
    fetchActionItems();
  }, []);

  return (
    <Router>
      <div style={styles.app}>
        <header style={styles.header}>
          <h1>D&D Electric App</h1>
        </header>

        {/* Main Dashboard */}
        <Routes>
          <Route path="/" element={
            <div style={styles.dashboard}>
              <h2>Dashboard</h2>
              <div style={styles.buttonGrid}>
                <Link to="/equipment" style={styles.button}>Equipment Tracker</Link>
                <a href="https://procore.com" style={styles.button}>Time Clock</a>
                <a href="https://procore.com" style={styles.button}>My Open Action Items ({actionItems.length})</a>
                <a href="https://procore.com/employees" style={styles.button}>Employee Directory</a>
                <a href="https://procore.com/forms" style={styles.button}>Company Documents</a>
              </div>

              {/* Weather Widget */}
              {weather && (
                <div style={styles.weatherBox}>
                  <h3>Weather</h3>
                  <p>{weather.city}</p>
                  <p>Temp: {weather.temp}°F</p>
                  <p>Precip: {weather.precip}%</p>
                </div>
              )}
            </div>
          }/>

          {/* Equipment Tracker Page */}
          <Route path="/equipment" element={<EquipmentTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

// Styles for UI
const styles = {
  app: { textAlign: 'center', fontFamily: 'Arial, sans-serif' },
  header: { background: '#0A1633', color: '#F2B705', padding: '1rem' },
  dashboard: { padding: '2rem' },
  buttonGrid: { display:
