//This module will handle all operations of the board.
	// TODO //
//get data from users
//control valid
//send to other clients
var draw_Control = module.exports = {};


draw_Control.drawFunctions = function(data, socket, io){
console.log(data);
socket.broadcast.emit('ext_coordinates', data);	
	
};
