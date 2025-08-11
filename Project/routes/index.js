const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Hear It Live' });
});

router.post('/search', (req, res) => {
  const city = req.body.city;
  res.redirect(`/events?city=${encodeURIComponent(city)}`);
});

module.exports = router;
