var sio = require('socket.io');
var io = null;

exports.io = function () {
  return io;
};

exports.init = function(server) {
  return io = sio(server);
};