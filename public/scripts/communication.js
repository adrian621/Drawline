var socket = io();

//gör room shit här

var room = "test";
var cRoomBut = document.getElementById('cRoom');
var showListBut = document.getElementById('create');
var rName = document.getElementById('roomName');
var table = document.getElementById("roomList");

socket.on('rooms', function(data){
  var table = document.getElementById("roomList");

  var new_tbody = document.createElement('tbody');
  var old_tbody = table.tBodies[0];

  for(var i = 0; i < data.length; i++){


    var row = new_tbody.insertRow(0);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    var a = document.createElement('a');
    var linkText = document.createTextNode(data[i][0]);

    a.appendChild(linkText);
    a.id = "r" + i;
    cell1.appendChild(a);
    cell2.innerHTML = data[i][1];
  }

  old_tbody.parentNode.replaceChild(new_tbody, old_tbody);

});


socket.on('connect', function(){
  socket.emit('wantRooms');
});

cRoomBut.onclick = function(){
  socket.emit('newRoom',{type: 'newRoom', roomName: rName.value})
}

//Check what room the client clicked and join
$(table).click(function(e){
  var roomToJoin = $(e.target).text();
  socket.emit('newRoom',{type: 'joinRoom', roomName: roomToJoin});
});
