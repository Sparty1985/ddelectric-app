import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getWeatherData } from './weatherAPI'; // Weather API helper
import EquipmentTracker from './EquipmentTracker'; // Equipment Page
import RedirectPage from './RedirectPage'; // Redirect Page to handle code exchange
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

  // Redirect User to Procore OAuth Authorization URL
  const redirectToProcoreAuth = () => {
    const clientId = 'YOUR_CLIENT_ID';  // Replace with your Procore Client ID
    const redirectUri = 'https://ddelectric-equip.netlify.app/';  // Your Redirect URI
    const authUrl = `https://app.procore.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = authUrl;  // Redirect the user to Procore's authorization page
  };

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

              {/* Add Login Button for Procore OAuth */}
              <button onClick={redirectToProcoreAuth} style={styles.button}>Login with Procore</button>

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

