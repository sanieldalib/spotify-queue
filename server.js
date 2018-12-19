const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/player');
const searchRoutes = require('./routes/search');
const session = require('express-session');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
mongoose
	.connect(
		process.env.MONGODB_URI,
		{ useNewUrlParser: true }
	)
	.then(
		() => {
			console.log('Database is connected');
		},
		err => {
			console.log('Can not connect to the database' + err);
		}
	);

app.use(
	session({
		secret: process.env.COOKIE_KEY,
		saveUninitialized: true
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.render('pages/index');
});

app.use('/auth', authRoutes);
app.use('/player', playerRoutes);
app.use('/search', searchRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
