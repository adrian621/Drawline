var socket = io();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var preview_canvas = document.getElementById('preview_canvas');
var preview_ctx = preview_canvas.getContext("2d");

var size = document.getElementById('size');
var color = document.getElementById('color');

var dBut = document.getElementById("downloadBut");

window.addEventListener('mousedown', function(){
	draw_preview()}, false);
size.addEventListener("input", function(){
	draw_preview()}, false);
color.addEventListener("input", function(){
	draw_preview()}, false);
canvas.addEventListener("mousedown", function(e){
	findMove('down', e)}, false);
canvas.addEventListener("mousemove", function(e){
	findMove('move', e)}, false);
canvas.addEventListener("mouseup", function(e){
	findMove('up', e)}, false);
canvas.addEventListener("mouseout", function(e){
	findMove('out', e)}, false);
window.addEventListener('resize', function(e){
  scale_canvas(e)}, false);
window.addEventListener('scroll', function(e){
	scale_canvas(e)}, false);
dBut.addEventListener('click', dlCanvas, false);

var flag = false;
var prevCordX = 0;
var prevCordY = 0;
var newCordX = 0;
var newCordY = 0;
var dot_flag = false;

//Will look like:
// coordinates = [[SIZE, COLOR],[x1,y1],[x2,y2]...[xn, yn]]
var coordinates = [];
var rect = canvas.getBoundingClientRect();



function dlCanvas() {
	canvas.toBlob(function(blob) {
			saveAs(blob, "output.jpeg");
	}, "image/jpeg");
};

socket.on('connect', function(){
	initCanvas();
	socket.emit('drawControl',{type:'wantCanvas'});
	draw_preview();
});

socket.on('ext_coordinates', function (data){
  draw_ext(data);
});


socket.on('latestCanvas', function(data){
	

ctx.clearRect(0, 0, canvas.width, canvas.height);


	var img = new Image;

	img.onload = function(){
		ctx.drawImage(img,0,0);
	}

	img.src = data;
});

socket.on('ext_clear', function(data) {
	clearCanvas();
});

socket.on('curr_vote', function(data) {
	if(data)
		document.getElementById('specificUserVote').innerHTML = "Yes!";
	else if(!data)
		document.getElementById('specificUserVote').innerHTML = "No!";
});

function draw_ext(data){
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
function findMove(res, e) {
	if(res == 'down') {

		//Set old mouse coordinates to "new" previous coordinates
		prevCordX = newCordX;
		prevCordY = newCordY;
		//Current relative mouse coordinates
		newCordX = e.clientX - rect.left;
		newCordY = e.clientY - rect.top;

		//Add brush color and size as first element in coordinates array.
		coordinates.push(size.value, "#"+color.value);
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

	if(res == 'up' || res == 'out') {
		//Send coordinates to server when user lets go of mouse
		res = 'up';
	  	//* UNCOMMENT IF YOU RUN INDEX.HTML IN A NODEJS SERVER!!! *
	 	socket.emit('drawControl', {type: 'coordinates', coord_data: coordinates} );
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

		if(coordinates.length > 50){
			socket.emit('drawControl', {type: 'coordinates', coord_data: coordinates} );
			coordinates = [];
			coordinates.push(size.value, "#"+color.value);
			coordinates.push(coord_tuple);
		}

		draw();
	}
}

function draw() {
	//Both these values will be sent to server
	var sizeVal = size.value;
	var colorVal = "#"+color.value;

  ctx.beginPath();
	ctx.lineCap = "round";
  ctx.moveTo(prevCordX, prevCordY);
  ctx.lineTo(newCordX, newCordY);
  ctx.lineWidth = sizeVal;
  ctx.strokeStyle = colorVal;
  ctx.stroke();

	draw_preview();
}

function draw_preview(){
	preview_ctx.clearRect(0,0, preview_canvas.width, preview_canvas.height);
	var sizeVal = size.value;
	var colorVal = "#"+color.value;

	x = preview_canvas.width /4;
	y = preview_canvas.height /2;
  preview_ctx.beginPath();
	preview_ctx.lineCap = "round";
  preview_ctx.moveTo(x, y);
  preview_ctx.lineTo(x, y);
  preview_ctx.lineWidth = sizeVal;
  preview_ctx.strokeStyle = colorVal;
  preview_ctx.stroke();
}
function scale_canvas(e){
  rect = canvas.getBoundingClientRect();
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initCanvas() {
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,600,600);
}
