const express = require('express');
const router = express.Router();
const axios = require('axios');
const isAuthenticated = require('../middlewares/isAuthenticated');

var queue = [];
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

const addQueue = song => {
	queue.push(song);
};

router.post('/play', isAuthenticated, (req, res) => {
	addQueue(req.body);
	console.log(queue);
	const { accessToken } = req.user.tokens;
	owner = accessToken;
	if (queue.length === 1) {
		playSong(req.body);
	}
});

router.get('/skip', isAuthenticated, (req, res) => {
	queue.shift();
	console.log(queue);
	if (queue.length > 0) {
		playSong(queue[0]);
	}
	res.status(200).send();
});

router.get('/devices', isAuthenticated, (req, res) => {
  getDevices();
})

const getDevices = () => {
  // console.log(owner);
  // axios
	// 	.get('https://api.spotify.com/v1/me/player/devices', {
	// 		headers: {
	// 			Authorization: `Bearer ${owner}`
	// 		}
	// 	}).then(res => {
	// 		console.log(res.body);
	// 	})
	// 	.catch(err => {
	// 		console.log(err);
	// 	});


    axios
      .get('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${owner}`
        }
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
};

const playSong = song => {
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
		})
		.catch(err => {
			console.log(err);
		});
};


module.exports = router;
