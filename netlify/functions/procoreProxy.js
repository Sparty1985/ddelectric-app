const fetch = require("node-fetch");

exports.handler = async function () {
    try {
        console.log("🔄 Fetching Procore Access Token...");

        const response = await fetch("https://login.procore.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "refresh_token",
                client_id: process.env.PROCORE_CLIENT_ID,
                client_secret: process.env.PROCORE_CLIENT_SECRET,
                refresh_token: process.env.PROCORE_REFRESH_TOKEN,
            }),
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch Procore token. Status: ${response.status}`);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Failed to retrieve access token" }),
            };
        }

        const data = await response.json();
        console.log("✅ Token received:", data.access_token);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" }, // Allow frontend to fetch this
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("🚨 Error in Netlify Function:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
