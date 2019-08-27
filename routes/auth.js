const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get(
	'/login',
	passport.authenticate('spotify', {
		scope: [
			'user-read-email',
			'playlist-modify-private',
			'playlist-modify-public',
			'user-modify-playback-state',
			'streaming',
      'user-read-playback-state'
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
    var redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;
    // is authenticated ?
    res.redirect(redirectTo);
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


module.exports = router;
