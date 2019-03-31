const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

passport.serializeUser((user, done) => {
	done(null, user.spotifyid);
});

passport.deserializeUser((id, done) => {
	User.findOne({ spotifyid: id }).then(user => {
		done(null, user);
	});
});

passport.use(
	new SpotifyStrategy(
		{
			clientID: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			callbackURL: '/auth/callback',
			proxy: true
		},
		async (accessToken, refreshToken, expires, profile, done) => {
			const date = new Date();
			date.setSeconds(date.getSeconds() + expires);
			const { id, displayName, photos, profileUrl } = profile;
			const existingUser = await User.findOne({ spotifyid: id });

			if (existingUser) {
				existingUser.tokens.accessToken = accessToken;
				existingUser.tokens.refreshToken = refreshToken;
				existingUser.tokens.expires = date;
				await existingUser.save();
				done(null, existingUser);
			} else {
				const newUser = await new User({
					spotifyid: id,
					name: displayName,
					photos: photos,
					profileUrl: profileUrl,
					tokens: {
						accessToken: accessToken,
						refreshToken: refreshToken,
						expires: date
					}
				}).save();
				newUser.token = accessToken;
				done(null, newUser);
			}
		}
	)
);

// async (accessToken, refreshToken, profile, done) => {
// 	const existingUser = await User.findOne({ googleID: profile.id });
// 	if (existingUser) {
// 		console.log(existingUser.googleID);
// 		done(null, existingUser);
// 	} else {
// 		const user = await new User({ googleID: profile.id }).save();
// 		done(null, user);
// 	}
// }

module.exports = passport;
