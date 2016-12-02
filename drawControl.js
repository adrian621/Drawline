//This module will handle all operations of the board.
	// TODO //
//get data from users
//control valid
//send to other clients
var draw_Control = module.exports = {};
var Canvas = require('canvas'), canvas = new Canvas(600,600), ctx = canvas.getContext('2d');


draw_Control.getServerCanvas = function(){
	return canvas.toDataURL();
}

draw_Control.drawFunctions = function(data, socket, io, rtt){

	switch (data.type) {
		case 'coordinates':
			//saveCoordinates(data);
			socket.broadcast.emit('ext_coordinates', data.coord_data);
			drawServerCanvas(data.coord_data);
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

function drawServerCanvas(data){
	var sizeVal = data[0];
	var colorVal = data[1];
  for (var i = 3; i < data.length; i++) {

		var tmp = data[i];
    var prev_tmp = data[i-1];

  	var x, y, width, height;
  	curr_x = tmp[0];
  	curr_y = tmp[1];

    prev_x = prev_tmp[0];
    prev_y = prev_tmp[1];

  	width = height = (sizeVal/2);

    ctx.beginPath();
		ctx.lineCap = "round";
    ctx.moveTo(prev_x, prev_y);
    ctx.lineTo(curr_x, curr_y);
    ctx.lineWidth = sizeVal;
    ctx.strokeStyle = colorVal;
    ctx.stroke();
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
