var room_Control = module.exports = {};
var draw_Control = require('./drawControl');
var user_Control = require('./userControl');

room_Control.roomFunctions = function(data, socket, io){
  switch (data.type){
    case 'newRoom':
      createRoom(data, io, socket);
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

function createRoom(data, io, socket){
  if(socket.curr_room == data.roomName)
    return;

  var old_room = socket.curr_room;

  socket.leave(socket.curr_room);
  socket.join(data.roomName);

  socket.curr_room = data.roomName;
}

function joinRoom(data, io, socket){
  if(socket.curr_room == data.roomName)
    return;

  var old_room = socket.curr_room;

  //socket leaves room and joins new room
  socket.leave(socket.curr_room);
  socket.join(data.roomName);


  socket.curr_room = data.roomName;
}