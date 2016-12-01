//This module will handle all operations of the board.
	// TODO //
//get data from users
//control valid
//send to other clients
var draw_Control = module.exports = {};


draw_Control.drawFunctions = function(data, socket, io, rtt){
	
	switch (data.type) {
		case 'coordinates':
			//saveCoordinates(data);
			socket.broadcast.emit('ext_coordinates', data.coord_data);

			break;
		default:
			break;
	}

}

//USER-SECTION
draw_Control.userFunctions = function(data, socket, io){
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


/*
var canvasMatrix = {
	coordinates: [],
>>>>>>> 1b2e215d5264a1a3eb83c4a6417be1342db439ab
};

saveCoordinates = function(data){
//console.log(canvas.coordinates);
<<<<<<< HEAD
	canvas.coordinates.push(data.coord_data);
//	console.log(canvas.coordinates);
=======
canvasMatrix.coordinates.push(data.coord_data);
console.log(canvasMatrix.coordinates);

}
*/
