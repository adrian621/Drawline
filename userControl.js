

var user_Control = module.exports = {};

user_Control.userFunctions = function(data, socket, io){
		switch(data.type){
			case 'newUser':
				//add user to list of users
				addToUserList(data, socket);
				//send new userList to all clients
				io.emit('onlineUsers', {users:onlineUsers.userNames});
				break;

			case 'userDisconnect':
					removeFromUserList(socket, io);
					break;
			}
}

var onlineUsers = {
	userNames:[],
	ids:[],
};

addToUserList = function(data, socket){
	onlineUsers.userNames.push(data.username);
	console.log(onlineUsers.userNames);
	onlineUsers.ids.push(socket.id);
}

removeFromUserList = function(data, io){
	for (var i = 0; i < onlineUsers.userNames.length; i++) {		
		if (onlineUsers.ids[i] == data.id) {
			 //console.log("CLIENT " + onlineUsers[i].id +" DISCONNECTED AND WAS REMOVED");
			 onlineUsers.ids.splice(i, 1);
			 onlineUsers.userNames.splice(i, 1);
			 console.log(onlineUsers.userNames);
			 io.emit('onlineUsers', {users:onlineUsers.userNames});
			 return;
		}
	}
}
