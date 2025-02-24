const PROCORE_BASE_URL = "https://api.procore.com/rest/v1.0";
const CLIENT_ID = process.env.REACT_APP_PROCORE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_PROCORE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REACT_APP_PROCORE_REFRESH_TOKEN;

const fetchAccessToken = async () => {
    try {
        const response = await fetch("https://login.procore.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "refresh_token",
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN,
            }),
        });

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

export { fetchAccessToken, procoreFetch };
