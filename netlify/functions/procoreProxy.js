const fetch = require("node-fetch");

exports.handler = async (event) => {
    const CLIENT_ID = process.env.PROCORE_CLIENT_ID;
    const CLIENT_SECRET = process.env.PROCORE_CLIENT_SECRET;
    const REFRESH_TOKEN = process.env.PROCORE_REFRESH_TOKEN;

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
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch token" }),
        };
    }
};
