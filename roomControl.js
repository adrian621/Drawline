var room_Control = module.exports = {};
var draw_Control = require('./drawControl');
var user_Control = require('./userControl');

room_Control.roomFunctions = function(data, socket, io){

  //console.log("current socketid is    " + socket.id);
  //var allConnectedClients = Object.keys(io.sockets.connected);
  //console.log(allConnectedClients);
  //currentRoom(socket, io);
  switch (data.type){
    case 'newRoom':
      joinRoom(data, io, socket);
    break;

    case 'joinRoom':
      joinRoom(data, io, socket);
    break;
  }
}

room_Control.sendRooms = function (socket, io){
  var roomIds = [];
  for(var roomId in io.sockets.adapter.rooms){
    roomIds.push([roomId, io.sockets.adapter.rooms[roomId].length]);
  }
  io.emit('rooms', roomIds);
}

function joinRoom(data, io, socket){
  socket.leave(socket.curr_room);
  socket.join(data.roomName);
  socket.curr_room = data.roomName;
  //console.log(io.sockets.adapter.rooms);
}
