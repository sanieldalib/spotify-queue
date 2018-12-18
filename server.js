const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
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

app.get('/', (req, res) => {
	res.send('Welcome');
});

app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
