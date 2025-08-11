const express = require('express');
const router = express.Router();
const { searchEvents, getEventDetails } = require('../controllers/ticketmaster');
const { getArtistPreview } = require('../controllers/spotify');

// Results page
router.get('/', async (req, res) => {
  try {
    const city = req.query.city;
    const events = await searchEvents(city);
    res.render('results', { title: 'Event Results', events, city });
  } catch (error) {
    console.error(error);
    res.render('results', { title: 'Event Results', events: [], city: req.query.city });
  }
});

// Details page
router.get('/:id', async (req, res) => {
  try {
    const event = await getEventDetails(req.params.id);
    const artistName = event?.artist || '';
    const spotifyData = await getArtistPreview(artistName);

    res.render('details', { title: event.name, event, spotifyData });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;
