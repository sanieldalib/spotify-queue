// Different Session Rooms for Listening

const axios = require('axios');
const io = require('./io').io();

const rooms = {};

//constructor for room
class Room {
  constructor(id, owner) {
    this.id = id;
    this.queue = [];
    this.owner = owner;
    if (!owner) {
      this.owner = owner;
    }
    this.timer = null;
    this.users = [];
    this.currentSong = null;
  }

  startTimer(time) {
    clearTimeout(this.timer);
    console.log(`timer starting with ${time / 1000} seconds`);
    const _this = this;
    this.timer = setTimeout(() => {
      this.currentSong = null;
      this.playNext();
    }, time);
  }

  addToQueue(song) {
    this.queue.push(song);
    console.log(`Queue Lenght: ${this.queue.length}`);
    if (this.currentSong === null) {
      this.playSong(song, err => {
        if (!err) {
          io.to(this.id).emit('playing', song);
          io.to(this.id).emit('queue-update', this.queue);
        }
      });
    } else {
      io.to(this.id).emit('queue-update', this.queue);
    }
  }

  playNext() {
    //shift queue and play next song
    console.log('playing next');
    if (this.queue.length > 0) {
      const song = this.queue[0];
      this.playSong(song, err => {
        if (!err) {
          io.to(this.id).emit('playing', song);
          io.to(this.id).emit('queue-update', this.queue);
        }
      });
    }
  }

  playSong(song, cb) {
    const { uri } = song.song;
    axios
      .put('https://api.spotify.com/v1/me/player/play', {
        uris: [uri]
      }, {
          headers: {
            Authorization: `Bearer ${this.owner}`
          }
        })
      .then(res => {
        console.log(`playing ${song.song.name}`);
        this.currentSong = song.song;
        this.queue.shift();
        console.log(this.queue.length);
        this.startTimer(song.song.duration_ms - 500);
        cb(null);
      })
      .catch(err => {
        console.log(`Spotify Request Error: ${err}`);
        cb(err);
      });
  }
}
;

const createRoom = (id, owner) => {
  const room = new Room(id, owner);
  rooms[id] = room;
  console.log(rooms);
}

module.exports = { rooms: rooms, createRoom: createRoom };
