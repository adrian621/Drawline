var socket = io();

//gör room shit här

var room = "test";

//testa med o joina room
//socket.emit('room', room);

socket.on('message', function(data){
  console.log(data);
})
