const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/player');
const session = require('express-session');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

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
		secret: 'keyboard cat',
		saveUninitialized: true
	})
);
// app.use(
// 	cookieSession({
// 		maxAge: 24 * 60 * 60 * 1000,
// 		keys: [process.env.COOKIE_KEY]
// 	})
// );

// app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.send('Welcome');
});

app.get(
	'/play',
	passport.authenticate('spotify', { session: false }),
	(req, res) => {
		console.log(req.user);
	}
);

app.use('/auth', authRoutes);
app.use('/player', playerRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
