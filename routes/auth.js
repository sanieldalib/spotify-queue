const express = require('express');
const router = express.Router();
const passport = require('passport');
const spotifyStrategy = require('../auth/passport');
const axios = require('axios');

router.get(
	'/login',
	passport.authenticate('spotify', {
		scope: [
			'user-read-email',
			'playlist-modify-private',
			'playlist-modify-public',
			'user-modify-playback-state',
			'streaming'
		],
		showDialog: true
	}),
	(req, res) => {
		res.send('login!');
	}
);

router.get(
	'/callback',
	passport.authenticate('spotify', { failureRedirect: '/login' }),
	(req, res) => {
		console.log('user authed!');
		res.send(req.user);
	}
);

router.get('/current', (req, res) => {
	const { accessToken } = req.user.tokens;
	console.log(accessToken);
	axios
		.put(
			'https://api.spotify.com/v1/me/player/play',
			{},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
		.catch(err => {
			console.log(err);
		});
});

module.exports = router;
