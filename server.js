// dependencies
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cookie = require('cookie');

const isAuthenticated = require('./middlewares/isAuthenticated');
const setCookie = require('./middlewares/setCookie');
const { rooms } = require('./rooms');
const { createRoom } = require('./rooms');
const { addUser } = require('./Users');
const { users } = require('./Users');
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/player');
const searchRoutes = require('./routes/search');
const roomRoutes = require('./routes/room');

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(setCookie);

const sessionMiddleware = session({
    secret: process.env.COOKIE_KEY,
    saveUninitialized: true
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	// if (!req.user) {
	// 	res.redirect('/auth/login');
	// 	return;
	// }
	res.render('pages/index');
});

app.use('/auth', authRoutes);
app.use('/player', playerRoutes);
app.use('/search', searchRoutes);
app.use('/room', roomRoutes);

io.on('connection', (socket) => {
  // socket joins a room
  const cookies = cookie.parse(socket.handshake.headers.cookie);
  addUser(cookies['userId'], socket);
  console.log('connected');


  // adding a song
  socket.on('connected', (obj) => {
    console.log('yooooo');
  });

  socket.on('skipped', obj => {
    console.log('skip ayyy');
  });

  socket.on('join', room => {
    console.log(room + 'joined!');
  })
});

http.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
