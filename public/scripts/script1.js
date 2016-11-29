//Create variable socket
var socket = io();

window.onload=function() {
  document.getElementById("nameFormId").onsubmit=function() {
	
	var userName = "Guest"
	if(document.getElementById("nameInputId").value != ""){
	userName = document.getElementById("nameInputId").value;
	}  
	  
    socket.emit('userControl', {type: 'newUser' , username: userName});
    window.location.replace("canvasView.html");
    
    return false;
  }
}

