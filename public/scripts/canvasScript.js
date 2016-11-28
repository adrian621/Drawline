var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", function(e){
	findMove('down', e)}, false);
canvas.addEventListener("mousemove", function(e){
	findMove('move', e)}, false);
canvas.addEventListener("mouseup", function(e){
	findMove('up', e)}, false);

var flag = false;
var prevCordX = 0;
var prevCordY = 0;
var newCordX = 0;
var newCordY = 0;
var dot_flag = false;
var coordinates = [];
var rect = canvas.getBoundingClientRect()

var size = document.getElementById('size');
var color = document.getElementById('color');
var socket = io();

socket.on('ext_coordinates', function (data){
console.log("fick coordinater");
 	// draw_ext(data); 

});

function findMove(res, e) {
	if(res == 'down') {
		//Set old mouse coordinates to "new" previous coordinates
		prevCordX = newCordX;
		prevCordY = newCordY;
		//Current relative mouse coordinates
		newCordX = e.clientX - rect.left;
		newCordY = e.clientY - rect.top;


		flag = true;
		dot_flag = true;


		if(dot_flag) {
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.fillRect = (newCordX, newCordY, size, size);
			ctx.closePath();
			dot_flag = false;
		}
	}

	if(res == 'up') {
		//Send coordinates to server when user lets go of mouse
		//CODE HERE
		var coords_json = JSON.stringify(coordinates);

		socket.emit('drawControl', {type: 'coordinates', coord_data: coords_json} );


		socket.emit('coordinates', coords_json);
		//Clear coordinates
		coordinates = [];

		flag = false;
	}

	if(res == 'move' && flag) {

		//Set old mouse coordinates to "new" previous coordinates
		prevCordX = newCordX;
		prevCordY = newCordY;
		//Current relative mouse coordinates.
		newCordX = e.clientX - rect.left;
		newCordY = e.clientY - rect.top;

		//Save mouse coordinates to send to server
		coord_tuple = [newCordX, newCordY];
		coordinates.push(coord_tuple);


		//Draw everything
		draw();
		}
}

function draw() {
	//Both these values will be sent to server
	var sizeVal = size.options[size.selectedIndex].value;
	var colorVal = color.options[color.selectedIndex].value;

	var x, y, width, height;
	x = newCordX-(sizeVal/2);
	y = newCordY-(sizeVal/2);
	width = height = (sizeVal/2)

	ctx.fillStyle = colorVal;
	ctx.lineWidth = sizeVal;
	ctx.strokeStyle = colorVal;
	ctx.rect(x,y,width,height);
	ctx.fillStyle = colorVal;
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}
