import { db } from "./firebaseConfig"; 
import { collection, setDoc, doc } from "firebase/firestore";

const initialEquipment = [
  { id: "DT2", name: "Dump Trailer", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "DC1", name: "LPX210", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "DC2", name: "Tilt Deck", type: "Trailer", location: "1407 Warehouse", assignedTo: "", notes: "" },
  { id: "DC3", name: "Tilt Deck", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "DW1", name: "Pole Trailer", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "FT1", name: "Pintle Deckover", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "FT2", name: "Wallace Flatbed", type: "Trailer", location: "Inactive", assignedTo: "", notes: "" },
  { id: "LB1", name: "RGN Lowboy", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "TR1", name: "Atlas Box Trailer", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "TR2", name: "Doo Box Trailer", type: "Trailer", location: "Mine Property", assignedTo: "", notes: "" },
  { id: "TR3", name: "Orange Deckover", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "TR4", name: "8.5X24CH-7000", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "TR5", name: "SM714TA22", type: "Trailer", location: "Unknown", assignedTo: "", notes: "" },
  { id: "TR6", name: "JV7X14TE2", type: "Trailer", location: "Warehouse", assignedTo: "", notes: "" },
  { id: "VT1", name: "VX50-800", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "DT1", name: "Dump Trailer", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "TR7", name: "XLSE Gray Cargo", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "RT13", name: "I-85 Reel Trailer", type: "Trailer", location: "Shop", assignedTo: "", notes: "" },
  { id: "AT01", name: "KAF400-A UTV", type: "Powered", location: "Unknown", assignedTo: "", notes: "" },
  { id: "DE01", name: "800A Boom Lift", type: "Powered", location: "Shop", assignedTo: "", notes: "" },
  { id: "DE02", name: "MLT3060KV Light Tower", type: "Trailer", location: "Belleville", assignedTo: "", notes: "" },
  { id: "DE03", name: "GTH-636 Telehandler", type: "Powered", location: "Shop", assignedTo: "", notes: "" },
  { id: "DE04", name: "TX427 Mini Compact Track Loader", type: "Powered", location: "Shop", assignedTo: "", notes: "" },
  { id: "DE05", name: "MP25-8E1 Generator", type: "Powered", location: "Shop", assignedTo: "", notes: "" },
  { id: "DA01", name: "D4H3 Harley Rake", type: "Powered", location: "Shop", assignedTo: "", notes: "" },
  { id: "DE06", name: "PD10 Pile Driver", type: "Powered", location: "Shop", assignedTo: "", notes: "" },
  { id: "DE07", name: "Concrete Mixer", type: "Powered", location: "Unknown", assignedTo: "", notes: "" },
  { id: "AT02", name: "KAF820 Side X Side UTV", type: "Powered", location: "Unknown", assignedTo: "", notes: "" },
  { id: "DE08", name: "SV40 Mini Excavator", type: "Powered", location: "Unknown", assignedTo: "", notes: "" },
  { id: "DE09", name: "ViO25 Mini Excavator", type: "Powered", location: "Unknown", assignedTo: "", notes: "" },
  { id: "PU4", name: "F150", type: "Vehicle", location: "Shop", assignedTo: "Nathan Sumner", notes: "" },
  { id: "PU5", name: "F150", type: "Vehicle", location: "Shop", assignedTo: "Tommy Reyling", notes: "" },
  { id: "PU6", name: "Canyon", type: "Vehicle", location: "Shop", assignedTo: "Spare ELD", notes: "" },
  { id: "PU7", name: "Silverado", type: "Vehicle", location: "Shop", assignedTo: "James Horseman", notes: "" },
  { id: "PU10", name: "Silverado", type: "Vehicle", location: "Unknown", assignedTo: "Davy Martin", notes: "" },
  { id: "PU11", name: "Silverado", type: "Vehicle", location: "Unknown", assignedTo: "Unknown", notes: "" },
  { id: "PU13", name: "F250", type: "Vehicle", location: "Unknown", assignedTo: "Brandon Norris", notes: "" },
  { id: "PU14", name: "F150", type: "Vehicle", location: "Unknown", assignedTo: "Spare HBG", notes: "" },
  { id: "PU15", name: "F150", type: "Vehicle", location: "Unknown", assignedTo: "ESG", notes: "" },
  { id: "PU16", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Kevin Rice", notes: "" },
  { id: "PU17", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Jacob Blackman", notes: "" },
  { id: "PU18", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Michael Rogers", notes: "" },
  { id: "PU19", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Ryan Heady", notes: "" },
  { id: "PU20", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Doug Uhls", notes: "" },
  { id: "PU21", name: "F150", type: "Vehicle", location: "Unknown", assignedTo: "Dave Martin", notes: "" },
  { id: "PV1", name: "E350 Van", type: "Vehicle", location: "Unknown", assignedTo: "Eldorado", notes: "" },
  { id: "TT1", name: "Semi Tractor", type: "CMV", location: "Unknown", assignedTo: "", notes: "" },
  { id: "TT2", name: "Semi Tractor", type: "CMV", location: "Unknown", assignedTo: "", notes: "" },
  { id: "ST2", name: "Silverado", type: "Vehicle", location: "Unknown", assignedTo: "Shop Truck", notes: "" },
  { id: "ST3", name: "F350 Dually", type: "Vehicle", location: "Unknown", assignedTo: "Christian Rogers", notes: "" },
  { id: "ST4", name: "Ram 4500", type: "Vehicle", location: "Unknown", assignedTo: "Steve McGhee-old", notes: "" },
  { id: "ST5", name: "Ram 2500", type: "Vehicle", location: "Unknown", assignedTo: "", notes: "" },
  { id: "ST6", name: "Ram 5500", type: "Vehicle", location: "Unknown", assignedTo: "Bill Taylor", notes: "" },
  { id: "ST7", name: "Silverado", type: "Vehicle", location: "Unknown", assignedTo: "Bobby Ragsdale", notes: "" },
  { id: "ST8", name: "Ram 3500 Red Flatbed", type: "Vehicle", location: "Shop", assignedTo: "", notes: "" },
  { id: "ST9", name: "Sierra 3500", type: "Vehicle", location: "Unknown", assignedTo: "Jeff Hathaway", notes: "" },
  { id: "ST10", name: "Semi Tractor", type: "CMV", location: "Unknown", assignedTo: "", notes: "" },
];

const locations = [
  "Shop", "ESL", "Dragon’s Breath", "1407 Warehouse", "Blue Hole", 
  "Local Solar", "M Class", "Mach", "DTM"
];

const employees = [
  "Houston Ellis", "Bob Hathaway", "Nathan Sumner", "Tim Serles", 
  "James Horseman", "Peyton Lane", "Matthew Bailey", "Nick Baird", 
  "Mitchell Barnett", "Garrett Bebout", "Michael Bennett", "Lisa Berry", 
  "Jacob Blackman", "Luke Bosler", "Israel Burtis", "Kaleb Clayton", 
  "Jamie Colbert", "Chaythian Coleman", "Caleb Coston", "Riley Cross", 
  "Tyler Cummins", "James Curry", "Cameron Damico", "Blane Davis", 
  "Adrian Fulton", "Ben Goben", "Kevin Gulley", "Jeffrey Hathaway", 
  "Ryan Heady", "Nolan Henson", "Jeremiah Horseman", "Jeremy Jackson", 
  "Nicholas Johnson", "John Jones", "Tobey Kragness", "Peyton Lane", 
  "Davy Martin", "Samuel Martin", "Josiah McCormick", "Daniel 'Steve' McGhee",
  "Kyle Melvin", "Brandon Milligan", "Caleb Moss", "Caleb Murray", 
  "Brandon Norris", "Domarion Nunez", "Brigette Owens", "Jennifer Patrick", 
  "Chad Patton", "Roger Peek", "Robert 'Bobby' Ragsdale", "Jamia Rasmussen", 
  "Tommy Reyling", "Caleb Rice", "Kevin Rice", "Nicholas Riggs", 
  "Justin Roberts", "Justin Robinson", "Kevin Robinson III", "Brandyn Roe", 
  "Christian Rogers", "Michael Rogers", "Michael 'Mike' Rogers", "Jheric Rush", 
  "Matt Russell", "Nathan Sanderson", "Benjamin Scott", "Paul Seagraves", 
  "Colton Sisk", "Jerry Stacy", "Caleb Stein", "Tyler Straube", 
  "William 'Bill' Taylor", "Jerry Thomas", "Trenton Thorpe", "Doug Uhls", 
  "Dallas Varble", "Grant Vickery", "Darla Martin"
];

const uploadData = async () => {
  try {
    // Upload Equipment
    for (let eq of equipment) {
      await setDoc(doc(db, "equipment", eq.id), eq);
    }
    console.log("✅ Equipment uploaded successfully!");

    // Upload Employees
    await setDoc(doc(db, "config", "employees"), { list: employees });
    console.log("✅ Employees uploaded successfully!");

    // Upload Locations
    await setDoc(doc(db, "config", "locations"), { list: locations });
    console.log("✅ Locations uploaded successfully!");

  } catch (error) {
    console.error("❌ Error uploading data:", error);
  }
};

// Run upload function
uploadData();
