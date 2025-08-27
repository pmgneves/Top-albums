export async function handler(event) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  // Debug logs — will show up in Netlify function logs
  console.log("Client ID:", clientId);
  console.log("Client Secret:", clientSecret ? "OK" : "MISSING");

  const code = event.queryStringParameters.code;
  const codeVerifier = event.queryStringParameters.verifier;

  if (!code || !codeVerifier) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing code or code_verifier" }),
    };
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://top-albums.netlify.app", // must match frontend exactly
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
      body,
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
