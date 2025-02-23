const PROCORE_API_URL = "https://api.procore.com/vapid";
const CLIENT_ID = iIwfbLFJxuYA99-mlZDNWCB-kGB4jb3eEpdUB0InkkE; // Replace with your Procore Client ID
const CLIENT_SECRET = IkhuCC0uMWQItHNlITjsS4_hLV8xirxZQVLg8CTGP34; // Replace with your Procore Client Secret
let ACCESS_TOKEN = eyJhbGciOiJFUzUxMiJ9.eyJhbXIiOltdLCJhaWQiOiJpSXdmYkxGSnh1WUE5OS1tbFpETldDQi1rR0I0amIzZUVwZFVCMElua2tFIiwiYW91aWQiOjExMzI1NDM5LCJhb3V1aWQiOiJhYjZmZmIwYi01YzRjLTRlYjUtOGY1Yy01YTRmMGM4NmE2ODUiLCJleHAiOjE3NDAzNTc3NDEsInNpYXQiOjE3NDAzNTA0MTcsInVpZCI6MTEzMjU0MzksInV1aWQiOiJhYjZmZmIwYi01YzRjLTRlYjUtOGY1Yy01YTRmMGM4NmE2ODUiLCJsYXN0X21mYV9jaGVjayI6MTc0MDM1MjM0MX0.AYf6iOiTK1PCvCIRAzBsVR05kK3m2wIudYww4WB9Y-QIyw-rDiphQCRiAGQEgVuqpfw6ufuTUoKJtQpWKEq8KURRAeF798BnPyZj29E56hwfbUHSRcwtm-AYyu3NNyTwN-LSHwLGAIAmerZuzTdukPp5PCdUTxA9MtsYOz89XKTG4Kpn; // Gets updated automatically
const REFRESH_TOKEN = "your_refresh_token"; // Stays the same
const COMPANY_ID = 598134325599451; // Replace with your actual Procore Company ID

/**
 * Function to Refresh Access Token Automatically
 */
async function refreshAccessToken() {
  try {
    const response = await fetch("https://login.procore.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN
      })
    });

    const data = await response.json();
    ACCESS_TOKEN = data.access_token; // Update token in memory
  } catch (error) {
    console.error("Failed to refresh access token:", error);
  }
}

/**
 * Fetches equipment from Procore Resource Management
 */
export async function getProcoreEquipment() {
  try {
    await refreshAccessToken(); // Ensure fresh token
    const response = await fetch(`${PROCORE_API_URL}/companies/${COMPANY_ID}/equipment`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch Procore Equipment");
    const data = await response.json();
    return data.items.map((item) => ({
      id: item.id,
      name: item.name,
      location: item.current_location || '',
      assignedTo: item.assigned_to || '',
    }));
  } catch (error) {
    console.error("Error fetching equipment from Procore:", error);
    return [];
  }
}

/**
 * 3️⃣ Update Equipment in Procore (Location & Assignment)
 */
export async function updateProcoreEquipment(equipmentId, updates) {
  try {
    await refreshAccessToken();
    const response = await fetch(`${PROCORE_API_URL}/companies/${COMPANY_ID}/equipment/${equipmentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error("Failed to update equipment in Procore");
    return await response.json();
  } catch (error) {
    console.error("Error updating equipment in Procore:", error);
  }
}

/**
 * 4️⃣ Fetch Employees from Procore
 */
export async function getProcoreEmployees() {
  try {
    await refreshAccessToken();
    const response = await fetch(`${PROCORE_API_URL}/companies/${COMPANY_ID}/employees`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch employees from Procore");
    const data = await response.json();
    return data.items.map((emp) => emp.name);
  } catch (error) {
    console.error("Error fetching employees from Procore:", error);
    return [];
  }
}

/**
 * 5️⃣ Fetch Open Action Plan Items from Procore
 */
export async function getProcoreActionItems() {
  try {
    await refreshAccessToken();
    const response = await fetch(`${PROCORE_API_URL}/companies/${COMPANY_ID}/action_plans/open_items`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch action items from Procore");
    const data = await response.json();
    return data.items.map((item) => ({
      id: item.id,
      title: item.title,
      dueDate: item.due_date,
    }));
  } catch (error) {
    console.error("Error fetching action items from Procore:", error);
    return [];
  }
}
