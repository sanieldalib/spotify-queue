const rooms = {};

function Room(id, owner) {
  this.id = id;
  this.queue = [];
  this.owner = '';
  if (!owner) {
    this.owner = owner;
  }
  this.timer = null
  this.users = []
};

Room.prototype.startTimer = function(time) {
  this.timer = setTimeout(() => {
    console.log('yo');
  }
    ,500)
}

const createRoom = (id, owner) => {
  const room = new Room(id, owner);
  rooms[id] = room;
}

module.exports = { rooms: rooms, createRoom: createRoom };
