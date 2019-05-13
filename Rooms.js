const axios = require('axios');

const rooms = {};

function Room(id, owner) {
  this.id = id;
  this.queue = [];
  this.owner = owner;
  if (!owner) {
    this.owner = owner;
  }
  this.timer = null
  this.users = []
};

Room.prototype.startTimer = function(time) {
  clearTimeout(this.timer);
  const _this = this;
  this.timer = setTimeout(() => {
    this.playNext();
  }, time);
}

Room.prototype.addToQueue = function(song) {
  this.queue.push(song);
  console.log(this.queue.length);
  console.log(this.queue);
  if (this.queue.length === 1) {
    this.playSong(song, err => {
      if (!err) {
        //emit socket
      }
    });
  }
}

Room.prototype.playNext = function() {
  //shift queue and play next song
  console.log('playing next');
  this.queue.shift();
  console.log(this.queue);
  if (this.queue.length > 0) {
    const song = this.queue[0];
    this.playSong(song, err => {
      if (!err) {

      }
    });
  }
}

Room.prototype.playSong = function(song, cb) {
  this.queue.shift();
  const { uri } = song.song;
	axios
		.put(
			'https://api.spotify.com/v1/me/player/play',
			{
				uris: [uri]
			},
			{
				headers: {
					Authorization: `Bearer ${this.owner}`
				}
			}
		)
		.then(res => {
			console.log(`playing ${song.song.name}`);
      this.startTimer(20*1000 - 500);
      cb(null)
		})
		.catch(err => {
			console.log(err);
      cb(err)
		});
}

const createRoom = (id, owner) => {
  const room = new Room(id, owner);
  rooms[id] = room;
  console.log(rooms);
}

module.exports = { rooms: rooms, createRoom: createRoom };
