const PROCORE_BASE_URL = "https://api.procore.com/rest/v1.0";
const CLIENT_ID = process.env.REACT_APP_PROCORE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_PROCORE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REACT_APP_PROCORE_REFRESH_TOKEN;

const fetchAccessToken = async () => {
    try {
        const response = await fetch("/.netlify/functions/procoreProxy");
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

// ✅ Add these functions so they can be used in App.js
export const getProcoreEmployees = async (projectId) => {
    return await procoreFetch(`/projects/${projectId}/employees`);
};

export const getProcoreActionItems = async (projectId) => {
    return await procoreFetch(`/projects/${projectId}/action_plans/open_items`);
};

export { fetchAccessToken, procoreFetch };
