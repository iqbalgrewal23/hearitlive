const axios = require('axios');

const API_KEY = process.env.TICKETMASTER_API_KEY;

async function searchEvents(city) {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=${encodeURIComponent(city)}&classificationName=music`;
  const response = await axios.get(url);
  return response.data._embedded ? response.data._embedded.events : [];
}

async function getEventDetails(id) {
  const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`;
  const response = await axios.get(url);
  const event = response.data;
  return {
    name: event.name,
    date: event.dates.start.localDate,
    venue: event._embedded?.venues[0]?.name,
    artist: event._embedded?.attractions?.[0]?.name,
    image: event.images[0]?.url,
    url: event.url
  };
}

module.exports = { searchEvents, getEventDetails };
