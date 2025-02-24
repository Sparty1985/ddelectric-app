import { useEffect } from 'react';

const RedirectPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');  // Extract the code from the URL

    if (code) {
      fetchAccessToken(code);  // Call the function to fetch the access token
    }
  }, []);

  const fetchAccessToken = async (code) => {
    try {
      const response = await fetch('https://api.procore.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: 'YOUR_CLIENT_ID',  // Replace with your Procore Client ID
          client_secret: 'YOUR_CLIENT_SECRET',  // Replace with your Procore Client Secret
          code: code,
          redirect_uri: 'https://ddelectric-equip.netlify.app/',  // Your registered Redirect URI
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem('procore_access_token', data.access_token);
        localStorage.setItem('procore_refresh_token', data.refresh_token);  // Store the refresh token as well
        console.log('Access Token:', data.access_token);
        // Redirect user to the main page or wherever they need to go after successful login
        window.location.href = '/';  // Redirect to home or dashboard page
      } else {
        console.error('Error fetching access token:', data);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
};

export default RedirectPage;
