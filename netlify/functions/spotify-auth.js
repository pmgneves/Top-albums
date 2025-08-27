export async function handler(event, context) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: event.queryStringParameters.code,
    redirect_uri: "https://my-best-albums.netlify.app/", // 👈 same as your redirect URI
  });

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
}
