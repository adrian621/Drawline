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



var onlineUsers = [];
draw_Control.userFunctions = function(data, socket, io){
		switch(data.type){
			case 'newUser':
				//log
			//	console.log("New user with username " + data.username + " has connected");
				//add user to list of users
				addToUserList(data, socket);
				//send new userList to all clients
				socket.emit('onlineUsers', {users:onlineUsers});
				break;

			case 'userDisconnect':
					removeFromUserList(socket);
					break;
			}
}

addToUserList = function(data, socket){
	onlineUsers.push({username: data.username, id: socket.id});
}

removeFromUserList = function(data){
	for (var i = 0; i < onlineUsers.length; i++) {
		
		if (onlineUsers[i].id == data.id) {
			 console.log("CLIENT " + onlineUsers[i].id +" DISCONNECTED AND WAS REMOVED");
			 onlineUsers.splice(i, 1);
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
