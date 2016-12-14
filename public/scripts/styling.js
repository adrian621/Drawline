var canvas = document.getElementById('canvas');
var roomsShown = false;
var newRoomShown = false;

var createBut = document.getElementById("newRoom");
function showRooms(){

  document.getElementById('roomsContainer').style.display="block";
  document.getElementById('roomsContainer').style.top = "50%";
  document.getElementById('roomsContainer').style.marginLeft = "50%";
  document.getElementById('roomsContainer').style.height = "600px";
  document.getElementById('roomsContainer').style.width = "500px";
  document.getElementById('roomsContainer').style.pointerEvents = "auto";
  document.getElementById('roomsContainer').onclick = "";

  document.getElementById('roomList').style.pointerEvents = "auto";
  document.getElementById('roomList').style.display = "block";
  $("#roomList").show(1000);

  document.getElementById('newRoom').style.display = "inline";
  roomsShown = true;

}

window.onclick = function(){
  if(roomsShown)
    canvas.onclick = function (){hideRooms(); hideNewRoomInfo();};
}

function hideRooms(){
  document.getElementById('roomsContainer').style.display = "none"
  document.getElementById('roomsContainer').style.top = "0";
  document.getElementById('roomsContainer').style.marginLeft = "0";
  document.getElementById('roomsContainer').style.height = "0";
  document.getElementById('roomsContainer').style.width = "0";
  document.getElementById('roomsContainer').style.pointerEvents = "none";

  document.getElementById('roomList').style.display = "none";

  $("#roomList").hide(1000);

  document.getElementById('newRoom').style.display = "none";

  roomsShown = false;
}


createBut.onclick = function(){
  document.getElementById('newRoomInfo').style.display = 'block';
  document.getElementById('newRoomInfo').style.top = "25%";
  document.getElementById('newRoomInfo').style.marginLeft = "50%";
  document.getElementById('roomsContainer').onclick = "";

  newRoomShown = true;
};

function hideNewRoomInfo(){
  document.getElementById('newRoomInfo').style.display = "none";
  document.getElementById('newRoomInfo').style.top = "0";
  document.getElementById('newRoomInfo').style.marginLeft = "0";

  newRoomShown = false;
}


/* Set the width of the side navigation to 250px */
function openNav() {
		document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
		document.getElementById("mySidenav").style.width = "0";
}
