const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
	spotifyid: String,
	name: String,
	photos: [(type: String)]
});

mongoose.model('user', User);
