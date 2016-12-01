
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
