const fetch = require("node-fetch");

exports.handler = async function () {
    try {
        console.log("🔄 Fetching Procore Access Token...");

        // Prepare the request body and headers
        const requestBody = {
            grant_type: "refresh_token",
            client_id: process.env.PROCORE_CLIENT_ID,
            client_secret: process.env.PROCORE_CLIENT_SECRET,
            refresh_token: process.env.PROCORE_REFRESH_TOKEN,
        };

        // Send POST request to fetch the token
        const response = await fetch("https://login.procore.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        // If response is not OK, log the error details
        if (!response.ok) {
            const errorDetails = await response.text(); // Fetch error details from response body
            console.error(`❌ Failed to fetch Procore token. Status: ${response.status}, Details: ${errorDetails}`);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Failed to retrieve access token", details: errorDetails }),
            };
        }

        // Parse the JSON response body to extract the token
        const data = await response.json();
        
        // Validate that the access token is present in the response
        if (!data.access_token) {
            console.error("❌ Access token not received from Procore.");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Access token not received from Procore", details: data }),
            };
        }

        // Successfully fetched the token
        console.log("✅ Token received");

        // Return the token and the response
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" }, // Allow frontend to fetch this
            body: JSON.stringify(data),
        };

    } catch (error) {
        // Handle any errors that occur during the function execution
        console.error("🚨 Error in Netlify Function:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
