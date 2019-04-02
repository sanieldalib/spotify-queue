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
  this.timer = setInterval(() => {
    console.log(this.id);
  }
    ,500)
}

Room.prototype.addToQueue = function(song) {
  this.queue.push(song);
  this.startTimer(1000);
}

const createRoom = (id, owner) => {
  const room = new Room(id, owner);
  rooms[id] = room;
  console.log(rooms);
}

module.exports = { rooms: rooms, createRoom: createRoom };
