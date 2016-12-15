//This module will handle all operations of the board.
var draw_Control = module.exports = {};

var Canvas = require('canvas'), canvas = new Canvas(1,1), ctx = canvas.getContext('2d'), Image = Canvas.Image;

draw_Control.getServerCanvas = function(){
	return canvas.toDataURL();
}

draw_Control.newCanvas = function(){
		var Canvas = require('canvas'), 
		canvas = new Canvas(1,1),
		ctx = canvas.getContext('2d'),
		Image = Canvas.Image;
	return 	[canvas, ctx];
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
		  //	io.emit('ext_coordinates', [data.coord_data, data.resolution]);
				io.to(socket.curr_room).emit('ext_coordinates', [data.coord_data, data.resolution]);
		 	 	drawServerCanvas({type: 'coordData', cnv_data: data.coord_data, resolution: data.resolution});
		  }
			break;

		case 'wantCanvas':
			//socket.emit('latestCanvas', {cnv_data: canvas.toDataURL(), resolution: [canvas.width, canvas.height]});
			socket.to(socket.curr_room).emit('latestCanvas', {cnv_data: canvas.toDataURL(), resolution: [canvas.width, canvas.height]});
			break;
		default:
			break;
	}

}

function drawServerCanvas(data){
	if(data.type == 'coordData'){
		var sizeVal = data.cnv_data[0];
		var colorVal = data.cnv_data[1];

		var width = data.resolution[0];
		var height = data.resolution[1];

		var scaleX = canvas.width/width;
		var scaleY = canvas.height/height;

		//Let server's canvas grow dynamically as it receives coordinates
		if(width > canvas.width)
			canvas.width = width;

		if(height > canvas.height)
			canvas.height = height;

	  for (var i = 3; i < data.cnv_data.length; i++) {
			var tmp = data.cnv_data[i];
	    var prev_tmp = data.cnv_data[i-1];

	  	curr_x = tmp[0] * scaleX;
	  	curr_y = tmp[1] * scaleY;

			//LÄGG TILL I VALIDCOORDCHECK
			//console.log("curr_x   " + curr_x + "    curr_y " + curr_y + "    " + typeof(curr_x));
			if(typeof(curr_x) != 'number' || typeof(curr_y) != 'number')
				return;

	    prev_x = prev_tmp[0]*scaleX;
	    prev_y = prev_tmp[1]*scaleY;

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
			canvas.width = img.width;
			canvas.height = img.height;
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
			socket.emit('latestCanvas', {cnv_data: canvas.toDataURL(), resolution: [canvas.width, canvas.height]});
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
		console.log("not valid size");
		return false;
	}
		return true;
}

//check validity of coordinates
checkValidCords = function(coordinates){
	var coord1 = coordinates[0];
	var coord2 = coordinates[1];
	var xMax = canvas.width;
	var yMax = canvas.height;
	
	
	if((coord1 <= xMax) && (coord1 >= 0) && (coord2 <= yMax) && (coord2 >= 0)){
	return true;
	
	}
	console.log("not valid coords");
	console.log(coord1 + "    xmax: " + xMax);
	console.log(coord2 + "    ymax: " + yMax);
	return false;
}

//checkValidityOfColor
checkValidHex = function(data){

}
