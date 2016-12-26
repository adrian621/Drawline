var room_Control = module.exports = {};
var draw_Control = require('./drawControl');
var user_Control = require('./userControl');
var rooms = [];


room_Control.init = function(){
  var id_ = (Math.random() * 1000).toFixed();

  //add constant so it doesnt get removed when no clients are connected
  var room = {id: id_, name: 'main', clients: ['constant'], canvas: draw_Control.newCanvas()};
  rooms.push(room);
}

room_Control.getRooms = function(){
  return rooms;
}


room_Control.roomFunctions = function(data, socket, io){
  switch (data.type){
    case 'newRoom':
      createRoom(data, io, socket);
    break;

    case 'joinRoom':
      joinRoom(data, io, socket);
    break;

    case 'leaveRoom':
      leaveRoom(socket);
    break;

    default:
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

function removeRoom(roomId){
  var index = -1;
  for(var i = 0; i < rooms.length; i++){
    if(rooms[i].id == roomId)
      index = i;
  }

  //remove
  if (index > -1) {
    rooms.splice(index, 1);
    return;
  }

  console.log("COULDNT FIND ROOM" + roomId + "IN SERVERS ROOM LIST! KNAS");
}

function addUserToRoom(roomId, socket){
  var index = -1;
  for(var i = 0; i < rooms.length; i++){
    if(rooms[i].id == roomId){
      rooms[i].clients.push(socket.id)
    }
  }
}

function removeUserFromRoom(roomId, socket){
  var room = roomFromId(roomId);

  if(room == undefined)
    return;


  //// DET KNASAR HÄR!!!!!!!!!!! ------
  var index = room.clients.indexOf(socket.id);

  //remove
  if (index > -1) {
    room.clients.splice(index, 1);
    //remove room from servers room list if no users connected
    if(room.clients.length == 0)
      removeRoom(roomId);
    return;
  }
}

function roomIdFromName(name){
  for (var i = 0; i < rooms.length; i++){
    if(rooms[i].name == name)
      return rooms[i].id;
  }
}

function roomFromId(roomId){
  for(var i = 0; i < rooms.length; i++){
    if(rooms[i].id == roomId)
      return rooms[i];
  }

  console.log("could not find roomid" + roomId);
}

room_Control.roomFromName = function(roomName){
  var roomId = roomIdFromName(roomName);
  return roomFromId(roomId);
}

room_Control.canvasFromRoomName = function(roomName){
  var room = this.roomFromName(roomName);

  return room.canvas;
}

function createRoom(data, io, socket){
  //if client clicks his current room in the room table on the website
  if(socket.curr_room == data.roomName)
    return;

  var old_room = socket.curr_room;

  socket.leave(socket.curr_room);
  removeUserFromRoom(roomIdFromName(old_room), socket);

  socket.join(data.roomName);

  //Create the room and insert it into the servers room list
  var id_ = (Math.random() * 1000).toFixed();
  var room = {id: id_, name: data.roomName, clients: [socket.id], canvas: draw_Control.newCanvas()};
  rooms.push(room);

  socket.curr_room = data.roomName;

  //emit newly created room to client
  var roomCanvas = room_Control.canvasFromRoomName(socket.curr_room);
  socket.emit('latestCanvas', {cnv_data: roomCanvas.toDataURL(), resolution: [roomCanvas.width, roomCanvas.height]});
  socket.emit('currRoom', socket.curr_room);
  
}

function joinRoom(data, io, socket){

  //if client clicks his current room in the room table on the website
  if(socket.curr_room == data.roomName)
    return;

  var old_room = socket.curr_room;

  //socket leaves room and joins new room
  socket.leave(socket.curr_room);
  removeUserFromRoom(roomIdFromName(old_room), socket);

  socket.join(data.roomName);
  addUserToRoom(roomIdFromName(data.roomName), socket);


  socket.curr_room = data.roomName;

  //emit rooms current canvas to client
  var roomCanvas = room_Control.canvasFromRoomName(socket.curr_room);
  socket.emit('latestCanvas', {cnv_data: roomCanvas.toDataURL(), resolution: [roomCanvas.width, roomCanvas.height]});
  socket.emit('currRoom', socket.curr_room);
}

function leaveRoom(socket){
  curr_room = socket.curr_room;
  roomId = roomIdFromName(curr_room);
  removeUserFromRoom(roomId, socket);
}
