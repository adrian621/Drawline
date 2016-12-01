
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

//Display i lista
displayUsers = function(userList){
	list = document.getElementById('onlineUsersList');
	for(i = 0; i < userList.length; i++){
			item = document.createElement('li');
			item.appendChild(document.createTextNode(userList[i].username + " - " + userList[i].id));
			list.appendChild(item);
		}
}

//Ta emot från server
socket.on('onlineUsers', function(data){
	displayUsers(data.users);
});
