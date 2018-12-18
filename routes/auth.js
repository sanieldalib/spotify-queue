const express = require('express');
const router = express.Router();
const passport = require('passport');
const spotifyStrategy = require('../auth/passport');

router.get(
	'/login',
	passport.authenticate('spotify', {
		scope: [
			'user-read-email',
			'playlist-modify-private',
			'playlist-modify-public',
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
	}
);

module.exports = router;
