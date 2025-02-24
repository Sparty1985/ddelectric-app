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
    const clientId = 'iIwfbLFJxuYA99-mlZDNWCB-kGB4jb3eEpdUB0InkkE'; // Replace with your Procore Client ID
    const redirectUri = 'https://ddelectric-equip.netlify.app'; // Your Redirect URI
    const authUrl = `https://app.procore.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = authUrl; // Redirect user to Procore's authorization page
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
                <a href="https://us02.procore.com/webclients/host/companies/598134325599451/tools/companytimesheets" style={styles.button}>Time Clock</a>
                <a href="https://us02.procore.com/598134325599451/company/home/my_open_items" style={styles.button}>My Open Action Items ({actionItems.length})</a>
                <a href="https://us02.procore.com/598134325599451/company/directory/groups/users?page=1&per_page=150&search=&group_by=vendor.id&sort=vendor_name%2Cname" style={styles.button}>Employee Directory</a>
                <a href="https://us02.procore.com/598134325599451/company/documents" style={styles.button}>Company Documents</a>
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

          {/* Equipment Tracker Page */}
          <Route path="/equipment" element={<EquipmentTracker />} />
          {/* Redirect Page for OAuth */}
          <Route path="/redirect" element={<RedirectPage />} />
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
  buttonGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
  button: { background: '#F2B705', padding: '1rem', borderRadius: '10px', textDecoration: 'none', color: 'black' },
  weatherBox: { marginTop: '1rem', padding: '1rem', background: '#EEE', borderRadius: '10px' }
};

export default App;
