const fetch = require("node-fetch");

exports.handler = async function () {
    try {
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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
