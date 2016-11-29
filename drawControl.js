//This module will handle all operations of the board.
	// TODO //
//get data from users
//control valid
//send to other clients
var draw_Control = module.exports = {};


draw_Control.drawFunctions = function(data, socket, io){

	switch (data.type) {
		case 'coordinates':
			socket.broadcast.emit('ext_coordinates', data.coord_data);
			break;
		default:
			break;
	}
}
