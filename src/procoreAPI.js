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
    let token = localStorage.getItem("procore_access_token");

    // If no token exists, fetch a new one
    if (!token) {
        token = await fetchAccessToken();
        if (!token) {
            console.error("No Procore access token available.");
            return {};
        }
    }

    try {
        const response = await fetch(`${PROCORE_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            // Token might be expired, clear it and try again
            if (response.status === 401) {
                localStorage.removeItem("procore_access_token");
                return await procoreFetch(endpoint); // Retry with fresh token
            }
            throw new Error(`API request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Procore API Error:", error);
        return {};
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
