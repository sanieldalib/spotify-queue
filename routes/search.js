const express = require('express');
const router = express.Router();
const axios = require('axios');
const { rooms } = require('../rooms');

// Searches for a song.
router.post('/',(req, res) => {
  const { querytext } = req.body;
  const { room } = req.body;
	if (!room) {
		console.log('no room');
		res.status(400).send('Not in a Room');
		return;
	}

	const query = encodeURI(
		`https://api.spotify.com/v1/search/?q=${querytext}&type=track&market=US`
	);

	const { owner } = rooms[room];
	axios
		.get(query, {
			headers: {
				Authorization: `Bearer ${owner}`
			}
		})
		.then(response => {
			console.log(response.data);
			const { items } = response.data.tracks;
			res.send(items);
		})
		.catch(err => {
			console.log(err);
			res.send('ass');
		});
});

const objectToQueryString = obj =>
	Object.keys(obj)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
		.join('&');

module.exports = router;

