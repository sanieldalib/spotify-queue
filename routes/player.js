const express = require('express');
const router = express.Router();
const axios = require('axios');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { rooms } = require('../rooms');

var owner = '';
var timer = null;

// { album: [Object],
//   artists: [Array],
//   disc_number: '1',
//   duration_ms: '213593',
//   explicit: 'true',
//   external_ids: [Object],
//   external_urls: [Object],
//   href: 'https://api.spotify.com/v1/tracks/2JvzF1RMd7lE3KmFlsyZD8',
//   id: '2JvzF1RMd7lE3KmFlsyZD8',
//   is_local: 'false',
//   is_playable: 'true',
//   name: 'MIDDLE CHILD',
//   popularity: '96',
//   preview_url: '',
//   track_number: '1',
//   type: 'track',
//   uri: 'spotify:track:2JvzF1RMd7lE3KmFlsyZD8' } }

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
  console.log(rooms);
};

router.post('/play', isAuthenticated, (req, res) => {
	addQueue(req.body.song, req.body.room);
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

router.get('/skip', isAuthenticated, (req, res) => {
	queue.shift();
	console.log(queue);
	if (queue.length > 0) {
    const song = queue[0];
		playSong(queue[0], err => {
      if (!err) {
        res.io.emit('playing', song);
      }
    });
	}
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
