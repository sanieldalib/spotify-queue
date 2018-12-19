const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
	spotifyid: String,
	name: String,
	photos: [{ type: String }],
	profileUrl: String,
	tokens: {
		refreshToken: String,
		accessToken: String,
		expires: Date
	}
});

module.exports = mongoose.model('user', User);
