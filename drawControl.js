//This module will handle all operations of the board.
var draw_Control = module.exports = {};
var room_Control = require('./roomControl');

var Canvas = require('canvas'), canvas = new Canvas(1,1), ctx = canvas.getContext('2d'), Image = Canvas.Image;

//Everything for MongoDB
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://jaki:123@ds141368.mlab.com:41368/heroku_b774r87n';
var mongoDB;

//Connect to MongoDB
mongoClient.connect(url, function(err, db) {
	if(err) {
		console.log(err);
		return;
	}
	mongoDB = db;
});


draw_Control.getServerCanvas = function(){
	return canvas.toDataURL();
}


draw_Control.newCanvas = function(){
		var canvaz = new Canvas(1, 1);
		return canvaz;
}


draw_Control.clearCanvas = function(socket){
	var roomCanvas = room_Control.canvasFromRoomName(socket.curr_room);
	var roomCtx = roomCanvas.getContext("2d");

	roomCtx.clearRect(0, 0, roomCanvas.width, roomCanvas.height);
}

draw_Control.drawFunctions = function(data, socket, io, rtt){

	switch (data.type) {
		case 'serverStart':
			drawServerCanvas({type: 'serverStart', cnv_data: data.coord_data});
		break;

		case 'coordinates':
		  if(controlValidCordinates(data.coord_data, socket)){
				//io.emit('ext_coordinates', [data.coord_data, data.resolution]);
			//	io.sockets.in(socket.curr_room).emit('ext_coordinates', [data.coord_data, data.resolution]);

				mongoDB.collection('UserMove').insert({'socketID':socket.id, "move":data.coord_data, "res":data.resolution});
				io.to(socket.curr_room).emit('ext_coordinates', {coordData: data.coord_data, resolution: data.resolution, brush: data.brush});

		 	 	drawServerCanvas({type: 'coordData', brush: data.brush, cnv_data: data.coord_data, resolution: data.resolution}, socket);

				//Save serverCanvas as URL in MongoDB
				var roomCanvas = room_Control.canvasFromRoomName(socket.curr_room);
			  mongoDB.collection('User').update({'user':'ADMIN'}, {'socketID':roomCanvas.toDataURL(), 'user':'ADMIN'});
		  }
			break;

		case 'wantCanvas':
			var roomCanvas = room_Control.canvasFromRoomName(socket.curr_room);
			//socket.emit('latestCanvas', {cnv_data: canvas.toDataURL(), resolution: [canvas.width, canvas.height]});
			socket.emit('latestCanvas', {cnv_data: roomCanvas.toDataURL(), resolution: [roomCanvas.width, roomCanvas.height]});
			break;

		default:
			break;
	}

}

function drawServerCanvas(data, socket){
	if(socket == undefined)
		return;

	var roomCanvas = room_Control.canvasFromRoomName(socket.curr_room);

	var roomCtx = roomCanvas.getContext("2d");

	if(data.type == 'coordData'){

		switch(data.brush){
			case 'Normal':
				var sizeVal = data.cnv_data[0];
				var colorVal = data.cnv_data[1];

				var width = data.resolution[0];
				var height = data.resolution[1];

				var scaleX = roomCanvas.width/width;
				var scaleY = roomCanvas.height/height;

				//Let server's canvases grow dynamically as it receives coordinates
				if(width > roomCanvas.width)
					roomCanvas.width = width;

				if(height > roomCanvas.height)
					roomCanvas.height = height;

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

			    roomCtx.beginPath();
					roomCtx.lineCap = "round";
			    roomCtx.moveTo(prev_x, prev_y);
			    roomCtx.lineTo(curr_x, curr_y);
			    roomCtx.lineWidth = sizeVal;
			    roomCtx.strokeStyle = colorVal;
			    roomCtx.stroke();
				}
			break;

			case 'Japanese':
				var sizeVal = data.cnv_data[0]/4;
				var colorVal = data.cnv_data[1];

				var width = data.resolution[0];
				var height = data.resolution[1];

				var scaleX = roomCanvas.width/width;
				var scaleY = roomCanvas.height/height;

				//Let server's canvases grow dynamically as it receives coordinates
				if(width > roomCanvas.width)
					roomCanvas.width = width;

				if(height > roomCanvas.height)
					roomCanvas.height = height;

				for (var i = 3; i < data.cnv_data.length; i++) {
					var tmp = data.cnv_data[i];

			  	curr_x = tmp[0];
			  	curr_y = tmp[1];
					var japRands = tmp[2];

					//LÄGG TILL I VALIDCOORDCHECK
					//console.log("curr_x   " + curr_x + "    curr_y " + curr_y + "    " + typeof(curr_x));
					if(typeof(curr_x) != 'number' || typeof(curr_y) != 'number')
						return;


					roomCtx.beginPath();
					roomCtx.fillStyle = colorVal;
					roomCtx.arc(curr_x-japRands[0]*12, curr_y, sizeVal, 0*Math.PI, japRands[1]*2*Math.PI);
					roomCtx.arc(curr_x+japRands[2]*12, curr_y, sizeVal, 0*Math.PI, japRands[3]*2*Math.PI);
					roomCtx.arc(curr_x, curr_y-japRands[4]*12, sizeVal, 0*Math.PI, japRands[5]*2*Math.PI);
					roomCtx.arc(curr_x, curr_y+japRands[6]*12, sizeVal, 0*Math.PI, japRands[7]*2*Math.PI);
					roomCtx.arc(curr_x, curr_y, sizeVal, 0*Math.PI, japRands[8]*2*Math.PI);
					roomCtx.closePath();
					roomCtx.fill();


				}
			break;
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

	//Temporary v
	return true;

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
