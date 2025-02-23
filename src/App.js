import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyD1AZtYt4RA2QWGbzxVHdO8MDoH1bo1WV0",
  authDomain: "ddelectric-equip.firebaseapp.com",
  projectId: "ddelectric-equip",
  storageBucket: "ddelectric-equip.firebasestorage.app",
  messagingSenderId: "611761031664",
  appId: "1:611761031664:web:e38bf733e979c5b1f17535",
  measurementId: "G-5SHJ0Y5LBF"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const localEquipment = [
    { id: 'DT2',   name: 'Dump' },
    { id: 'DC1',   name: 'LPX210' },
    { id: 'DC2',   name: 'Tilt Deck' },
    { id: 'DC3',   name: 'Tilt Deck' },
    { id: 'DW1',   name: 'Pole Trailer' },
    { id: 'FT1',   name: 'Pintle Deckover' },
    { id: 'FT2',   name: 'Wallace Fltb' },
    { id: 'LB1',   name: 'RGN Lowboy' },
    { id: 'TR1',   name: 'Atlas Bx Tlr' },
    { id: 'TR2',   name: 'Doo Bx Tlr' },
    { id: 'TR3',   name: 'Orange Deckover' },
    { id: 'TR4',   name: '8.5X24CH-7000' },
    { id: 'TR5',   name: 'SM714TA22' },
    { id: 'TR6',   name: 'JV7X14TE2' },
    { id: 'VT1',   name: 'VX50-800' },
    { id: 'DT1',   name: 'Dump' },
    { id: 'TR7',   name: 'XLSE Gray Cargo' },
    { id: 'RT13',  name: 'I-85' },
    { id: 'AT01',  name: 'KAF400-A' },
    { id: 'DE01',  name: '800A' },
    { id: 'DE02',  name: 'MLT3060KV' },
    { id: 'DE03',  name: 'GTH-636' },
    { id: 'DE04',  name: 'TX427' },
    { id: 'DE05',  name: 'MP25-8E1' },
    { id: 'DA01',  name: 'D4H3' },
    { id: 'DE06',  name: 'PD10' },
    { id: 'DE07',  name: '5 Cubic Feet C' },
    { id: 'AT02',  name: 'KAF820' },
    { id: 'AT03',  name: 'K9 2400 4X4' },
    { id: 'AT04',  name: 'K9 2400 4X4' },
    { id: 'DE08',  name: 'SV40' },
    { id: 'DE09',  name: 'ViO25' },
    { id: 'DE10',  name: '3/4 Yard' },
    { id: 'AT05',  name: 'K92440SW' },
    { id: 'AT06',  name: 'K92440SW' },
    { id: 'RT01',  name: 'Reel Cart' },
    { id: 'DE11',  name: 'GS-1932' },
    { id: 'DE12',  name: 'LT750' },
    { id: 'DE14',  name: '279D3' },
    { id: 'DE15',  name: '400S' },
    { id: 'AT07',  name: 'RTV1120D' },
    { id: 'DA02',  name: 'Post Hole Digger' },
    { id: 'DA03',  name: 'Skid Attachment' },
    { id: 'DA04',  name: 'Skid Attachment' },
    { id: 'DA05',  name: 'Skid Attachment' },
    { id: 'DA06',  name: 'Skid Attachment' },
    { id: 'BT1',   name: 'Bucket Truck' },
    { id: 'LT1',   name: 'Digger1' },
    { id: 'LT2',   name: 'Digger2' },
    { id: 'DV1',   name: 'Transit1' },
    { id: 'PU1',   name: 'F150' },
    { id: 'PU2',   name: 'F150' },
    { id: 'PU3',   name: 'F150' },
    { id: 'PU4',   name: 'F150' },
    { id: 'PU5',   name: 'F150' },
    { id: 'PU6',   name: 'Canyon' },
    { id: 'PU7',   name: 'Silverado' },
    { id: 'PU10',  name: 'Silverado' },
    { id: 'PU11',  name: 'Silverado' },
    { id: 'PU13',  name: 'F250' },
    { id: 'PU14',  name: 'F150' },
    { id: 'PU15',  name: 'F150' },
    { id: 'PU16',  name: 'Sierra 3500' },
    { id: 'PU17',  name: 'Sierra 3500' },
    { id: 'PU18',  name: 'Sierra 3500' },
    { id: 'PU19',  name: 'Sierra 3500' },
    { id: 'PU20',  name: 'Sierra 3500' },
    { id: 'PU21',  name: 'F150' },
    { id: 'PV1',   name: 'E350' },
    { id: 'TT1',   name: 'Semi1' },
    { id: 'TT2',   name: 'Semi2' },
    { id: 'ST2',   name: 'Silverado' },
    { id: 'ST3',   name: 'F350' },
    { id: 'ST4',   name: 'Ram4500' },
    { id: 'ST5',   name: 'Ram2500' },
    { id: 'ST6',   name: 'Ram5500' },
    { id: 'ST7',   name: 'Silverado' },
    { id: 'ST8',   name: 'Ram3500' },
    { id: 'ST9',   name: 'Sierra 3500' },
    { id: 'ST10',  name: 'Semi3' },
    { id: 'ST12',  name: 'Sierra 2500' },
    { id: 'ST13',  name: 'Sierra 3500' },
    { id: 'ST14',  name: 'F250' },
    { id: 'ST15',  name: 'F550' },
    { id: 'ST16',  name: 'F250' },
    { id: 'SV1',   name: 'Van' },
    { id: 'SV2',   name: 'Van' },
    { id: 'ST17',  name: 'F550' },
    { id: 'TT3',   name: 'Semi4' }
  ];

 const [equipment, setEquipment] = useState([]);

  // HARDCODED LOCATIONS & EMPLOYEES
  const locations = [
    'Shop',
    'ESL',
    'Dragon’s Breath',
    '1407 Warehouse',
    'Blue Hole',
    'Local Solar',
    'M Class',
    'Mach',
    'DTM',
  ];

  const employees = [
'Barbara "Barbie" Abraham',
'Matthew Bailey',
'Nick Baird',
'Mitchell Barnett',
'Garrett Bebout',
'Michael Bennett',
'Lisa Berry',
'Jacob Blackman',
'Israel Burtis',
'Kaleb Clayton',
'Jamie Colbert',
'Chaythian Coleman',
'Caleb Coston',
'Riley Cross',
'Tyler Cummins',
'James Curry',
'Cameron Damico',
'Blane Davis',
'T. Houston Ellis',
'Adrian Fulton',
'Ben Goben',
'Ben Goben',
'Kevin Gulley',
'Ericka Gwaltney',
'Bob Hathaway',
'Jeffrey Hathaway',
'Ryan Heady',
'Nolan Henson',
'Syd Hollaway',
'James Horseman',
'Jeremiah Horseman',
'Jeremy Jackson',
'Jeremy Jackson',
'Nicholas Johnson',
'Brent Jones',
'John Jones',
'Leslie Jones',
'Tobey Kragness',
'Peyton Lane',
'Darla Martin',
'David Martin',
'Davy Martin',
'Samuel Martin',
'Josiah McCormick',
'Daniel "Steve" McGhee',
'Kyle Melvin',
'Brandon Milligan',
'Jadi Monroe',
'Caleb Moss',
'Brandon Norris',
'Domarion Nunez',
'Brigette Owens',
'Jennifer Patrick',
'Chad Patton',
'Roger Peek',
'Robert "Bobby" Ragsdale',
'Jamia Rasmussen',
'Tommy Reyling',
'Caleb Rice',
'Kevin Rice',
'Nicholas Riggs',
'Justin Roberts',
'Justin Robinson',
'Kevin Robinson III',
'Brandyn Roe',
'Christian Rogers',
'Christian Rogers',
'Michael Rogers',
'Michael "Mike" Rogers',
'Jheric Rush',
'Matt Russell',
'Nathan Sanderson',
'Benjamin Scott',
'Paul Seagraves',
'Tim Serles',
'Colton Sisk',
'Jerry Stacy',
'Caleb Stein',
'Tyler Straube',
'Nathan Sumner',
'William "Bill" Taylor',
'Jerry Thomas',
'Trenton Thorpe',
'Doug Uhls',
'Doug Uhls',
'Dallas Varble',
'Grant Vickery',

    // ...Add more if you have them
  ];

  /**
   * 2) LOAD EQUIPMENT FROM FIRESTORE ONCE
   */
  useEffect(() => {
    const syncEquipment = async () => {
      try {
        const equipColl = collection(db, 'equipment');

        // CREATE docs if missing
        for (const item of localEquipment) {
          const docRef = doc(equipColl, item.id);
          const snap = await getDoc(docRef);
          if (!snap.exists()) {
            await setDoc(docRef, {
              name: item.name,
              location: '',
              assignedTo: ''
            });
          }
        }

        // Then LOAD everything from Firestore
        const snapshot = await getDocs(equipColl);
        const eqData = [];
        snapshot.forEach(docSnap => {
          eqData.push({ id: docSnap.id, ...docSnap.data() });
        });
        setEquipment(eqData);
      } catch (err) {
        console.error('Error syncing equipment:', err);
      }
    };
    syncEquipment();
  }, []);

  /**
   * 6) Update location/assignedTo in Firestore + local state
   */
  const updateEquipment = async (id, field, value) => {
    try {
      setEquipment(prev =>
        prev.map(eq => (eq.id === id ? { ...eq, [field]: value } : eq))
      );
      const docRef = doc(db, 'equipment', id);
      await updateDoc(docRef, { [field]: value });
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  // 7) Some simple D&D styling (navy/gold)
  const styles = {
    header: {
      background: '#0A1633',
      color: '#F2B705',
      padding: '1rem',
      textAlign: 'center',
    },
    title: {
      margin: 0,
      fontSize: '1.8rem',
      fontWeight: 'bold',
    },
    container: {
      background: '#F9FAFB',
      minHeight: '100vh',
      padding: '1rem',
      fontFamily: 'sans-serif',
    },
    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      marginTop: '1rem',
    },
    card: {
      background: '#FFFFFF',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      flex: '1 0 250px',
      boxSizing: 'border-box',
    },
    equipmentName: {
      margin: '0 0 0.5rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#0A1633',
    },
    label: {
      display: 'block',
      marginBottom: '0.25rem',
      fontSize: '0.85rem',
      fontWeight: '500',
      color: '#333',
    },
    select: {
      width: '100%',
      marginBottom: '0.5rem',
      padding: '0.3rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    equipmentInfo: {
      margin: '0 0 0.25rem',
      fontSize: '0.9rem',
      color: '#555',
    },
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>D&D Electric Equipment Tracker</h1>
      </header>

      {/* MAIN CONTENT */}
      <div style={styles.container}>
        <div style={styles.grid}>
          {equipment.map(eq => (
            <div key={eq.id} style={styles.card}>
              <h2 style={styles.equipmentName}>{eq.name}</h2>
              <p style={styles.equipmentInfo}>ID: {eq.id}</p>

              {/* LOCATION */}
              <div>
                <label style={styles.label}>Location:</label>
                <select
                  style={styles.select}
                  value={eq.location || ''}
                  onChange={e => updateEquipment(eq.id, 'location', e.target.value)}
                >
                  <option value=''>-- Select a Location --</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* ASSIGNED TO */}
              <div>
                <label style={styles.label}>Assigned To:</label>
                <select
                  style={styles.select}
                  value={eq.assignedTo || ''}
                  onChange={e => updateEquipment(eq.id, 'assignedTo', e.target.value)}
                >
                  <option value=''>Unassigned</option>
                  {employees.map(emp => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
