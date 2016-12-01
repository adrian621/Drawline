//This module will handle all operations of the board.
	// TODO //
//get data from users
//control valid
//send to other clients
var draw_Control = module.exports = {};

draw_Control.drawFunctions = function(data, socket, io){

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
				console.log("New user with username " + data.username + " has connected");
				//add user to list of users
				addToUserList(data);
				//send new userList to all clients
				socket.emit('onlineUsers', {users:onlineUsers});
			}
}

addToUserList = function(data){
onlineUsers.push(data.username);	
}



/*
var canvasMatrix = {
	coordinates: [],	
};

saveCoordinates = function(data){
//console.log(canvas.coordinates);
canvasMatrix.coordinates.push(data.coord_data);
console.log(canvasMatrix.coordinates);	
	
}
*/











