var canvas = document.getElementById('canvas');


var ctx = canvas.getContext("2d");

//var preview_canvas = document.getElementById('preview_canvas');
//var preview_ctx = preview_canvas.getContext("2d");

var size = document.getElementById('size');
var color = document.getElementById('color');

var old_w;
var old_h;
var old_dataURL;
var dBut = document.getElementById("downloadBut");

// window.addEventListener('mousedown', function(){
// 	draw_preview()}, false);
// size.addEventListener("input", function(){
// 	draw_preview()}, false);
// color.addEventListener("input", function(){
// 	draw_preview()}, false);
window.addEventListener('load', function(e){
	init_page()}, false);


canvas.addEventListener("mousedown", function(e){
	findMove('down', e);}, false);
canvas.addEventListener("mousemove", function(e){
	findMove('move', e)}, false);
canvas.addEventListener("mouseup", function(e){
	findMove('up', e)}, false);
canvas.addEventListener("mouseout", function(e){
	findMove('out', e)}, false);
window.addEventListener('resize', function(e){
  scale_canvas(e);}, false);

dBut.addEventListener('click', dlCanvas, false);

window.addEventListener("deviceorientation", handleOrientation, true);

canvas.addEventListener("touchstart", function(e){
	touchMove('down', e)}, false);
canvas.addEventListener("touchmove", function(e){
	touchMove('move', e)}, false);
canvas.addEventListener("touchend", function(e){
	touchMove('up', e)}, false);
canvas.addEventListener("touchcancel", function(e){
	touchMove('out', e)}, false);

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

function handleOrientation(e){
	//socket.emit('rot', (e.beta));

}
function dlCanvas() {
	canvas.toBlob(function(blob) {
			saveAs(blob, "output.gif");
	}, "image/gif");
};

socket.on('connect', function(){
	socket.emit('drawControl',{type:'wantCanvas'});
	//draw_preview();
});



socket.on('latestCanvas', function(data){
	var resolution = data.resolution;
	scaleX = canvas.width/resolution[0];
	scaleY = canvas.height/resolution[1];

	load_image(data.cnv_data, scaleX, scaleY);
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

socket.on('ext_coordinates', function (data){
  draw_ext(data[0], data[1]);
});

function draw_ext(data, resolution){
	var sizeVal = data[0];
	var colorVal = data[1];

	var scaleX = canvas.width/resolution[0];
	var scaleY = canvas.height/resolution[1];

  for (var i = 3; i < data.length; i++) {
	prev_temp_data = data[i-1];
	temp_data = data[i];

	prev_x = prev_temp_data[0]*scaleX;
	prev_y = prev_temp_data[1]*scaleY;

	curr_x = temp_data[0]*scaleX;
	curr_y = temp_data[1]*scaleY;

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
		document.getElementById("mySidenav").style.width = "0";
		//Set old mouse coordinates to "new" previous coordinates
		prevCordX = newCordX;
		prevCordY = newCordY;
		//Current relative mouse coordinates
		newCordX = e.clientX - rect.left;
		newCordY = e.clientY - rect.top;

		//Add brush color and size as first element in coordinates array.
		coordinates.push(size.value, "#"+color.value);
		frst_coord_tuple = [newCordX, newCordY];
		coordinates.push(frst_coord_tuple);
		flag = true;
		dot_flag = true;

		if(dot_flag) {
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.fillRect = (newCordX, newCordY, size.value, size.value);
			ctx.closePath();
			dot_flag = false;
			coordinates.push([newCordX, newCordY]);
		}
	}

	if(res == 'up' || res == 'out') {
		//Send coordinates to server when user lets go of mouse
	  	//* UNCOMMENT IF YOU RUN INDEX.HTML IN A NODEJS SERVER!!! *
	 	socket.emit('drawControl', {type: 'coordinates', coord_data: coordinates, resolution: [canvas.width, canvas.height]} );
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
			socket.emit('drawControl', {type: 'coordinates', coord_data: coordinates, resolution: [canvas.width, canvas.height]} );
			coordinates = [];
			coordinates.push(size.value, "#"+color.value);
			coordinates.push(coord_tuple);
		}

		draw();
	}
}


function touchMove(res, e){
	switch(res){
		case 'down':
			document.getElementById("mySidenav").style.width = "0";
			window.blockMenuHeaderScroll = true;
			touch = e.changedTouches[0];
			touches = e.changedTouches;

			newCordX = touch.pageX - rect.left;
			newCordY = touch.pageY - rect.top;

			coordinates.push(size.value, "#"+color.value);
			frst_coord_tuple = [newCordX, newCordY];
			coordinates.push(frst_coord_tuple);

			ctx.beginPath();
			ctx.fillStyle = "#" + color.value;
			ctx.fillRect = (newCordX, newCordY, size.value, size.value);
			ctx.closePath();

		break;
		case 'move':
			if (blockMenuHeaderScroll)
	    {
	        e.preventDefault();
	    }

			touch = e.changedTouches[0];

			//Set old mouse coordinates to "new" previous coordinates
			prevCordX = newCordX;
			prevCordY = newCordY;
			//Current relative mouse coordinates.
			newCordX = touch.pageX - rect.left;
			newCordY = touch.pageY - rect.top;

			coord_tuple = [newCordX, newCordY];
			coordinates.push(coord_tuple);

			if(coordinates.length > 50){
				socket.emit('drawControl', {type: 'coordinates', coord_data: coordinates, resolution: [canvas.width, canvas.height]} );
				coordinates = [];
				coordinates.push(size.value, "#"+color.value);
				coordinates.push(coord_tuple);
			}

			draw();
		break;
		case 'up':
			socket.emit('drawControl', {type: 'coordinates', coord_data: coordinates, resolution: [canvas.width, canvas.height]} );
			//Clear coordinates
			coordinates = [];
			window.blockMenuHeaderScroll = false;
		break;
		case 'out':
			socket.emit('drawControl', {type: 'coordinates', coord_data: coordinates, resolution: [canvas.width, canvas.height]} );
			//Clear coordinates
			coordinates = [];
			window.blockMenuHeaderScroll = false;
		break;
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

	//draw_preview();
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
	socket.emit('rot', 'rotated');
  rect = canvas.getBoundingClientRect();

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	//RITA OM EFTER RESIZE. VRF DEN INTE FUNKA
	load_image(old_dataURL, canvas.width/old_w, canvas.height/old_h);
	socket.emit('drawControl',{type:'wantCanvas'});

	socket.emit('rot', canvas.width + "   " + canvas.height);
	old_w = canvas.width;
	old_h = canvas.height;
	old_dataURL = canvas.toDataURL();
}


function init_page(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,canvas.width, canvas.height);
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function load_image(src, x_scale, y_scale){
	clearCanvas();
	var img = new Image;
	img.onload = function(){
		ctx.drawImage(img,0,0, img.width*x_scale, img.height*y_scale);
	}

	img.src = src;
}

$( document ).ready(function() {
		old_dataURL = canvas.toDataURL();
    old_w = canvas.width;
		old_h = canvas.height;
});
