const axios = require('axios');

let accessToken = '';
let tokenExpiry = 0;

async function getSpotifyToken() {
  if (Date.now() < tokenExpiry) return accessToken;

  const response = await axios.post('https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000);
  return accessToken;
}

async function getArtistPreview(artistName) {
  const token = await getSpotifyToken();
  const searchRes = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const artistId = searchRes.data.artists.items[0]?.id;
  if (!artistId) return null;

  const tracksRes = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return {
    artist: searchRes.data.artists.items[0],
    tracks: tracksRes.data.tracks.slice(0, 5) // first 5 tracks
  };
}

module.exports = { getArtistPreview };
