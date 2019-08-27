const express = require('express');
const router = express.Router();
const axios = require('axios');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { rooms } = require('../rooms');

var owner = '';
var timer = null;

const startTimer = time => {
	console.log(time);
	clearTimeout(timer);
	timer = setTimeout(() => {
		console.log('new song!');
		queue.shift();
		if (queue.length > 0) {
			playSong(queue[0]);
		}
	}, time);
};

const addQueue = (song, room) => {
	const storedRoom = rooms[room];
  storedRoom.addToQueue(song);
};

router.post('/play', (req, res) => {
  console.log('play endpoint hit');
  if (!req.body.song || !req.body.room) {
    res.status(400).send('Incomplete Request!');
  }
  
  addQueue(req.body.song, req.body.room);
  res.status(200).send('Success');
	// const { accessToken } = req.user.tokens;
	// owner = accessToken;
	// if (queue.length === 1) {
	// 	playSong(req.body, err => {
  //     if (!err) {
  //       res.io.emit('playing', req.body);
  //     }
  //   });
	// }
});

router.post('/skip', (req, res) => {
  const { room } = req.body;
  console.log('skip requested')
  rooms[room].playNext();
  res.status(200).send();
});

router.get('/devices', isAuthenticated, (req, res) => {
  const { accessToken } = req.user.tokens;
  owner = accessToken;
  getDevices();
})

const getDevices = () => {
  const authed = axios.create({
    baseURL: 'https://api.spotify.com/v1/me/player',
    timeout: 3000,
    headers: { 'Authorization': `Bearer ${owner}`}
  })

    authed.get('/devices')
      .then(res => {
        res.send(res.body)
      })
      .catch(err => {
        console.log(err);
      });
};

const playSong = (song, cb) => {
	const { uri } = song.song;
  console.log(owner);
	axios
		.put(
			'https://api.spotify.com/v1/me/player/play',
			{
				uris: [uri]
			},
			{
				headers: {
					Authorization: `Bearer ${owner}`
				}
			}
		)
		.then(res => {
			console.log('setTimeout');
			startTimer(song.song.duration_ms - 500);
      cb(null)
		})
		.catch(err => {
			console.log(err);
      cb(err)
		});
};


module.exports = router;
