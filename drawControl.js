//This module will handle all operations of the board.
var draw_Control = module.exports = {};

var Canvas = require('canvas'), canvas = new Canvas(600,600), ctx = canvas.getContext('2d'), Image = Canvas.Image;

draw_Control.getServerCanvas = function(){
	return canvas.toDataURL();
}

draw_Control.setServerCanvas = function(data){
	canvas = data;
}

draw_Control.clearCanvas = function(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

draw_Control.drawFunctions = function(data, socket, io, rtt){

	switch (data.type) {
		case 'serverStart':
			drawServerCanvas({type: 'serverStart', cnv_data: data.coord_data});
		break;

		case 'coordinates':
			if(controlValidCordinates(data.coord_data, socket)){
				io.emit('ext_coordinates', data.coord_data);
				drawServerCanvas({type: 'coordData', cnv_data: data.coord_data});
			}
			break;

		case 'wantCanvas':
			socket.emit('latestCanvas', canvas.toDataURL());
			break;
		default:
			break;
	}

}

function drawServerCanvas(data){
	if(data.type == 'coordData'){
		var sizeVal = data.cnv_data[0];
		var colorVal = data.cnv_data[1];
	  for (var i = 3; i < data.cnv_data.length; i++) {

			var tmp = data.cnv_data[i];
	    var prev_tmp = data.cnv_data[i-1];

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

	if(data.type == 'serverStart'){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var img = new Image;

		img.onload = function(){
			ctx.drawImage(img,0,0);
		}

		img.src = data.cnv_data;
	}
}

//check validity
controlValidCordinates = function(data, socket){
	if(!checkDef(data)){
	return false;
	}
	sizeVal = data[0];
	coordinates = data[2];
	if(checkValidSize(sizeVal) && checkValidCords(coordinates)){
		return true;
	}
	else	{
			socket.emit('latestCanvas', canvas.toDataURL());
		}
}

//check that everything is defined
checkDef = function(data){
	if(data[0] === undefined || data[2] === undefined || data[2][0] === undefined || data[2][1] === undefined){
	return false;
	}
	else return true;
}


//check validity of size
checkValidSize = function(sizeVal){
	if((sizeVal < 2) || (sizeVal > 30)){
	return false;
	}
	return true;
}

//check validity of coordinates
checkValidCords = function(coordinates){
	var coord1 = coordinates[0];
	var coord2 = coordinates[1];
	var xMax = 600;
	var yMax = 600;
	if((coord1 <= yMax) && (coord1 >= 0) && (coord2 <= xMax) && (coord2 >= 0)){
	return true;
	}
	return false;
}

//checkValidityOfColor
checkValidHex = function(data){

}
