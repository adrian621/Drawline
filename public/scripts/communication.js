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
    a.className = "roomEntry";
    cell1.appendChild(a);
    cell2.innerHTML = data[i][1];
  }

  old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
});

socket.on('currRoom', function(data){
  var curr = document.getElementById("curr");
  curr.innerHTML = "";

  var h = document.createElement('h4');
  h.className = "title is-4";
  h.id = "rListTitle";
  var text = document.createTextNode("You are in " + data);
  h.appendChild(text);
  curr.appendChild(h);

})
socket.on('connect', function(){
  socket.emit('wantRooms');
});

cRoomBut.onclick = function(){
  document.getElementById('newRoomInfo').style.display = "none";
  document.getElementById('newRoomInfo').style.top = "0";
  document.getElementById('newRoomInfo').style.marginLeft = "0";
  socket.emit('newRoom',{type: 'newRoom', roomName: rName.value});
}

//Check what room the client clicked and join
$(table).on("click", ".roomEntry", function(e){
  var roomToJoin = $(e.target).text();
  socket.emit('newRoom',{type: 'joinRoom', roomName: roomToJoin});
});
