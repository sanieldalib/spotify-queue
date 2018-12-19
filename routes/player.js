const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/current', (req, res) => {
	console.log('in it bitches');
	const { accessToken } = req.user.tokens;
	axios
		.put(
			'https://api.spotify.com/v1/me/player/play',
			{
				uris: ['spotify:track:4cAgkb0ifwn0FSHGXnr4F6']
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
		.then(() => {
			res.send('playing!');
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = router;
