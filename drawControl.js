//This module will handle all operations of the board.
	// TODO //
//get data from users
//control valid
//send to other clients
var draw_Control = module.exports = {};

draw_Control.drawFunctions = function(data, socket, io){

	switch (data.type) {
		case 'coordinates':
			saveCoordinates(data);
			socket.broadcast.emit('ext_coordinates', data.coord_data);
			break;
		default:
			break;
	}

}

draw_Control.userFunctions = function(data, socket, io){
		switch(data.type){
			case 'newUser':
				console.log("New user with username " + data.username + " has connected");
			
			}

}

var canvas = {
	coordinates: [],	
};

saveCoordinates = function(data){
//console.log(canvas.coordinates);
canvas.coordinates.push(data.coord_data);
console.log(canvas.coordinates);	
	
}











