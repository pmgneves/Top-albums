export async function handler(event) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const code = event.queryStringParameters.code;
  const codeVerifier = event.queryStringParameters.verifier;

  if (!code || !codeVerifier) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing code or code_verifier" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://top-albums.netlify.app",
    client_id: clientId,  // required in PKCE flow
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data }),
        headers: { "Content-Type": "application/json" },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
