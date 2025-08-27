export async function handler(event, context) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const code = event.queryStringParameters.code;
  const verifier = event.queryStringParameters.verifier;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://pmgneves.github.io/Top-albums/", // your site URL
    client_id: clientId,
    code_verifier: verifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
