const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  id: String,
  owner: String,
  queue: [ { uri: String, duration: Number } ],
},
{
  usePushEach: true
});

roomSchema.statics.createRoom = function(id, owner, callback) {
  console.log(this);
  const room = new self({ id: id, owner: owner });
  room.save((err) => {
    if (err) {
      callback(err)
    } else {
      callback(err, room);
    }
  });
};

roomSchema.statics.find = function(id, callback) {
  this.findOne({ id: id }, (err, room) => {
    if (err) {
      callback(err);
      console.log(err);
    }

    if (room) {
      callback(null, room);
    } else {
      // catch if no room or error
      callback(err);
    }
  });
};

roomSchema.statics.addSong = (song, id, callback) => {
  this.findOne({ id: id }, (err, room) => {
    if (err) { callback(err); }
    room.list.push(song);
    room.save(callback);
  });
}

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

// finds or creates a room.
// roomSchema.statics.findOrCreate = function(id, cb) {
//   var self = this;
//   this.findOne({ id: id }, function (err, room) {
//     if (err) { cb(err) }
//     if (!room) {
//       var room = new self({ id: id });
//       room.save(cb);
//     }
//     if (room) {
//       cb(null, room);
//     }
//   });
// }
//
// // adds a song to a room with a specific id.
// roomSchema.statics.addSong = function(song, id, cb) {
//   this.findOne({ id: id }, function (err, room) {
//     if (err) { cb(err); }
//     room.list.push(song);
//     room.save(cb);
//   });
// }
//
// // removes a song at a specific index. Invalid id's are ignored.
// roomSchema.statics.removeSong = function(index, id, cb) {
//   this.findOne({ id: id }, function (err, room) {
//     if (err) { cb(err); }
//     room.list = room.list.filter( (song, i) => { return i !== index });
//     room.save(cb);
//   });
// }
//
// // moves a song higher up the list. Invalid moves are ignored.
// roomSchema.statics.moveUp = function(index, id, cb) {
//   this.findOne({ id: id }, function (err, room) {
//     if (err) { cb(err); }
//     if (index > 0) {
// 			var tmp = room.list[index - 1];
// 	    room.list.set(index - 1, room.list[index]);
// 	    room.list.set(index, tmp);
// 	  }
// 	  room.save(cb);
//   });
// }
//
// // moves a song lower down the list.
// roomSchema.statics.moveDown = function(index, id, cb) {
//   this.findOne({ id: id }, function (err, room) {
//     if (err) { cb(err); }
//     if (index < room.list.length - 1) {
// 			var tmp = room.list[index + 1];
// 	    room.list.set(index + 1, room.list[index]);
// 	    room.list.set(index, tmp);
// 	  }
// 	  room.save(cb);
//   });
// }
//
// roomSchema.statics.getList = function (id, cb) {
// 	this.findOne({ id: id }, function (err, room) {
//     if (err) { cb(err); }
//     return room.list;
//   });
// }

module.exports = mongoose.model('Room', roomSchema);
