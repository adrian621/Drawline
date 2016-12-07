//Code for Voting-button
var vote_button = document.getElementById('voteButtonID');

vote_button.addEventListener("click", function() {
	socket.emit('userControl', {type:'userChange'});
});

//Code for percentage of TRUE votes (for clearing canvas).
var prcForClear = document.createElement('prcForClear');
var intPrcForClear = document.createTextNode("0");
prcForClear.appendChild(intPrcForClear);

//Visa på sidan hur många % har röstat för att cleara canvas
socket.on('voteStats', function(data){
	document.getElementById("vStats").value = data*100;
});

//Hämta ut parameter
getUserName = function(){
	var url = window.location.href;
	var splitted = url.split('=');
	return splitted[1];
}
//Skicka till server
emitUserName = function(userName){
	socket.emit('userControl', {type: 'newUser' , username: userName});
}

//Körs när sidan laddas
window.onload = function(){
	var userName = getUserName();
	emitUserName(userName);
}

//Tömmer den gamla listan innan vi fyller på den nya
emptyList = function (ul){
  if (ul) {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
  }
}

//Display i lista
displayUsers = function(userList){
	list = document.getElementById('onlineUsersList');
	emptyList(list);
	for(i = 0; i < userList.length; i++){
			item = document.createElement('li');
			item.appendChild(document.createTextNode(userList[i]));
			list.appendChild(item);
		}
}

//Ta emot från server
socket.on('onlineUsers', function(data){
	displayUsers(data.users);
});
