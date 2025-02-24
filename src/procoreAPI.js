const PROCORE_BASE_URL = "https://api.procore.com/rest/v1.0";

// Function to fetch access token via Netlify function
const fetchAccessToken = async () => {
    try {
        const response = await fetch("/.netlify/functions/procoreProxy");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem("procore_access_token", data.access_token);
            return data.access_token;
        } else {
            console.error("Failed to get access token:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching Procore token:", error);
        return null;
    }
};

// Function to fetch data from Procore API
const procoreFetch = async (endpoint) => {
    const token = localStorage.getItem("procore_access_token") || await fetchAccessToken();
    if (!token) return null;

    try {
        const response = await fetch(`${PROCORE_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return await response.json();
    } catch (error) {
        console.error("Procore API Error:", error);
        return null;
    }
};

// ✅ Fetch employees from Procore
export const getProcoreEmployees = async (projectId) => {
    return await procoreFetch(`/projects/${projectId}/employees`);
};

// ✅ Fetch open action plan items from Procore
export const getProcoreActionItems = async (projectId) => {
    return await procoreFetch(`/projects/${projectId}/action_plans/open_items`);
};

// Export main functions
export { fetchAccessToken, procoreFetch };
