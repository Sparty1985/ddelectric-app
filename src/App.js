import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { getWeatherData } from './weatherAPI'; // Weather API helper
import RedirectPage from './RedirectPage'; // Redirect Page to handle code exchange

function App() {
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();
  
  // Procore OAuth Configuration
  const clientId = 'iIwfbLFJxuYA99-mlZDNWCB-kGB4jb3eEpdUB0InkkE';
  const redirectUri = 'https://ddelectric-equip.netlify.app';
  const authUrl = `https://app.procore.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

  // 🔴 Force Login if No Access Token
  useEffect(() => {
    const token = localStorage.getItem("procore_access_token");
    if (!token) {
      window.location.href = authUrl; // Redirect to Procore login
    }
  }, []);

  // Fetch Weather on App Start
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const data = await getWeatherData(latitude, longitude);
      setWeather(data);
    });
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
                <a href="https://us02.procore.com/webclients/host/companies/598134325599451/tools/equipment" style={styles.button}>Equipment Tracker</a>
                <a href="https://us02.procore.com/webclients/host/companies/598134325599451/tools/companytimesheets" style={styles.button}>Time Clock</a>
                <a href="https://us02.procore.com/598134325599451/company/home/my_open_items" style={styles.button}>My Open Action Items</a>
                <a href="https://us02.procore.com/598134325599451/company/directory/groups/users?page=1&per_page=150" style={styles.button}>Employee Directory</a>
                <a href="https://us02.procore.com/598134325599451/company/documents" style={styles.button}>Company Documents</a>
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
