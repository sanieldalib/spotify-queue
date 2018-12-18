const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');
//
// passport.serializeUser((user, done) => {
// 	done(null, user.id);
// });
//
// passport.deserializeUser((id, done) => {
// 	User.findById(id).then(user => {
// 		done(null, user);
// 	});
// });

passport.use(
	new SpotifyStrategy(
		{
			clientID: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			callbackURL: 'http://localhost:5000/auth/callback'
		},
		async (accessToken, refreshToken, profile, done) => {
			console.log(profile);
			const { id, displayName, photos, profileUrl } = profile;
			const existingUser = await User.findOne({ spotifyid: id });

			if (existingUser) {
				done(null, existingUser);
			} else {
				const newUser = await new User({
					spotifyid: id,
					name: displayName,
					photos: photos,
					profileUrl: profileUrl
				}).save();
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
