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

  const CLIENT_ID = 'iIwfbLFJxuYA99-mlZDNWCB-kGB4jb3eEpdUB0InkkE'; // Replace with your Procore Client ID
  const REDIRECT_URI = 'https://ddelectric-equip.netlify.app'; // Ensure this matches your Procore settings

  // Procore OAuth Login Redirect
  const redirectToProcoreAuth = () => {
    const authUrl = `https://app.procore.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = authUrl;
  };

  // Smooth Scroll Function
  const smoothScroll = (event, sectionId) => {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

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
          <h1>D&D Electric</h1>
          <button onClick={redirectToProcoreAuth} style={styles.loginButton}>
            Login with Procore
          </button>
        </header>

        {/* Main Dashboard */}
        <div style={styles.container}>
          <h2>Dashboard</h2>
          <div style={styles.buttonGrid}>
            <a href="#equipment-section" style={styles.button} onClick={(e) => smoothScroll(e, "equipment-section")}>Equipment</a>
            <a href="https://us02.procore.com/webclients/host/companies/598134325599451/tools/companytimesheets" style={styles.button}>Time Clock</a>
            <a href="https://us02.procore.com/598134325599451/company/home/my_open_items" style={styles.button}>My Open Action Items</a>
            <a href="https://us02.procore.com/598134325599451/company/directory/groups/users?page=1&per_page=150&search=&group_by=vendor.id&sort=vendor_name%2Cname" style={styles.button}>Employee Directory</a>
            <a href="https://us02.procore.com/598134325599451/company/documents" style={styles.button}>Company Documents</a>
            <a href="https://accounts.inflowinventory.com/login" style={styles.button}>Inventory</a>
          </div>

          
       {/* Weather Widget */}
          {weather && (
  <div style={styles.weatherContainer}>
    {/* Current Weather */}
    <div style={styles.weatherBox}>
      <h3>Current Weather</h3>
      <p><strong>{weather.city}</strong></p>
      <p>Temperature: {weather.temp}°F</p>
      <p>Precipitation: {weather.precip}</p>
    </div>

    {/* 5-Day Forecast Below */}
    <div style={styles.forecastContainer}>
      {weather.forecast.map((day, index) => (
        <div key={index} style={styles.forecastCard}>
          <p>{day.date.split("-").slice(1).join("/")}</p>
          <img src={day.icon} alt={day.weather} style={styles.weatherIcon} />
          <p>{day.temp}°F</p>
          <p style={styles.forecastText}>{day.weather}</p>
        </div>
      ))}
    </div>
  </div>
)}
        </div>

        {/* Equipment Tracker Section */}
        <div id="equipment-section">
          <EquipmentTracker />
        </div>

      </div> 
    </Router>
  );
}



// Styles
const styles = {
  app: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F7F7F7',
    minHeight: '100vh',
  },
  header: {
    background: '#1F2937',
    color: '#FFFFFF',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#E67E22', // Professional muted orange
    border: 'none',
    color: '#FFF',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background 0.3s',
  },
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '20px',
  },
  button: {
    background: '#E67E22',
    color: '#FFF',
    padding: '12px',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    textAlign: 'center',
    display: 'inline-block',
    transition: 'background 0.3s',
  },
  weatherBox: {
    marginTop: '30px',
    padding: '15px',
    background: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
weatherContainer: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#1E293B", // Darker background
  color: "#FFF", // White text
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  padding: "15px",
  marginTop: "20px",
},

weatherBox: {
  textAlign: "center",
  marginBottom: "10px",
},

forecastContainer: {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  flexWrap: "wrap",
  padding: "10px",
},

forecastCard: {
  background: "#334155", // Slightly darker for contrast
  padding: "5px",
  borderRadius: "6px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  width: "80px",
  fontSize: "12px",
},

weatherIcon: {
  width: "30px",
  height: "30px",
},

forecastText: {
  fontSize: "10px",
  fontWeight: "bold",
}
};

export default App;
