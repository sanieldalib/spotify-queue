const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const axios = require('axios');

router.post('/',(req, res) => {
	if (!req.user) {
		console.log('auth');
		res.status(400).send('Authentication');
		return;
	}
	const { querytext } = req.body;
	const query = encodeURI(
		`https://api.spotify.com/v1/search/?q=${querytext}&type=track&market=US`
	);
	const { accessToken } = req.user.tokens;
	axios
		.get(query, {
			headers: {
				Authorization: `Bearer ${accessToken}`
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
