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
			/*
		case 'clearCanvas':
			socket.broadcast.emit('ext_clear');
			break;
			*/
		default:
			break;
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
