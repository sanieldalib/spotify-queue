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
		res.redirect('/');
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
