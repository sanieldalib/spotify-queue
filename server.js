const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/player');
const searchRoutes = require('./routes/search');
// const roomRoutes = require('.routes/room');
const session = require('express-session');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

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
	if (!req.user) {
		res.redirect('/auth/login');
		return;
	}
	res.render('pages/index');
});

app.use('/auth', authRoutes);
app.use('/player', playerRoutes);
app.use('/search', searchRoutes);
// app.use('/room', roomRoutes);

io.on('connection', (socket) => {
  // socket joins a room
  console.log('connected');
  let id = socket.handshake.query;
  console.log(id);

  // adding a song
  socket.on('connected', (obj) => {
    console.log('yooooo');
  });

  socket.on('skipped', obj => {
    console.log('skip ayyy');
  });

  // searching for a song
  // socket.on('SEARCH', (query) => {
  //   spotifyApi.search(query, (list) => {
  //     socket.emit('UPDATE_RESULTS', list);
  //   });
  // });

  // removing a song
  // socket.on('REMOVE_SONG', (obj) => {
  //   let index = obj.index;
  //   let id = obj.id;
  //   Room.removeSong(index, id, (err, room) => {
  //     io.in(id).emit('UPDATE_PLAYLIST', room.list);
  //   });
  // });

  // moving up a song
  // socket.on('MOVEUP_SONG', (obj) => {
  //   let index = obj.index;
  //   let id = obj.id;
  //   Room.moveUp(index, id, (err, room) => {
  //     io.in(id).emit('UPDATE_PLAYLIST', room.list);
  //   });
  // });

  // moving down a song
  // socket.on('MOVEDOWN_SONG', (obj) => {
  //   let index = obj.index;
  //   let id = obj.id;
  //   Room.moveDown(index, id, (err, room) => {
  //     io.in(id).emit('UPDATE_PLAYLIST', room.list);
  //   });
  // });

});

http.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
